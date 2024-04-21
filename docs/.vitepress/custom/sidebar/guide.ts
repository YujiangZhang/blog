import { DefaultTheme } from "vitepress";


const guideSidebar: DefaultTheme.SidebarMulti = {
  "/guide/": [
    {
      text: "指南",
      items: [
        { text: "Markdown 扩展", link: "/guide/Markdown 扩展" },
        { text: "Runtime API Examples", link: "/guide/api-examples" },
      ],
    },
  ],
};

export default guideSidebar;
