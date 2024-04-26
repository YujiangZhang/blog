import { DefaultTheme } from "vitepress";
import bookmarks from "./bookmarks";
import english from "./learningEnglish";
import jade from "./jade";

const nav: DefaultTheme.Config["nav"] = [jade, english, bookmarks];

export default nav;
