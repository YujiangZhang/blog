import { DefaultTheme } from "vitepress";
import { UserConfig, PluginOption } from "vite";

//
export type CustomSidebarItem = DefaultTheme.SidebarItem;
export type CustomSidebar = DefaultTheme.SidebarMulti;

//
export type CustomPlugins = UserConfig["plugins"];
export type CustomPlugin = PluginOption;
