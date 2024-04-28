<script setup lang="ts">
import { VPTeamMembers } from "vitepress/theme";
import { Image, LinkBar } from ".";

const HFACTOR = 7 / 5;
const imageBase = 110;
const imageWidth = imageBase + "px";
const imageHeight = HFACTOR * imageBase + "px";

const social = {
  qq: {
    text: "陵游",
    icon: "qq",
    link: "https://qm.qq.com/q/JJCQ4N8i8S",
    image: "/assets/images/qq.jpg",
  },
  bili: {
    text: "陵游main",
    icon: "bilibili",
    link: "https://space.bilibili.com/400815687",
    image: "/assets/images/bilibili.jpg",
  },
};
const members = [
  {
    avatar: "/avatar.png",
    name: "Jade Zhang",
    title: "欢迎访问 🎉",
    desc: "",
    actionText: "Jade",
    links: [
      {
        icon: "github",
        link: "https://github.com/zyj-dev/",
        ariaLabel: "github 链接",
      },
      {
        icon: {
          svg: '<svg t="1714150464808" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="14009" width="256" height="256"><path d="M513 583.8l448.5-448.5c-11.6-4.7-24.3-7.3-37.5-7.3H100c-12.7 0-24.9 2.4-36.1 6.7L513 583.8z" p-id="14010" fill="#8a8a8a"></path><path d="M513 674.3L14.6 175.9C5.3 191.1 0 208.9 0 228v568c0 55.2 44.8 100 100 100h824c55.2 0 100-44.8 100-100V228c0-18.5-5.1-35.9-13.9-50.8L513 674.3z" p-id="14011" fill="#8a8a8a"></path></svg>',
        },
        link: "mailto:jadezhang.jz@outlook.com",
      },
    ],
  },
];
</script>

<template>
  <section class="social">
    <VPTeamMembers size="small" :members="members" />
    <div class="qrcodes">
      <div v-for="(item, key) in social" :key="item.text" class="qrcode">
        <LinkBar :data="item" :logo="true" class="bar" />
        <Image
          :src="item.image"
          :width="imageWidth"
          :height="imageHeight"
          :alt="item.text"
          borderRadius="6px"
          class="image"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
.social,
.qrcodes,
.qrcode {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: end;
  gap: 1rem;
}

.social {
  justify-content: space-between;
  flex-wrap: wrap;
  row-gap: 1rem;
  margin: 0 auto;
}

.qrcode {
  width: 100%;
  height: 232px;
  overflow: hidden;
  gap: 0.5rem;
  flex-direction: column;
  align-items: center;
  padding: 0.5rem 1rem;
  background-color: var(--vp-c-bg-soft);
  border-radius: 12px;
}

.image {
  box-shadow: var(--vp-shadow-3);
}

@media (max-width: 980px) {
  .social {
    justify-content: center;
  }
}
</style>
