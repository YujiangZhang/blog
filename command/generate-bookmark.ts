import fs from "fs";
import path from "path";
import {
  Callback,
  publicDataPath,
  normalizeRootPath,
  traverseDirectory,
  srcDataPath,
  publicPath,
} from "./utils";

const bookmarkPath = path.join(publicDataPath, "bookmark");
const outFile = path.join(srcDataPath, "bookmark-links.json");

//
function generate() {
  console.log(`正在根据 ${bookmarkPath} 目录结构生成数据，请稍后 ...`);

  const jsonFilesMapping = {} as Record<string, string>;

  const callback: Callback = (item, itemPath, index) => {
    if (path.extname(item) !== ".json") return;
    let key = item.replace(".json", "");

    if (Reflect.has(jsonFilesMapping, key)) {
      console.warn(`文件名 ${key} 重复: ${itemPath}`);
      key += index;
      console.warn(`\t文件名更改为 ${key}}`);
    }

    jsonFilesMapping[key] = normalizeRootPath(itemPath, publicPath);
  };

  traverseDirectory(
    bookmarkPath,
    {
      file: callback,
    },
    { deep: true, ignores: ["index.json"] }
  );

  fs.writeFileSync(outFile, JSON.stringify(jsonFilesMapping, null, 2));

  console.log(`映射数据已保存到 ${outFile}`);
}

//
generate();
