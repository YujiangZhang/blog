import { DefaultTheme } from "vitepress";

const nav: DefaultTheme.Config["nav"] = [
  // #region Jade
  {
    text: "笔记",
    activeMatch: "/jade/",
    link: "/jade/Jade",
  },

  // #region 动态
  // {
  //   text: "动态",
  //   activeMatch: "/posts/",
  //   link: "/posts/",
  // },

  // #region 书签
  {
    text: "书签",
    activeMatch: "/bookmarks/",
    items: [
      // more
      {
        text: "更多 ♾️",
        link: "/bookmarks/",
      },

      // 快捷
      {
        items: [
          {
            text: "有道词典",
            link: "https://dict.youdao.com/",
          },

          {
            text: "哔哩哔哩",
            link: "https://www.bilibili.com/",
          },

          {
            text: "Github",
            link: "https://github.com/",
          },

          {
            text: "Chat-GPT",
            link: "https://chat.openai.com/",
          },
        ],
      },
    ],
  },
];

export default nav;
