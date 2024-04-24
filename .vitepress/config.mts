import { defineConfig } from "vitepress";
import custom from "./custom";
import { genFeed } from "./genFeed";
import sidebarPlugin from "./custom/plugins/vite-plugin-sidebar-generator";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  cleanUrls: true,
  srcExclude: ["**/README.md", "src/**/*.md"],
  metaChunk: true,

  buildEnd: genFeed,
  vite: {
    plugins: [
      sidebarPlugin({
        ignoreSegments: ["index.md"],
      }),
    ],
  },

  // #region 站点数据
  lang: "zh-CN",
  title: "Jade",
  description: "笔记",
  head: custom.defineHead({
    favicon: {
      theme: "light",
      shape: "rounded",
    },
  }),

  // #region 主题
  appearance: "dark",
  lastUpdated: true,

  // #region 国际化
  locales: custom.locals,

  // #region markdown
  markdown: {
    math: true,
    image: {
      lazyLoading: true,
    },
    container: {
      tipLabel: "提示",
      warningLabel: "警告",
      dangerLabel: "危险",
      infoLabel: "信息",
      detailsLabel: "详细信息",
    },
  },

  // region themeConfig
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config

    logo: "/logo.svg",
    nav: custom.nav,
    sidebar: custom.sidebar,
    search: {
      provider: "local",
    },

    socialLinks: [
      {
        icon: "github",
        link: "https://github.com/zyj-dev/",
        ariaLabel: "github link",
      },
    ],

    //#region editLink
    editLink: {
      pattern: ({ filePath, frontmatter }) => {
        const jSourceExt = frontmatter.jSourceExt as string | undefined; // 自定义属性
        const link = jSourceExt
          ? filePath.replace(".md", jSourceExt)
          : filePath;

        return `https://github.com/zyj-dev/blog/tree/main/docs/${link}`;
      },
      text: "在 Github 上编辑此页面",
    },
    //#endregion editLink

    lastUpdated: {
      text: "最后更新于",
      formatOptions: {
        dateStyle: "short",
        timeStyle: "medium",
      },
    },

    docFooter: {
      prev: "上一页",
      next: "下一页",
    },

    darkModeSwitchLabel: "外观",
    sidebarMenuLabel: "菜单",
    returnToTopLabel: "返回顶部",
    externalLinkIcon: true,

    outline: {
      level: "deep",
      label: "页面导航",
    },
  },
});
