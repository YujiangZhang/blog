import { readdirSync, statSync, writeFile, writeFileSync, writeSync } from "fs";
import type { SidebarItem, SidebarMulti, Options, TextLink } from "./types";
import _ from "lodash";
import path from "path";

type Info = {
  text: string;
  link: string;
  ext: null | string;
  rewrite?: TextLink;
};

function errorMessage(message?: string) {
  throw new Error(
    `[SidebarGenratorPlugin] 错误: ${message || import.meta.url}`
  );
}

function warnMessage(message?: string) {
  console.log(`[SidebarGenratorPlugin] 警告: ${message || import.meta.url}`);
}

function removeStartingDigitsAndHyphens(str: string) {
  return str.replace(/^(?:\d+[-])?(.*)$/, "$1");
}

export default class SidebarGenerator {
  pages: string[];

  sidebar: SidebarMulti = {};
  rewrites: Record<string, string> = {};

  src: Options["src"];
  exclude: Options["exclude"];
  include: Options["include"];
  _exclude = new Set([
    "node_modules",
    ".vitepress",
    "public",
    ".github",
    ".git",
    ".vscode",
  ]);
  _include = new Set([".md"]);

  rewritePath: Options["rewritePath"];
  sortRules: Options["sortRules"];
  transformSidebarItem: Options["transformSidebarItem"];

  // #region constructor
  constructor(options?: Options) {
    let {
      exclude = [],
      include = [],
      sortRules = [],
      src = SidebarGenerator.defaultSrc,
      rewritePath = SidebarGenerator.defaultRewritePath,
      transformSidebarItem = SidebarGenerator.defaultFormateSidebarItem,
    }: Options = options ?? {};

    this.src = src;
    this.exclude = SidebarGenerator.defaultExclude(exclude);
    this.include = SidebarGenerator.defaultInclude(include);

    this.rewritePath = rewritePath;
    this.sortRules = sortRules;
    this.transformSidebarItem = transformSidebarItem;
  }

  static defaultSrc = "./";

  static defaultExclude(exclude: string[]) {
    return _.union([...["\\[.+\\]\\.md$"], ...exclude]);
  }

  static defaultInclude(include: string[]) {
    return _.union([...include]);
  }

  static defaultRewritePath(segment: string, parentPath?: null | TextLink) {
    // console.log(path);
    const ext = path.extname(segment);
    let text = removeStartingDigitsAndHyphens(segment);
    let linkFormater = text;

    if (ext) {
      text = text.replace(ext, "");
      linkFormater = text + ".md";
    }

    return {
      text,
      link: parentPath?.link
        ? `${parentPath.link}/${linkFormater}`
        : `/${linkFormater}`,
    };
  }
  static defaultFormateSidebarItem(item: SidebarItem) {
    const ext = path.extname(item.text!);
    item.text = removeStartingDigitsAndHyphens(item.text!).replace(ext, "");
    item.items && (item.collapsed = false);
    return item;
  }

  srcpath(filepath: string) {
    return path.resolve(this.src!, filepath);
  }

  // #region valid
  valid(filepath: string) {
    const base = path.basename(filepath);
    const fullPath = this.srcpath(filepath);

    if (this._exclude.has(base)) return null;

    const excludePattern = new RegExp(this.exclude!.join("|"));

    if (excludePattern.test(filepath)) return null;

    if (statSync(fullPath).isDirectory())
      return {
        isDir: true,
      };

    if (this._include.has(path.extname(base))) return { isFile: true };

    const includePattern = new RegExp(this.include!.join("|"));
    return includePattern.test(filepath) ? { isFile: true } : null;
  }

  // #region info
  info(filepath: string, parentInfo?: Info): Info {
    let filename = path.basename(filepath);
    let ext: string | null = path.extname(filepath);

    let filenameFormater = filename;
    if (ext && ext !== ".md") {
      filenameFormater = filename.replace(ext, ".md");
    }

    let rewrite: Record<"text" | "link", string> | undefined;
    if (this.rewritePath) {
      const parentRewrite: TextLink | null = parentInfo?.rewrite
        ? parentInfo.rewrite
        : null;
      rewrite = this.rewritePath(filenameFormater, parentRewrite);
    }

    return {
      text: filename,
      ext: ext || null,
      link: parentInfo
        ? `${parentInfo.link}/${filenameFormater}`
        : `/${filenameFormater}`,
      rewrite,
    };
  }

  // #region setRewrite
  setRewrite(from: string, to: string) {
    if (!from || !to || from === to) return;
    from.startsWith("/") && (from = from.slice(1));
    to.startsWith("/") && (to = to.slice(1));
    this.rewrites[from] = to;
  }

  // #region genItem
  genItem(info: Info): SidebarItem {
    let text: string = info.text;
    let link: string;

    if (this.rewritePath) {
      // text = info.rewrite!.text; // 交给 transformItem
      link = info.rewrite!.link;
      this.setRewrite(info.link, link);
    } else {
      text = info.text.replace(".md", "");
      link = info.link;
    }

    if (info.ext) {
      return { text, link };
    } else {
      return { text };
    }
  }

  // region transformItems
  transformItems(items: SidebarItem[]) {
    return this.transformSidebarItem
      ? items.map((item) => {
          return this.transformSidebarItem!(item);
        })
      : items;
  }

  // #region genItems
  genItems(
    folderPath: string,
    { parentInfo, parentItem }: { parentInfo?: Info; parentItem?: SidebarItem }
  ) {
    const items: SidebarItem[] = [];

    let filenames = readdirSync(this.srcpath(folderPath));

    filenames = _.sortBy(filenames, ...this.sortRules!);

    for (const filename of filenames) {
      const filepath = `${folderPath}/${filename}`;

      const valid = this.valid(filepath);
      if (!valid) continue;

      const info = this.info(filepath, parentInfo);

      const item = this.genItem(info);

      if (valid.isDir) {
        item.items = this.genItems(filepath, {
          parentInfo: info,
          parentItem: item,
        });
      }

      if (info.text === "index.md") {
        parentItem && (parentItem.link = info.link);
      } else {
        items.push(item);
      }
    }

    return this.transformItems(items);
  }

  generate() {
    const items = this.genItems(this.src!, {});
    this.sidebar = items.reduce(
      (sidebar, item) =>
        ({ ...sidebar, [`/${item.text}/`]: item.items } as SidebarMulti),
      {} as SidebarMulti
    );

    return this.sidebar;
  }

  // #region 启动
  start() {
    this.generate();
    writeFileSync("test.json", JSON.stringify(this.sidebar, null, 2));
    return { sidebar: this.sidebar, rewrites: this.rewrites };
  }
}
