弃用

### types

```typescript
export interface File {
  name: string;
  type: "dir" | "file";
  mtime: string | number;
  birthtime: string | number;
  children?: File[];
  url?: string;
}

```



### `markdown` 文件

```shell
$ npm install marked
$ npm install @types/marked
```



关于 `marked` 未来版本配置项可能取消，配置 `false`

```typescript
import { marked } from "marked";

marked.use({
  headerIds: false,
  mangle: false,
});
```



## 问题解决

### ts 导入 `*.vue` 文件的类型声明

- [Typescript support](https://github.com/vuejs/vue-next-webpack-preview/issues/5)

```typescript
// src/vue-env.d.ts
declare module "*.vue" {
  import { ComponentOptions } from "vue";
  const componentOptions: ComponentOptions;
  export default componentOptions;
}
```
