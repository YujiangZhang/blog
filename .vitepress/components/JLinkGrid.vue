<script setup lang="ts">
import { h, defineComponent, computed } from "vue";
import { Link } from "./types";
import JLinkBar from "./JLinkBar.vue";

interface Props {
  data: Link[] | Link | null | undefined;
  logo?: boolean;
  titleLevel?: 2 | 3 | 4 | 5 | 6 | "2" | "3" | "4" | "5" | "6" | "normal";
}

const props = defineProps<Props>();

const data = computed(() => {
  if (!props.data) return null;
  return Array.isArray(props.data) ? props.data : [props.data];
});

// 组件
const Title = defineComponent({
  props: {
    level: {
      type: [Number, String],
      default: 2,
    },
  },
  setup(props, { slots }) {
    return () => h(`h${props.level}`, {}, slots);
  },
});
</script>

<template>
  <section
    v-if="data"
    v-for="(dataItem, index) in data"
    :key="index"
    class="link-grid"
    :class="{
      'grid-padding':
        [undefined, 'normal'].some((i) => i === props.titleLevel) ||
        !dataItem.text,
    }"
  >
    <template v-if="dataItem.text && props.titleLevel">
      <div v-if="props.titleLevel === 'normal'" class="title__normal">
        {{ dataItem.text }}
      </div>
      <Title v-else :level="props.titleLevel" class="title">{{
        dataItem.text
      }}</Title>
    </template>
    <JLinkBar class="links" :data="dataItem.items" :logo="true" container />
  </section>
</template>

<style scoped>
/* link-grid */
.grid-padding {
  padding-top: 1rem;
}

/* title */
.title__normal {
  font-weight: 700;
  margin-top: 1.5rem;
  margin-bottom: 1rem;
}

/* links */
</style>
