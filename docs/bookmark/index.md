# 书签

::: tip
菜单作为书签分类
:::

## 数据

数据目录为 `docs/public/data`

构建资源 api 映射数据

```sh
$ yarn generate:bookmark
```

::: tip
数据目录下的文件时需要执行，但不考虑作为中间件
:::

使用

```ts
import { useBookmark } from "/src/client";

const { data, state, error } = useBookmark("vue");
```

## 组件

直接传递 `useBookmark()` 的 `data`，而 `aside` 则会失效

```md
---
aside: false
---

<script setup>
import LinkGrid from '/src/components/LinkGrid.vue';
import { useBookmark } from "/src/client";

const { data } = useBookmark('vue');
</script>

<LinkGrid :data="data" titleLevel="2" />
```

如果需要 aside，需要手动指定数据

```md
<script setup>
import LinkGrid from '/src/components/LinkGrid.vue';
import { useBookmark } from "/src/client";

const { data } = useBookmark('vue', true)
</script>

## Vue

<LinkGrid :data="data.vue" />

## UI

<LinkGrid :data="data.ui" />
```
