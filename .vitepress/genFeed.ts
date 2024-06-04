import path from "path";
import { writeFileSync } from "fs";
import { Feed } from "feed";
import { type SiteConfig } from "vitepress";

const { createContentLoader } = await import("vitepress");

const baseUrl = `https://jadezhang.cn`;

//
export async function genFeed(config: SiteConfig) {
  const feed = new Feed({
    title: "Jared",
    description: "笔记",
    id: baseUrl,
    link: baseUrl,
    language: "zh-CN",
    image: `${baseUrl}/logo.svg`,
    favicon: `${baseUrl}/favicon.ico`,
    copyright:
      "Copyright (c) 2024-present, Yujiang (Jared) Zhang and blog contributors",
  });

  const posts = await createContentLoader("posts/**/*.md", {
    excerpt: true,
    render: true,
  }).load();

  posts.sort(
    (a, b) =>
      +new Date(b.frontmatter.date as string) -
      +new Date(a.frontmatter.date as string)
  );

  for (const { url, excerpt, frontmatter, html } of posts) {
    feed.addItem({
      title: frontmatter.title,
      id: `${baseUrl}${url}`,
      link: `${baseUrl}${url}`,
      description: excerpt,
      content: html?.replace(/&ZeroWidthSpace;/g, ""),
      author: [
        {
          name: frontmatter.author,
          link: frontmatter.github
            ? `https://github.com/${frontmatter.github}`
            : undefined,
        },
      ],
      date: frontmatter.date,
    });
  }

  writeFileSync(path.join(config.outDir, "feed.rss"), feed.rss2());
}
