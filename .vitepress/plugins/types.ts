import type { DefaultTheme, SiteConfig, UserConfig, Plugin } from "vitepress";

export type VPThemeConfig = Pick<DefaultTheme.Config, "sidebar" | "nav">;

export type VPUserConfig = Pick<UserConfig, "rewrites"> & {
  themeConfig: VPThemeConfig;
};

export type VPConfig = Pick<SiteConfig, "pages" | "rewrites"> & {
  userConfig: VPUserConfig;
  site: VPThemeConfig;
};

export type Config = Record<string, unknown> & { vitepress?: VPConfig };

// #region sidebar
export namespace SidebarPlugin {
  // DefultTheme
  export type SidebarItem = DefaultTheme.SidebarItem;
  export type SidebarMulti = DefaultTheme.SidebarMulti;
  export type Sidebar = SidebarItem[] | SidebarMulti;

  /**
   * page 为完整的路径
   *
   * path 为 slash (斜杠) 之间的部分
   */
  export type PathPage = { page: string; path: string };

  export interface RequiredOptions {
    /**
     * 是否在插件内部改变 config，默认 true
     */
    mutate: boolean;

    /**
     * 路由重写规则， path 为 slash (斜杠) 之间的部分
     *
     * 这会改变 sidebarItem 的 link 值，值为 PathPage.page
     *
     * 默认重写规则为去除 path 以 /\d+[-]/ 开头的部分，见 static defaultRewritePath
     */
    rewritePath:
      | null
      | ((path: string, parentPath?: PathPage | undefined | null) => PathPage);

    /**
     * 路由重写结束，排序 sidebarItems
     *
     * 默认 ['text']，见 static defaultSortRules
     *
     * @see https://www.lodashjs.com/docs/lodash.sortBy#_sortbycollection-iteratees_identity
     */
    sortRules: any[];

    /**
     * 路由重写结束，自定义 sidebarItem
     *
     * 默认去除 text 值开头符合 /\d+[-]/ 的部分, 见 static default transformSidebarItem
     */
    transformSidebarItem: (sidebarItem: SidebarItem) => SidebarItem;
  }

  export type Options = Partial<RequiredOptions>;
}
// #endregion sidebar
