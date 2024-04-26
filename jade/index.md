# 自定义配置

:::tip 提示
如果是自定义的 config 等**一次性配置**，则见 `config.ts` 或相关文件内的类型，不再列出。
:::

## sidebar 侧边栏

~~vite 插件: 侧边栏会根据 pages 自动生成侧边栏，即源目录结构。~~

配置创建时调用 **默认配置**时将根据以下规则生成：

- 文件 'index.md' 会使该文件所在文件夹生成 link
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


## markdown

::: tip 提示
一些仅在 `.md` 文件内部的定义说明，目前只有在 `/bookmarks/` 中使用。
:::

### frontmatter

追加自定义选项，如一些自动生成的 `.md` 文件，追溯源文件信息片段。

#### jSrcExt

frontmatter 新增选项 `jSrcExt`，表示由 `file[.ext]` 文件生成。值为原始文件后缀 `.ext`，这将用于编辑链接指向正确的文件。

:::details 书签示例
<<< @/bookmarks/[bm].md#frontmatter{4}
:::

## Github Action

### skip build 跳过构建

```sh
$ git commit -m '...' -m '[skip build]'
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
如果已经 skip build 了，该命令不会触发 deploy

::: details deploy 配置
<<< @/.github/workflows/deploy.yml#deploy{8}
:::
