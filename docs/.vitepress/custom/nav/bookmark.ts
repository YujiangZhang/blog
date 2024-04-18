import { DefaultTheme } from "vitepress";

type NavItem = DefaultTheme.NavItem;

//
const bookmark: NavItem = {
  text: "书签",
  items: [
    // more
    {
      items: [
        {
          text: "更多 ♾️",
          link: "/bookmark/index",
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
