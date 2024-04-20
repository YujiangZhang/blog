import { ref } from "vue";
import { Link } from "../types";
import links from "../data/bookmark-links.json";

type BookmarkText = "vue";
function mapFromArray(items: Link[]): Record<string, Link> {
  const obj = {};
  items.forEach((item, index) => {
    const key = item.text?.toLowerCase() || "key" + index;
    obj[key] = item;
  });
  return obj;
}

function mapFromObject(item: Link, text = "key") {
  return { [item.text || text]: item };
}

/**
 * 获得指定书签的数据
 *
 * @param text 书签名
 * @param toMap 是否返回一个映射
 * @returns 如果不返回指定映射，将返回原始的数据格式；如果指定返回映射，则键将处理为小写。
 *
 * 指定映射的规则为：
 * - 如果原始类型为 Link[]，则建的优先级为 item.text -> 字符 `key` + index
 * - 如果原始类型为 Link, 则键的优先级为 link.text -> 参数 text -> 字符 `key`
 */
export function useBookmark(text: BookmarkText, toMap: boolean = false) {
  const data = ref<Link[] | Link | Record<string, Link>>({});
  const state = ref<"loading" | "success" | "error">("loading");
  const error = ref<Error | null>(null);

  function getData() {
    if (!Reflect.has(links, text)) {
      state.value = "error";
      error.value = new Error(`不存在书签名为 ${text} 的数据`);
    }

    fetch(links[text])
      .then((res) => res.json())
      .then((originalData) => {
        const isArr = Array.isArray(originalData);

        let normalData = originalData;
        if (toMap) {
          normalData = isArr
            ? mapFromArray(originalData)
            : mapFromObject(originalData, text);
        }

        data.value = normalData;
        state.value = "success";
      })
      .catch((reason) => {
        error.value = reason;
        state.value = "error";
      });
  }

  getData();

  return {
    data,
    state,
    error,
  };
}
