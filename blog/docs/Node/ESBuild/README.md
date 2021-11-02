---
sidebar: auto
---

# esbuild

先简单了解一下 esbuild 是个啥 

[esbuild](https://www.breword.com/evanw-esbuild/)官方描述的作用就是：一个JavaScript的打包和和压缩工具

esbuild使用golang开发，在打包的速度上非常快，vite在dev模式下就是使用 esbuild 进行打包

**esbuild的主要特征**

- 在没有缓存的情况也能有极致的性能

- 支持ES6的Tree shaking

- 原生支持typescript和jsx打包

- 支持Source Map

- 代码压缩

- 支持定义插件

- 其它等等

## 语言优势

JavaScript 本质上依然是一门解释型语言，JavaScript 程序每次执行都需要先由解释器一边将源码翻译成机器语言，一边调度执行；而 Go 是一种编译型语言，在编译阶段就已经将源码转译为机器码，启动时只需要直接执行这些机器码即可。也就意味着，Go 语言编写的程序比 JavaScript 少了一个动态解释的过程

Go 天生具有多线程运行能力，而 JavaScript 本质上是一门单线程语言，直到引入 WebWorker 规范之后才有可能在浏览器、Node 中实现多线程操作

## 集成webpack

有一个相对较新的项目叫[esbuild-loader](https://github.com/privatenumber/esbuild-loader)。由hiroki osame开发，`esbuild-loader` 是一个建立在 esbuild 之上的webpack加载器。它允许用户用自己来替换 `ts-loader` 或 `babel-loader` ，这极大地提高了构建速度

### 将一个现有的项目迁移到esbuild

安装 esbuild-loader： `npm i -D esbuild-loader`

`webpack.config.js` 修改 `babel-loader` 的使用

```
  module.exports = {
    module: {
      rules: [
-       {
-         test: /\.js$/,
-         use: 'babel-loader',
-       },
+       {
+         test: /\.js$/,
+         loader: 'esbuild-loader',
+         options: {
+           loader: 'jsx',  // Remove this if you're not using JSX
+           target: 'es2015'  // Syntax to compile to (see options below for possible values)
+         }
+       },

        ...
      ],
    },
  }

```

如果有使用 `ts-loader` ，做如下修改

```
  module.exports = {
    module: {
      rules: [
-       {
-         test: /\.tsx?$/,
-         use: 'ts-loader'
-       },
+       {
+         test: /\.tsx?$/,
+         loader: 'esbuild-loader',
+         options: {
+           loader: 'tsx',  // Or 'ts' if you don't need tsx
+           target: 'es2015'
+         }
+       },

        ...
      ]
    },
  }

```

> [webpack或esbuild。为什么不同时进行呢](https://juejin.cn/post/6977183266986000414)  
> [webpack 或 esbuild：为什么不是两者兼而有之？](https://xie.infoq.cn/article/d9c4ca69e0de8fecf176dfd20)