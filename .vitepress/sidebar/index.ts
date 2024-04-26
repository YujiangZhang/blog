import SidebarGenerator from "./sidebarGenerator";
import type { Options } from "./types";

export function generateSidebar(options?: Options) {
  const generator = new SidebarGenerator(options);
  return generator.start();
}
