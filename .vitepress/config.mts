import { defineConfig } from "vitepress";
import custom from "./custom";
import path from "path";

const __dirname = path.dirname(__filename);
const __rootname = path.resolve(__dirname, "../");

// https://vitepress.dev/reference/site-config
export default defineConfig({
  srcDir: "docs",
  outDir: "dist",

  //
  lang: "zh-CN",
  title: "Jade",
  description: "学习笔记",
  head: custom.defineHead({
    favicon: {
      theme: "light",
      shape: "rounded",
    },
  }),

  lastUpdated: true,

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config

    logo: '/logo.svg',
    // logo: {
    //   light: '/favicon/light/favicon-32x32.png',
    //   dark: '/favicon/dark/favicon-32x32.png'
    // },

    nav: custom.nav,

    sidebar: custom.sidebar,

    search: {
      provider: "local",
    },

    socialLinks: [
      {
        icon: "github",
        link: "https://github.com/zyj-dev/blog",
        ariaLabel: "github link",
      },
    ],

    //

    editLink: {
      pattern: "https://github.com/zyj-dev/blog/tree/main/docs/:path",
      text: "在 Github 上编辑此页面",
    },

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

  //

  markdown: {
    math: true,
    image: {
      // lazyLoading: true,
    },
  },

  vite: {
    resolve: {
      alias: {
        "@src": path.resolve(__rootname, "src"),
        "@docs": path.resolve(__rootname, "docs"),
      },
    },
  },
});
