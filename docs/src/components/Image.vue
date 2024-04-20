<script setup lang="ts">
import { ref, computed, onMounted } from "vue";

const props = defineProps<{
  src: string | undefined;
  alt: string;
  logo?: boolean; // 是否为本地 logo
  width?: string;
  height?: string;
  borderRadius?: string;
  style?: Record<string, unknown>;
}>();

//
const state = ref<"loading" | "error" | "success" | "null">("loading");
const error = ref<null | string>(null);
const src = ref<string>("");

//
const style = computed(() => {
  return {
    ...(props.style || {}),
    width: props.width || "100px",
    height: props.height || "200px",
    borderRadius: props.borderRadius || ".25rem",
  };
});

//
const normalizeSrc = (src: string) => {
  if (!props.logo) return src;
  return `/assets/logo/${src.lastIndexOf(".") === -1 ? src + ".svg" : src}`;
};

//
const fetchImage = async () => {
  if (!props.src) {
    error.value = "加载图片失败: 链接无效";
    state.value = "null";
    return;
  }

  try {
    const res = await fetch(normalizeSrc(props.src));

    if (!res.ok) {
      throw new Error(`加载图片失败: ${res.statusText}`);
    }

    // blob
    const blob = await res.blob();
    src.value = URL.createObjectURL(blob);
    state.value = "success";
  } catch (err) {
    error.value = err.message;
    state.value = "error";
  }
};

onMounted(() => fetchImage());
</script>

<template>
  <div class="image" :style="style">
    <span v-if="state === 'loading'" class="item loading"></span>
    <img
      v-else-if="state === 'success'"
      :src="src"
      :alt="props.alt"
      class="item img"
    />
    <span v-else-if="state === 'error'" class="item error"></span>
    <span v-else class="item null"></span>
  </div>
</template>

<style scoped>
.item {
  display: block;
  width: inherit;
  height: inherit;
  border-radius: inherit;
  padding: 0;
}

.img {
  object-fit: contain;
}

/* 禁用 loading 样式，减弱闪烁视觉效果 */
/* .loading {
  background: linear-gradient(to top left, cyan, lightcyan);
} */

.error {
  background: linear-gradient(to top left, tomato, peachpuff);
}

.null {
  background: linear-gradient(to top left, #6f63f4, lightblue);
}
</style>
