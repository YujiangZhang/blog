import { DefaultTheme } from "vitepress";

const bookmark: DefaultTheme.NavItem = {
  text: "书签",
  activeMatch: "/bookmarks/",
  items: [
    // more
    {
      items: [
        {
          text: "更多 ♾️",
          link: "/bookmarks/",
        },
      ],
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

    //
  ],
};

export default bookmark;
