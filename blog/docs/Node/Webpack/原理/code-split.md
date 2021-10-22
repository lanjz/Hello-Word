# Code-Split

在 Webpack 启动的项目中，使用 `import()` 方法就可以实现动态加载模块，被动态加载的模块会被 Webpack 分割成独立文件

通过一个粟子来看下 Webpack 打包后的文件是如何处理分割后模块的

```js
// index.js
console.log('AAAAAAAAAAAAA')
import('./modules/utils')
  .then(({ MB }) => {
    console.log('MB', MB)
  })
  .catch((error) => 'An error occurred while loading theS hllComponent');
// ./modules/utils
export function MA(){
  console.log('执行MA')
}
export function MB(){
  console.log('执行MB')
}
```

打包后在 `dist` 文件下生成两个JS文件: `index.bundle.js` 和 `src_modules_utils_js.bundle.js`

## bundle 内容简析

`index.bundle.js` 大致内容为各种各样的 `__webpack_require__` 属性和方法：

```js
(() => {
    var __webpack_modules__ = {}, __webpack_module_cache__ = {}, inProgress, dataWebpackPrefix;
    function __webpack_require__(moduleId) {}
    __webpack_require__.m = __webpack_modules__
    __webpack_require__.d = (exports, definition) => {  }
    __webpack_require__.f = {}
    __webpack_require__.e = chunkId => {}
    __webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
    _webpack_require__.l = (url, done, key, chunkId) => {}
    btn.addEventListener('click', function (){
        __webpack_require__.e(/*! import() */ "src_output_modules_utils_js").then(__webpack_require__.bind(__webpack_require__, "./src/output/modules/utils.js"))
            .then(({MB}) => {
                console.log('MB', MB)
            })
            .catch((error) => 'An error occurred while loading theS hllComponent');
    })
})();
```

先大概认识一下几个比较重要的属性和方法：

### **__webpack_require__**

实现模块化的核心方法，作用就是返回模块导出的方法（`exports`），首先会尝试从 `__webpack_module_cache__` 中获取，如果 `__webpack_module_cache__` 中不存在，则通过执行 `__webpack_modules__[e](r, r.exports, __webpack_require__)` 获取 `exports`  

### **__webpack_modules__**

当分离的文件下载完成后，模块中的要执行的内容将保存到 `__webpack_modules__` 对象中，所以先根据打包的例子（`src_modules_utils_js.bundle.js`）分析下其内容

`self.webpackChunkmind_map` 等于 `window.webpackChunkmind_map` 是在入口文件 `index.bundle` 中的定义的， `src_modules_utils_js.bundle.js` 的作用就是向 `webpackChunkmind_map` 属性 `push`了一个长度为 2 的数组，上文有注释这个 `push` 是 `webpack` 重写后的 `push`，这个数组的内容为：

`0`： - 模块名

`1`：  - 函数：`Function(__unused_webpack_module, __webpack_exports__, __webpack_require__)`，这个函数要执行代码如下：

  ```js
  __webpack_require__.r(__webpack_exports__)
  __webpack_require__.d(__webpack_exports__, {
      MA: () => MA,
      MB: () => MB
  });
  function MA() {console.log('执行MA');}
  function MB() {console.log('执行MB');}  
  // __webpack_require__.d 是 index.bundle.js 中定义的方法
    __webpack_require__.d = (e, r) => {
        for (var _ in r) __webpack_require__.o(r, _) && !__webpack_require__.o(e, _) && Object.defineProperty(e, _, {
            enumerable: !0,
            get: r[_]
        });
  }
  ```

  重点看下第二行执行的方法 `__webpack_require__.d` ，`__webpack_require__.d` 的作用将当前文件中的导出的方法映射到当前参数 `__webpack_exports__` 中

  也就是上文 `__webpack_require__` 介绍中执行 `__webpack_modules__[e]` 的作用
  
### **__webpack_module__**

`__webpack_module__` 是一个对象，`key` 为模块ID， `value` 为函数，这个函数就是执行模块内容的方法.eg:

```js
// ./index.js 文件的内容如下
console.log('lanjz')

// 该文件打包后结果将保存到
__webpack_modules__['./index.js'] = () => {eval('console.log(lanjz)')}
```

### **__webpack_require__.m**

源代码定义为 `__webpack_require__.m = __webpack_module__`，所以指向 `__webpack_module__` 

### **__webpack_module_cache__**

`__webpack_module_cache__` 也是一个对象，`key` 为模块ID，`value` 保存对应模块的 `export` 内容. eg:

```js
__webpack_module_cache__['./index.js'] = {
  id: './index.js',
  loaded: true, // 标识这个模块是否已加载 
  exports: {}, // 模块的导出内容 
}
```

### **__webpack_require__.c**

源代码定义为 `__webpack_require__.c = __webpack_module_cache__`，所以指向 `__webpack_module_cache__`

### **__webpack_require__.f.j**

`__webpack_require__.f.j(chunkId, promises)` 是加载模块前的准备工作，处理模块加载或安装失败的回调

```js
__webpack_require__.f.j = (chunkId, promises) => {
		// installedChunkData 是一个标识，标识当前这个模块是否已经安装
        // __webpack_require__.o(e, r)等同于Object.prototype.hasOwnProperty.call(e, r)
		var installedChunkData = __webpack_require__.o(installedChunks, chunkId) ? installedChunks[chunkId] : undefined;
        // 0 表示已经安装了
		if(installedChunkData !== 0) {
			// 如果当前有 installedChunkData 表示当前正在获取中，那之返回之前的 promise，installedChunkData下面的 else 分支会介绍
			if(installedChunkData) {
				promises.push(installedChunkData[2]);
			} else {
			    // 这是判断 chunk 类型的，比如 federation 的 Chunk，就不会进入该杂质
				if(true) {
					// 创建一个 installedChunkData 保存到 installedChunks[chunkId] 中
                    // installedChunkData[0] = promise回调的 resolve方法
                    // installedChunkData[1] = promise回调的 reject方法
                    // installedChunkData[2] = promise
					var promise = new Promise((resolve, reject) => {
						installedChunkData = installedChunks[chunkId] = [resolve, reject];
					});
					promises.push(installedChunkData[2] = promise);

					// 接接完整的模块地址
					var url = __webpack_require__.p + __webpack_require__.u(chunkId);
					// create error before stack unwound to get useful stacktrace later
					var error = new Error();
                    // 创建加载后的回调，这里更像是处理加载模块失败的处理
					var loadingEnded = (event) => {
                        // 当前模块是 installedChunks 中的模块
						if(__webpack_require__.o(installedChunks, chunkId)) {
                            // 获取当前模块对应的安装信息
							installedChunkData = installedChunks[chunkId];
                            // 如果非 0 将原始内容赋值初始状态
							if(installedChunkData !== 0) installedChunks[chunkId] = undefined;
							// 如果值为 [resove, reject, promise]，说明当前的模块没有被正常加载，那么执行错误
							if(installedChunkData) {
								var errorType = event && (event.type === 'load' ? 'missing' : event.type);
								var realSrc = event && event.target && event.target.src;
								error.message = 'Loading chunk ' + chunkId + ' failed.\n(' + errorType + ': ' + realSrc + ')';
								error.name = 'ChunkLoadError';
								error.type = errorType;
								error.request = realSrc;
								// installedChunkData[1] = reject
								installedChunkData[1](error);
							}
						}
					};
                    // 创建 script 加载模块内容
					__webpack_require__.l(url, loadingEnded, "chunk-" + chunkId, chunkId);
				} else installedChunks[chunkId] = 0; // 
			}
		}
};
```

函数体有个直接 `if(true)` 条件，这个 `if` 是判断 chunk 类型的，当 Webpack 包含了 `federation` 配置时，共享的 Chunk 和外链的 Chunk 将不进入当前条件分支而是直接执行 `installedChunks[chunkId] = 0`，至于 `federation` 的 Chunk 怎么处理这里先不分析

这里要注意 `loadingEnded` 方法，根据代码内容可以发现主要是处理模块加载失败或安装失败的情况，那么成功的回调在哪处理的呢？ 成功的回调在 `__webpack_require__.l` 方法会处理

### **__webpack_require__e(chunkId)和__webpack_require__.f**

```js
__webpack_require__.e = (chunkId) => {
	return Promise.all(Object.keys(__webpack_require__.f).reduce((promises, key) => {
		__webpack_require__.f[key](chunkId, promises);
		return promises;
	}, []));
};
```

`__webpack_require__.f` 是一个对象，这个对象包含的属性都是跟获取模块内容的方法，比如上文的 `__webpack_require__.f`，除了 `f` 属性外还有 `remote`、`consume` 属性，都是获取模块的方法，大致区别：  

- `f` 是获取当前项目打包的模块

- `remote` 和 `consume` 这两个方法跟 `federation Chunk` 有关系

`__webpack_require__.e` 是执行 `__webpack_require__.f` 的地方了，虽然这里看上去是会使用 `f`、`remote`、`consume` 都去获取 Chunk，但是这个方法里面会根据当前 Chunk 类型，不是自己支持的类型直接 `return`，所以只会执行其中的一种

总之 `__webpack_require__e(chunkId)` 和 `__webpack_require__.f` 的作用就是发起模块获取

### **__webpack_require__.l**

上文中的 `__webpack_require__.f.j` 方法 最后会调用  `__webpack_require__.l(url, loadingEnded, "chunk-" + chunkId, chunkId)` 方法下载模块 

```js
/* webpack/runtime/load script */
(() => {
    // 保存下载成功后的回调
	var inProgress = {};
	var dataWebpackPrefix = "base:";
	// loadScript function to load a script via script tag
	__webpack_require__.l = (url, done, key, chunkId) => {
        // 如果已经包含模块下载，则添加一个回调，这里情况可能是针对不同的地方同一时间调用了相同的模块，那就是需要收集多个回调
		if(inProgress[url]) { inProgress[url].push(done); return; }
		var script, needAttach;
        
		if(key !== undefined) {
            // 判断是已经存在相同的 script 标签 
			var scripts = document.getElementsByTagName("script");
			for(var i = 0; i < scripts.length; i++) {
				var s = scripts[i];
				if(s.getAttribute("src") == url || s.getAttribute("data-webpack") == dataWebpackPrefix + key) { script = s; break; }
			}
		}
		// 动态创建 scripts 标签
		if(!script) {
			needAttach = true;
			script = document.createElement('script');
	
			script.charset = 'utf-8';
			script.timeout = 120;
			if (__webpack_require__.nc) {
				script.setAttribute("nonce", __webpack_require__.nc);
			}
			script.setAttribute("data-webpack", dataWebpackPrefix + key);
			script.src = url;
		}
        // 添加回调
		inProgress[url] = [done];
        // 创建模块下载成功的回调
		var onScriptComplete = (prev, event) => {
			// avoid mem leaks in IE.
			script.onerror = script.onload = null;
			clearTimeout(timeout);
			var doneFns = inProgress[url];
			delete inProgress[url];
			script.parentNode && script.parentNode.removeChild(script); // 除移当前动态创建的 script 标签
			doneFns && doneFns.forEach((fn) => (fn(event)));
			if(prev) return prev(event);
		}
		;
        // 处理起时的情况
		var timeout = setTimeout(onScriptComplete.bind(null, undefined, { type: 'timeout', target: script }), 120000);
		script.onerror = onScriptComplete.bind(null, script.onerror);
		script.onload = onScriptComplete.bind(null, script.onload);
		needAttach && document.head.appendChild(script); // 添加到 DOM
	};
})();
```

`onScriptComplete` 就是处理上文中 `__webpack_require__.f.j` 设置的回调中

### webpackJsonpCallback()

`webpackJsonpCallback` 是一个挂载到全局变量(window、global、self) 上的全局方法，用于保存模块的 `chunk` 内容。这个方法执行时，会把 `chunk` 内部包含的模块及模块的执行方法收集到 `__webpack_modules__` 中

## 模块加载过程分析

首先粟子中的主文件编译后的代码变成以下样子：

```js
const btn = document.createElement('button')
btn.innerText = '按钮'
btn.addEventListener('click', function (){
	__webpack_require__.e(/*! import() */ "src_output_modules_utils_js").then(__webpack_require__.bind(__webpack_require__, /*! ./modules/utils */ "./src/output/modules/utils.js"))
		.then(({MB}) => {
			console.log('MB', MB)
		})
		.catch((error) => 'An error occurred while loading theS hllComponent');
})
document.body.appendChild(btn)
```

接下来通过 [模块下载]、[模块加载完成]、[模块加载完成之后] 三个阶段来分析按需加载的过程

### 模块下载

当点击按钮的时候将调用 `__webpack_require__.e("src_modules_utils_js")` 获取 `src_modules_utils_js` 模块  
通过断点此时 `__webpack_require__.e` 返回 `trackBlockingPromise(require.e(chunkId))` 结果，根据代码 `trackBlockingPromise` 返回的是一个 promise，`trackBlockingPromise` 的参数传是的 `require.e(chunkId)`，也就是 `__webpack_require__.e` 方法的结果  
(这里有点不明白为什么 `_webpack_require__.e` 执行时不是直接执行 `_webpack_require__.e` 呢？)

```js
  __webpack_require__.e = e => {
    return Promise.all(Object.keys(__webpack_require__.f)
      .reduce(((promises, key) => {
          // 真正获取某模块的方法 e=>模块名 r => 当前Promise[]
          __webpack_require__.f[key](chunkId, promises);
          return promises
      }), []))
   }
```

`__webpack_require__.e` 返回的是一个 promisesAll (数组{promise}`)

`__webpack_require__.e` 遍历后会使用 `__webpack_require__.f.j(chunkId, promises)` 方法获取 `src_modules_utils_js` 模块

`__webpack_require__.f.j` 再通过调用 `__webpack_require__.l` 动态创建 `script` 加载模块，同时创建当前下载任务的 `promise` 保存到 `promises` 中

到这里 `__webpack_require__.e(/*! import() */ "src_output_modules_utils_js").then()` 工作就做完了，之后就是模块下载完成的执行 `then` 中的回调，然后就是待上面的 `promises` 的结果

### 模块加载完成

粟子中的模块 `src_output_modules_utils_js` 加载完成后，得到的内容为：

```js
(self["webpackChunkbase"] = self["webpackChunkbase"] || []).push([["src_output_modules_utils_js"],{
 "./src/output/modules/utils.js": ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
    eval("__webpack_require__.r(__webpack_exports__); __webpack_require__.d(__webpack_exports__, {default: () => (__WEBPACK_DEFAULT_EXPORT__) }); const __WEBPACK_DEFAULT_EXPORT__ = ({\r\n\tMB: function (){\r\n\t\tconsole.log('MB')\r\n\t}\r\n});\n\n");
     })
}]);

// 格式一下代码
(self["webpackChunkbase"] = self["webpackChunkbase"] || []).push(
    [
        ["src_output_modules_utils_js"],
        {
         "./src/output/modules/utils.js": ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {})
        }
    ]
);
```

模块加载后就会直接执行 `self["webpackChunkbase"] || []).push` 方法，这里的 `push` 不是简单的原生 `Array.push`， Webpack 做了 `webpackChunkbase.push` 做了额外的处理

```js
// 如果已经存在 self["webpackChunkbase"] 则直接取，否则创建新数据
var chunkLoadingGlobal = self["webpackChunkbase"] = self["webpackChunkbase"] || [];
chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0)); // 这个是啥意思？
// chunkLoadingGlobal.push 执行的 webpackJsonpCallback 方法
chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal))
```

第一行就是针对如果当前项目应用了多套 Webpack 打包的输出，那么 `self["webpackChunkbase"]` 就可能已经存了    
第二行中 `bind` 的参数是 0 ，表示当前是第一个 Webpack 打包环境，如果当前应用的是第二个 Webpack 打包环境，那么参数为 第一个打包环境  
第三行重写 `push` 方法  
有点绕，重点是子模块加后实在的 `push` 为 `webpackJsonpCallback` 方法


```js
// parentChunkLoadingFunction 父级环境
// data 为子模块加后的 push 的数据
var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
    // chunkIds 是模块名 moreModules 是模块信息 {模块名：模块内容}
    var [chunkIds, moreModules, runtime] = data;
    // 添加 "moreModules" 到 modules object,
    var moduleId, chunkId, i = 0;
    // 遍历模块信息，将模块保存到 `__webpack_require__.m` 对象中，_webpack_require__.m 就是 `__webpack_module__`
    for(moduleId in moreModules) {
        if(__webpack_require__.o(moreModules, moduleId)) {
            __webpack_require__.m[moduleId] = moreModules[moduleId];
        }
    }
    if(runtime) runtime(__webpack_require__);
    if(parentChunkLoadingFunction) parentChunkLoadingFunction(data); // 如果有父环境，则止父环境也保存当前的模块，这样就可以复用了
    for(;i < chunkIds.length; i++) {
        chunkId = chunkIds[i];
        // installedChunks 保存各个模块加后的 promise 回调
        if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
            installedChunks[chunkId][0](); // 执行 resolve()
        }
        installedChunks[chunkIds[i]] = 0; // 当前模块标志为已加载
    }
}  
```

上面方法重点在于两个地方：

1. 遍历 `moreModules`，将当前下载到的模块内容保存到 `__webpack_module__` 中

2. 看到执行的 `installedChunks`，每个模块发起下载任务后都保存 `pending` 状态的 Promise 到 `installedChunks`，这里另载完成后就就会执行 `promise.resolve()` 执行回调

之后就是进入子模块加载成功后的阶段

### 模块加载完成之后

模块加载成功，模块内容保存到了 `__webpack_module__` 中，如果执行当前模块的任务状态 `resolve`. 然后就是执行 `__webpack_require__.e(/*! import() */ "src_output_modules_utils_js").then()` 的调回了. `then` 回调执行 `__webpack_require__.bind(__webpack_require__, "./src/output/modules/utils.js")`

`then` 方法执行的是 `__webpack_require__` 方法

```js
// 保存模块的 exports
var __webpack_module_cache__ = {};
function __webpack_require__(moduleId) {
	// 如果缓存中存在当前模块的结果，直接返回
	var cachedModule = __webpack_module_cache__[moduleId];
	if (cachedModule !== undefined) {
		if (cachedModule.error !== undefined) throw cachedModule.error;
		return cachedModule.exports;
	}
	// 创建新的模块信息到缓存中
	var module = __webpack_module_cache__[moduleId] = {
		id: moduleId,
		loaded: false,
		exports: {}
	};

	// Execute the module function
	try {
        // 执行模块方法，这里的 factory 传的就是下载后的模块内容了
		var execOptions = { id: moduleId, module: module, factory: __webpack_modules__[moduleId], require: __webpack_require__ };
		__webpack_require__.i.forEach(function(handler) { handler(execOptions); });
		module = execOptions.module;
        // 这里执行模块的代码内容
		execOptions.factory.call(module.exports, module, module.exports, execOptions.require);
	} catch(e) {
		module.error = e;
		throw e;
	}
	// 标记模块加载完成
	module.loaded = true;
	// Return the exports of the module
	return module.exports;
}
```

创建一个新的模块信息并保存到 `__webpack_module_cache__` 对象中，之后就执行 `execOptions.factory.call(module.exports, module, module.exports, execOptions.require)` 回顾一下 `src_output_modules_utils_js` 加载完成后内容为：

```js
(self["webpackChunkbase"] = self["webpackChunkbase"] || []).push([["src_output_modules_utils_js"],{
 "./src/output/modules/utils.js": ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
    eval("__webpack_require__.r(__webpack_exports__); __webpack_require__.d(__webpack_exports__, {default: () => (__WEBPACK_DEFAULT_EXPORT__) }); const __WEBPACK_DEFAULT_EXPORT__ = ({\r\n\tMB: function (){\r\n\t\tconsole.log('MB')\r\n\t}\r\n});\n\n");
     })
}]);

// 格式一下代码
(self["webpackChunkbase"] = self["webpackChunkbase"] || []).push(
    [
        ["src_output_modules_utils_js"],
        {
         "./src/output/modules/utils.js": ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {})
        }
    ]
);
```

`factory` 就是对应就是执行 `((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {})` 方法，执行代码为：

```js
__webpack_require__.r(__webpack_exports__) // 定义属性信息，忽略
__webpack_require__.d(__webpack_exports__, {default: () => (__WEBPACK_DEFAULT_EXPORT__) })
const __WEBPACK_DEFAULT_EXPORT__ = {MB: function (){console.log('MB')}}
```

```js
__webpack_require__.d = (exports, definition) => {
	for(var key in definition) {
		if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
			Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
		}
	}
}
```

上面的代码就是将 `modeule.exports` 作为参数传入子模块的执行内容中，子模块执行过程中会通过 `__webpack_require__.d` 方法将当前模块导出的 `exports` 对象保存到 `modeule.exports` 中，最后就返回 `modeule.exports` 

返回后就是回到入口JS 文件中，执行最后的 `then` 回调 `console.log('MB', MB)`

```js
btn.addEventListener('click', function (){
	__webpack_require__.e(/*! import() */ "src_output_modules_utils_js").then(__webpack_require__.bind(__webpack_require__, "./src/output/modules/utils.js"))
		.then(({MB}) => {
			console.log('MB', MB)
		})
		.catch((error) => 'An error occurred while loading theS hllComponent');
})
```

  

## Prefetch/Preload modules

`Prefetch` 和 `Preload` 的区别

- `Preload` 在当前页面可能会用到，资源会与父块资源并行加载

- `Prefetch` 可能是用于其它页面使用，资源会在当前页面空闲资源加载完后在空闲时间开始

**Prefetch**

将之前代码改造如下：

```js
console.log('AAAAAAAAAAAAA')

document.body.onclick = function (){
  import(/* webpackPrefetch: true */ './modules/utils')
    .then(({ MB }) => {
      console.log('MB', MB)
    })
    .catch((error) => 'An error occurred while loading theS hllComponent');
}

```

打包后代码将会立即执行一个 `__webpack_require__.x()` 方法, 然后执行 `__webpack_require__.F.j`

```js
// __webpack_require__.F.j
__webpack_require__.F.j = _ => {
            if (!__webpack_require__.o(e, _) || void 0 === e[_]) {
                e[_] = null;
                var r = document.createElement("link");
                __webpack_require__.nc && r.setAttribute("nonce", __webpack_require__.nc)
                r.rel = "prefetch"
                r.as = "script"
                r.href = __webpack_require__.p + __webpack_require__.u(_)
                document.head.appendChild(r);
            }
        }
```
`__webpack_require__.F.j` 的作用就是动态创建了一个 `<link rel="prefetch" as="script" href="http://localhost:63342/Hello-Word/mind-map-js/dist/src_modules_utils_js.bundle.js">` 到 `document` 中，这将指示浏览器在空闲时间预取 `src_modules_utils_js.bundle.js` 文件

**Prefetch**

使用 `Prefetch` 需要添加配置 `preload-webpack-plugin`

```js
console.log('AAAAAAAAAAAAA')

document.body.onclick = function (){
  import(/* webpackPreload: true */ './modules/utils')
    .then(({ MB }) => {
      console.log('MB', MB)
    })
    .catch((error) => 'An error occurred while loading theS hllComponent');
}

```

使用 `Prefetch` 主要是对 `index.html` 添加 `link` 标签，跟分割模块的逻辑没啥影响

## 手写模块化加载

写个简单的 Demo 方便理解 Webpack 的模块化原理

```js
(function (){
	var modules = {} // 用于保存模块
	let _resolve = null
    // 获取模块，如果已经加载过则直接取，如果未加载过则直接 JSONP 加载模块
    function getModule(name){
		return new Promise((resolve) => {
			if(modules[name]){
				resolve()
            } else {
                _resolve = resolve
                JSonP()
            }
        })
    }
    // 子模块会调用这个方法，保存下载的模块到 modules
    var webpackJsonpCallback = (parent, data) => {
        if(parent){ // 关于这行的作用，直接看后面的解释，当前选略过
            parent(data)
        }
        modules[data.key] = data.content
        _resolve&&_resolve()
    }
	var chunkLoadingGlobal = self["webpackChunkbase"] = self["webpackChunkbase"] || []
	chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
    // 业务代码
	const btn = document.createElement('button')
	btn.innerText = '按钮'
	btn.addEventListener('click', function (){
		getModule('module1')
			.then(() => {
				console.log('成功加载了模块MB', modules['module1'])
			})
			.catch((error) => 'An error occurred while loading theS hllComponent');
	})
	document.body.appendChild(btn)
})();

// 模块子模块加截完成
function JSonP(){
	setTimeout(() => {
		self["webpackChunkbase"].push({
          key: 'module1',
          content: "我是module1"
        })
	}, 1000)
}
``` 

## Q&A

**当项目存在多个主模块**

从上文分析我们知道当子模块加载后会执行一个全局的方法 `(self.webpackChunkmind_map = self.webpackChunkmind_map || []).push()`，将当前模块内容保存到主模块 `webpack_module_cache` 中。

那么问题了，如果当前页面同时加了多个被 webpack 打包出来的文件，也就是存在多个主模块，这里每个主模块都实现了相同的模块加载的方法，那么当子模块加载的时候怎么知道当前添加到哪个主文件中呢，按正常的逻辑 `self.webpackChunkmind_map` 应该是指向最后一个赋值的地方，那么无论哪个主模块加载的子模块都将添加到最后个加载的主模块中，如果真这样的话肯定会有问题，webpack 考虑到了这一点，所以注意一下这行代码：

```js
	var chunkLoadingGlobal = self["webpackChunkbase"] = self["webpackChunkbase"] || []
	chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
```

假设当前有页面加载了两个 webpack 打包出来的文件，第一个主模块运行时没有 `self["webpackChunkbase"]`，所以 `chunkLoadingGlobal = []`，将这个方法通过下面那行的 `bind`保存到 `webpackJsonpCallback` 参数中

当加载了第二个主模块时 `self["webpackChunkbase"] = 之前模块的chunkLoadingGlobal`，也通过 `bind` 保存到 `webpackJsonpCallback` 参数中

之后当子模块加载完后执行 `webpackJsonpCallback` 方法，看代码：

```js
    var webpackJsonpCallback = (parent, data) => {
        if(parent){ // 有parent，执行之前的 webpackJsonpCallback 方法
            parent(data)
        }
        modules[data.key] = data.content
        _resolve&&_resolve()
    }
```

`parent` 表示之前模块的 `webpackJsonpCallback` 方法，有的话就执行。也就是说某个主模块加载的子模块，将会被所有主模块收集！

## 总结

webpack 实现自己实现了一个 `_webpack_reuqire_` 来模拟 `import` 的导入，并定义了一个全局属性`__webpack_modules__` 来保存模块内容

加载模块时使用动态创建 `script` 标签的方式来加载模块，被加载的模块在加载运行时，会添加到 `__webpack_modules__` 对于中，之后再执行模块内容的方法保存模块的 `exports` 导出结果。大致过程为：

- Webpack 打包后的文件定义了一个 `__webpack_modules__` 对象，用于存储模块的执行内容。`key` 值对应模块的 `id`， `value` 对应模块的模块内容

- Webpack 打包后的文件定义了一个 `_webpack_module_cache__` 是一个对象，用于缓存模块的 `export` 导出结果。`key` 值对应模块的 `id`，`value` 对应模块的输出

- Webpack 还提供了一个 `__webpack_require__` 对象，可用于获取模块的输出。源代码中的 `import xx from 'xxx'`,最终会被转化为 `__webpack_require__.[xx](...)` 的形式

- 对于每一个抽离出来的模块 Webpack 会把这个模块打包为一个含自执行方法的 JS 文件。当加载这个 JS 文件的时候会执行模块对应的相关代码，将对内保存到 `__webpack_modules__` 对象中

- 之后会执行模块的代码内容，输出 `exports` 导出结果同时保存到 `__webpack_module_cache__`




