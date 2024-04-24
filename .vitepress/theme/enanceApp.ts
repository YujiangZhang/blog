import { type EnhanceAppContext } from "vitepress";
import { type Plugin } from "vue";
import { LinkBar, LinkGrid } from "../components";

// 全局组件
const globalComponentPlugin: Plugin = {
  install(app, ..._option) {
    app.component("LinkBar", LinkBar);
    app.component("LinkGrid", LinkGrid);
  },
};

export default function enhanceApp({
  app,
  router,
  siteData,
}: EnhanceAppContext) {
  app.use(globalComponentPlugin);
}
