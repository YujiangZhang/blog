---
aside: false
---

# Python

<script setup>
import LinkGrid from '/src/components/LinkGrid.vue';
import { useBookmark } from "/src/client";

const { data } = useBookmark('python');

</script>

<LinkGrid :data="data" titleLevel="normal" />
