import { DefaultTheme } from "vitepress";

const english: DefaultTheme.SidebarMulti = {
  "/learning-english/": [
    {
      text: "脑洞部长 - 150 天英文剧",
      link: "/learning-english/150 天英文剧/index",
      collapsed: true,

      items: [{ text: "第一天", link: "/learning-english/150 天英文剧/001" }],
    },
  ],

  // "/english/150 天英文剧/": [
  //   { text: "第一天", link: "/english/150 天英文剧/001" },
  // ],
};

export default english;
