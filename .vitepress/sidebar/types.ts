import type { DefaultTheme } from "vitepress";

// DefultTheme
export type SidebarItem = DefaultTheme.SidebarItem;
export type SidebarMulti = DefaultTheme.SidebarMulti;
export type Sidebar = SidebarItem[] | SidebarMulti;

// #region Options
/**
 * text 为 slash (斜杠) 之间的部分
 * link 为完整的路径
 */
export type TextLink = { text: string; link: string };

export type Options = {
  src?: string;

  /**
   * 正则字符串列表，排除不匹配项
   * 默认不会被匹配的【文件夹名】: node_modules, .vitepress", public", .github", .git", .vscode"
   */
  exclude?: string[];

  /**
   * 正则字符串列表，默认包含 .md 文件
   * 如某文件夹下自动生成，数据为对应的 .json 文件，则可 "folder/.*\\.json"
   */
  include?: string[];

  /**
   * 对文件夹下的文件排序（文件名未更改）
   * @see https://www.lodashjs.com/docs/lodash.sortBy#_sortbycollection-iteratees_identity
   * 当为 Record<string, any[]> 时，键为指定文件夹，如 bookmarks/01 - frontend
   */
  sortRules?: any[] | (Record<string, any[]> & { global?: any[] });

  /**
   * 路由重写规则， path 为 slash (斜杠) 之间的部分
   * 这会改变 sidebarItem 的 link 值，值为 PathPage.page
   * 默认重写规则为去除 path 以 /\d+[-]/ 开头的部分，见 static defaultRewritePath
   */
  rewritePath?:
    | null
    | ((segment: string, parentPath?: TextLink | undefined | null) => TextLink);

  /**
   * text 是否 path 相同，即 SidebarItem.text 为 rewritePath 结果中的 path
   * 默认 true
   */
  pathAsText?: boolean;

  /**
   * 路由重写结束，自定义 sidebarItem
   * 默认去除 text 值开头符合 /\d+[-]/ 的部分，见 static default transformSidebarItem
   */
  transformSidebarItem?: (sidebarItem: SidebarItem) => SidebarItem;
};

export type MergeOptions = {
  sidebar?: SidebarMulti;
  rewrites?: Record<string, string>;
} & ({ sidebar: SidebarMulti } | { rewrites: Record<string, string> });

// #endregion Options
