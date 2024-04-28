import { defineConfig } from "vitepress";
import { genFeed } from "./genFeed";
import { generateSidebar } from "./sidebar/sidebarGenerator";
import custom from "./custom";

// #region sidebar
const { sidebar, rewrites } = generateSidebar({
  include: ["bookmarks/.*\\.json"],
});
// #endregion sidebar

// https://vitepress.dev/reference/site-config

export default defineConfig({
  cleanUrls: true,
  srcExclude: ["**/README.md", "src/**/*.md"],
  metaChunk: true,
  sitemap: {
    hostname: "https://jadezhang.cn",
  },

  buildEnd: genFeed,
  lang: "zh-CN",
  title: "Jade",
  description: "笔记",
  head: custom.defineHead({
    favicon: {
      theme: "light",
      shape: "rounded",
    },
  }),

  appearance: "dark",
  lastUpdated: true,

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

  rewrites,

  themeConfig: {
    logo: "/logo.svg",
    nav: custom.nav,
    sidebar,
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

    editLink: {
      pattern: ({ filePath, frontmatter }) => {
        const jSrcExt = frontmatter.jSrcExt as string | undefined; // 自定义属性
        const link = jSrcExt ? filePath.replace(".md", jSrcExt) : filePath;

        return `https://github.com/zyj-dev/blog/tree/main/${link}`;
      },
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
});
