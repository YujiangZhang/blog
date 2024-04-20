---
aside: false
---

# 资源导航

<script setup>
import LinkGrid from '/src/components/LinkGrid.vue';
import { useBookmark } from "/src/client";

const { data } = useBookmark('resource');

</script>

<LinkGrid :data="data" titleLevel="normal" />
