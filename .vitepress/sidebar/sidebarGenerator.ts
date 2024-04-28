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
  return str.replace(/^(?:\d+\s?[-]\s?)?(.*)$/, "$1");
}

// #region 类

export default class SidebarGenerator {
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
      src = "./",
      exclude = [],
      include = [],
      sortRules = [],
      pathAsText = true,
      rewritePath = SidebarGenerator.defaultRewritePath,
      transformSidebarItem,
    }: Options = options ?? {};

    this.src = src;
    this.pathAsText = pathAsText;
    this.exclude = _.union([...["\\[.+\\]\\.md$"], ...exclude]);
    this.include = _.union([...include]);

    this.rewritePath = rewritePath;
    this.sortRules = sortRules;
    this.transformSidebarItem = transformSidebarItem;
  }

  // #region defaultRewritePath
  static defaultRewritePath(segment: string, parentPath?: TextLink | null) {
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

  // #endregion defaultRewritePath

  srcpath(filepath: string) {
    return path.resolve(this.src!, filepath);
  }

  isDir(filepath: string) {
    return statSync(this.srcpath(filepath)).isDirectory();
  }

  // #region valid

  validExclude(filepath: string) {
    const base = path.basename(filepath);
    return (
      this._exclude.has(base) ||
      new RegExp(this.exclude!.join("|")).test(filepath)
    );
  }

  validInclude(filepath: string) {
    if (this._include.has(path.extname(filepath))) return { isFile: true };

    const includePattern = new RegExp(this.include!.join("|"));
    return includePattern.test(filepath);
  }

  validPathType(filepath: string) {
    return this.isDir(filepath)
      ? { isDir: true }
      : this.validInclude(filepath)
      ? { isFile: true }
      : null;
  }

  valid(filepath: string) {
    if (this.validExclude(filepath)) return null;
    return this.validPathType(filepath);
  }

  // #region info

  infoBase(filepath: string, parentInfo?: Info) {
    let text = path.basename(filepath);
    let ext: string | null = path.extname(filepath);

    return {
      text: text,
      ext: ext || null,
    };
  }

  infoRewrite(textAfterFormate: string, info: Info, parentInfo?: Info) {
    if (!this.rewritePath) return undefined;
    const parentRewrite: TextLink | null = parentInfo?.rewrite
      ? parentInfo.rewrite
      : null;

    info.rewrite = this.rewritePath(textAfterFormate, parentRewrite);

    this.pathAsText && (info.text = info.rewrite.text);
  }

  info(filepath: string, parentInfo?: Info): Info {
    const base = this.infoBase(filepath, parentInfo);

    let textFormater =
      base.ext && base.ext !== ".md"
        ? base.text.replace(base.ext, ".md")
        : base.text;

    const info = {
      ...base,
      link: parentInfo
        ? `${parentInfo.link}/${textFormater}`
        : `/${textFormater}`,
    };

    this.infoRewrite(textFormater, info, parentInfo);
    return info;
  }

  // #region setRewrite

  setRewrite(from: string, to: string) {
    if (!from || !to || from === to) return;
    from = from.replace(/^\//, "");
    to = to.replace(/^\//, "");
    this.rewrites[from] = to;
  }

  // #region genItem

  genItem(info: Info): SidebarItem {
    let text: string = info.text;
    let link: string;

    if (this.rewritePath) {
      link = info.rewrite!.link;
      this.setRewrite(info.link, link);
    } else {
      text = info.text.replace(".md", "");
      link = info.link;
    }

    return info.ext ? { text, link } : { text };
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

  genItemsGetSortedPaths(folderPath: string) {
    let filenames = _.sortBy(
      readdirSync(this.srcpath(folderPath)),
      ...this.sortRules!
    );

    const paths: { filepath: string; isDir?: boolean; isFile?: boolean }[] = [];

    for (const filename of filenames) {
      const filepath = `${folderPath}/${filename}`;
      const valid = this.valid(filepath);
      if (!valid) continue;

      paths.push({ filepath, ...valid });
    }

    return paths;
  }

  genItemsPush(
    items: SidebarItem[],
    {
      item,
      info,
      parentItem,
    }: { item: SidebarItem; info: Info; parentItem?: SidebarItem }
  ) {
    if (info.text === "index" || info.text === "index.md") {
      parentItem && (parentItem.link = info.link);
    } else {
      items.push(item);
    }
  }

  genItems(
    folderPath: string,
    { parentInfo, parentItem }: { parentInfo?: Info; parentItem?: SidebarItem }
  ) {
    const items: SidebarItem[] = [];

    const sortedPaths = this.genItemsGetSortedPaths(folderPath);

    for (const pathItem of sortedPaths) {
      const info = this.info(pathItem.filepath, parentInfo);
      const item = this.genItem(info);

      if (pathItem.isDir) {
        const children = this.genItems(pathItem.filepath, {
          parentInfo: info,
          parentItem: item,
        });
        if (children.length !== 0) {
          item.items = children;
          item.collapsed = false;
        }
      }

      this.genItemsPush(items, { item, info, parentItem });
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

  // #region start
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
  const generater = new SidebarGenerator(options);
  let result: SidebarGeneratorResult;

  try {
    result = mergeOptions
      ? generater.mergeWith(mergeOptions, customizer)
      : generater.start();
  } catch (err) {
    console.log(`\x1b[33m[generateSidebar] 生成失败: \x1b[0m`, err);
    result = (mergeOptions ?? {
      sidebar: {},
      rewrites: {},
    }) as SidebarGeneratorResult;
  }

  return result;
}

// #endregion 函数
