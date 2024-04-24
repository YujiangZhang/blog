# 自定义配置

:::tip 提示
如果是自定义的 config 等**一次性配置**，则见 `config.ts` 或相关文件内的类型，不再列出。
:::

## markdown

::: tip 提示
一些仅在 `.md` 文件内部的定义说明。
:::

### frontmatter

追加自定义选项，如一些自动生成的 `.md` 文件，追溯源文件信息片段。

#### jSourceExt

frontmatter 新增选项 `jSourceExt`，表示由 `file[.extname]` 文件生成。值为原始文件后缀 `.extname`，这将用于编辑链接指向正确的文件。

:::details 书签示例
<<< @/bookmark/[bm].md#frontmatter{4}
:::

::: details editLink 配置

```ts
{
  editLink: {
    pattern({ filePath, frontmatter }){
      const jSourceExt = frontmatter.jSourceExt as string | undefined; // [!code focus]
      const link = jSourceExt
        ? filePath.replace(".md", jSourceExt)
        : filePath;
      return `https://github.com/zyj-dev/blog/tree/main/docs/${link}`;
    },
    text: "在 Github 上编辑此页面",
  },
}
```

:::

## Github Action

### skip build 跳过构建

```sh
$ git commit -m '...' -m '[skip build]'
```

::: tip
::: details build 配置
<<< @/../.github/workflows/deploy.yml#build{3}
:::

### deploy 部署

```sh
$ git commit -m '...' -m '[deploy]'
```

::: tip
如果已经 skip build 了，该命令不会触发 deploy

::: details deploy 配置
<<< @/../.github/workflows/deploy.yml#deploy{8}
:::
