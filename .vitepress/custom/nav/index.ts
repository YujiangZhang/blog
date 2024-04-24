import { DefaultTheme } from "vitepress";
import bookmark from "./bookmark";
import english from "./learningEnglish";
import jade from "./jade";

const nav: DefaultTheme.Config["nav"] = [jade, bookmark, english];

export default nav;
