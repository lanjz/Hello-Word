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

假设我们使用 `cli` 来执行一个 Webpack 打包命令

```js
webpack.js --config=webpack.build.js
```

以上代码等同于以下代码：

```js
const Webpack = require('./node_modules/webpack');
const config = require('./webpack.build.js');
const compiler = Webpack(config);
compiler.run();

```

## 流程细节

Webpack的构建流程大致可以分为以下三个阶段

1. 初始化：启动构建，读取与合并配置参数，加载 `Plugin`，实例化`Compiler`

2. 编译：从 `Entry` 发出，针对每个 Module 串行调用对应的  Loader 去翻译文件的内容，再找到该 Module 依赖的 Module，递归地进行编译处理

3. 输出：将编译后的 Module 组合成 Chunk，将 Chunk 转换成文件，输出到文件系统中

### 初始化阶段

初始化阶段会发生的事件及解释如下：

- 初始化参数：从配置文件和 Shell 语句中读取并合并参数，得出最终的参数。在这个过程中还会执行配置文件中的插件实例化语句 `new Plugin()`

- 实例 Compiler：用上一步得到的参数初始化 Compiler 实例，Compiler 负责文件的监听和启动编译。在 Compiler 实例中包含了完整的 Webpack 配置，全局只有一个 Compiler 实例

- 加载插件：依次调用插件的 `apply` 方法，让插件可以监听后续的所有事件节点。同时向插件传入Compiler 实例的引用，以方便插件通过 Compiler 调用 Webpack 提供的 API

- `environment`：开始应用 Node.js 风格的文件系统到 Compiler 对象，以方便后续的文件寻找和读取

- `entry-option`：读取配置的 `Entry`，为每个 `Entry` 实例化一个对应的 `EntryPlugin`，为后面该 `Entry` 的递归解析工作做准备

- `after-plugin`：调用完所有内置的和配置的插件的 `apply方` 法

- `after-resolvers`：根据配置初始 `resolver`, `resolver` 负责在文件系统中寻找指定路径的文件

### 编译阶段

编译阶段会发生的事件及解释如下：

- `run`：启动一次新的编译

- `watch-run`：和 `run` 类似，区别在于它是监听模式下启动编译，在这个事件中可以获取是哪些文件发了变化从而导致重新启动一次编译

- `compile`：该事件是为了告诉插件一次新的编译将要启动，同时会给插件带上 Compiler 对象

- `compilation`：当 Webpack 以及开发模式运行时，每当检测到文件发生了变化，便有一次新的`Compilation` 被创建。一个 `Compilation` 对象包含了当前的模块资源 、编译生成资源 、变化的文件等。`Compilation` 对象也提供了很多事件回调给插件进行扩展

- `make`：一个新的 `compilation` 创建后，即从 `Entry` 配置的入口文件开发，根据配置的`Loader` 对这个入口文件及依赖的模块进行递归的编译和解析

- `after-compile`：一次 `compilation` 编译完成

- `invalid`：当遇到文件不存在、文件编译发生错误等异常情况会触发该事件，该事件不会导致 Webpack退出 

其中 `compilation` 事件又包含了几个小事件

- `build-module`：使用对应的 Loader去 转换一个模块

- 在用 Loader 转换完一个模块后，使用 `acorn` 解析转换后的内容，输出对应的抽象语法树（AST），以方便 Webpack 在后面对代码进行分析

- `program`：从配置的入口模块开始，分析其 `AST`，当遇到i `mport` 等导入其它模块的语句时，便将其加入依赖的模块列表中，同时对新找的依赖模块做递归分析，最终弄清楚所有模块的依赖关系

- `seal`：所有模块及其依赖的模块都通过 Loader 转换完成，根据依赖关系开始生成 Chunk

## 输出编译

输出编译阶段会发生的事件及解释如下：

- `should-emit`：所有需要输出的文件已经生成，询问插件哪些文件需要输出，哪些文件不需要输出

- `emit`： 确定好要输出的文件之后，执行文件输出，可以在这里获取和修改输出的内容

- `after-emit`： 文件输出完成

- `done`：成功完成一次完整的编译和输出流程

- `failed`： 如果在编译和输出的流程中遇到异常，导致Webpack退出，就会直接跳转到本步骤，插件可通过本事件中获取到具体的错误原因

## 输出文件分析

打包以下文件：

```js
// index.js
import { sayHello } from "./main";

function component() {
    var element = document.createElement('div');
    element.innerHTML = 'Hello';
    sayHello()
    return element;
}

document.body.appendChild(component());
```

```js
// main.js
export function sayHello(){
    console.log('sayHello')
}
```

得到的`bundle.js`文件内容如下：

```js
/******/ (function(modules) { // webpackBootstrap
/******/ 	// 已经加载的模块缓存
/******/ 	var installedModules = {};
/******/
/******/ 	// webpack的require函数实现
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// 检查模块是否在缓存内
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// 建立一个新模块，并放入缓存
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// 执行这个模块
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// l变量标示模块是否加载过了
/******/ 		module.l = true;
/******/
/******/ 		// 返回模块暴露给外面的对象
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// 暴露给外接的模块对象 这里的模块对象是所有的模块集合 (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// 暴露的模块缓存
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// 给exports出来的每一个属性都定义一个getter函数
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// 给exports对象定义__esModule属性
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// 兼容 non-harmony 模块，这些模块如果设了__esModule属性，则被标记为non-harmony
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// 先require入口文件
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _main__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./main */ \"./src/main.js\");\n\n\nfunction component() {\n    var element = document.createElement('div');\n    element.innerHTML = 'Hello';\n    Object(_main__WEBPACK_IMPORTED_MODULE_0__[\"sayHello\"])()\n    return element;\n}\n\ndocument.body.appendChild(component());\n\n//# sourceURL=webpack:///./src/index.js?");

/***/ }),

/***/ "./src/main.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"sayHello\", function() { return sayHello; });\nfunction sayHello(){\n    console.log('sayHello')\n}\n\n//# sourceURL=webpack:///./src/main.js?");

/***/ })

/******/ });

```

上面的两个 `eval` 分别对应我们代码中两个模块 `index.js` 和 `main.js`

第一个 `eval` 格式化后的内容：

```js
(function(module, __webpack_exports__, __webpack_require__) {
    "use strict";
    e__webpack_require__.r(__webpack_exports__);
    var _main__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./main */ "./src/main.js");
    function component() {
        var element = document.createElement('div');
        element.innerHTML = 'Hello';
        Object(_main__WEBPACK_IMPORTED_MODULE_0__["sayHello"])()
        return element;
    }
    document.body.appendChild(component());
})
```

第二个 `eval` 格式化后的内容：

```js
(function(module, __webpack_exports__, __webpack_require__) {
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    __webpack_require__.d(__webpack_exports__, "sayHello", function() { return sayHello; });
    function sayHello(){
        console.log('sayHello')
    }
})
```

先把代码简化并格式化：

```js
(function(modules) { // do somethine })(
    {
        "./src/index.js": // ./src/index.js中的代码内容,
        "./src/main.js": // ./src/main.js中的代码内容
    });
```

`bundle.js` 能直接运行在浏览器中的原因是输出出来的是一个自执行函数

在输出的文件中通过 `__webpak__require__` 函数，定义了一个可以在浏览器中执行的加载函数，来模拟 Node.js 中的 `require` 语句

原来一个个独立的模块文件被合并到了一个单独的 `bundle.js` 的原因是，浏览器不能像 Node.js 那样快速地在本地加载一个个模块文件，而必须通过网络请求去加载未得到的文件。
如果模块的数量很多，则加载时间会很长，因此将所有模块都存在数组中，执行一次网络

仔细分析 `__webpak__require__` 函数的实现，我们还会发现 Webpack做了缓存优化，执行加载过的模块不会再执行第二次，执行结果缓存在内存中，当某个再次被用到时，直接从缓存中获取

### 加入按需要加载后的`bundle.js`文件分析

这里的 `bundle.js` 和之前上比非常相似，区别在于：

- 多了一个 `__webpack_require__.e`，用于加载被分割出去的需要异步加载的 `Chunk` 对应的文件

- 多了一个 `webpackJson` 函数，用于从异步加载的文件中安装模块

使用 `CommonsChunkPlugin` 提取公共代码时输出的文件和使用异步加载时输出的文件是一样的，都会有 `__webpack_require__.e` 和`webpackJson` 。原因在于提取公共代码和异步加载在本质上都代码分割

Webpack4 之前打出来的内容传给自执行函数的参数是一个数组，但是原理是一样的

```js
 (function (modules) {
    // 模拟require语句
    function __webpack_require__() {
      // 执行存放所有模块数组中的第0个模块
      __webpack_require__(0)
    }
  })([/*存放所有模块的数组*/])

```

