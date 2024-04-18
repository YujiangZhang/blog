import { CustomSidebar } from "../types";
import englishSidebar from "./english";
import guideSidebar from "./guide";
import bookmarkSidebar from "./bookmark";

const sidebar: CustomSidebar = {
  ...guideSidebar,
  ...bookmarkSidebar,
  ...englishSidebar,
};

export default sidebar;
