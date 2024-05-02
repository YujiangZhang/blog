<script setup lang="ts">
/**
 * @see https://github.com/vuejs/blog/blob/main/.vitepress/theme/Home.vue
 */
import { useData } from "vitepress";

type Post = Record<"title" | "url" | "excerpt", string> & {
  date: {
    time: number;
    string: string;
  };
  image?: string;
};

defineProps<{ posts: Post[] }>();

const { frontmatter } = useData();

function getDateTime(date: Post["date"]) {
  return new Date(date.time).toISOString();
}
</script>

<template>
  <div class="posts">
    <div class="header">
      <img class="logo" src="/logo.svg" alt="logo" />
      <h1 class="title">{{ frontmatter.title }}</h1>
      <p class="subtext">{{ frontmatter.subtext }}</p>
    </div>

    <ul>
      <li v-for="(post, index) of posts" :key="index">
        <article class="article">
          <dl>
            <dt class="dt">发表日期</dt>
            <dd class="dd">
              <time :datetime="getDateTime(post.date)">{{
                post.date.string
              }}</time>
            </dd>
          </dl>
          <div class="content">
            <div
              v-if="post.image"
              class="image"
              :style="{
                backgroundImage: `url(${post.image})`,
              }"
            ></div>
            <h2 class="article-title">
              <a :href="post.url">{{ post.title }}</a>
            </h2>
            <div
              v-if="post.excerpt"
              class="article-excerpt"
              v-html="post.excerpt"
            ></div>
            <div class="read-more">
              <a aria-label="read more" :href="post.url">Read more →</a>
            </div>
          </div>
        </article>
      </li>
    </ul>
  </div>
</template>

<style scoped>
/* posts */
.posts {
  display: grid;
  margin-left: auto;
  margin-right: auto;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  padding-bottom: 5rem;

  @media (min-width: 640px) {
    max-width: 45rem;
  }

  @media (min-width: 1280px) {
    max-width: 61rem;
  }
}

/* header */
.header {
  display: grid;
  align-items: end;
  align-content: center;
  padding-top: 2.5rem;
  padding-bottom: 2.5rem;

  @media (min-width: 640px) {
    grid-template-columns: 100px 1fr;
    column-gap: 1rem;
  }
}

.logo {
  grid-row: 1 / span 2;
  width: 100px;
  padding-bottom: 1rem;

  @media (min-width: 640px) {
    padding-bottom: 0;
  }
}

.title {
  font-size: 1.875rem;
  font-weight: 800;
  letter-spacing: -0.025em;
}

.subtext {
  font-size: 1.125rem;
  align-self: start;
  padding-top: 0.5rem;
}

/* article */
.article {
  border-top: 1px solid var(--vp-c-gray-soft);
  padding-top: 2rem;
  padding-bottom: 2rem;

  @media (min-width: 1280px) {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 2rem 0;
    align-items: baseline;
  }
}

/* date */

.dt {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0; 0; 0; 0);
  border: 0;
}

.dd {
  margin: 0;
  color: var(--vp-c-text-2);
}

/* content */
.content {
  padding: 1rem;
  position: relative;
  z-index: 1;

  @media (min-width: 1280px) {
    grid-column: 2 / span 3;
  }
}

/* image */
.image {
  position: absolute;
  left: 0;
  top: 0;
  z-index: -1;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;

  border-radius: 0.5rem;
  /* opacity: 0.2; */
}

.image::before {
  content: "";
  display: block;
  width: 100%;
  height: 100%;
  background: linear-gradient(35deg, var(--vp-c-bg-soft), transparent);
}

/* article- */
.article-title {
  font-size: 1.25rem;
  line-height: 1.6;
  font-weight: 700;
  letter-spacing: -0.025em;
}

.article-excerpt {
  display: flex;
  flex-flow: column nowrap;
  row-gap: 1rem;
  margin-top: 1rem;
  color: var(--vp-c-text-2);
}

/* read-more */
.read-more {
  margin-top: 1.5rem;
  color: var(--vp-c-brand-1);
}
</style>
