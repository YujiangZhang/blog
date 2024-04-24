// https://vitepress.dev/guide/custom-theme
import type { Theme } from "vitepress";
import DefaultTheme from "vitepress/theme-without-fonts";
import enhanceApp from "./enanceApp";
import Layout from "./Layout.vue";
import "./styles.css";

export default {
  extends: DefaultTheme,
  enhanceApp,
  Layout,
} satisfies Theme;
