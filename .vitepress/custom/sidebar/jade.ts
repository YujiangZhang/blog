import { DefaultTheme } from "vitepress";

const jade: DefaultTheme.SidebarMulti = {
  "/jade/": [
    {
      text: "JADE",
      base: "/jade",
      items: [{ text: "自定义配置", link: "/" }],
    },
    {
      text: "todo",
      link: "/jade/todo.md",
    },
  ],
};

export default jade;
