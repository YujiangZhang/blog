import { DefaultTheme } from "vitepress";
import bookmark from "./bookmark";

const nav: DefaultTheme.Config["nav"] = [

  // { text: "指南", activeMatch: "/guide/", link: "/guide/Markdown 扩展" },

  { text: "书签", activeMatch: "/markbook/", ...bookmark },

  {
    text: "英语",
    activeMatch: "/english/",
    items: [
      {
        text: "脑洞部长 - 150 天英文剧",
        link: "/english/150 天英文剧/index",
      },
    ],
  },
];

export default nav;
