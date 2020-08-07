**模板尽可能少得使用表达示**

模板中表达式过多时(如`v-if="isShow && hasRight && (foo || bar)"`)，适当的封装成`computed`

**不同时使用`v-for`和`v-if`**

`v-for` 具有比 `v-if` 更高的优先级，应当先对循环的内容作用 `v-if` 条件的过滤，减少不必要的循环

**频繁的切换显示使用`v-show`**

**动态加载模块**

**异步加载组件**

**在动态组件上使用 keep-alive**

使用动态组件时，反复的切换组件会造成组件重新渲染，使用 `keep-alive` 可以缓存失活的组件，更加高效复用组件

**列表渲染添加key**

**Object.freeze**

对于只纯展示的数据，就不需要对这个数进行监听了，此时可以使用 `Object.freeze` 方法冻结一个对象

**图片资源懒加载**

`vue-lazyload 插件`

**预取/预加载模块(prefetch/preload module)**

在声明 `import` 时，使用下面这些内置指令，可以让 webpack 输出 "resource hint(资源提示)"，来告知浏览器：

- `prefetch`(预取)：将来某些导航下可能需要的资源

- `preload`(预加载)：当前导航下可能需要资源

```js
import(/* webpackPrefetch: true */ 'LoginModal');

import(/* webpackPreload: true */ 'ChartingLibrary');
```

这会生成 `<link rel="prefetch" href="login-modal-chunk.js">` 并追加到页面头部，指示着浏览器在闲置时间预取 `login-modal-chunk.js` 文件

只要父 chunk 完成加载，webpack 就会添加 prefetch hint(预取提示)

与 prefetch 指令相比，preload 指令有许多不同之处：

- `preload chunk` 会在父 `chunk` 加载时，以并行方式开始加载。`prefetch chunk` 会在父 `chunk` 加载结束后开始加载

- `prefetch chunk` 在浏览器闲置时下载

[项目性能评测](https://www.googlespeed.cn/?spm=a2c4e.10696291.0.0.6e4919a4XKVOUm&url=www.zhujizhou.com)

**巧用`<div id="app"></div>`进行白屏优化**

首次渲染会有一段时间的白屏原因是首次渲染时需要加载一堆资源，如js、css、图片。很多优化策略，最终目的是提高这些资源的加载速度。
但是如果遇上网络慢的情况，无论优化到极致还是需要一定加载时间，这时就会出现白屏现象

如果 `<div id="app"></div>` 里面有内容，就不会出现白屏。所以我们可以在 `<div id="app"></div>` 里添加首屏的静态页面。
等真正的首屏加载出来后就会把 `<div id="app"></div>` 这块结构都替换掉，给人一种视觉上的误差，就不会产生白屏


