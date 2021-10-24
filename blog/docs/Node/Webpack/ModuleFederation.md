# Module Federation

[Module Federation](https://webpack.docschina.org/concepts/module-federation/) 是 Webpack 5 的一个新特性。文档的介绍如下：  
一个应用可以由多个独立的构建组成。这些独立的构建之间没有依赖关系，他们可以独立开发、部署。上述解释，其实就是微前端的概念。使用 module federation，我们可以在一个 javascript 应用中动态加载并运行另一个 javascript 应用的代码，并实现应用之间的依赖共享

其实看到去好像就是支持模块从别的项目地址进行加载，从而达到复用模块的的效果

[module federation 深入了解](https://www.qiyuandi.com/zhanzhang/zonghe/12450.html)

## 源码简析

首页回顾一个 Webpack 实现的 [模块加载](./原理/code-split.md) 的原理：

- Webpack 打包后的文件定义了一个 `__webpack_modules__` 对象，用于存储模块的执行内容。`key` 值对应模块的 `id`， `value` 对应模块的模块内容

- Webpack 打包后的文件定义了一个 `_webpack_module_cache__` 是一个对象，用于缓存模块的 `export` 导出结果。`key` 值对应模块的 `id`，`value` 对应模块的输出

- Webpack 还提供了一个 `__webpack_require__` 对象，可用于获取模块的输出。源代码中的 `import xx from 'xxx'`,最终会被转化为 `__webpack_require__.[xx](...)` 的形式

- 对于每一个抽离出来的模块 Webpack 会把这个模块打包为一个含自执行方法的 JS 文件。当加载这个 JS 文件的时候会执行模块对应的相关代码，将对内保存到 `__webpack_modules__` 对象中

- 之后会执行模块的代码内容，输出 `exports` 导出结果同时保存到 `__webpack_module_cache__`

之前模块加载只支持当前项目所在的地址，Federation 的实现就在原来的基本上支持了从其它地上进行模块的获取

当使用了 Federation 后，看下 Webpack Bundle 文件输出内容的多了哪些属性方法

### __webpack_require__.f

在之前模块化原理的分析中知道 `__webpack_require__.f` 的作用是用于准备获取加载模块内容的， 其中 `__webpack_require__.f.j` 属性用于获取当前项目打包的模块  
在配置了 Federation 之后， `__webpack_require__.f` 多了两个属性 `consumes` 和 `remote`

```js
var chunkMapping = {
	"webpack_sharing_consume_default_react_react-_2849": [
		"webpack/sharing/consume/default/react/react?2849"
	],
	"src_bootstrap_js": [
		"webpack/sharing/consume/default/react-dom/react-dom"
	],
	"webpack_sharing_consume_default_react_react-_76b1": [
		"webpack/sharing/consume/default/react/react?76b1"
	]
};
__webpack_require__.f.consumes = (chunkId, promises) => {
	if(__webpack_require__.o(chunkMapping, chunkId)) {
	}
}
```

```js
var chunkMapping = {
	"webpack_container_remote_app2_Button": [
		"webpack/container/remote/app2/Button"
	]
};
__webpack_require__.f.remotes = (chunkId, promises) => {
	if(__webpack_require__.o(chunkMapping, chunkId)) {
	}
}
```

可以发现 Webpack 根据 Federation 配置添加 Map 表，所以加载模块的时候就会知道使用哪个 `__webpack_require__.f` 方法进行获取了

- `remote` 用于获取 `remote` 模块的

- `consumes` 用于获取 共享模块 的


所以从 [共享依赖] 和 [加载remote] 两个方面去了解一下 Webpack 是怎么处理的

### 共享依赖

当我们配置了 Federation 的共享模块配置后，主文件内容将会添加如下代码内容

```js
Promise.all(/*! import() */[__webpack_require__.e("webpack_sharing_consume_default_react_react-_2849"), __webpack_require__.e("src_bootstrap_js")]).then(__webpack_require__.bind(__webpack_require__, /*! ./bootstrap */ "./src/bootstrap.js"));
```

源码中这段代码是通过 `eval` 包装起来的，所以将主文件加载后就会执行 `__webpack_require__.e("webpack_sharing_consume_default_react_react-_2849")` 和 `__webpack_require__.e("src_bootstrap_js")`

```js
__webpack_require__.e = (chunkId) => {
    return Promise.all(Object.keys(__webpack_require__.f).reduce((promises, key) => {
		__webpack_require__.f[key](chunkId, promises);
		return promises;
	}, []));
}
```

通过上文的分析可以知道此时加载的是 共享模块 所以这里执行 `__webpack_require__.f.consumes` 方法

```js
// 保存模块的加载的状态
var installedModules = {};
__webpack_require__.f.consumes = (chunkId, promises) => {
    if(__webpack_require__.o(chunkMapping, chunkId)) { // 判断 chunkMapping 对象中是否存在 chunkId 属性，即判断当前模块是否属性共享模块
        chunkMapping[chunkId].forEach((id) => { // 根据 chunkId 获取要载的模块
            // 如果 installedModules 已经该模块的状态，直接取出使用
            if(__webpack_require__.o(installedModules, id)) return promises.push(installedModules[id]);
            // 设置成功的回调
            var onFactory = (factory) => {
                installedModules[id] = 0; // 成功后状态置为 0 ，表示已经安装过
                __webpack_require__.m[id] = (module) => {
                    delete __webpack_require__.c[id];
                    module.exports = factory();
                }
            };
            // 设置失败的回调
            var onError = (error) => {
                delete installedModules[id];
                __webpack_require__.m[id] = (module) => {
                    delete __webpack_require__.c[id];
                    throw error;
                }
            };
            try {
                var promise = moduleToHandlerMapping[id](); // 执行对应的方法
                if(promise.then) {
                    promises.push(installedModules[id] = promise.then(onFactory).catch(onError));
                } else onFactory(promise);
            } catch(e) { onError(e); }
        });
    }
}

	var moduleToHandlerMapping = {
		"webpack/sharing/consume/default/react/react?2849": () => (loadSingletonVersionCheckFallback("default", "react", [1,16,13,0], () => (Promise.all([__webpack_require__.e("vendors-node_modules_react_index_js"), __webpack_require__.e("node_modules_object-assign_index_js-node_modules_prop-types_checkPropTypes_js")]).then(() => (() => (__webpack_require__(/*! react */ "./node_modules/react/index.js"))))))),
	};
```

`consumes` 方法首先向 `installedModules` 对路添加该模块的 `pending promise`信息，然后从 `moduleToHandlerMapping` 得到模块加载的方法，具体代码为：

```js
loadSingletonVersionCheckFallback(
    "default",
    "react",
    [1,16,13,0],
    () => (Promise.all( [
          __webpack_require__.e("vendors-node_modules_react_index_js"), 
          __webpack_require__.e("node_modules_object-assign_index_js-node_modules_prop-types_checkPropTypes_js")
        ]).then(() => (() => (__webpack_require__(/*! react */ "./node_modules/react/index.js")))))
)

var loadSingletonVersionCheckFallback =  init((scopeName, scope, key, version, fallback) => {
	if(!scope || !__webpack_require__.o(scope, key)) return fallback();
	return getSingletonVersion(scope, scopeName, key, version);
});

var init = (fn) => (function(scopeName, a, b, c) {
	var promise = __webpack_require__.I(scopeName);
	if (promise && promise.then) return promise.then(fn.bind(fn, scopeName, __webpack_require__.S[scopeName], a, b, c));
	return fn(scopeName, __webpack_require__.S[scopeName], a, b, c);
});
```

`loadSingletonVersionCheckFallback` 实际上执行的 `init` 返回的函数，根据当前例子参数对应为：

- scopeName： `default`

- a： `react`

- b： `[1,16,13,0]`

- c： Promise 函数

`init` 然后执行 `__webpack_require__.I(scopeName)`，`scopeName=default` 是默认值 

```js
/* webpack/runtime/sharing */
(() => {
    // 初始化一个 __webpack_require__.S 保存共享的依赖名、版本号、获取方法
    __webpack_require__.S = {};
    var initPromises = {};
    var initTokens = {};
    __webpack_require__.I = (name, initScope) => {
        if(!initScope) initScope = [];
        // 处理循环初始化调用      
        var initToken = initTokens[name];
        if(!initToken) initToken = initTokens[name] = {};
        // 如果存在，说明之前获取后，直接返回
        if(initScope.indexOf(initToken) >= 0) return;
        initScope.push(initToken);
        // 防止重复调用
        if(initPromises[name]) return initPromises[name];
        // 保存当前共享模块到 __webpack_require__.S
        if(!__webpack_require__.o(__webpack_require__.S, name)) __webpack_require__.S[name] = {};
        // 运行这个模块的所有初始化代码片段
        var scope = __webpack_require__.S[name];
        var warn = (msg) => (typeof console !== "undefined" && console.warn && console.warn(msg));
        var uniqueName = "@automatic-vendor-sharing/app1";
        // 注册共享模块
        var register = (name, version, factory, eager) => {
            var versions = scope[name] = scope[name] || {};
            var activeVersion = versions[version];
            // 添加当前模块的信息到 versions 对象中，变向保存到 __webpack_require__.S 对于中. 其中 get 属性表示执行模块的获取方法
            if(!activeVersion || (!activeVersion.loaded && (!eager != !activeVersion.eager ? eager : uniqueName > activeVersion.from))) versions[version] = { get: factory, from: uniqueName, eager: !!eager };
        };
        var initExternal = (id) => {
            var handleError = (err) => (warn("Initialization of sharing external failed: " + err));
            try {
                // 获取另个应用的 remoteEntry.js 模块，这里返回 promise
                var module = __webpack_require__(id);
                if(!module) return;
                // module 执行成功后的回调
                var initFn = (module) => (module && module.init && module.init(__webpack_require__.S[name], initScope))
                 // 执行是导步的，先保存 promise 到 promises 中，等成功后再执行 initFn
                if(module.then) return promises.push(module.then(initFn, handleError));
                // 如果是已经加过的，直接执行 initFn
                var initResult = initFn(module);
                // 添加异常的情况
                if(initResult && initResult.then) return promises.push(initResult.catch(handleError));
            } catch(err) { handleError(err); }
        }
        var promises = [];
        switch(name) {
            case "default": {
                register("react-dom", "16.14.0", () => (Promise.all([__webpack_require__.e("vendors-node_modules_react-dom_index_js"), __webpack_require__.e("webpack_sharing_consume_default_react_react-_76b1")]).then(() => (() => (__webpack_require__(/*! ./node_modules/react-dom/index.js */ "./node_modules/react-dom/index.js"))))));
                register("react", "16.14.0", () => (Promise.all([__webpack_require__.e("vendors-node_modules_react_index_js"), __webpack_require__.e("node_modules_object-assign_index_js-node_modules_prop-types_checkPropTypes_js")]).then(() => (() => (__webpack_require__(/*! ./node_modules/react/index.js */ "./node_modules/react/index.js"))))));
                initExternal("webpack/container/reference/app2");
            }
            break;
        }
        if(!promises.length) return initPromises[name] = 1;
        return initPromises[name] = Promise.all(promises).then(() => (initPromises[name] = 1));
    };
})();
```

上面代码通过 `register` 方法添加共享模块的信息到 `__webpack_require__.S` 对象中，此时 `__webpack_require__.S` 对象的内容大致如下图所示：

![](./static/federation_1.png)

然后执行 `initExternal("webpack/container/reference/app2")` 方法，执行 `__webpack_require__(id)`

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

`__webpack_require__()` 创建一个新的模块信息并保存到 `__webpack_module_cache__` 对象中，之后就执行 `execOptions.factory.call(module.exports, module, module.exports, execOptions.require)`  `execOptions.factory` 是当前模块的代码内容， `webpack/container/reference/app2` 内容为

```js
var __webpack_error__ = new Error();
module.exports = new Promise((resolve, reject) => {
    // 如果存在 app2 执行成功的回调      
	if(typeof app2 !== "undefined") return resolve();
    // 通过加载 remoteEntry.js
	__webpack_require__.l("http://localhost:3002/remoteEntry.js", (event) => {
		if(typeof app2 !== "undefined") return resolve();
		var errorType = event && (event.type === 'load' ? 'missing' : event.type);
		var realSrc = event && event.target && event.target.src;
		__webpack_error__.message = 'Loading script failed.\n(' + errorType + ': ' + realSrc + ')';
		__webpack_error__.name = 'ScriptExternalLoadError';
		__webpack_error__.type = errorType;
		__webpack_error__.request = realSrc;
		reject(__webpack_error__);
	}, "app2");
}).then(() => (app2));
```

此时 `__webpack_require__` 作用就是加载 `remoteEntry`，返回的 `module.exports` 是一个 Promise，这个 Promise 的回调是 `app2`

回到 `initExternal` 方法中，执行 ` return promises.push(module.then(initFn, handleError))`, 返回到 `promises` 集合中

`__webpack_require__.I` 返回的就是这个 Promise 集合 `promises`

最后返回 `module.exports`

最后会执行 `init` 中的 `fn` 回调

代码分析：

`__webpack_require__` 新增了 `I` 方法，`_webpack_require__.I` 方法首先会初始化一个 `__webpack_require__.S` 对象

`__webpack_require__.I` 内部定义了两个关键方法：`register` 和 `initExternal`
 
  - `register` 执行时，会将 `shared` 配置项指定的共享依赖及获取方法添加到 `__webpack_require__.S` 中，最后 `__webpack_require__.S` 呈现结果如下图所示：
  
     

  - `initExternal` 执行时，会加载另个应用的 `remoteEntry.js`，然后使用当前应用的 `__webpack_require__.S` 来初始化另个应用的 `__webpack_require__.S` 对象
  
- 之后执行 `register("react-dom", fn)` 和 `register("react", fn)`，添加这两个共享模块，然后执行 `initExternal` 调用 `__webpack_require__('webpack/container/reference/app2')` 加载模块

- 此时加载的是 `http://localhost:3002/remoteEntry.js` 文件

- 上面的 `fn` 就是获取共享模块的方法

**initExternal**

从上文代码的注释里可以知道执行 `initExternal` 会加载另个应用的 `remoteEntry.js` 模块，加载成功后会通过 `initFn` 方法处理模块结果，通过代码函体中的执行代码 `module && module.init && module.init(__webpack_require__.S[name], initScope)` 又可以知道主要执行的是导步加载的模块的 `init()` 方法

```js
var init = (shareScope, initScope) => {
	if (!__webpack_require__.S) return;
	// 获取另个应用的 __webpack_require__.S["default"]，此时是没内容的
	var oldScope = __webpack_require__.S["default"];
	var name = "default"
	if(oldScope && oldScope !== shareScope) throw new Error("Container initialization failed as it has already been initialized with a different share scope");
	// 用shareScope初始化当前 __webpack_require__.S["default"]
    __webpack_require__.S[name] = shareScope;
	return __webpack_require__.I(name, initScope);
}
```

`init` 使用应用A中的 `shareScope(__webpack_require__.S["default"])` 来初始化应用B 的 `__webpack_require__.S["default"]`，最后还是会执行 `__webpack_require__.I(name, initScope)`， `__webpack_require__.I` 执行过程中 `register`


```js
var loadSingletonVersionCheckFallback = /*#__PURE__*/ init((scopeName, scope, key, version, fallback) => {
	if(!scope || !__webpack_require__.o(scope, key)) return fallback();
	return getSingletonVersion(scope, scopeName, key, version);
})
```

```js
var getSingletonVersion = (scope, scopeName, key, requiredVersion) => {
	var version = findSingletonVersionKey(scope, key);
	if (!satisfy(requiredVersion, version)) typeof console !== "undefined" && console.warn && console.warn(getInvalidSingletonVersionMessage(key, version, requiredVersion));
	return get(scope[key][version]);
};
```

```js
var get = (entry) => {
	entry.loaded = 1;
	return entry.get()
};
```

`此时 entry.get()` 就会使用 `__webpack_require__.e` 加载模块，=> `__webpack_require__.f.j`，此时拼接的模块地址是 app2的地址

模块加载完之后，在 `__webpack_modules__` 就会看到相对应的模块

## Q&A

### 为什么 index.js 中需要以 import() 的方式引入 bootstrap.js ？

在查看 module federation 例子的时候，示例中 `index.js` 中使用 `import()` 方法引入 `bootstrap.js` ，如果把 `bootstrap.js` 中的内容，直接粘贴到 `index.js` 中。启动就会报错

原因在于使用 `module federation` 以后，`react` 会作为异步模块，在 `app1` 的 `main.js`、`app2` 的 `remote.js` 完成加载并且初始化 `sharedScope` 以后，才会加载并运行对应的执行方法。

**所以这带来思考：异步后页面的加载不就变长了？**

### module federation 是否可以做到与技术栈无关？

答案是可以的。

假设两个应用， host 应用使用 react 技术栈， remote 应用使用 vue 技术栈，host 应用在使用 remote 应用提供的组件时，不能直接使用，需要额外执行 vue.mount('#xxx') 方法，将 remote 组件挂载的指定位置

### 共享依赖的版本控制

module federation 在初始化 `shareScope` 时，会比较 `host` 应用和 `remote` 应用之间共享依赖的版本，将 `shareScope` 中共享依赖的版本更新为较高版本。

在加载共享依赖时，如果发现实际需要的版本和 `shareScope` 中共享依赖的版本不一致时，会根据 `share` 配置项的不同做相应处理：

- 如果配置 `singleton` 为 `ture`，实际使用 `shareScope` 中的共享依赖，控制台会打印版本不一致警告

- 如果配置 `singleton` 为 `ture`，且 `strictVersion` 为 `ture`，即需要保证版本必须一致，会抛出异常

- 如果配置 `singleton` 为 `false`，那么应用不会使用 `shareScope` 中的共享依赖，而是加载应用自己的依赖

综上，如果 host 应用和 remote 应用共享依赖的版本可以兼容，可将 `singleton` 配置为 `ture`；如果共享依赖版本不兼容，需要将 `singleton` 配置为 `false`

### 多个应用(超过 2 个) 是否可共用一个 shareScope ？

假设有这么一个场景， 三个应用 - app1、app2、app3， app2 是 app1 的 remote 应用， app3 是 app2 的 remote 应用， 那么他们是否可共用一个 shareScope ？

答案是肯定的。

使用 module federation 功能以后，所有建立联系的应用，共用一个 shareScope

### 多个应用配置相同的 shareScope，最终使用哪个？

## 总结 

- 使用 module federation，我们可以在一个应用中动态加载并执行另一个应用的代码，且与技术栈无关；

- 通过 module federation 建立连接的应用，共享同一个 `shareScope`，可实现依赖共享；

- host 应用的入口文件，必须使用 `import()` 的方式，否则会报错；

- 使用 module federation 需要基于 webpack5