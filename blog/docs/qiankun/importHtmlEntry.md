# import-html-entry

`single-spa` 使用 [import-html-entry](https://github.com/kuitos/import-html-entry) 库来加载子应用。所以单独写一个单节来粗读一下 `import-html-entry` 的核心代码

```js
export default function importHTML(url, opts = {}) {
	let fetch = defaultFetch; // 默认使用 window.fetch
	let autoDecodeResponse = false;
	let getPublicPath = defaultGetPublicPath; // 获取路径的方法
	let getTemplate = defaultGetTemplate; // function defaultGetTemplate(tpl) {return tpl;}

	// compatible with the legacy importHTML api
	if (typeof opts === 'function') {
		fetch = opts;
	} else {
		// fetch option is availble
		if (opts.fetch) {
			// fetch is a funciton
			if (typeof opts.fetch === 'function') {
				fetch = opts.fetch;
			} else { // configuration
				fetch = opts.fetch.fn || defaultFetch;
				autoDecodeResponse = !!opts.fetch.autoDecodeResponse;
			}
		}
		getPublicPath = opts.getPublicPath || opts.getDomain || defaultGetPublicPath;
		getTemplate = opts.getTemplate || defaultGetTemplate;
	}
    // 通过 fetch 请求地址
	return embedHTMLCache[url] || (embedHTMLCache[url] = fetch(url)
		.then(response => readResAsString(response, autoDecodeResponse))
		.then(html => { // 读取文件html内容
			const assetPublicPath = getPublicPath(url);
			const { template, scripts, entry, styles } = processTpl(getTemplate(html), assetPublicPath);
			return getEmbedHTML(template, styles, { fetch }).then(embedHTML => ({
				template: embedHTML,
				assetPublicPath,
				getExternalScripts: () => getExternalScripts(scripts, fetch),
				getExternalStyleSheets: () => getExternalStyleSheets(styles, fetch),
				execScripts: (proxy, strictGlobal, execScriptsHooks = {}) => {
					if (!scripts.length) {
						return Promise.resolve();
					}
					return execScripts(entry, scripts, proxy, {
						fetch,
						strictGlobal,
						beforeExec: execScriptsHooks.beforeExec,
						afterExec: execScriptsHooks.afterExec,
					});
				},
			}));
		}));
}
```

## 主函数分析

上面就是 `import-html-entry` 的入口函数了，接下来看下 `importHTML` 主要做了哪几件事情

### 获取文件

从 `importHTML` 获取文件的代码为 `embedHTMLCache[url] || (embedHTMLCache[url] = fetch(url)`

如果缓存中有则从缓存中拿，如果没有则通过 `fetch(url)` 发起请求，下面是一个获取到的文件内容:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <link rel="stylesheet" href="./app.css">
</head>
<body>
<div>DIST3</div>
</body>
<script src="./index.js"></script>
</html>
```

### 提取样式和JS文件

`fetch(url)` 获取到文件内容后，调用 `processTpl()` 方法对 `html文件内容` 做处理，主要是提取出所有使用 `script`及`link` 标签要加载的资源地址，并注释掉原本的相关代码。以上面的例子为例经 `processTpl()` 处理后返回一个对象，该对象包含以下属性：

- `template`：注释掉了 `link` 和 `script` 标签

  ```html
   <!DOCTYPE html>
   <html lang="en">
   <head>
      <meta charset="UTF-8">
      <title>Title</title>
      <!--  link http://localhost:5000/app.css replaced by import-html-entry -->
   </head>
   <body>
   <div>DIST3</div>
   </body>
   <!--  script http://localhost:5000/index.js replaced by import-html-entry -->
   </html>
  ```

- `entry`: 因为使用最后一个 JS 资源作为为入口文件，当前例子为 `http://localhost:5000/index.js`

- `scripts`: 包含的 JS 脚本资源，当前例子为 `["http://localhost:5000/index.js"]`

- styles: 包含的样式资源，当前例子为`["http://localhost:5000/app.css"]`

### 添加内联样式

经过上一步之后调用 `getEmbedHTML(template, styles, { fetch })` 获取样式内容并添加到 `html 内容`中，下面是经 `getEmbedHTML` 处理后返回的内容：

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <style>/* http://localhost:5000/app.css */div{
    color: red;
}</style>
</head>
<body>
<div>DIST3</div>
</body>
<!--  script http://localhost:5000/index.js replaced by import-html-entry -->
</html>
```

### Return

最后 `importHTML` 方法返回以下结构的对象：

```js
{
    template: embedHTML,
    assetPublicPath,
    getExternalScripts: () => getExternalScripts(scripts, fetch),
    getExternalStyleSheets: () => getExternalStyleSheets(styles, fetch),
    execScripts: (proxy, strictGlobal, execScriptsHooks = {}) => {
        if (!scripts.length) {
            return Promise.resolve();
        }
        return execScripts(entry, scripts, proxy, {
            fetch,
            strictGlobal,
            beforeExec: execScriptsHooks.beforeExec,
            afterExec: execScriptsHooks.afterExec,
        });
    },
}
```

- `embedHTML`： 包含样式的 html 内容

- `assetPublicPath`: 当前资源的路径根域名

- `getExternalScripts`: 获取JS内容的方法，可以是内联JS也可以了资源地址

- `getExternalStyleSheets`: 获取样式内容的方法，可以是内联样式也可以了资源地址

- `execScripts`: 执行JS代码，如果执行的JS是入口文件的话，返回最后一个设置的全局变量

这里重点分析一下 `execScripts` 方法

## execScripts

重点分析 `execScripts` 方法，先贴上 `execScripts` 方法的定义：

```js
export function execScripts(entry, scripts, proxy = window, opts = {}) {
	const {
		fetch = defaultFetch, strictGlobal = false, success, error = () => {
		}, beforeExec = () => {
		}, afterExec = () => {
		},
	} = opts;
	return getExternalScripts(scripts, fetch, error)
		.then(scriptsText => {
			const geval = (scriptSrc, inlineScript) => {
				const rawCode = beforeExec(inlineScript, scriptSrc) || inlineScript;
				const code = getExecutableScript(scriptSrc, rawCode, proxy, strictGlobal);
				(0, eval)(code);
				afterExec(inlineScript, scriptSrc);
			};
			function exec(scriptSrc, inlineScript, resolve) {
				if (scriptSrc === entry) {
					noteGlobalProps(strictGlobal ? proxy : window);
					try {
						// bind window.proxy to change `this` reference in script
						geval(scriptSrc, inlineScript);
						const exports = proxy[getGlobalProp(strictGlobal ? proxy : window)] || {};
						resolve(exports);
					} catch (e) {
						// entry error must be thrown to make the promise settled
						console.error(`[import-html-entry]: error occurs while executing entry script ${scriptSrc}`);
						throw e;
					}
				} else {
					if (typeof inlineScript === 'string') {
						try {
							// bind window.proxy to change `this` reference in script
							geval(scriptSrc, inlineScript);
						} catch (e) {
							// consistent with browser behavior, any independent script evaluation error should not block the others
							throwNonBlockingError(e, `[import-html-entry]: error occurs while executing normal script ${scriptSrc}`);
						}
					} else {
						// external script marked with async
						inlineScript.async && inlineScript?.content
							.then(downloadedScriptText => geval(inlineScript.src, downloadedScriptText))
							.catch(e => {
								throwNonBlockingError(e, `[import-html-entry]: error occurs while executing async script ${inlineScript.src}`);
							});
					}
				}
			}

			function schedule(i, resolvePromise) {
				if (i < scripts.length) {
					const scriptSrc = scripts[i];
					const inlineScript = scriptsText[i];
					exec(scriptSrc, inlineScript, resolvePromise);
					// resolve the promise while the last script executed and entry not provided
					if (!entry && i === scripts.length - 1) {
						resolvePromise();
					} else {
						schedule(i + 1, resolvePromise);
					}
				}
			}

			return new Promise(resolve => schedule(0, success || resolve));
		});
}
```

大致捋一下执行过程：

1. 通过 `getExternalScripts(scripts, fetch, error)` 方法获取 js 文件内容，`scripts` 可能有多个，所以是它一个数组，行到的结果也是一个数组，之后调用 `schedule` 遍历JS内容，执行 `exec(scriptSrc, inlineScript, resolvePromise)` 方法

2. `exec` 代码块中的有两个分支，一个如果是入口文件执行的分支，一个非入口文件执行的分支，这里直接分析入口文件的分支

3. 先执行 `noteGlobalProps(strictGlobal ? proxy : window)`，在执行 `entry` 代码前，获取当前 `proxy` 的最后一个属性

4. 之后执行 `geval(scriptSrc, inlineScript)`，执行 `entry` 代码，`geval` 方法下面再分析

5. 然后执行 `getGlobalProp(strictGlobal ? proxy : window)` 获取此时 `proxy` 的最后一个属性，这个属性将作为 `entry` 文件导出的属性保存到 `exports` 变量中，并通过 `resolve(exports)` 返回。

为了理解上面说的 `exports` 的作用，先回顾一个 qiankun 的框架的使用。使用 `qiankun` 框架时，要求子应用需要导出 `bootstrap`、 `mount` 、 `unmount` 三个方法，这三个方法将供主应用调用。`qiankun` 就是使用 `execScripts` 导出的 `exports` 属性来获取这三个变量的。

**那么 `import-html-entry` 是如何找到哪些属性是要导出的呢？**

上面有提到 `noteGlobalProps` 和 `getGlobalProp` 两个方法，以下这两个方法的定义

```js
//getGlobalProp
export function getGlobalProp(global) {
	let cnt = 0;
	let lastProp;
	let hasIframe = false;
	for (let p in global) {
		if (shouldSkipProperty(global, p))
			continue;
		// 遍历 iframe，检查 window 上的属性值是否是 iframe，是则跳过后面的 first 和 second 判断
		for (let i = 0; i < window.frames.length && !hasIframe; i++) {
			const frame = window.frames[i];
			if (frame === global[p]) {
				hasIframe = true;
				break;
			}
		}
		if (!hasIframe && (cnt === 0 && p !== firstGlobalProp || cnt === 1 && p !== secondGlobalProp))
			return p;
		cnt++;
		lastProp = p;
	}

	if (lastProp !== lastGlobalProp)
		return lastProp;
}
//noteGlobalProps
export function noteGlobalProps(global) {
	// alternatively Object.keys(global).pop()
	// but this may be faster (pending benchmarks)
	firstGlobalProp = secondGlobalProp = undefined;
	for (let p in global) {
		if (shouldSkipProperty(global, p))
			continue;
		if (!firstGlobalProp)
			firstGlobalProp = p;
		else if (!secondGlobalProp)
			secondGlobalProp = p;
		lastGlobalProp = p;
	}

	return lastGlobalProp;
}
// shouldSkipProperty
function shouldSkipProperty(global, p) {
	if (
		!global.hasOwnProperty(p) ||
		!isNaN(p) && p < global.length
	)
		return true;

	if (isIE11) {
		// https://github.com/kuitos/import-html-entry/pull/32，最小化 try 范围
		try {
			return global[p] && typeof window !== 'undefined' && global[p].parent === window;
		} catch (err) {
			return true;
		}
	} else {
		return false;
	}
}
```

`noteGlobalProps` 和 `getGlobalProp` 两个方法内容都差不多，都是遍历 `proxy` 对象，找到最后一个属性，所以 `execScripts` 方法就是找到 `proxy` 最后一个属性作为 `entry` 文件要导出属性

:::tip
JS的 `for in` 循环对象属性的顺序遵循的规则：整数=>字符串=>Symbol，在此基础上相同类型的属性将按添加的时间顺序排列
:::

所以在回顾一个找 `proxy` 最后一个属性的流程：

1. 在执行 `entry` 文件，通过 `noteGlobalProps` 找到当前 `prosy` 的最后一个属性

2. 执行  `entry` 文件，在执行代码过程中，可能会定义新的全局属性

3. 再执行 `getGlobalProp` 方法再到当前 `prosy` 的最后一个属性，并且这个属性与之前 `noteGlobalProps` 标志的最后一个属性不相等，则说明这个属性是 `entry` 要导出的属性

:::tip
使用 `for in` 循环会遍历原型中的属性，原型中的属性总是在最后遍历出来，所以要过滤掉原型的属性
:::

## geval

`execScripts` 通过调用 `geval` 执行具体代码的，定义如下：

```js
const geval = (scriptSrc, inlineScript) => {
    const rawCode = beforeExec(inlineScript, scriptSrc) || inlineScript;
    const code = getExecutableScript(scriptSrc, rawCode, proxy, strictGlobal);
    (0, eval)(code);
    afterExec(inlineScript, scriptSrc);
};
// getExecutableScript
function getExecutableScript(scriptSrc, scriptText, proxy, strictGlobal) {
	const sourceUrl = isInlineCode(scriptSrc) ? '' : `//# sourceURL=${scriptSrc}\n`;

	// 通过这种方式获取全局 window，因为 script 也是在全局作用域下运行的，所以我们通过 window.proxy 绑定时也必须确保绑定到全局 window 上
	// 否则在嵌套场景下， window.proxy 设置的是内层应用的 window，而代码其实是在全局作用域运行的，会导致闭包里的 window.proxy 取的是最外层的微应用的 proxy
	const globalWindow = (0, eval)('window');
	globalWindow.proxy = proxy;
	// TODO 通过 strictGlobal 方式切换切换 with 闭包，待 with 方式坑趟平后再合并
	return strictGlobal
		? `;(function(window, self, globalThis){with(window){;${scriptText}\n${sourceUrl}}}).bind(window.proxy)(window.proxy, window.proxy, window.proxy);`
		: `;(function(window, self, globalThis){;${scriptText}\n${sourceUrl}}).bind(window.proxy)(window.proxy, window.proxy, window.proxy);`;
}
```

`getExecutableScript` 方法中参数 `scriptText` 就是要执行的 js 内容，最后会通过自执行函数传入 `proxy`，来设置执行代码的全局环境 

```js
(function(window, self, globalThis){
  with(window){
    // scriptText
  }
}).bind(window.proxy)(window.proxy, window.proxy, window.proxy)
```

总之通过这一波操作，给脚本字符串构件了一个简单的执行环境，该环境屏蔽了全局了 `this` 、`window` 和 `self` ，上面的 `proxy` 就是执行 `execScripts` 传入的，默认为 `window`

>[JavaScript读源码系列--微前端之import-html-entry](https://blog.csdn.net/daihaoxin/article/details/106250617)

>[importHtmlEntry 源码](https://www.jianshu.com/p/dcffdcd121ba)