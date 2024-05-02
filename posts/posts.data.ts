/**
 * @see https://github.com/vuejs/blog/blob/main/.vitepress/theme/posts.data.ts
 */

import { createContentLoader } from "vitepress";

interface Post {
  title: string;
  url: string;
  date: {
    time: number;
    string: string;
  };
  excerpt: string | undefined;
}

export default createContentLoader("posts/[^index]*.md", {
  excerpt: true,
  transform(raw): Post[] {
    return raw
      .map(({ url, frontmatter, excerpt }) => {
        return {
          title: frontmatter.title,
          url: url.replace(/.*\/(?:\d+\s?[-]\s?)?(.*)$/, "$1"),
          excerpt,
          date: formatDate(frontmatter.date),
          image: frontmatter.image,
        };
      })
      .sort((a, b) => b.date.time - a.date.time);
  },
});

function formatDate(raw: string): Post["date"] {
  const date = new Date(raw);
  date.setHours(12);

  if (isNaN(date.getTime())) {
    throw new Error("Invalid date");
  }

  return {
    time: +date,
    string: date.toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
  };
}
