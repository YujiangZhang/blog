<script setup lang="ts">
import { computed } from "vue";
import JImage from "./JImage.vue";

const props = defineProps<{
  src: string | undefined;
  alt: string;
  width?: string;
  height?: string;
  borderRadius?: string;
  objectFit?: "contain" | "cover";
}>();

const logo = computed(() => {
  if (!props.src) return undefined;
  return `/assets/logo/${
    props.src.lastIndexOf(".") === -1 ? props.src + ".svg" : props.src
  }`;
});
</script>

<template>
  <JImage
    :src="logo"
    :alt="props.alt"
    :width="width || '1.2rem'"
    :height="height || '1.2rem'"
    :objectFit="objectFit || 'contain'"
    :borderRadius="borderRadius"
  />
</template>

<style scoped></style>
