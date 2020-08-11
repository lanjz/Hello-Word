# Node 模块

JavaScript 模块加载类型

- CommonJS: 显著的特点就是模块是加载是同步的，就目前来说，受限于宽带速度，并不适用于浏览器中的 JavaScript，NodeJS 用的就是这种

- AMD: "异步模块定义"，它采用异步方式加载模块，模块的加载不影响它后面语句的运行。依赖这个模块的代码定义在一个回调函数中，
等到加载完成之后，这个回调函数才会运行。RequestJS 就是 AMD规范的一种实现

## CommonJS

### 重复引入

在 Node 中无须关心这个问题，因为 Node 默认先从缓存中加载模块，一个模块被第一次加载后，就会在缓存中维持一个副本，如果遇到重复加载的模块，则会从缓存中获取

**为什么Node中，`request()`加载模块是同步而非异步？**

么有标准答案

- Node 会自动缓存加载过的模块，而且本地IO开销几乎可以忽略

- Node 程序运行在服务端，很少频繁的重启，同步加模块也花不了多少时间

### require缓存策略

Node 会缓存经过 `require` 引入的文件，这种缓存是基于文件路径定位的，这表示即使两个相同的文件，但它们位于不同的路径下，也会缓存维持两份

### require的隐患

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

### 模块化和作用域

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