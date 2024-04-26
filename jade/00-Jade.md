# Jade

<JSocial />

:::tip
本站使用 [vitepress](https://vitepress.dev/zh/) 构建，本页记录了一些使用备忘。

本页可能会频繁更改，所以会出现该页会忘记更新，更甚至代码片段文件位置改变等问题。

如果是自定义的 config 等**一次性配置**，则见 `config.ts` 或相关文件内的类型，不再列出。
:::

## 待办

- favicon 不一起被打包

## 侧边栏

配置创建时调用，**默认配置**将根据以下规则生成：

- 文件 `index.md` 会使该文件所在文件夹生成 link
- 根据文件名排序
- 文件名会删除以 `/\d+[-]/` 开头的部分，如:
  - `01-folder/02-file.md`: 显示为 `folder/file`
- 路由重写: `01-folder/02-file.md` 将生成 `folder/file.html`

<<<@/.vitepress/config.mts#sidebar{ts}

::: tip
以上规则仅适用于默认配置。非插件，开发模式下不自动更新，根据 config.mts 更新。

::: details 配置类型
<<< @/.vitepress/sidebar/types.ts#Options
:::

## 书签

只需要提供 `.json` 文件，侧边栏会自动生成，命名规遵守[sidebar 侧边栏](#侧边栏)的规则。

为了能够在浏览器中得到正确的文件链接，自定义了 frontmatter 的 [jSrcExt](#jSrcExt) 属性。

## markdown

### frontmatter

追加自定义选项，如一些自动生成的 `.md` 文件，追溯源文件信息片段。

::: tip 提示
目前只有在 `/bookmarks/` 中使用。
:::

#### jSrcExt

frontmatter 新增选项 `jSrcExt`，表示由 `file[.ext]` 文件生成。值为原始文件后缀 `.ext`，这将用于编辑链接指向正确的文件。

:::details 书签示例
<<< @/bookmarks/[bm].md#frontmatter{4}
:::

## Github Action

### ci skip 跳过构建

```sh
$ git commit -m '...' -m '[ci skip]'
```

::: tip
::: details build 配置
<<< @/.github/workflows/deploy.yml#build{3}
:::

### deploy 部署

```sh
$ git commit -m '...' -m '[deploy]'
```

::: tip
如果已经 ci skip 了，该命令不会触发 deploy

::: details deploy 配置
<<< @/.github/workflows/deploy.yml#deploy{8}
:::
