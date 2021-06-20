# code-split

在 webpack 启动的项目中，使用 `import()` 方法就可以实现动态加载模块，被动态加载的模块会被 webpack 分割成独立文件

通过一个动态加载的粟子来看下 webpack 打包后的文件是如何处理分割后模块的

源文件：

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

打包后在 `dist` 文件下生成两个JS文件:

- `index.bundle.js`

- `src_modules_utils_js.bundle.js`

```js
// index.bundle.js
/*! 下面中的代码为方便阅读稍手动做了点格式化 */
/*! For license information please see index.bundle.js.LICENSE.txt */
(() => {
    var __webpack_modules__ = {}, __webpack_module_cache__ = {}, inProgress, dataWebpackPrefix;
    /**
     * 获取模块的 export
     * @params {String} e: 模块
     * */
    function __webpack_require__(e) {
        // 如果已经获取过，则直接拿出来使用
        if (__webpack_module_cache__[e]) return __webpack_module_cache__[e].exports;
        var r = __webpack_module_cache__[e] = {
            exports: {}
        };
        return __webpack_modules__[e](r, r.exports, __webpack_require__), r.exports;
    }
    __webpack_require__.m = __webpack_modules__
    /**
     * 将模块中的方法映射到 e(r.exports)中
     * @params {Object} exports
     * @params {Object} r: 模块内 导出的方法
     * */
    __webpack_require__.d = (e, r) => {
        for (var _ in r) __webpack_require__.o(r, _) && !__webpack_require__.o(e, _) && Object.defineProperty(e, _, {
            enumerable: !0,
            get: r[_]
        });
    }
    __webpack_require__.f = {}
    __webpack_require__.e = e => {
        // __webpack_require__.f 保存着要加载的模块，遍历这些模块分别获取模块
        return Promise.all(Object.keys(__webpack_require__.f)
          .reduce(((r, _) => {
              // 这里会执行 __webpack_require__.f.j
              // 真正获取某模块的方法 e=>模块名 r => 当前Promise[]
              return __webpack_require__.f[_](e, r), r
          }), []))
    }
    __webpack_require__.u = e => e + ".bundle.js"
    __webpack_require__.g = function() {
        if ("object" == typeof globalThis) return globalThis;
        try {
            return this || new Function("return this")();
        } catch (e) {
            if ("object" == typeof window) return window;
        }
    }()
    __webpack_require__.o = (e, r) => Object.prototype.hasOwnProperty.call(e, r)
    inProgress = {}
    dataWebpackPrefix = "mind-map:"
    /**
     * @params {String} e : 模块路径
     * @params {Function} r
     * @params {String} _ : "chunk-" + 模块
     * */
    __webpack_require__.l = (e, r, _) => {
        if (inProgress[e]){ // 如果 inProgress[e] 已存在，将当前函数添加到 inProgress[e] 队列中
            inProgress[e].push(r)
        } else {
            var a, t;
            if (void 0 !== _) {
                for (var i = document.getElementsByTagName("script"), o = 0; o < i.length; o++) {
                    // 判断当前要加载模块是否已经存在于 dom中
                    var c = i[o];
                    if (c.getAttribute("src") == e || c.getAttribute("data-webpack") == dataWebpackPrefix + _) {
                        // 如果存在刚保存到变量a
                        a = c;
                        break;
                    }
                }
            }
            /* a || (t = !0, (a = document.createElement("script")).charset = "utf-8", a.timeout = 120,
            __webpack_require__.nc && a.setAttribute("nonce", __webpack_require__.nc), a.setAttribute("data-webpack", dataWebpackPrefix + _),
            a.src = e), inProgress[e] = [ r ];*/
            // 将上面的注释的源代码转换了下，方便阅读
            if(!a){
                // 动态创建 script 标签加载模块
                t = !0 // t = true
                a = document.createElement("script")
                a.charset = "utf-8"
                a.timeout = 120
                __webpack_require__.nc && a.setAttribute("nonce", __webpack_require__.nc)
                a.setAttribute("data-webpack", dataWebpackPrefix + _) // 标记 data-webpack 属性
                a.src = e
            }
            inProgress[e] = [ r ] // inProgress创建对象的队列
            // n的作用就是当模块加载成功或者失败或者超时要做的事情
            // 当成功时，r=a.onload方法，_=成功的事件信息，取出inProgress中保存的回调一一执行 t.forEach((e => e(_))，此时 _ 为成功后事件信息
            // 当失败时，r=a.onerror，_=失败的事件信息，取出inProgress中保存的回调一一执行 t.forEach((e => e(_))，此时 _ 为失败后事件信息
            // 当超时时，_ 为 {type: "timeout",target: a}
            var n = (r, _) => {
                a.onerror = a.onload = null, clearTimeout(u);
                var t = inProgress[e];
                if (delete inProgress[e], a.parentNode && a.parentNode.removeChild(a), t && t.forEach((e => e(_))), 
                r) return r(_);
            }, u = setTimeout(n.bind(null, void 0, {
                type: "timeout",
                target: a
            }), 12e4);
            // 将动态创建script 标签 添加添加DOM,开始下载模块，并定义对应的 onerror 和 onload 方法
            a.onerror = n.bind(null, a.onerror), a.onload = n.bind(null, a.onload), t && document.head.appendChild(a);
        }
    }
    __webpack_require__.r = e => {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
            value: "Module"
        })
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
    }
    (() => {
        var e;
        // importScripts 返回的undefined，暂不确定表示什么
        __webpack_require__.g.importScripts && (e = __webpack_require__.g.location + "");
        var r = __webpack_require__.g.document;
        // currentScript 表示当前执行脚本的信息，获取脚本的路径并赋值给 e
        // 当前例子 e=http://localhost:63342/Hello-Word/mind-map-js/dist/index.bundle.js
        if (!e && r && (r.currentScript && (e = r.currentScript.src), !e)) {
            // 如果没上一步获取不到，则通过获取 script 标签来获取脚本路径
            var _ = r.getElementsByTagName("script");
            _.length && (e = _[_.length - 1].src);
        }
        if (!e) throw new Error("Automatic publicPath is not supported in this browser");
        // 获取脚本所在目录 __webpack_require__.p = e = http://localhost:63342/Hello-Word/mind-map-js/dist/
        e = e.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/"), __webpack_require__.p = e;
    })();
    (() => {
        var e = {
            index: 0
        };
        /**
         * @params {String} r: 模块名，当前例子为 "src_modules_utils_js"
         * @params {Array<Promise>>} _: 异步数组
         * */
        // 参数 r 表示要获取的模块名
        __webpack_require__.f.j = (r, _) => {
            // 等同于Object.prototype.hasOwnProperty.call(e, r)，判断 r(key) 是否包含在 e 中(是否之前获取过)
            var a = __webpack_require__.o(e, r) ? e[r] : void 0;
            if (0 !== a) {
                if (a) {
                    _.push(a[2]); // 如果a有值，则将 a[2] 保存到 _中，a[2]的意思下面的else分支会介绍到
                } else {
                    var t = new Promise(((_, t) => {
                        // Promise 构造函数是同步的，这里面 “_” 表示 `resolve`, “t” 表示 `reject`
                        // 将 `resolve` 和 `reject`，保存到 e[r]和变量a中
                        a = e[r] = [ _, t ];
                    }));
                    // 将上文返回的Promise 一方面添加添加到 a[2]中，另一方面添加到 _ 中
                    _.push(a[2] = t);  // a[0] => Promise.resolve   a[1] => Promise.reject  a[2] => Promise
                    // 获取这个模块的完整的路径，这里返回 // http://localhost:63342/Hello-Word/mind-map-js/dist/src_modules_utils_js.bundle.js
                    var i = __webpack_require__.p + __webpack_require__.u(r), o = new Error;
                    // 加载模块i，加载完成后执行第二个函数参数
                    __webpack_require__.l(i, (_ => {
                        // 如果模块加载成功，执行这个回调时e[r]为0，所以 if 块中的代码只有失败的时候才能会执行
                        debugger
                        if (__webpack_require__.o(e, r) && (0 !== (a = e[r]) && (e[r] = void 0), a)) {
                            var t = _ && ("load" === _.type ? "missing" : _.type), i = _ && _.target && _.target.src;
                            o.message = "Loading chunk " + r + " failed.\n(" + t + ": " + i + ")"
                            o.name = "ChunkLoadError"
                            o.type = t
                            o.request = i, a[1](o);
                        }
                    }), "chunk-" + r);
                }
            }
        };
        // 保存 self.webpackChunkmind_map 原生 push 方法
        var r = self.webpackChunkmind_map = self.webpackChunkmind_map || [], _ = r.push.bind(r);
        /**
         * 重写 push 方法
         * 这个 push方法 是要加载的模块（src_modules_utils_js）下载成功后，模块（src_modules_utils_js）内触发的
         * @params {Array} r: 成功下载模块后返回的内容
         * */
        r.push = r => {
            for (var a, t, [i, o, c] = r, n = 0, u = []; n < i.length; n++) {
                // 下载成功后，将e中保存 resolve 保存到 u 中，并将 e[t] 重置为0
                t = i[n] // t表示模块名
                // e 是否包含这个 t 这个属性，
                __webpack_require__.o(e, t) && e[t] && u.push(e[t][0])
                e[t] = 0;
            }
            // o： { 模块： 添加模块的方法}
            // 将这个模块及对应的方法 保存到  __webpack_require__.m 中
            for (a in o) __webpack_require__.o(o, a) && (__webpack_require__.m[a] = o[a]);
            for (c && c(__webpack_require__), _(r); u.length; ) u.shift()(); // 取出 resolve 并执行
        };
    })()
    console.log('AAAAAAAAAAAAA');
    __webpack_require__.e("src_modules_utils_js") // 获取模块
      .then(__webpack_require__.bind(__webpack_require__, "./src/modules/utils.js"))
      .then(function (_ref) {
          var MB = _ref.MB;
          console.log('MB', MB);
      })
      .catch(function (error) {
            return 'An error occurred while loading theS hllComponent';
        });
    //# sourceURL=webpack://mind-map/./src/index.js?
})();
```

```js
// 分离的模块
/*! For license information please see src_modules_utils_js.bundle.js.LICENSE.txt */
(self.webpackChunkmind_map = self.webpackChunkmind_map || []).push([ [ "src_modules_utils_js" ], {
    "./src/modules/utils.js": (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
        "use strict";
        // eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"MA\": () => /* binding */ MA,\n/* harmony export */   \"MB\": () => /* binding */ MB\n/* harmony export */ });\nfunction MA() {\n  console.log('执行MA');\n}\nfunction MB() {\n  console.log('执行MB');\n}\n\n//# sourceURL=webpack://mind-map/./src/modules/utils.js?");
        __webpack_require__.r(__webpack_exports__)
        __webpack_require__.d(__webpack_exports__, {
            MA: () => MA,
            MB: () => MB
        });
        function MA() {console.log('执行MA');}
        function MB() {console.log('执行MB');}
    }
} ]);
```

### bundle代码分析

首先要知道打包出来的文件代码都使用自执行函数形成一个单独的块级作用域

```js
(function(){
  var name = 'lan'
})();
(function(){
  var name = 'jz'
})();
```

上面的两个 `name` 仅限于自己所在块级作用域中有效

之后看下打包出来的入口文件中两个重要包含的属性和方法：

**__webpack_require__**

实现模块化的核心方法，作用就是返回模块导出的方法（`exports`），首先会尝试从 `__webpack_module_cache__` 中获取，如果 `__webpack_module_cache__` 中不存在，则通过执行 `__webpack_modules__[e](r, r.exports, __webpack_require__)` 获取 `exports`  

**__webpack_modules__**

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

- `__webpack_require__e("模块名")`: 获模块导出的所有方法和属性

- `__webpack_require__.o(e, r)`:  `(e, r) => Object.prototype.hasOwnProperty.call(e, r)`，判断是否包含属性 `r`

- `__webpack_require__.g`: 当前运行的全局环境，当前例子指向 `window`

- `__webpack_require__.p`: 当前运行的JS模块所在目录

- `__webpack_require__.u`: 返回模块的完成文件名 `__webpack_require__.u('abc')` 返回 `abc.bundle.js`

- `__webpack_require__.l(模块名，加载后回调，当前模块的一个标记)`：动态创建 `script` 下载模块

### 执行bundler过程分析

- 执行主文件方法 `console.log('AAAAAAAAAAAAA')`

- 调用 `__webpack_require__.e("src_modules_utils_js")` 获取 "src_modules_utils_js" 模块内容

    ```js
      __webpack_require__.e = e => {
        // __webpack_require__.f 保存着要加载的模块，遍历这些模块分别获取模块
        return Promise.all(Object.keys(__webpack_require__.f)
          .reduce(((r, _) => {
              // 真正获取某模块的方法 e=>模块名 r => 当前Promise[]
              return __webpack_require__.f[_](e, r), r
          }), []))
       }
    ```

  - 调用 `__webpack_require__.f[_]` 获取模块,这里实际执行的是 `__webpack_require__.f.j`
  
  - 执行 `__webpack_require__.l` 动态创建 `script` 下载模块，下完成将做两件事情：
  
    1. 下载的模块内将执行 `self.webpackChunkmind_map.push()` 方法，`push` 执行时，将下载的模块要主要代码主容保存到 `__webpack_require__.m` 对象中
    
    2. 执行  `__webpack_require__.e("src_modules_utils_js")` 的 `resove()`
    
- 执行第一个 `then` 回调 `__webpack_require__.bind(__webpack_require__, "./src/modules/utils.js")`

- 执行 `__webpack_require__(e)` 方法时，因为是首将加载这个模块，所以会执行 `__webpack_modules__[e](r, r.exports, __webpack_require__)` 方法，将下载的模块中的方法和属性保存到 `r.exports` 中返回

- 执行第一个 `then` 回调，在回调中执行我们依赖分离模块的代码
  
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

### Demo

上面的分析反复看到过自己都有点懵，所以写个简单的 demo 方便理解 webpack 的模块化原理

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

**关于子模块加载的思考：**

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

webpack 实现自己实现了一个 `_webpack_reuqire_` 来模拟 `import` 的导入，并定义了一个全局属性`__webpack_modules__` 来保存模块

使用动态创建 `script` 标签的方式来加载模块，被加载的模块在加载运行时，会添加到 `__webpack_modules__` 属性中，之后再获取模块内的方法和属性存到到 `export` 属性供调用者使用

