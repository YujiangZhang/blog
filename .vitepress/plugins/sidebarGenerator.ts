import type { Config, VPConfig, SidebarPlugin, VPUserConfig } from "./types";
import _ from "lodash";

type sidebarItem = SidebarPlugin.SidebarItem;
type SidebarMulti = SidebarPlugin.SidebarMulti;
type Options = SidebarPlugin.RequiredOptions;

interface SideTreeItem extends Omit<sidebarItem, "items"> {
  items?: Record<string, SideTreeItem>;
}
type SideTreeMulti = Record<string, SideTreeItem>;

function errorMessage(message?: string) {
  throw new Error(
    `[SidebarGenratorPlugin] 错误: ${message || import.meta.url}`
  );
}

function warnMessage(message?: string) {
  console.log(`[SidebarGenratorPlugin] 警告: ${message || import.meta.url}`);
}

function removeStartingDigitsAndHyphens(str: string) {
  return str.replace(/^(?:\d+[-])?(.*)$/, "$1");
}

export default class SidebarGenerator {
  vitepressConfig: VPConfig;
  userConfig: VPUserConfig;

  pages: string[];
  sidebar: SidebarMulti;
  userRewrites: Record<string, string>;
  siteRewrites: VPConfig["rewrites"];

  rewritePath: Options["rewritePath"];
  sortRules: Options["sortRules"];
  transformSidebarItem: Options["transformSidebarItem"];

  // #region 初始化配置
  constructor(config: Config, options?: SidebarPlugin.Options) {
    this.initConfig(config, options);
    this.initOptions(options);
  }

  initConfig(config: Config, options?: SidebarPlugin.Options) {
    let vitepress = config.vitepress;
    if (!vitepress) {
      errorMessage();
      return;
    }

    options?.mutate === false && (vitepress = _.cloneDeep(vitepress));

    this.vitepressConfig = vitepress;
    this.pages = vitepress.pages;

    this.siteRewrites = vitepress.rewrites;

    const userConfig = vitepress.userConfig;
    this.userConfig = userConfig;
    if (userConfig.rewrites) {
      this.userRewrites = userConfig.rewrites;
    } else {
      this.userRewrites = {};
      userConfig.rewrites = this.userRewrites;
    }

    const themeConfig = vitepress.userConfig.themeConfig;
    let sidebar = themeConfig.sidebar;
    const sidebarIsArr = _.isArray(sidebar);

    if (!sidebar || sidebarIsArr) {
      sidebarIsArr && warnMessage("sidebar 暂不支持数组，将忽略已有配置");
      sidebar = {};
      themeConfig.sidebar = sidebar;
    }

    this.sidebar = sidebar as SidebarMulti;
  }

  initOptions(options: SidebarPlugin.Options | undefined) {
    let {
      rewritePath = SidebarGenerator.defaultRewritePath,
      sortRules = SidebarGenerator.defaultSortRules,
      transformSidebarItem = SidebarGenerator.defaultFormateSidebarItem,
    }: SidebarPlugin.Options = options ?? {};

    this.rewritePath = rewritePath;
    this.sortRules = sortRules;
    this.transformSidebarItem = transformSidebarItem;
  }

  static defaultRewritePath(
    path: string,
    parentPath?: null | SidebarPlugin.PathPage
  ) {
    path = removeStartingDigitsAndHyphens(path);
    return {
      path,
      page: parentPath?.page ? `${parentPath.page}/${path}` : `/${path}`,
    };
  }

  static defaultSortRules = ["text"];

  static defaultFormateSidebarItem(item: sidebarItem) {
    let text = item.text;

    text && (item.text = removeStartingDigitsAndHyphens(text));
    item.items && (item.collapsed = false);

    return item;
  }

  // region 路由重写
  setRewrite(from: string, to: string) {
    if (!from || !to || from === to) return;
    from.startsWith("/") && (from = from.slice(1));
    to.startsWith("/") && (to = to.slice(1));
    this.userRewrites[from] = to;
    this.siteRewrites.map[from] = to;
    this.siteRewrites.inv[to] = from;
  }

  // #region 生成树 item
  genTreeItemByPage(
    page: string,
    options: {
      rewritePath?: Options["rewritePath"];
      parentPathPage?: SidebarPlugin.PathPage | null;
    }
  ) {
    const { rewritePath, parentPathPage } = options;

    let treeItem: SideTreeItem = {},
      pathPage: SidebarPlugin.PathPage | undefined,
      path: string,
      text: string,
      link: string,
      isFolder: boolean;

    const lastSlashIndex = page.lastIndexOf("/");

    path = page.slice(lastSlashIndex + 1);
    isFolder = !path.endsWith(".md");

    text = path; // 可做排序凭证，此处不改
    if (rewritePath) {
      pathPage = rewritePath(path, parentPathPage);
      link = pathPage.page;
    } else {
      link = page;
    }

    if (isFolder) {
      treeItem.text = text;
      treeItem.items = {};
    } else {
      treeItem.text = text.replace(".md", "");
      treeItem.link = link;

      this.setRewrite(page, link); // 相等时不会生效
    }

    return { treeItem, pathPage };
  }

  // #region 生成树
  genTreeMulti() {
    const root: SideTreeMulti = {};
    let branch: SideTreeMulti,
      link: string,
      parentItem: SideTreeItem | undefined,
      parentPathPage: SidebarPlugin.PathPage | undefined;

    for (const page of this.pages) {
      const paths = page.split("/");
      branch = root;
      link = "";
      parentItem = undefined;
      parentPathPage = undefined;

      for (const path of paths) {
        link += "/" + path;

        let treeItem = branch[path];
        let treePathPage: SidebarPlugin.PathPage | undefined;

        if (!treeItem) {
          const treePage = this.genTreeItemByPage(link, {
            rewritePath: this.rewritePath,
            parentPathPage,
          });
          treeItem = treePage.treeItem;
          treePathPage = treePage.pathPage;

          if (treeItem.text !== "index") {
            branch[path] = treeItem;
          } else {
            parentItem && (parentItem.link = treeItem.link);
          }
        } else {
          treePathPage = this.rewritePath
            ? this.rewritePath(path, parentPathPage)
            : undefined;
        }

        if (treeItem.items) {
          branch = treeItem.items;
          parentItem = treeItem;
          parentPathPage = treePathPage;
        }
      }
    }

    return root;
  }

  // #region 标准 item
  convertItemsToArray(tree: SideTreeMulti) {
    const traver = (branch: SideTreeItem) => {
      const items = _.sortBy(branch, ...this.sortRules) as SideTreeItem[];

      return items.map((treeItem) => {
        const { items, ...itemRest } = treeItem;

        if (items) {
          (itemRest as sidebarItem).items = traver(items) as sidebarItem[];
        }

        return this.transformSidebarItem(itemRest);
      });
    };

    return traver(tree);
  }

  // #region 生成规则
  genSidebar(sidebarItems: sidebarItem[]) {
    sidebarItems.forEach((item) => {
      const section = `/${item.text}/`;
      this.sidebar[section] = item.items!;
    });
    return this.sidebar;
  }

  // #region 启动
  start(): Config {
    // console.log("侧边栏自动生成 ...");
    const tree = this.genTreeMulti();
    const sidebarItems = this.convertItemsToArray(tree);
    this.genSidebar(sidebarItems);
    // console.log("侧边栏自动生成: 成功");
    return this.vitepressConfig;
  }
}
