<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";

const props = defineProps<{
  src: string | undefined;
  alt: string;
  width?: string;
  height?: string;
  borderRadius?: string;
  objectFit?: "contain" | "cover";
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

// blob URL
const blobURLs: string[] = [];
const clearBlobURL = () => {
  blobURLs.forEach((url) => URL.revokeObjectURL(url));
};

/** 每当调用该函数，在合适的时机调用 clearBlobURL */
const getImageBlobURL = async (src: string) => {
  const res = await fetch(src);

  if (!res.ok) {
    throw new Error(`图片 ${src} 加载失败, statusText ${res.statusText}`);
  }

  const blob = await res.blob();

  if (blob.type.includes("text")) {
    throw new Error(`图片 <${src}> 加载失败, ${blob.type} 不是图片类型`);
  }
  const url = URL.createObjectURL(blob);
  blobURLs.push(url);

  return url;
};

/** 加载图片 */
const fetchImage = async () => {
  if (!props.src) {
    error.value = "加载图片失败: 链接无效";
    state.value = "null";
    return;
  }

  try {
    // const [blobURL] = await Promise.all([
    //   getImageBlobURL(props.src),
    //   asyncDelay(),
    // ]);
    const blobURL = await getImageBlobURL(props.src);

    src.value = blobURL;
    state.value = "success";
  } catch (err) {
    error.value = err.message;
    state.value = "error";

    /*@__PURE__*/ console.error(`[fetchImage] ${err.message}`);
  }
};

onMounted(() => fetchImage());
onUnmounted(() => clearBlobURL());
</script>

<template>
  <div class="image" :style="style">
    <span v-if="state === 'loading'" class="item loading"></span>
    <img
      v-else-if="state === 'success'"
      :src="src"
      :alt="props.alt"
      class="item img"
      :style="{
        objectFit: props.objectFit || 'contain',
      }"
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

.loading {
  /* background: linear-gradient(to top left, #09a1ff, #7ed0fc); */
  background-color: var(--vp-c-bg-soft);
  box-shadow: var(--vp-shadow-3);
}

.error {
  background: linear-gradient(to top left, #ff6347, #ff8e51);
}

.null {
  background: linear-gradient(to top left, #6f63f4, #add8e6);
}
</style>
