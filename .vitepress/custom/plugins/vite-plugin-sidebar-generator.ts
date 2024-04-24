import { DefaultTheme, Plugin, UserConfig } from "vitepress";
import _, { map } from "lodash";
import { Sidebar, SidebarPluginOptions } from "./types";

const splitStr = (str: string, sepCount = 1, sep = "/") =>
  str.match(
    new RegExp(`(?:[^${sep}]+${sep}){0,${sepCount - 1}}([^${sep}]+)`, "g")
  ) || [];

const removeStartingDigitsAndHyphens = (str: string) =>
  str.replace(/^(?:\d+[-_])?(.*)$/, "$1");

//
const defaultTransformSidebarItem: SidebarPluginOptions.Options["transformSidebarItem"] =
  (sidebarItem) => {
    if (sidebarItem.text) {
      sidebarItem.text = removeStartingDigitsAndHyphens(sidebarItem.text);
    }
    return sidebarItem;
  };

// #region page 到树形结构
function convertPagesToSidebarTree<T>(
  pages: string[],
  options?: SidebarPluginOptions.PagesToTree
) {
  const { ignoreSegments = [] } = options || {};

  const root: Sidebar.TreeItems = {};

  pages.forEach((path) => {
    const segments = path.split("/");
    let currentSidebar: Sidebar.TreeItems = root;

    segments.forEach((segment, index) => {
      if (ignoreSegments.includes(segment)) return;

      const isLastSegment = index === segments.length - 1;
      let sidebarItem = currentSidebar[segment];

      if (!sidebarItem) {
        sidebarItem = { text: segment };
        const link = `/${segments.slice(0, index + 1).join("/")}`;
        if (isLastSegment) {
          Object.assign(sidebarItem, { link: link });
        } else {
          Object.assign(sidebarItem, {
            items: {},
            collapsed: false,
          });
        }
        currentSidebar[segment] = sidebarItem;
      }

      !isLastSegment &&
        (currentSidebar = sidebarItem.items as Sidebar.TreeItems);
    });
  });

  return root;
}

// #region formatter
function convertSidebarTreeToSidebar(
  sidebarTree: Sidebar.TreeItems,
  {
    baseSidebar,
    sortCallback = (item) => item.text,
    transformSidebarItem = defaultTransformSidebarItem,
  }: SidebarPluginOptions.TreeToSidebar
) {
  // #region to SidebarItem[]
  const traverse = (tree: Sidebar.TreeItem) => {
    const items = _.sortBy(tree.items, (sidebarItem: Sidebar.TreeItem) => {
      sidebarItem.items && (sidebarItem.items = traverse(sidebarItem));
      return sortCallback(sidebarItem);
    }) as Sidebar.Item[];

    return !transformSidebarItem
      ? items
      : items.map((item) => {
          const originItem = { ...item };
          const customItem = transformSidebarItem(item);

          return customItem;
        });
  };

  const sidebar: Record<string, Sidebar.Item[]> = {};

  Object.entries(sidebarTree).forEach(([text, item]) => {
    sidebar[`/${text}/`] = traverse(item);
  });

  return {
    sidebar: baseSidebar ? _.merge(baseSidebar, sidebar) : sidebar,
  };
}

// #region 入口
function pagesToSidebarMulti(
  pages: string[],
  userConfig: UserConfig,
  options?: SidebarPluginOptions.Options
) {
  const {
    ignoreSegments = [],
    baseSidebar = userConfig.themeConfig.sidebar || {},
  } = options || {};

  const root = convertPagesToSidebarTree(pages, { ignoreSegments });

  return convertSidebarTreeToSidebar(root, baseSidebar);
}

// #region 配置更改
export default function sidebarPlugin(
  options?: SidebarPluginOptions.Options
): Plugin {
  let config: Plugin["configResolved"] & Record<string, unknown>;

  return {
    name: "j-sidebar-generator",

    configResolved(resolvedConfig) {
      const _config = resolvedConfig as unknown as Plugin["configResolved"] &
        Record<string, unknown>;

      const vitepressConfig = _config.vitepress as Record<string, unknown>;

      if (
        !vitepressConfig ||
        !vitepressConfig.pages ||
        !vitepressConfig.userConfig
      ) {
        console.log(
          `${import.meta.filename} 自动生成侧边栏失败，构建数据未找到`
        );
        return;
      }

      const pages = vitepressConfig.pages as string[];
      const userConfig = vitepressConfig.userConfig as UserConfig;
      const { sidebar } = pagesToSidebarMulti(pages, userConfig, options);

      userConfig.themeConfig.sidebar = sidebar;

      config = _config;
    },
  };
}
