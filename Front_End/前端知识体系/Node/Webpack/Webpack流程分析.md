# Webpack流程分析

Webpack的运行过程是一个串行的过程，从启动到结束会经过以下过程：

- 初始化参数：从配置文件和 Shell 命令语句中读取并合并参数，得到最终的参数

- 开始编译：用上一步得到的参数初始化 Compiler 对象，加载所有配置的插件，执行对象的 `run`
方法开始执行编译

- 确定入口：根据配置中的`entry`配置找出所有的入口文件

- 编译模块：从入文件开始，调用所有配置的 Loader 对模块进行翻译，再找该模块所依赖的模块，
递归本步骤直到所有依赖的模块都经过此步骤

- 完成模块的编译：通过上一步使用 Loader 翻译完所有模块后，得到了每个模块被翻译后的最终内容以及它们之间的依赖关系

- 输出资源：根据入口和模块之间的依赖关系，组装成一个个包含多个模块的 Chunk，再把每个 Chunk 转换成一个单独的文件加入到输出列表，
这步是可以修改输出内容的最后机会

- 在确定好输出内容后，根据配置确定输出的路径和文件名，把文件内容写入到文件系统

假设我们使用 cli 来执行一个 Webpack 打包命令

```
webpack.js --config=webpack.build.js
```

以上代码等同于以下代码：

```
const Webpack = require('./node_modules/webpack');
const config = require('./webpack.build.js');
const compiler = Webpack(config);
compiler.run();

```

# Loader

Loader 本质就是一个函数，在该函数中对接收到的内容进行转换，返回转换后的结果。 因为 Webpack 只认识 JavaScript，所以 Loader 就成了翻译官，
对其他类型的资源进行转译的预处理工作。

Loader 在 `module.rules` 中配置，作为模块的解析规则，类型为数组。每一项都是一个 `Object`，
内部包含了 `test`(类型文件)、`loader`、`options` (参数)等属性。

# Plugin

就是插件，基于事件流框架 `Tapable`，插件可以扩展 Webpack 的功能，在 Webpack 运行的生命周期中会广
播出许多事件，Plugin 可以监听这些事件，在合适的时机通过 Webpack 提供的 API 改变输出结果。

Plugin 在 `plugins` 中单独配置，类型为数组，每一项是一个 `Plugin` 的实例，参数都通过构造函数传入。

# 使用webpack开发时，你用过哪些可以提高效率的插件？

- webpack-dashboard: 可以更友好的展示相关打包信息

- webpack-merge: 提取公共配置，减少重复配置代码

- 



