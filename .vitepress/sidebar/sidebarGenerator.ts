import type {
  SidebarItem,
  SidebarMulti,
  Options,
  TextLink,
  MergeOptions,
} from "./types";
import { readdirSync, statSync } from "fs";
import path from "path";
import _ from "lodash";

type Info = {
  text: string;
  link: string;
  ext: null | string;
  rewrite?: TextLink;
};

function removeStartingDigitsAndHyphens(str: string) {
  return str.replace(/^(?:\d+[-])?(.*)$/, "$1");
}

// #region 类

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

  pathAsText: Options["pathAsText"];
  rewritePath: Options["rewritePath"];
  sortRules: Options["sortRules"];
  transformSidebarItem: Options["transformSidebarItem"];

  // #region constructor
  constructor(options?: Options) {
    let {
      exclude = [],
      include = [],
      sortRules = [],
      pathAsText = true,
      src = SidebarGenerator.defaultSrc,
      rewritePath = SidebarGenerator.defaultRewritePath,
      transformSidebarItem,
    }: Options = options ?? {};

    this.src = src;
    this.pathAsText = pathAsText;
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
    let text = path.basename(filepath);
    let ext: string | null = path.extname(filepath);

    let filenameFormater = text;
    if (ext && ext !== ".md") {
      filenameFormater = text.replace(ext, ".md");
    }

    let rewrite: Record<"text" | "link", string> | undefined;
    if (this.rewritePath) {
      const parentRewrite: TextLink | null = parentInfo?.rewrite
        ? parentInfo.rewrite
        : null;
      rewrite = this.rewritePath(filenameFormater, parentRewrite);

      this.pathAsText && (text = rewrite.text);
    }

    return {
      text: text,
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
        const children = this.genItems(filepath, {
          parentInfo: info,
          parentItem: item,
        });
        if (children.length !== 0) {
          item.items = children;
          item.collapsed = false;
        }
      }

      if (info.text === "index" || info.text === "index.md") {
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
    return { sidebar: this.sidebar, rewrites: this.rewrites };
  }

  static mergeCustomizer(item: unknown, srcItem: unknown) {
    if (_.isArray(item)) {
      return item.concat(srcItem);
    }
  }

  mergeWith(
    { sidebar, rewrites }: MergeOptions,
    customizer = SidebarGenerator.mergeCustomizer
  ) {
    this.generate();
    return {
      sidebar: _.mergeWith(this.sidebar, sidebar, customizer),
      rewrites: _.mergeWith(this.rewrites, rewrites, customizer),
    };
  }
}

// #endregion 类

// #region 函数

interface SidebarGeneratorResult {
  sidebar: SidebarMulti;
  rewrites: Record<string, string>;
}

type GeneratorCustomizer = (...args: any[]) => any;

export function generateSidebar(options: Options): SidebarGeneratorResult;
export function generateSidebar(
  options: Options,
  mergeOptions: MergeOptions,
  customizer?: GeneratorCustomizer
): SidebarGeneratorResult;

export function generateSidebar(
  options: Options,
  mergeOptions?: MergeOptions,
  customizer: GeneratorCustomizer = SidebarGenerator.mergeCustomizer
): SidebarGeneratorResult {
  try {
    const generater = new SidebarGenerator(options);
    if (mergeOptions) {
      return generater.mergeWith(mergeOptions, customizer);
    } else {
      return generater.start();
    }
  } catch (err) {
    console.log(`\x1b[33m[generateSidebar] 生成失败: \x1b[0m`, err);
    return (mergeOptions ?? {
      sidebar: {},
      rewrites: {},
    }) as SidebarGeneratorResult;
  }
}
// #endregion 函数
