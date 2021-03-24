# qiankun原理

之前大致了玩了下 qiankun 框架的使用，现在开始了解一下它的实现原理，但是稍微看了下源码后，发现源码太多回调了看得实现是晕，所以不细读源码了，直接带些问题去找下对应的实现原理

## import-html-entry

`single-spa` 使用 [import-html-entry](https://github.com/kuitos/import-html-entry) 库来加载子应用。直接看下 `import-html-entry` 的核心代码

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

根据上面的代码，`importHTML` 主要做的以下几件事件

请求传入的文件地址，获取文件内容。如:

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

调用 `processTpl()` 方法对html文件内容做处理，主要是提取出所有使用 `script`及`link` 标签要加载的资源地址，并注释掉原本的相关代码，以上面的例子为例经 `processTpl()` 处理后返回下面内容：

- template

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

- entry: "http://localhost:5000/index.js"

- scripts: ["http://localhost:5000/index.js"]

- styles: ["http://localhost:5000/app.css"]

调用`getEmbedHTML(template, styles, { fetch })` 获取样式内容并添加到 html 内容中，下面是经 `getEmbedHTML` 处理后返回的内容：

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

- embedHTML： 包含样式的 html 内容

- getExternalScripts: 获取JS内容的方法，可以是内联JS也可以了资源地址

- getExternalStyleSheets: 获取样式内容的方法，可以是内联样式也可以了资源地址

- execScripts: 执行JS代码，如果执行的JS是入口文件的话，返回最后一个设置的全局变量

这里重点分析一下 `execScripts` 方法

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

通过 `getExternalScripts(scripts, fetch, error)` 方法获取 js 文件内容，`scripts` 可能有多个，所以是一个数组，之后调用 `schedule` 调成这个`scripts`，执行 `exec(scriptSrc, inlineScript, resolvePromise)`

`exec` 代码块中的有两个分支，一个如果是入口文件执行的分支，一个非入口文件执行的分支，这里直接分析入口文件的分支

先执行 `noteGlobalProps(strictGlobal ? proxy : window)`，在执行 `entry` 代码前，获取当前 `window` 的最后一个属性

之后执行 `geval(scriptSrc, inlineScript)`，执行 `entry` 代码

然后执行 `getGlobalProp(strictGlobal ? proxy : window)` 此时 `window` 的最后一个属性，这个属性作为 `entry` 导出的属性

具体执行代码的实现

```js
const geval = (scriptSrc, inlineScript) => {
    const rawCode = beforeExec(inlineScript, scriptSrc) || inlineScript;
    const code = getExecutableScript(scriptSrc, rawCode, proxy, strictGlobal);
    (0, eval)(code);
    afterExec(inlineScript, scriptSrc);
};

```

``````
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



## 如何加载子应用

## 路由监听

## 如果样式隔离

[](https://segmentfault.com/a/1190000022275991)