import { CustomSidebar } from "../types";

const bookmarkSidebar: CustomSidebar = {
  "/bookmark/": [
    {
      text: "书签",
      items: [
        { text: "AI", link: "/bookmark/ai" },
        { text: "文件处理", link: "/bookmark/file-processing" },
        { text: "资源导航", link: "/bookmark/resource" },
        {
          text: "前端",
          collapsed: true,
          items: [

            { text: "开发", link: "/bookmark/frontend/frontend-development" },
            { text: "vue", link: "/bookmark/frontend/vue" },
            { text: "react", link: "/bookmark/frontend/react" },
            { text: "angular", link: "/bookmark/frontend/angular" },
          ],
        },
        { text: "后端", link: "/bookmark/backend" },
        { text: "Python", link: "/bookmark/python" },
        { text: "Java", link: "/bookmark/java" },
      ],
    },
  ],
};

export default bookmarkSidebar;
