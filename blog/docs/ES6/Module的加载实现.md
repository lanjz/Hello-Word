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

- `defer` 属性脚本的执行是在所有元素解析完成之后，DOMContentLoaded 事件触发之前完成，并且当包含多个 `defer` 标签的传本时，它是按照加载顺序执行脚本的

- `async` 的脚本并不保证按照指定它们的先后顺序执行。对它来说脚本的加载和执行是紧紧挨着的，所以不管你声明的顺序如何，只要它加载完了就会立刻执行

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

上面代码指定项目的入口脚本为 `./src/index.js` ，它的格式为 ES6 模块。如果没有 `type` 字段，`index.js` 就会被解释为 CommonJS 模块

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

**条件加载**

利用 `.` 这个别名，可以为 ES6 模块和 CommonJS 指定不同的入口。目前，这个功能需要在 Node.js 运行的时候，打开 `--experimental-conditional-exports` 标志

```js
{
  "type": "module",
  "exports": {
    ".": {
      "require": "./main.cjs",
      "default": "./main.js"
    }
  }
}
```

上面代码中，别名 `.` 的 `require` 条件指定 `require()` 命令的入口文件（即 CommonJS 的入口），`default` 条件指定其他情况的入口（即 ES6 的入口）。

上面的写法可以简写如下

```js
{
  "exports": {
    "require": "./main.cjs",
    "default": "./main.js"
  }
}
```

注意，如果同时还有其他别名，就不能采用简写，否则或报错

```js
{
  // 报错
  "exports": {
    "./feature": "./lib/feature.js",
    "require": "./main.cjs",
    "default": "./main.js"
  }
}
```

## ES6 模块加载 CommonJS 模块

目前，一个模块同时支持 ES6 和 CommonJS 两种格式的常见方法是，`package.json` 文件的 `main` 字段指定 CommonJS 入口，给 Node.js 使用；`module` 字段指定 ES6 模块入口，给打包工具使用，因为 Node.js 不认识 `module` 字段。

有了上一节的条件加载以后，Node.js 本身就可以同时处理两种模块

```js
// ./node_modules/pkg/package.json
{
  "type": "module",
  "main": "./index.cjs",
  "exports": {
    "require": "./index.cjs",
    "default": "./wrapper.mjs"
  }
}
```

上面代码指定了 CommonJS 入口文件 `index.cjs` ，下面是这个文件的代码

```js
// ./node_modules/pkg/index.cjs
exports.name = 'value';
```

然后，ES6 模块可以加载这个文件

```js
// ./node_modules/pkg/wrapper.mjs
import cjsModule from './index.cjs';
export const name = cjsModule.name;
```

注意，`import` 命令加载 CommonJS 模块，只能整体加载，不能只加载单一的输出项

```js
// 正确
import packageMain from 'commonjs-package';

// 报错
import { method } from 'commonjs-package';
```

还有一种变通的加载方法，就是使用 Node.js 内置的 `module.createRequire()` 方法。

```js
// cjs.cjs
module.exports = 'cjs';

// esm.mjs
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

const cjs = require('./cjs.cjs');
cjs === 'cjs'; // true
```

上面代码中，ES6 模块通过 `module.createRequire()` 方法可以加载 CommonJS 模块

## CommonJS 模块加载 ES6 模块 

CommonJS 的 `require` 命令不能加载 ES6 模块，会报错，只能使用 `import()` 这个方法加载

```js
(async () => {
  await import('./my-app.mjs');
})();
```

上面代码可以在 CommonJS 模块中运行

## Node.js 的内置模块

Node.js 的内置模块可以整体加载，也可以加载指定的输出项

```js
// 整体加载
import EventEmitter from 'events';
const e = new EventEmitter();

// 加载指定的输出项
import { readFile } from 'fs';
readFile('./foo.txt', (err, source) => {
  if (err) {
    console.error(err);
  } else {
    console.log(source);
  }
});
```

## 加载路径

ES6 模块的加载路径必须给出脚本的完整路径，不能省略脚本的后缀名。`import` 命令和 `package.json` 文件的 `main` 字段如果省略脚本的后缀名，会报错。

```js
// ES6 模块中将报错
import { something } from './index';
```

为了与浏览器的 `import` 加载规则相同，Node.js 的 `.mjs` 文件支持 URL 路径

```js
import './foo.mjs?query=1'; // 加载 ./foo 传入参数 ?query=1
```

上面代码中，脚本路径带有参数 `?query=1` ，Node 会按 URL 规则解读。同一个脚本只要参数不同，就会被加载多次，并且保存成不同的缓存。由于这个原因，只要文件名中含有 `:` 、`%` 、 `#` 、`?` 等特殊字符，最好对这些字符进行转义。

目前，Node.js 的 `import` 命令只支持加载本地模块（`file:`协议）和 `data:` 协议，不支持加载远程模块。另外，脚本路径只支持相对路径，不支持绝对路径（即以 `/` 或 `//` 开头的路径）。

最后，Node 的 `import` 命令是异步加载，这一点与浏览器的处理方法相同

## 内部变量

ES6 模块之中，顶层的 `this` 指向 `undefined`

CommonJS 模块的顶层 `this` 指向当前模块，这是两者的一个重大差异

其次，以下这些顶层变量在 ES6 模块之中都是不存在的

- `arguments`

- `require`

- `module`

- `exports`

- `__filename`

- `__dirname`


## CommonJS 模块的加载原理

CommonJS 的一个模块，就是一个脚本文件。`require` 命令第一次加载该脚本，就会执行整个脚本，然后在内存生成一个对象

```js
{
  id: '...',
  exports: { ... },
  loaded: true,
  ...
}
```

上面代码就是 Node 内部加载模块后生成的一个对象

- `id`: 表示模块名

- `exports`: 模块输出的各个接口

- `loaded`: 一个布尔值，表示该模块的脚本是否执行完毕

以后需要用到这个模块的时候，就会到 `exports` 属性上面取值。即使再次执行 `require` 命令，也不会再次执行该模块，而是到缓存之中取值。也就是说，CommonJS 模块无论加载多少次，都只会在第一次加载时运行一次，以后再加载，就返回第一次运行的结果，除非手动清除系统缓存

## CommonJS 模块的循环加载

CommonJS 模块的重要特性是加载时执行，即脚本代码在 `require` 的时候，就会全部执行。一旦出现某个模块被"循环加载"，就只输出已经执行的部分，还未执行的部分不会输出

```js
// a.js
exports.done = false;
var b = require('./b.js');
console.log('在 a.js 之中，b.done = %j', b.done);
exports.done = true;
console.log('a.js 执行完毕');

// b.js
exports.done = false;
var a = require('./a.js');
console.log('在 b.js 之中，a.done = %j', a.done);
exports.done = true;
console.log('b.js 执行完毕');
```

上面代码之中，`a.js` 脚本先输出一个 `done` 变量，然后加载另一个脚本文件 `b.js` 。注意，此时 `a.js` 代码就停在这里，等待 `b.js` 执行完毕，再往下执行

`b.js` 执行到第二行，就会去加载 `a.js` ，这时，就发生了“循环加载”。系统会去 `a.js` 模块对应对象的 `exports` 属性取值，可是此时 `a.js` 只执行了 `exports.done = false`，所以从 `a.js` 只输入一个变量 `done` ，值为 `false`

然后，`b.js` 接着往下执行，等到全部执行完毕，再把执行权交还给 `a.js` 。于是，`a.js` 接着往下执行，直到执行完毕

## ES6 模块的循环加载

ES6 处理“循环加载”与 CommonJS 有本质的不同。ES6 模块是动态引用，如果使用 `import` 从一个模块加载变量（即 `import foo from 'foo'` ），那些变量不会被缓存，而是成为一个指向被加载模块的引用

```js
// a.mjs
import {bar} from './b';
console.log('a.mjs');
console.log(bar);
export let foo = 'foo';

// b.mjs
import {foo} from './a';
console.log('b.mjs');
console.log(foo);
export let bar = 'bar';
```

上面代码中，`a.mjs` 加载 `b.mjs` ，`b.mjs` 又加载 `a.mjs`，构成循环加载。执行 `a.mjs` ，结果如下:

```js
$ node --experimental-modules a.mjs
b.mjs
ReferenceError: foo is not defined
```

首先，执行 `a.mjs` 以后，引擎发现它加载了 `b.mjs` ，因此会优先执行 `b.mjs`

执行 `b.mjs` 的时候，已知它从 `a.mjs` 输入了 `foo` 接口，这时不会去执行 `a.mjs`，而是认为这个接口已经存在了，继续往下执行

执行到第三行 `console.log(foo)` 的时候，才发现这个接口根本没定义，因此报错

解决这个问题的方法，就是让 `b.mjs` 运行的时候，`foo` 已经有定义了。这可以通过将 `foo` 写成函数来解决

```js
// a.mjs
import {bar} from './b';
console.log('a.mjs');
console.log(bar());
function foo() { return 'foo' }
export {foo};

// b.mjs
import {foo} from './a';
console.log('b.mjs');
console.log(foo());
function bar() { return 'bar' }
export {bar};
```

这时再执行 `a.mjs` 就可以得到预期结果

```js
$ node --experimental-modules a.mjs
b.mjs
foo
a.mjs
bar
```

这是因为函数具有提升作用，在执行 `import {bar} from './b'` 时，函数 `foo` 就已经有定义了，所以 `b.mjs` 加载的时候不会报错。这也意味着，如果把函数 `foo` 改写成函数表达式，也会报错

```js
// a.mjs
import {bar} from './b';
console.log('a.mjs');
console.log(bar());
const foo = () => 'foo';
export {foo};
```

上面代码的第四行，改成了函数表达式，就不具有提升作用，执行就会报错。

我们再来看 ES6 模块加载器 `SystemJS` 给出的一个例子

```js
// even.js
import { odd } from './odd'
export var counter = 0;
export function even(n) {
  counter++;
  return n === 0 || odd(n - 1);
}

// odd.js
import { even } from './even';
export function odd(n) {
  return n !== 0 && even(n - 1);
}
```

上面代码中，`even.js` 里面的函数 `even` 有一个参数 `n`，只要不等于 `0`，就会减去 `1`，传入加载的 `odd()`。`odd.js` 也会做类似操作

```js
$ babel-node
> import * as m from './even.js';
> m.even(10);
true
> m.counter
6
> m.even(20)
true
> m.counter
17
```

上面代码中，参数 `n` 从 `10` 变为 `0` 的过程中，`even()` 一共会执行 `6` 次，所以变量 `counter` 等于 `6`。第二次调用 `even()` 时，参数 `n` 从 `20` 变为 `0` ，`even()` 一共会执行 `11` 次，加上前面的 `6` 次，所以变量 `counter` 等于 `17`

这个例子要是改写成 CommonJS，就根本无法执行，会报错

```js
// even.js
var odd = require('./odd');
var counter = 0;
exports.counter = counter;
exports.even = function (n) {
  counter++;
  return n == 0 || odd(n - 1);
}

// odd.js
var even = require('./even').even;
module.exports = function (n) {
  return n != 0 && even(n - 1);
}
```

上面代码中，`even.js` 加载 `odd.js` ，而 `odd.js` 又去加载 `even.js` ，形成“循环加载”。这时，执行引擎就会输出`even.js` 已经执行的部分（不存在任何结果），所以在 `odd.js` 之中，变量 `even` 等于 `undefined` ，等到后面调用 `even(n - 1)` 就会报错

```js
$ node
> var m = require('./even');
> m.even(10)
TypeError: even is not a function
```