## 发布npm

步骤：

1. 注册 [`npm`](https://www.npmjs.com/) 账号

2. 本地终端登录 `npm` 账号：`npm login`

  ```shell
  Username: YOUR_USER_NAME
  Password: YOUR_PASSWORD
  Email: YOUR_EMAIL@domain.com
  ```

3. 查看 `npm` 当前使用的用户：`npm whoami`

4. 创建 `npm` 包：`npm init packagename -y`

  `package.json` 中的字段

  必需带有的字段

  - `name` :包名(全部小写，没有空格，可以使用下划线或者横线)

  - `version` : 版本

  其他内容

  - `author` : 作者信息

  - `main` : 程序入口文件，一般都是 `index.js`

  - `description` : 描述信息，有助于搜索

  - `keywords[]`: 关键字，有助于在人们使用 `npm search` 搜索时发现你的项目

  `scripts`: 支持的脚本，默认是一个空的 `test`

  - `license` : 默认是 MIT

  - `bugs` : 当前项目的一些错误信息，如果有的话

  - `dependencies` : 在生产环境中需要用到的依赖

  - `devDependencies`: 在开发、测试环境中用到的依赖

  - `repository : 代码仓库

5. 发布

  - 将 `npm` 源切换为 `https://registry.npmjs.org/`

  `npm set registry https://registry.npmjs.org/`

  - 发布：`npm publish`

## 执行`npm publish`时可以遇到的错误

**提示 `is not in the npm registry`**

- 查看自己的 `npm` 是否使用了镜像，比如常用的淘宝镜像 `http://registry.npm.taobao.org/`

- 我们需要切回原来的 `npm config set registry https://registry.npmjs.org/`

- 重新执行 `npm adduser`、`npm publish`


**This package has been marked as private**

删除 `package.json` 文件的 `"private": true`

**you must verify your email before publishing a new package**

`npm` 要求开发者提供了一个有效的电子邮件地址，并且在每次发布新的NPM包之前，需要验证你的电子邮件。

所以登录 `npm` 官网，验证一下自己的邮件地址

示例：[black-hook-ui](https://github.com/lanjz/black-hook-ui)

### 粟子

> 参数 [vue封装组件，类似elementUI组件库打包发布到npm上](https://blog.csdn.net/cscscssjsp/article/details/82501745)

1. 通过 `vue init webpack-simple`，新建一个 `vue` 项目

2. 在 `src` 目录下新一个 `lib` 文件夹，放置需要封装的 `vue` 组件

3. 修改 `vue.config.js` 文件

```js
{
   entry: './src/lib/index.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: '/dist/',
    filename: 'black-hook-ui.min.js',
    library: 'blackHookUI'
  },
}
```

4. 修改 `packpack.json` 文件

```js
{
 "main": "/dist/black-hook-ui.min.js",
 "files": [
    "dist",
    "src/lib"
  ],
}
```

5. 执行 `yarn build` 命令生成 `dist` 目录

6. `npm` 上传


