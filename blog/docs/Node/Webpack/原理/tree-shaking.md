# tree-shaking

Tree-shaking 的本质是消除无用的 js 模块。javascript 绝大多数情况需要通过网络进行加载，然后执行，加载的文件越小，整体执行时间越短。

消除无用代码广泛存在于传统的编程语言编译器中，编译器可以判断出某些代码根本不影响输出，然后消除这些代码，这个称之为DCE（dead code elimination）。Tree-shaking 是 DCE 的一种新的实现，

Tree-shaking 和传统的 DCE的方法又不太一样，传统的DCE 消灭不可能执行的代码，而Tree-shaking 更关注于消除没有用到的模块，网上很多文章会说是消除没有用到的代码，但是按照自己实践的效果来看总觉得 “消除没有用到的代码” 有点不准确

**Dead Code 一般具有以下几个特征**

- 代码不会被执行，不可到达

- 代码执行的结果不会被用到

- 代码只会影响死变量（只写不读）

## 使用

配置 tree-shaking 需要两个条件：

1. 引入相关插件

  在 webpack 中， tree-shaking 的实现依靠 `terser-webpack-plugin`， 在 webpack4 及以上的版本中已经默认集成了 `TerserPlugin`, 通过 `optimization.minimizer` 配置开启，并且默认值情况下也是开启的...（啥也不用做）
  
2. 模块必须采用 ES6Module语法， 因为 tree-shaking 的实现依赖 ES6Module语法，所以在配置 babel 时，需要指定 `modules` 属性为 `true`

   ```js
   {
     "presets": [
       ["@babel/preset-env", {
         "modules": true
       }]
     ]
   }
   ```
   
   我这里使用 webpack5 , 安装的 babel 解析插件为 `"@babel/preset-env": "^7.12.10",`，默认 `modules: auto` ,即会使用 ES6Module 模式来处理JS，总之也不用特定指定 `"modules": true` 就是了
   
粟子：

```js
// 源代码
import * as utils from './utils'
import './helper'
utils.MA()
new Object()
var b = Math.abc(-1);
function fn1(){
  console.log('fn1')
}
function fn2(){
  console.log('fn2')
}
fn2()
// utils.js
export function MA(){
  console.log('执行MA')
}
export function MB(){
  console.log('执行MB')
}
```

打包后的JS

```js
(() => {
    "use strict";
    document.body.setAttribute("style", "color: red"), console.log("执行MA"), new Object;
    Math.abc(-1);
    console.log("fn2");
})();
```

上面的结果可以觉得以下几个讯息：

1. `utils` 没用到的 `MB` 函数被删除了，入口文件 `fn1` 函数也被删除了，但是下面这两行代码仍然还在

   ```js
     new Object
     Math.abc(-1)
     console.log("fn2")
   ```
  
2. `import './helper'` 虽然没有显性导出被使用，但是也是内部的方法被消除而已，`document.body.setAttribute("style", "color: red")` 语句还在

关于上面的两点下文会做进一步处理方式

综合以上两点我才会理解 Tree-shaking 是消除没用到的模块，而不是消除没用到的代码

## tree-shaking 实现原理

tree-shaking 的消除原理是依赖于ES6的模块特性。ES6 module 特点：

- 只能作为模块顶层的语句出现

- import 的模块名只能是字符串常量

- import binding 是 immutable的

ES6模块依赖关系是确定的，和运行时的状态无关，可以进行可靠的静态分析，这就是 tree-shaking 的基础

**实现细节**

Webpack 负责对代码进行标记，把 `import & export` 标记为三类：

- 所有 import 标记为 `/* harmony import */`

- 被使用过的 export 标记为 `/* harmony export ([type]) */`，其中 `[type]` 和 Webpack 内部有关，可能是 `binding`、`immutable` 等等。

- 没被使用过的 export 标记为 `/* unused harmony export [FuncName] */`，其中 `[FuncName]` 为 export 的方法名称

通过以下配置可以查看上面的打包的文件效果：

```js
 mode: 'development',
 optimization: {
   usedExports: true,
 },
```

可以发现文件里就会多这些标志的出现

之后就是通过 `TerserPlugin` 对标记了 `unused` 模块进行删除

或者直接通过 `production` 模式打包，查看最终结果

```js
 mode: 'production'
```

**实现原理可以简单的概况：**

- ES6 Module引入进行静态分析，故而编译的时候正确判断到底加载了那些模块

- 静态分析程序流，判断那些模块和变量未被使用或者引用，进而删除对应代码

## 其它注意项

**类的处理**

```js
// index.js
import Utils from './utils';
const utils = new Utils();
const result = util.foo();
console.log(result);
// utils.js
export default class Util {
  foo() {
    return 'foo';
  }
  bar() {
    return 'bar';
  }
}
```

注意到 Webpack 是对 Util 类整体进行标记的（标记为被使用），而不是分别针对两个方法。也因此，最终打包的代码依然会包含 `bar` 方法。这表明 Webpack TreeShaking 只处理顶层内容，例如类和对象内部都不会再被分别处理

**直接在最外层执行的内置方法**

对于上文中没有删除的 `console.log`、 `Math.abs` 方法，Webpack 好像是无法确定这些是否该删除，所以干脆是保留了，那我们该怎么告诉 Webpack 让他放心大胆的删除呢？

```js
  optimization: {
    usedExports: true,
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          output: {
            beautify: true, // 只是为了让输出文件可以换行，实现运行时不应该配制这个
          },
          compress: {
            pure_funcs: ["console.log", "Math.abs"]
          }
        }
      })
    ],
  },
```

打包输出结果如下：

```js
(() => {
    "use strict";
    document.body.setAttribute("style", "color: red"), new Object;
})();
```

**未显性导出使用的模块**

如上文中的 `import './helper'`

如果希望这个文件是可以完全删除的，可以通过在 `package.json` 配置 `sideEffects` 属性来控制，比如设置 `"sideEffects": false`，表示所有代码都不包含副作用, 来告知 webpack，它可以安全地删除未用到的 `export` 文件代码，还可以进行更细致的配置

## 总结

ES Modules 是静态处理的，在编译阶段可以确定模块的依赖关系，对未使用得模块进行标记，之后通过 TerserPlugin 插件这些没用到的模块进行删除 
