import { DefaultTheme, createContentLoader } from "vitepress";

import english from "./english";
import bookmarks from "./bookmarks";
import jade from "./jade";

const sidebar: DefaultTheme.Sidebar = {
  ...jade,
  // ...bookmarks,
  // ...english,
};

export default sidebar;
