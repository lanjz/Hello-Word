# babel

Babel 是一个通用的多功能 JavaScript 编译器，但与一般编译器不同的是它只是把同种语言的高版本规则转换为低版本规则，而不是输出另一种低级机器可识别的代码，
并且在依赖不同的拓展插件下可用于不同形式的静态分析。（静态分析：指在不需要执行代码的前提下对代码进行分析以及相应处理的一个过程，主要应用于语法检查、编译、代码高亮、代码转换、优化、压缩等等）

注意很重要的一点就是，Babel 只是转译新标准引入的语法，比如:

- 箭头函数

- let/const

- 解构

- 等等新语法

对于新标准引入的全局变量、部分原生对象新增的原型链上的方法，Babel 表示超纲了

- 全局变量

- Promise

- Symbol

- WeakMap

- Set

- includes

- generator 函数

对于上面的这些 API，Babel 是不会转译的，需要引入 polyfill 来解决


## 运行原理

![](https://haitao.nos.netease.com/3de22c36-9220-4ba7-8e1e-b0be28d563fd_1650_594.jpg)


babel工作分为三大阶段：

1. 解析(Parse)：将代码字符串解析为抽象语法树；
  
2. 转换(Transform)：遍历抽象树，对抽象语法树进行再变换；

  babel 接受得到 AST 并通过 `babel-traverse` 对其进行遍历，在此过程中进行添加、更新及移除等操作

3. 生成(Generate)：递使用`babel-generator`模块将 AST 再转换换为 JS 代码

此外需要注意的是，babel 只是转译新标准引入的语法，比如ES6箭头函数：而新标准引入的新的原生对象，
部分原生对象新增的原型方法，新增的 API 等（Proxy、Set 等）, 这些事不会转译的，需要引入对应的 polyfill 来解决

### 解析

解析第一步分为两个步骤: 分词和语法分析

1. 分词:将整个代码字符串分割成 语法单元 数组

  > 语法单元是被解析语法当中具备实际意义的最小单元，通俗点说就是类似于自然语言中的词语
  
   拆分过程就是就是简单粗暴地一个字符一个字符地遍历，然后分情况讨论，整个实现方法就是顺序遍历和大量的条件判断
  
  ```
  if (1 > 0) {
    alert("if \"1 > 0\"");
  }
  ```
  
  我们希望得到的分词是：
  
  ```
  'if'     ' '       '('    '1'      ' '    '>'    ' '    ')'    ' '    '{'
  '\n  '   'alert'   '('    '"if \"1 > 0\""'    ')'    ';'    '\n'   '}'
  ```


2. 语义分析:在分词结果的基础之上分析 语法单元之间的关系

  语义分析就是把词汇进行立体的组合，确定词语最终是什么意思、多个词语之间有什么关系以及又应该再哪里断句等

  简单来说语法分析是对语句和表达式识别，这是个递归过程，在解析中，Babel  会在解析每个语句和表达式的过程中设置一个暂存器，
  用来暂存当前读取到的语法单元，如果解析失败，就会返回之前的暂存点，再按照另一种方式进行解析，如果解析成功，则将暂存点销毁，不断重复以上操作，直到最后生成对应的语法树
  
  我的另一种理解是：在解析每个语句和表达式的过程中设置一个暂存器，用来暂存当前读取到的语法单元，如果读取到的语法单元能与暂存的最后一个语法单元匹配成完整的语法，那么就将当前
  的语法单元从栈中推出
  
### 转换（Transformation）

插件应用于 babel 的转译过程，尤其是第二个阶段 `Transformation`，如果这个阶段不使用任何插件，那么 babel 会原样输出代码

Babel 官方帮我们做了一些预设的插件集，称之为 Preset，这样我们只需要使用对应的 Preset 就可以了。每年每个 Preset 只编译当年批准的内容。而 `babel-preset-env` 相当于 ES2015 ，ES2016 ，ES2017 及最新版本

如果 Plugin 是通过 npm 安装，可以传入 Plugin 名字给 Babel，Babel 将检查它是否安装在 node_modules 中

```
"plugins": ["babel-plugin-myPlugin"]
```
也可以指定你的 Plugin/Preset 的相对或绝对路径
```
"plugins": ["./node_modules/asdf/plugin"]
```

**Plugin/Preset 转译顺序**

如果两次转译都访问相同的节点，则转译将按照 Plugin 或 Preset 的规则进行排序然后执行

- Plugin 会运行在 Preset 之前

- Plugin 会从第一个开始顺序执行

- Preset 的顺序则刚好相反(从最后一个逆序执行)

例如

```
{
  "plugins": [
    "transform-decorators-legacy",
    "transform-class-properties"
  ]
}
```

将先执行 `transform-decorators-legacy` 再执行 `transform-class-properties`

但 preset 是反射的

```
{
  "presets": [
    "es2015",
    "react",
    "stage-2"
  ]
}
```

会按以下顺序运行:  `stage-2`， `react`， 最后 `es2015`

那么问题来了，如果 `presets` 和 `plugins` 同时存在，那执行顺序又是怎样的呢？

```
// .babelrc 文件
{
  "presets": [
    [
      "@babel/preset-env"
    ]
  ],
  "plugins": [
    ["@babel/plugin-proposal-decorators", { "legacy": true }],
    ["@babel/plugin-proposal-class-properties", { "loose": true }],
    "@babel/plugin-transform-runtime",
  ]
}
```

答案是先执行 `plugins` 的配置，再执行 `presets` 的配置

所以上面代码的执行顺序为

1. @babel/plugin-proposal-decorators

2. @babel/plugin-proposal-class-properties

3. @babel/plugin-transform-runtime

4. @babel/preset-env

###　生成（Code Generation）

用 `babel-generator` 通过 AST 树生成 ES5 代码。

# Babel 主要模块

- `@babel/core`： Babel 的编译器，核心 API 都在这里面，比如常见的 transform、parse

- `@babel/cli`：cli 是命令行工具,  安装了 @babel/cli 就能够在命令行中使用 babel  命令来编译文件。当然我们一般不会用到，打包工具已经帮我们做好了

- `@babel/node`：直接在 node 环境中，运行 ES6 的代码。

- `babylon`：Babel 的JS词法解析器

- `babel-traverse`：用于对 AST 的遍历，维护了整棵树的状态，并且负责替换、移除和添加节点，要给plugin用

- `babel-types`：用于 AST 节点的 Lodash 式工具库, 它包含了构造、验证以及变换 AST 节点的方法，对编写处理 AST 逻辑非常有用

- `babel-generator`：Babel 的代码生成器，它读取 AST 并将其转换为代码和源码映射（sourcemaps）

- `babel-runtime`: 功能类似babel-polyfill，一般用于library或plugin中，因为它不会污染全局作用域

**怎么写一个Babel插件见引用文章**


> [Babel 的工作原理以及怎么写一个 Babel 插件](https://cloud.tencent.com/developer/article/1520124)

# Polyfill

polyfill是一个针对ES2015+环境的shim，实现上来说babel-polyfill包只是简单的把core-js和regenerator runtime包装了下，这两个包才是真正的实现代码所在（后文会详细介绍core-js）。
使用babel-polyfill会把ES2015+环境整体引入到你的代码环境中，让你的代码可以直接使用新标准所引入的新原生对象，新API等，一般来说单独的应用和页面都可以这样使用


## 使用方法

1. 先安装包： `npm install --save babel-polyfill`

2. 确保在入口处导入 polyfill，因为 polyfill 代码需要在所有其他代码前先被调用

  - 代码方式： `import "babel-polyfill"`
  
  - webpack配置： `module.exports = { entry: ["babel-polyfill", "./app/js"] }`

# runtime


直接使用babel-polyfill对于应用或页面等环境在你控制之中的情况来说，并没有什么问题。但是对于在library中使用polyfill，就变得不可行了。
因为library是供外部使用的，但外部的环境并不在library的可控范围，而polyfill是会污染原来的全局环境的（因为新的原生对象、API这些都直接由polyfill引入到全局环境）。
这样就很容易会发生冲突，所以这个时候，babel-runtime就可以派上用场了。


## transform-runtime和babel-runtime

`babel-plugin-transform-runtime`插件依赖`babel-runtime`，`babel-runtime`是真正提供`runtime`环境的包；
也就是说`transform-runtime`插件是把js代码中使用到的新原生对象和静态方法转换成对runtime实现包的引用，举个例子如下：

```
// 输入的ES6代码
var sym = Symbol();
// 通过transform-runtime转换后的ES5+runtime代码 
var _symbol = require("babel-runtime/core-js/symbol");
var sym = (0, _symbol.default)();
```

从上面代码可以看到，当我们要使用`Symbol`时，这个方法是从`babel-runtime/core-js/symbol`导出的，这样既有了 Symbol 的功能，同时又没有像polyfill那样污染全局环境

另外，这里我们也可以隐约发现，babel-runtime其实也不是真正的实现代码所在，真正的代码实现是在core-js中，后面我们再说

总结来说`babel-plugin-transform-runtime`插件的功能有以下几点：

- 当代码中有使用到的ES6引入的新原生对象和静态方法时，这些方法使用`babel-runtime/core-js`对应的方法替代

- 当使用`generators`或`async`函数时，用`babel-runtime/regenerator`导出的函数取代

- 把Babel生成的辅助函数改为用`babel-runtime/helpers`导出的函数来替代（babel默认会在每个文件顶部放置所需要的辅助函数，如果文件多的话，这些辅助函数就在每个文件中都重复了，
  通过引用`babel-runtime/helpers`就可以统一起来，减少代码体积）
  
建议不要直接使用`babel-runtime`，因为`transform-runtime`依赖`babel-runtime`，大部分情况下都可以用`transform-runtime`达成目的

`transform-runtime`在 `.babelrc`里配置的时候，还可以设置`helpers`、`polyfill`、`regenerator`这三个开关，以自行决定`runtime`是否要引入对应的功能

**由于runtime不会污染全局空间，所以实例方法是无法工作的（因为这必须在原型链上添加这个方法，这是和polyfill最大的不同）**

```
var arr = ['a', 'b', 'c'];
arr.fill(7);  // 实例方法不行
Array.prototype.fill.apply(arr, 7);  // 用原型链来调用也是不行
```

# 通过core-js实现按需引入polyfill或runtime

但是`polyfill`和`runtime`都是整体引入的，不能做细粒度的调整，如果我们的代码只是用到了小部分ES6而导致需要使用`polyfill`和`runtim`e的话，会造成代码体积不必要的增大（`runtime`的影响较小）。
所以，按需引入的需求就自然而然产生了，这个时候就得依靠`core-js`来实现了

core-js有三种使用方式

- 默认方式：`require('core-js')`

  这种方式包括全部特性，标准的和非标准的
  
- 库的形式: `var core = require('core-js/library')`

  这种方式也包括全部特性，只是它不会污染全局名字空间
  
- 只是`shim`： `require('core-js/shim')`或`var shim = require('core-js/library/shim')`

  这种方式只包括标准特性（就是只有polyfill功能，没有扩展的特性）

## core-js的按需使用

1. 类似`polyfill`，直接把特性添加到全局环境，这种方式体验最完整

  ```
  require('core-js/fn/set');
  require('core-js/fn/array/from');
  require('core-js/fn/array/find-index');
  
  Array.from(new Set([1, 2, 3, 2, 1])); // => [1, 2, 3]
  [1, 2, NaN, 3, 4].findIndex(isNaN);   // => 2
  ```

2. 类似`runtime`一样，以库的形式来使用特性，这种方式不会污染全局名字空间，但是不能使用实例方法

  ```
  var Set       = require('core-js/library/fn/set');
  var from      = require('core-js/library/fn/array/from');
  var findIndex = require('core-js/library/fn/array/find-index');
  
  from(new Set([1, 2, 3, 2, 1]));      // => [1, 2, 3]
  findIndex([1, 2, NaN, 3, 4], isNaN); // => 2
  ```

3. 因为第二种库的形式不能使用prototype方法，所以第三种方式使用了一个小技巧，通过::这个符号而不是.来调用实例方式，从而达到曲线救国的目的。这种方式的使用，路径中都会带有`/virtual/ `

  ```
  import {fill, findIndex} from 'core-js/library/fn/array/virtual';
  
  Array(10)::fill(0).map((a, b) => b * b)::findIndex(it => it && !(it % 8)); // => 4
  
  // 对比下polyfill的实现 
  // Array(10).fill(0).map((a, b) => b * b).findIndex(it => it && !(it % 8));
  ```
