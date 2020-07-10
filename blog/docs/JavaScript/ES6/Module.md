# Module

在 ES6 之前，社区制定了一些模块加载方案，最主要的有 CommonJS 和 AMD 两种。前者用于服务器，后者用于浏览器

## CommonJS

CommonJS 模块就是对象，输入时必须查找对象属性

```js
// CommonJS模块
let { stat, exists, readfile } = require('fs');

// 等同于
let _fs = require('fs');
let stat = _fs.stat;
let exists = _fs.exists;
let readfile = _fs.readfile;
```

上面代码的实质是整体加载 `fs` 模块（即加载 `fs` 的所有方法），生成一个对象（ `_fs` ），然后再从这个对象上面读取 3 个方法。这种加载称为“运行时加载”，因为只有运行时才能得到这个对象，导致完全没办法在编译时做“静态优化”。

ES6 模块是通过不是对象， `export` 命令显式指定输出的代码，再通过 `import` 命令输入

```js
// ES6模块
import { stat, exists, readFile } from 'fs';
```

上面代码的实质是从 `fs` 模块加载 3 个方法，其他方法不加载。这种加载称为“编译时加载”或者静态加载，即 ES6 可以在编译时就完成模块加载，效率要比 CommonJS 模块的加载方式高。当然，这也导致了没法引用 ES6 模块本身，因为它不是对象

## export命令

`export` 命令用于规定模块的对外接口

```js
// profile.js
export var firstName = 'Michael';
export var lastName = 'Jackson';
export var year = 1958;
// 获
export { firstName, lastName, year };
```

**需要特别注意的是，`export` 命令规定的是对外的接口，必须与模块内部的变量建立一一对应关系**

```js
// 报错
export 1;

// 报错
var m = 1;
export m;

// 报错
function f() {}
export f;
```

上面两种写法都会报错，因为没有提供对外的接口。第一种写法直接输出 1，第二种写法通过变量m，还是直接输出 1。1只是一个值，不是接口。正确的写法是下面这样

```js
// 写法一
export var m = 1;

// 写法二
var m = 1;
export {m};

// 写法三
var n = 1;
export {n as m};

// 正确
export function f() {};

// 正确
function f() {}
export {f};
```

### 重命名导出模块

`export` 输出的变量就是本来的名字，但是可以使用 `as` 关键字重命名

```js
function v1() { ... }
function v2() { ... }

export {
  v1 as streamV1,
  v2 as streamV2,
  v2 as streamLatestVersion
};
```

**`export`语句输出的接口，与其对应的值是动态绑定关系，即通过该接口，可以取到模块内部实时的值**

```js
export var foo = 'bar';
setTimeout(() => foo = 'baz', 500);
```

上面代码输出变量 `foo`，值为 `bar`，500 毫秒之后变成 `baz`

所以如果在一个页面中修改了模块内某个属性的值，那么其它页面读取这个这模块的时候，取到的将会修改后的值

这一点与 CommonJS 规范完全不同。CommonJS 模块输出的是值的缓存，不存在动态更新

`export` 命令只能处于模块顶层。如果处于块级作用域内，就会报错

```js
function foo() {
  export default 'bar' // SyntaxError
}
foo()
```

## export default 命令

`export default` 命令，为模块指定默认输出

```js
// export-default.js
export default function () {
  console.log('foo');
}

// import-default.js
import customName from './export-default';
customName(); // 'foo'
```

**export default命令用在非匿名函数前，也是可以的**

```js
// export-default.js
export default function foo() {
  console.log('foo');
}

// 或者写成

function foo() {
  console.log('foo');
}

export default foo;
```

本质上，`export default` 就是输出一个叫做 `default` 的变量或方法，然后系统允许你为它取任意名字。所以，下面的写法是有效的

```js
// modules.js
function add(x, y) {
  return x * y;
}
export {add as default};
// 等同于
// export default add;

// app.js
import { default as foo } from 'modules';
// 等同于
// import foo from 'modules';
```

正是因为 `export default` 命令其实只是输出一个叫做 `default` 的变量，所以它后面不能跟变量声明语句

```js
// 正确
export var a = 1;

// 正确
var a = 1;
export default a;

// 错误
export default var a = 1;
```

上面代码中，`export default a` 的含义是将变量 `a` 的值赋给变量 `default`。所以，最后一种写法会报错

同样地，因为 `export default` 命令的本质是将后面的值，赋给 `default` 变量，所以可以直接将一个值写在 `export default` 之后

```js
// 正确
export default 42;

// 报错
export 42
```

## import 命令

`import` 命令用于输入其他模块提供的功能

当 `import` 命令使用一对大括号时，类似使用解构赋值的方式获取指定的变量名

当 `import` 命令直接使用一个变量名时，表示获取模块的默认导出的模块(`export default`)

由于 `import` 是静态执行，所以不能使用表达式和变量，这些只有在运行时才能得到结果的语法结构

```js
// 报错
import { 'f' + 'oo' } from 'my_module';

// 报错
let module = 'my_module';
import { foo } from module;

// 报错
if (x === 1) {
  import { foo } from 'module1';
} else {
  import { foo } from 'module2';
}
```

### 重命令名模块

如果想为输入的变量重新取一个名字，`import` 命令要使用 `as` 关键字，将输入的变量重命名

```js
import { lastName as surname } from './profile.js'
```

### 模块的整体加载

除了指定加载某个输出值，还可以使用整体加载，即用星号（*）指定一个对象，所有输出值都加载在这个对象上面

```js
// circle.js

export function area(radius) {
  return Math.PI * radius * radius;
}

export function circumference(radius) {
  return 2 * Math.PI * radius;
}
export default function sum(){}

// main.js
import * as circle from './circle';
console.log(circle)

//Module
//  default: {sum: ƒ}
//  circumference: (...)
//  area
```

注意，模块整体加载所在的那个对象（上例是 `circle` ），应该是可以静态分析的，所以不允许运行时改变。下面的写法都是不允许的

```js
import * as circle from './circle';

// 下面两行都是不允许的
circle.foo = 'hello';
circle.area = function () {}
```

## export 与 import 的复合写法

如果在一个模块之中，先输入后输出同一个模块，`import` 语句可以与 `export` 语句写在一起

```js
export { foo, bar } from 'my_module';

// 可以简单理解为
import { foo, bar } from 'my_module';
export { foo, bar };
```

上面代码中，`export` 和 `import` 语句可以结合在一起，写成一行。但需要注意的是，写成一行以后，`foo` 和 `bar` 实际上并没有被导入当前模块，只是相当于对外转发了这两个接口，导致当前模块不能直接使用 `foo` 和 `bar`

模块的接口改名和整体输出，也可以采用这种写法

```js
// 接口改名
export { foo as myFoo } from 'my_module';

// 整体输出
export * from 'my_module';
```

默认接口的写法如下

```js
export { default } from 'foo';
```

具名接口改为默认接口的写法如下

```js
export { es6 as default } from './someModule';

// 等同于
import { es6 } from './someModule';
export default es6;
```

同样地，默认接口也可以改名为具名接口

```js
export { default as es6 } from './someModule';

```

其它例子二

```js
export * as ns from "mod";

// 等同于
import * as ns from "mod";
export {ns};
```

## 模块的继承

模块之间也可以继承。

假设有一个 `circleplus` 模块，继承了 `circle` 模块

```js
// circleplus.js

export * from 'circle';
export var e = 2.71828182846;
export default function(x) {
  return Math.exp(x);
}
```

上面代码中的 `export *`，表示再输出 `circle` 模块的所有属性和方法。注意，`export *` 命令会忽略 `circle` 模块的 `default` 方法。然后，上面代码又输出了自定义的 `e` 变量和默认方法。

这时，也可以将 `circle` 的属性或方法，改名后再输出

```js
// circleplus.js

export { area as circleArea } from 'circle';
```

上面代码表示，只输出 `circle` 模块的 `area` 方法，且将其改名为 `circleArea`。

加载上面模块的写法如下

```js
// main.js

import * as math from 'circleplus';
import exp from 'circleplus';
console.log(exp(math.e));
```

上面代码中的 `import exp` 表示，将 `circleplus` 模块的默认方法加载为 `exp` 方法

## import()

前面介绍过， `import` 命令会被 JavaScript 引擎静态分析，先于模块内的其他语句执行。所以也无法实现动态加载

ES2020提案 引入 `import()` 函数，支持动态加载模块

```js
import(specifier)
```

上面代码中，`import` 函数的参数 `specifier`，指定所要加载的模块的位置。`import` 命令能够接受什么参数，`import()` 函数就能接受什么参数，两者区别主要是后者为动态加载。

`import()` 返回一个 Promise 对象。下面是一个例子

```js
const main = document.querySelector('main');

import(`./section-modules/${someVariable}.js`)
  .then(module => {
    module.loadPageInto(main);
  })
  .catch(err => {
    main.textContent = err.message;
  });
```

`import()` 加载模块成功以后，这个模块会作为一个对象，当作 `then` 方法的参数。因此，可以使用对象解构赋值的语法，获取输出接口

```js
import('./myModule.js')
.then(({export1, export2}) => {
  // ...·
});
```

上面代码中，`export1` 和 `export2` 都是 `myModule.js` 的输出接口，可以解构获得

**如果模块有 `default` 输出接口，可以用参数直接获得**

```js
import('./myModule.js')
.then(myModule => {
  console.log(myModule.default);
});
```

**import()也可以用在 async 函数之中**

```js
async function main() {
  const myModule = await import('./myModule.js');
  const {export1, export2} = await import('./myModule.js');
  const [module1, module2, module3] =
    await Promise.all([
      import('./module1.js'),
      import('./module2.js'),
      import('./module3.js'),
    ]);
}
main();
```

### 同时加载多个模块

如果想同时加载多个模块，可以采用下面的写法

```js
Promise.all([
  import('./module1.js'),
  import('./module2.js'),
  import('./module3.js'),
])
.then(([module1, module2, module3]) => {
   ···
});
```

`import()` 函数可以用在任何地方，不仅仅是模块，非模块的脚本也可以使用。它是运行时执行，也就是说，什么时候运行到这一句，就会加载指定的模块。另外，`import()` 函数与所加载的模块没有静态连接关系，这点也是与 `import` 语句不相同。`import()` 类似于 Node 的 `require` 方法，区别主要是前者是异步加载，后者是同步加载



### 使用场景

**按需加载**

`import()` 可以在需要的时候，再加载某个模块

```js
button.addEventListener('click', event => {
  import('./dialogBox.js')
  .then(dialogBox => {
    dialogBox.open();
  })
  .catch(error => {
    /* Error handling */
  })
});
```

**条件加载**

`import()` 可以放在 `if` 代码块，根据不同的情况，加载不同的模块

```js
if (condition) {
  import('moduleA').then(...);
} else {
  import('moduleB').then(...);
}

```

**动态的模块路径**

`import()` 允许模块路径动态生成

```js
import(f())
.then(...);
```