---
aside: false
---

# Angular

<script setup>
import LinkGrid from '/src/components/LinkGrid.vue';
import { useBookmark } from "/src/client"

const { data } = useBookmark('angular');

</script>

<LinkGrid :data="data" />
