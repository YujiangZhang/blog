# Github Action

## ci skip 跳过构建

```sh
$ git commit -m '...' -m '[ci skip]'
```

## deploy 部署

```sh
$ git commit -m '...' -m '[deploy]'
```

::: tip
如果已经 ci skip 了，该命令不会触发 deploy
:::
