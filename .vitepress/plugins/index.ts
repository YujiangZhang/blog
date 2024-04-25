import SidebarGenerator from "./sidebarGenerator";
import { Plugin } from "vitepress";
import type { Config, SidebarPlugin } from "./types";
import { writeFileSync } from "fs";

export function sidebarGeneratorPlugin(
  options?: SidebarPlugin.Options
): Plugin<any> {
  const generator = (config: Config) => {
    let sidebarGenerator: null | SidebarGenerator = new SidebarGenerator(
      config,
      options
    );
    return sidebarGenerator.start();
  };

  return {
    name: "jade-sidebar-generator",

    configResolved(config) {
      generator(config as Config);
    },
  };
}
