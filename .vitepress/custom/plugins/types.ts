import { DefaultTheme } from "vitepress";

export namespace Sidebar {
  export interface Item extends DefaultTheme.SidebarItem {}

  export interface TreeItem extends Omit<Item, "items"> {
    items?: Record<string, TreeItem> | Item[];
  }

  export type TreeItems = Record<string, TreeItem>;
}

export namespace SidebarPluginOptions {
  export interface PagesToTree {
    ignoreSegments?: string[];
  }

  export interface TreeToSidebar {
    /**
     * sidebar 源，默认为已配置在 vitepress 中的 sidebar
     * 在 SidebarPlugin 生成最后的 sidebar 的时候会进行合并
     * 即 _.merge( baseSidebar, generateData )
     */
    baseSidebar?: DefaultTheme.SidebarMulti;

    /**
     * 默认按 sidebarItem 的文件名排序
     */
    sortCallback?: (sidebarItem: Sidebar.TreeItem) => any;

    /**
     * 默认处理 text.replace(/^(?:\d+[-_])?(.*)$/, '$1');
     */
    transformSidebarItem?: (
      sidebarItem: Sidebar.Item
    ) => DefaultTheme.SidebarItem;
  }

  export type Options = PagesToTree & TreeToSidebar;
}
