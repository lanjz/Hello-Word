# Module 的加载实现

## 浏览器加载 

### 传统加载

HTML 网页中，浏览器通过 `<script>` 标签加载 JavaScript 脚本

```js
<!-- 页面内嵌的脚本 -->
<script type="application/javascript">
  // module code
</script>

<!-- 外部脚本 -->
<script type="application/javascript" src="path/to/myModule.js">
</script>
```

上面代码中，由于浏览器脚本的默认语言是 JavaScript，因此 `type="application/javascript"` 可以省略

默认情况下，浏览器是同步加载 JavaScript 脚本，即渲染引擎遇到 `<script>` 标签就会停下来，等到执行完脚本，再继续向下渲染。如果是外部脚本，还必须加入脚本下载的时间

`defer` 和 `async` 两个属性可以让脚本异步加载

```js
<script src="path/to/myModule.js" defer></script>
<script src="path/to/myModule.js" async></script>
```

`defer` 与 `async` 的区别是：

- `defer` 要等到整个页面在内存中正常渲染结束（DOM 结构完全生成，以及其他脚本执行完成），才会执行。如果有多个defer脚本，会按照它们在页面出现的顺序加载

- `async` 一旦下载完，渲染引擎就会中断渲染，执行这个脚本以后，再继续渲染。多个async脚本是不能保证加载顺序的

### 浏览器加载 ES6 模块

浏览器加载 ES6 模块，也使用 `<script>` 标签，但是要加入 `type="module"` 属性

```js
<script type="module" src="./foo.js"></script>
<script type="module">
  import $ from "./jquery/src/jquery.js";
  $('#message').text('Hi from jQuery!');
</script>
```

浏览器对于带有 `type="module"` 的 `<script>` ，都是异步加载，不会造成堵塞浏览器，即等到整个页面渲染完，再执行模块脚本，等同于打开了 `<script>` 标签的 `defer` 属性

```js
<script type="module" src="./foo.js"></script>
<!-- 等同于 -->
<script type="module" src="./foo.js" defer></script>
```

如果网页有多个 `<script type="module">` ，它们会按照在页面出现的顺序依次执行

对于外部的模块脚本（上例是foo.js），有几点需要注意:

- 代码是在模块作用域之中运行，而不是在全局作用域运行。模块内部的顶层变量，外部不可见

- 模块脚本自动采用严格模式，不管有没有声明 `use strict`

- 模块之中，可以使用 `import` 命令加载其他模块（ `.js` 后缀不可省略，需要提供绝对 URL 或相对 URL），也可以使用 `export` 命令输出对外接口

- 模块之中，顶层的 `this` 关键字返回 `undefined` ，而不是指向 `window` 。也就是说，在模块顶层使用 `this` 关键字，是无意义的

- 同一个模块如果加载多次，将只执行一次

```js
import utils from 'https://example.com/js/utils.js';

const x = 1;

console.log(x === window.x); //false
console.log(this === undefined); // true
```

利用顶层的 `this` 等于 `undefined` 这个语法点，可以侦测当前代码是否在 ES6 模块之中

## ES6 模块与 CommonJS 模块的差异

- CommonJS 模块输出的是一个值的拷贝，ES6 模块输出的是值的引用。

- CommonJS 模块是运行时加载，ES6 模块是编译时输出接口

**CommonJS 模块输出的是一个值的拷贝，ES6 模块输出的是值的引用**

CommonJS 模块输出的是值的拷贝，也就是说，一旦输出一个值，模块内部的变化就影响不到这个值

```js
// lib.js
var counter = 3;
function incCounter() {
  counter++;
}
module.exports = {
  counter: counter,
  incCounter: incCounter,
};
```

引用这个模块

```js
// main.js
var mod = require('./lib');

console.log(mod.counter);  // 3
mod.incCounter();
console.log(mod.counter); // 3
```

上面代码说明，`lib.js` 模块加载以后，它的内部变化就影响不到输出的 `mod.counter` 了。这是因为 `mod.counter` 是一个原始类型的值，会被缓存。除非写成一个函数，才能得到内部变动后的值

```js
// lib.js
var counter = 3;
function incCounter() {
  counter++;
}
module.exports = {
  get counter() {
    return counter
  },
  incCounter: incCounter,
};
```

通过取值器函数就可以正确读取内部变量 `counter` 的变动了

```js
node main.js
3
4
```

ES6 模块的运行机制与 CommonJS 不一样。JS 引擎对脚本静态分析的时候，遇到模块加载命令 `import`，就会生成一个只读引用.等到脚本真正执行时，再根据这个只读引用，到被加载的那个模块里面去取值

因此，ES6 模块是动态引用，并且不会缓存值，模块里面的变量绑定其所在的模块

```js
// lib.js
export let counter = 3;
export function incCounter() {
  counter++;
}

// main.js
import { counter, incCounter } from './lib';
console.log(counter); // 3
incCounter();
console.log(counter); // 4
```

由于 ES6 输入的模块变量，只是一个“符号连接”，所以这个变量是只读的，对它进行重新赋值会报错

```js
// lib.js
export let obj = {};

// main.js
import { obj } from './lib';

obj.prop = 123; // OK
obj = {}; // TypeError
```

上面代码中，`main.js` 从 `lib.js` 输入变量 `obj`，可以对 `obj` 添加属性，但是重新赋值就会报错。因为变量 `obj` 指向的地址是只读的，不能重新赋值，这就好比 `main.js` 创造了一个名为 `obj` 的 `const` 变量

**CommonJS 模块是运行时加载，ES6 模块是编译时输出接口**

第二个差异是因为 CommonJS 加载的是一个对象（即 `module.exports` 属性），该对象只有在脚本运行完才会生成。而 ES6 模块不是对象，它的对外接口只是一种静态定义，在代码静态解析阶段就会生成

## Node.js 加载

Node.js 对 ES6 模块的处理比较麻烦，因为它有自己的 CommonJS 模块格式，与 ES6 模块格式是不兼容的。目前的解决方案是，将两者分开，ES6 模块和 CommonJS 采用各自的加载方案。从 v13.2 版本开始，Node.js 已经默认打开了 ES6 模块支持

Node.js 要求 ES6 模块采用 `.mjs` 后缀文件名。也就是说，只要脚本文件里面使用 `import` 或者 `export` 命令，那么就必须采用 `.mjs` 后缀名。Node.js 遇到 `.mjs` 文件，就认为它是 ES6 模块，默认启用严格模式，不必在每个模块文件顶部指定"use strict"

如果不希望将后缀名改成 `.mjs` ，可以在项目的 `package.json` 文件中，指定 `type` 字段为 `module`

```json
{
   "type": "module"
}
```

如果这时还要使用 CommonJS 模块，那么需要将 CommonJS 脚本的后缀名都改成 `.cjs` 。如果没有 `type` 字段，或者 `type` 字段为 `commonjs` ，则 `.js` 脚本会被解释成 CommonJS 模块

总结为一句话：`.mjs` 文件总是以 ES6 模块加载，`.cjs` 文件总是以 CommonJS 模块加载，`.js` 文件的加载取决于 `package.json` 里面 `type` 字段的设置

注意，ES6 模块与 CommonJS 模块尽量不要混用。`require` 命令不能加载 `.mjs` 文件，会报错，只有 `import` 命令才可以加载 `.mjs` 文件。反过来，`.mjs` 文件里面也不能使用 `require` 命令，必须使用 `import`

### main 字段 

`package.json` 文件有两个字段可以指定模块的入口文件：`main` 和 `exports` 。比较简单的模块，可以只使用 `main` 字段，指定模块加载的入口文件

```js
// ./node_modules/es-module-package/package.json
{
  "type": "module",
  "main": "./src/index.js"
}
```

面代码指定项目的入口脚本为 `./src/index.js` ，它的格式为 ES6 模块。如果没有 `type` 字段，`index.js` 就会被解释为 CommonJS 模块

然后，`import` 命令就可以加载这个模块

```js
// ./my-app.mjs

import { something } from 'es-module-package';
// 实际加载的是 ./node_modules/es-module-package/src/index.js
```

上面代码中，运行该脚本以后，Node.js 就会到 `./node_modules` 目录下面，寻找 `es-module-package` 模块，然后根据该模块 `package.json` 的 `main` 字段去执行入口文件。

这时，如果用 CommonJS 模块的 `require()` 命令去加载 `es-module-package` 模块会报错，因为 CommonJS 模块不能处理 `export` 命令

### exports 字段

`exports` 字段的优先级高于 `main` 字段。它有多种用法。

**子目录别名**

```js
// ./node_modules/es-module-package/package.json
{
  "exports": {
    "./submodule": "./src/submodule.js"
  }
}
```

上面的代码指定 `src/submodule.js` 别名为 `submodule` ，然后就可以从别名加载这个文件

```js
import submodule from 'es-module-package/submodule';
// 加载 ./node_modules/es-module-package/src/submodule.js
```

**main 的别名**

`exports` 字段的别名如果是 `.` ，就代表模块的主入口，优先级高于 `main` 字段，并且可以直接简写成 `exports` 字段的值

```js
{
  "exports": {
    ".": "./main.js"
  }
}

// 等同于
{
  "exports": "./main.js"
}
```

由于 `exports` 字段只有支持 ES6 的 Node.js 才认识，所以可以用来兼容旧版本的 Node.js

```js
{
  "main": "./main-legacy.cjs",
  "exports": {
    ".": "./main-modern.cjs"
  }
}
```

上面代码中，老版本的 Node.js （不支持 ES6 模块）的入口文件是 `main-legacy.cjs` ，新版本的 Node.js 的入口文件是`main-modern.cjs`