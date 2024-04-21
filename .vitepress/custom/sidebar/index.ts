import { DefaultTheme } from "vitepress";

import englishSidebar from "./english";
import guideSidebar from "./guide";
import bookmarkSidebar from "./bookmark";

const sidebar: DefaultTheme.SidebarMulti = {
  ...guideSidebar,
  ...bookmarkSidebar,
  ...englishSidebar,
};

export default sidebar;
