<script setup lang="ts">
import { h, defineComponent, computed } from "vue";

interface DataItem {
  text: string;
  link?: string;
  icon?: string;
  items?: DataItem[];
}

interface Props {
  data: DataItem[] | DataItem | null | undefined;
  titleLevel?: 2 | 3 | 4 | 5;
}

const props = defineProps<Props>();

const data = computed(() => {
  if (!props.data) return null;
  return Array.isArray(props.data) ? props.data : [props.data];
});

// 组件
const Title = defineComponent({
  setup(_props, { slots }) {
    return () => h(`h${props.titleLevel || 2}`, {}, slots);
  },
});
</script>

<template>
  <section
    v-if="data"
    v-for="(dataItem, index) in data"
    :key="index"
    class="link-grid"
  >
    <Title v-if="dataItem.text" class="title">{{ dataItem.text }}</Title>
    <div class="items">
      <a
        v-for="(item, index) in dataItem.items"
        class="item"
        :key="index"
        :href="item.link"
        :title="item.text + '链接'"
      >
        <div class="icon-container">
          <img v-if="item.icon" class="icon" :src="item.icon" alt />
          <span v-else class="circle"></span>
        </div>
        <span class="text">{{ item.text }}</span>
      </a>
    </div>
  </section>
</template>

<style scoped>
/* link-grid */
.link-grid {
  padding: 1rem 0;
}

/* items */
.items {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  grid-auto-flow: dense;
  gap: 1rem;
}

/* item link */
.item {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  gap: 0.5rem;
  color: inherit;
  text-decoration: none;
  background-color: var(--vp-c-bg-soft);
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  transition: background-color 0.2s;
}

.item:hover {
  background-color: var(--vp-button-alt-bg);
}

/* title */

/* icon */
.icon-container {
  width: 1.75rem;
  height: 1.75rem;
}

.icon,
.circle {
  display: block;
  width: 100%;
  height: 100%;
}

.icon {
  border-radius: 0.25rem;
}

.circle {
  border-radius: 50%;
  background-color: var(--vp-button-alt-bg);
  transition: background-color 0.2s;
}

.item:hover .circle {
  background-color: var(--vp-c-bg-soft);
}

/* text */
</style>
