# 模块机制

JavaScript 模块加载类型

- CommonJS: 显著的特点就是模块是加载是同步的，就目前来说，受限于宽带速度，并不适用于浏览器中的 JavaScript，NodeJS 用的就是这种

- AMD: "异步模块定义"，它采用异步方式加载模块，模块的加载不影响它后面语句的运行。依赖这个模块的代码定义在一个回调函数中，
等到加载完成之后，这个回调函数才会运行。RequestJS 就是 AMD规范的一种实现

Node 模块管理是使用的 CommonJS 规范

## 模块引入

在 Node 引入模块时，需要经过三个步骤：

1. 解析路径

2. 文件定位

3. 编译执行



:::tip
1. node 对引入过的模块都会缓存处理，下次再引用相同模块将会从缓存中直接获取，这种缓存是基于文件路径定位的，这表示即使两个相同的文件，但它们位于不同的路径下，也会缓存维持两份
2. 要注意的是 node 缓存的不是文件路径而是模块编译和执行后的结果
::: 

### 解析路径

node 根据模块类型的不同将使用不同的解析方法，模块类型大致分为三种：内置模块、自己定义模块、第三方模块

**内置模块**

内置模块如 `http`、`path` 等模块在 Node 源代码编译已经被编译成了二进制代码，所以其加载速度最后

**自定义模块**

自定义模块就是项目中自己编写的模块，加载这类模块往往需要我们在模块名添加相对路径或绝对路径

```js
const utils = require('./utils/index.js')
```

**第三方模块**

一般是指我们使用 `npm/yarn` 下载到的模块，这类模块会被下载到 `node_modeuls` 目录，项目中加载这类的模块时也不需要我们添加具体路径，因为 node 默认会从当前文件所在路径开始不断寻找 `node_modeuls` 文件夹，再从 `node_modeuls` 文件夹找对应的模块

### 文件定位

经过路径解析就可以找到对应的模块文件了，但是回想一下平时引入的模块的时候有两个细节：

1. 不需要指时具体的文件扩展名

   这是因为 Node 会按 `.js`，`.json`, `.node` 的次序补充扩展名，依次尝试

2. 即使我们引用的模块名刚好只到目录名的程度， Node 也可以正确找到可执行的模块文件

   这是因为当 Node 找到与模块名相同的目录时，会在当前目录下查找 `package.json` 文件，然后通过 `JSON.parse()` 解析描述对象，再从中取出 `main` 字段，根据 `main` 字段来定位最终的文件名
   
   如果缺少 `main` 字段，或者 `main` 指定的文件名错误又或者没有 `package.json` 文件，那么 Node 会将 `index` 当做默认的文件名，也就是会尝试依次查找 `index.js`、`index.json`、`index.node`

:::tip
虽然 Node 会默认补充扩展名，但是 Node 在尝试加载的过程中都需要调用 `fs` 模块同步阻塞式得判断文件是否存在，所以在加载非 `.js` 的模块时，最好还是加上具体的扩展名，可以提高一点加载速度
:::

### 模块编译

看下面模块代码：

```js
const path = require('path');
exports.getP = function (){
	return path.join(__dirname)
}
```

在编写 Node 模块时，我们可以使用 `requre`、`exports`、`__dirname`、`__filename` 等方法和变量，这么方法和变量是从哪来的？

事实上在编译的过程中，Node 对模块代码进行包装，例子上面的例子将转变成以下代码：

```js
(function (exports, reuiqre, module, __filename, __dirname){
  const path = require('path');
  exports.getP = function (){
  	return path.join(__dirname)
  }
})(exports, reuiqre, module, __filename, __dirname)
```

通过这样方式传递了内置的方法和变量，同时实现了模块之间的相互隔离



## require的隐患

当`require`加载一个模块时，模块内部的代码都会被调用，有时候这可能会带来隐藏的 `bug`

```js
function test(){
    setInterval(function(){
        console.log("test")
    }, 1000)
}
test()
module.exoprts = test
```

当 `require` 这个文件的时候，模块内的定时器将被运行

## 模块化和作用域

模块中的 `this` 指向 `module.exports`

```js
var a = 10
console.log(this.a) // undefined
console.log(global.a) //undefined
```

```js
a = 10
console.log(global.a) // 10
```

```js
this.a = 10
console.log(module.exports) // { a: 10 }
```

## 思考

**为什么Node中，`request()`加载模块是同步而非异步？**

么有标准答案

- Node 会自动缓存加载过的模块，而且本地IO开销几乎可以忽略

- Node 程序运行在服务端，很少频繁的重启，同步加模块也花不了多少时间

