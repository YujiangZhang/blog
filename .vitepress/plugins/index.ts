import SidebarGenerator from "./sidebarGenerator";
import { Plugin } from "vitepress";
import type { Config, SidebarPlugin } from "./types";

export function sidebarGeneratorPlugin(
  options?: SidebarPlugin.Options
): Plugin<any> {
  return {
    name: "jade-sidebar-generator",

    config(config) {
      let sidebarGenerator: null | SidebarGenerator = new SidebarGenerator(
        config as Config,
        { rewritePath: null, ...options }
      );
      (config as Config).vitepress = sidebarGenerator.start();
    },
  };
}
