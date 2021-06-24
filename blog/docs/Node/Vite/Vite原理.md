# Vite

Vite 快的原因？

Vite 以 原生ESM 方式提供源码。这实际上是让浏览器接管了打包程序的部分工作：Vite 只需要在浏览器请求源码时进行转换并按需提供源码。根据情景动态导入代码，即只在当前屏幕上实际使用时才会被处理。

## 原生ESM

先来个例子：

```html
<!--index.html-->
 <script type="module" src="/src/main.js"></script>
```
```js
// main.js
import { doSomeThing } from "./utils.js";

doSomeThing()
```
```js
// utils.js
export function doSomeThing(){
  console.log('doSomeThing')
}
```

浏览器打后控制台能正常输出了 `doSomeThing`

控制台 network 的信息如下：

![](./static/esmodule.png)

可以发现对于 `main.js` 中的 `import { doSomeThing } from "./utils.js"`

浏览器会发起了一个 `get`请求，下载 `utils.js` 文件并获取其中导出的模块并执行

### vite-app

回头看下使用 `vite-app` 创建的项目，浏览器是如果何加载的

```js
import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')
```

我们能 get 到以下几点信息：

首先加载：`http://localhost:3000/src/main.js`

```js
import { createApp } from '/node_modules/.vite/vue.js?v=80d8618d'
import App from '/src/App.vue'

createApp(App).mount('#app')
```

可以看到源码中的 `import { createApp } from 'vue'` 变成了 `import { createApp } from '/node_modules/.vite/vue.js?v=80d8618d'`

这是为了让浏览器把资源路径定位到 `node_modules` 中，准确下载到对应的模块

之后加载：`http://localhost:3000/node_modules/.vite/vue.js`

获取 `createApp` 这个方法

之后再加载： `http://localhost:3000/src/App.vue`

获取 App

然后使用 `createApp` 创建应用并挂载节点

vite 利用 ES module，把 “构建 vue 应用” 这个本来需要通过 webpack 打包后才能执行的代码直接放在浏览器里执行，这么做是为了：

- 去掉打包步骤

- 实现按需加载

### 去掉打包步骤

打包的概念是开发者利用打包工具以一定规则读取模块的代码，就将对这些模块进行翻译转换，组成形成 bundle，以便在不支持模块化的浏览器里使用。webpack 的运行就离不开打包这个环节

先回顾一下 Webpack 的运行流程：

- [初始化参数]：从配置文件和 Shell 语句中读取与合并参数，得出最终的参数

- [开始编译]：用上一步得到的参数初始化 Compiler 对象，加载所有配置的插件，执行对象的 run 方法开始执行编译

- [确定入口]：根据配置中的 entry 找出所有的入口文件

- [编译模块]：从入口文件出发，调用所有配置的 Loader 对模块进行翻译，再找出该模块依赖的模块，再递归本步骤直到所有入口依赖的文件都经过了本步骤的处理

- [完成模块编译]：在经过第4步使用 Loader 翻译完所有模块后，得到了每个模块被翻译后的最终内容以及它们之间的依赖关系

- [输出资源]：根据入口和模块之间的依赖关系，组装成一个个包含多个模块的 Chunk，再把每个 Chunk 转换成一个单独的文件加入到输出列表，这步是可以修改输出内容的最后机会

- [输出完成]：在确定好输出内容后，根据配置确定输出的路径和文件名，把文件内容写入到文件系统

在 webpack 的启动和和每次热更新的过程中，模块的编译都需要花费很多的时间

vite 利用浏览器原生支持模块化导入这一特性，省略了对模块的编译和组装工作，所以打包这一步就可以省略了

### 实现按需打包

前面说到，webpack 会将各模块提前打包进 bundle 里，在不进行任何的处理的情况，webpack 会将所以的模块打包在一起——不管这个模块的代码是否有被执行到，所以往往一个 bundle 文件会很大，并且随着项目越来越大打包后的 bundle 也越来越大

为了解决这个问题，开发者会使用 `import()` 的方式将模块进行分离，实现按需模块（ 但被分离的模块依然需要提前编译和打包)，又或者使用 teaserPlugin 进行代码压缩或 tree shaking 等方式尽力得去减小代码体积，然而这些方式都不如 vite 的优雅，vite 可以只在某个模块被 `import` 时才去引入它，而且不需要提前打包

## vite 启动

跟 webpack 类似 vite 启动时也会创建一个本地服务

声明 script 标签类型为 module

```js
<script type="module" src="/src/main.js"></script>
```

浏览器向服务器发起GET

```js
// 请求main.js文件：
http://localhost:3000/src/main.js

// /src/main.js:
import { createApp } from 'vue'
import App from './App.vue'
createApp(App).mount('#app')
```

请求到main.js文件，检测内部含有import引入的包，会对内部的 import 引用发起 HTTP 请求获取模块的内容文件

劫持浏览器的http请求，在后端进行相应的处理将项目中使用的文件通过简单的分解与整合，然后再返回给浏览器(整个过程没有对文件进行打包编译)

## VS Webpack

vite是直接启动开发服务器，请求哪个模块再对该模块进行实时编译。
由于现代浏览器本身就支持ES Module，会自动向依赖的Module发出请求。vite充分利用这一点，将开发环境下的模块文件，就作为浏览器要执行的文件，而不是像webpack那样进行打包合并。
由于vite在启动的时候不需要打包，也就意味着不需要分析模块的依赖、不需要编译，因此启动速度非常快。当浏览器请求某个模块时，再根据需要对模块内容进行编译。这种按需动态编译的方式，极大的缩减了编译时间，项目越复杂、模块越多，vite的优势越明显。
在HMR方面，当改动了一个模块后，仅需让浏览器重新请求该模块即可，不像webpack那样需要把该模块的相关依赖模块全部编译一次，效率更高。
当需要打包到生产环境时，vite使用传统的rollup进行打包，因此，vite的主要优势在开发阶段。另外，由于vite利用的是ES Module，因此在代码中不可以使用CommonJS


### 打包原理比较

**webpack**

过程：识别入口->逐层识别依赖->分析/转换/编译/输出代码->打包后的代码

原理：逐级递归识别依赖，构建依赖图谱->转化AST语法树->处理代码->转换为浏览器可识别的代码

**Vite**

开发阶段直接省去上停的打包过程，直接基于浏览器原生 ES module，利用浏览器解析 imports，服务器端按需编译返回

webpack会先打包，然后启动开发服务器，请求服务器时直接给予打包结果

https://jishuin.proginn.com/p/763bfbd29d7f

https://bbs.huaweicloud.com/blogs/271090

