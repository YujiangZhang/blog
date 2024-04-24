---
# region frontmatter
title: Jade
titleTemplate: 书签
aside: false
jSourceExt: .json # [!code focus]
# endregion frontmatter
---

<script setup>
import { useData } from 'vitepress'

const { params } = useData()

</script>

# {{ params.bm.match(/[^/]+$/)[0].replace('-', ' ').toUpperCase() }}

::: details :tada:
根据 `/docs/bookmark` 中的 `*.json` 数据生成，见 [VitePress: 动态生成路径](https://vitepress.dev/zh/guide/routing#dynamically-generating-paths)。

若需自定义该页面，需编写与该 `.json` 文件同名的 `.md` 文件。
:::

<LinkGrid :data="params.data" titleLevel="normal" />