---
layout: page
aside: false
sidebar: false
title: Jade 的动态
subtext: “多情自古空余恨，好梦由来最易醒。”
---

<script setup>
import Posts from '/.vitepress/components/Posts.vue'
import {data} from './posts.data'
</script>

<Posts :posts="data" />
