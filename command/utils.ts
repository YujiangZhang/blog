import fs from "fs";
import path from "path";

export type Callback = (item: string, itemPath: string, index: number) => void;
export interface Callbacks {
  folder?: Callback;
  file?: Callback;
}
export interface Options {
  ignores?: string[];
  deep?: boolean;
}

//
export const docsPath = path.join(process.cwd(), "docs");
export const publicPath = path.join(docsPath, "public");
export const publicDataPath = path.join(docsPath, "public/data");
export const srcPath = path.join(docsPath, "src");
export const srcDataPath = path.join(docsPath, "src/data");

/**
 * 指定目录为根目录，返回以 / 开头的路径
 * @param itemPath 文件路径，格式为绝对路径
 * @param relativePath 以该目录为根目录，格式为绝对路径。默认为 publicPath
 * @returns 以 / 开头的路径
 */
export function normalizeRootPath(
  itemPath: string,
  relativePath: string = publicPath
) {
  return (
    "/" +
    path
      .relative(path.resolve(relativePath), itemPath)
      .split(path.sep)
      .join("/")
  );
}

/**
 * 遍历指定目录
 * @param folderPath
 * @param callbacks
 * @param options
 */
export function traverseDirectory(
  folderPath: string,
  callbacks: Callbacks = {},
  options: Options = { deep: false, ignores: [] }
) {
  const items = fs.readdirSync(folderPath);

  items.forEach((item, index) => {
    if (options.ignores && options.ignores.includes(item)) return;

    const itemPath = path.join(folderPath, item);

    const stat = fs.statSync(itemPath);

    if (stat.isDirectory()) {
      callbacks.folder && callbacks.folder(item, itemPath, index);
      options.deep && traverseDirectory(itemPath, callbacks, options);
    } else {
      callbacks.file && callbacks.file(item, itemPath, index);
    }
  });
}
