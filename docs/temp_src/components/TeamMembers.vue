<script setup lang="ts">
import { DefaultTheme } from "vitepress/theme";
import Image from "./Image.vue";

interface Member {
  avatar: string;
  name: string;
  title: string;
  links: DefaultTheme.SocialLink[];
}
interface Props {
  members: Member[];
}
const props = defineProps<Props>();
</script>

<template>
  <div class="team-members">
    <div v-for="(member, index) in props.members" :key="index">
      <Image
        :src="member.avatar"
        alt=""
        width="3rem"
        height="3rem"
        borderRadius="50%"
      />
      <span>{{ member.name }}</span>
    </div>
  </div>
</template>

<style scoped></style>
