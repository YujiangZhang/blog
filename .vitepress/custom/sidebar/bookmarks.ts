import { DefaultTheme } from "vitepress";

const bookmarks: DefaultTheme.SidebarMulti = {
  "/bookmarks/": [
    {
      text: "书签",
      base: "/bookmarks",
      collapsed: false,
      items: [
        { text: "AI", link: "/ai" },
        { text: "资源导航", link: "/resource" },
        { text: "文件处理", link: "/file-processing" },
      ],
    },
    {
      text: "编程",
      base: "/bookmarks/coding",
      collapsed: false,
      items: [
        {
          text: "前端",
          items: [
            {
              text: "开发",
              link: "/frontend/frontend-development",
            },
            { text: "vue", link: "/frontend/vue" },
            { text: "react", link: "/frontend/react" },
            {
              text: "angular",
              link: "/frontend/angular",
            },
          ],
        },
        { text: "后端", link: "/backend" },
        { text: "Python", link: "/python" },
        { text: "Java", link: "/java" },
      ],
    },
  ],
};

export default bookmarks;
