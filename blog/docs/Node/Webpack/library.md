# library

平时很少用到 `library` 配置，这个配置的使用场景一般用于开发库的时候

回想一下，当我们引入别人开发的类库时有几种方式？下面假设我们引入一个 `demo` 方法：

**传统方式：script标签**

```js
<script src="demo.js"></script>
<script>demo();</script>
```

这个需要 `demo.js` 中全局定义 `demo` 方法

**commonjs 方式**

```js
const demo = require('demo');
demo();
```

这个需要 `demo.js` 实现 `module.exports = { demo: Function }`

**ES6 module**

```js
import demo from 'demo';

demo();
```

这个需要 `demo.js` 实现 `export.default =  Function`

如果不用 `library` 我们可能需要一一实现上面几种导出方法，所以使用 `library` 就可以自动帮我们处理这些事件

先来一个没用 `library` 的简单的 Demo

```js
// src/index.js
function doDemo(){
  console.log('demo')
}
doDemo()

// webpack.confing.js
module.exports = {
    mode: 'development',
    entry: './src/index.js',
    output: {
        filename: 'demo.js', // 输出文件的文件
        path: path.resolve(process.cwd(), 'dist'),
    },
}
```

```js
'demo'
typeof doDemo // "undefined"

```

打包运行过控制台将输出 `demo`，但是此时模块外并没有 `doDemo` 方法，接下来就是利用 `library` 暴露 `deDemo` 方法

## library使用

使用 `library` 需要与 `libraryTarget` 同时使用

- `library`： 暴露出去的模块名字

- `libraryTarget`: 暴露方式，可选项有：

  - var：作为一个全局变量，那么就可以通过 script 标签来访问，默认值为 `var`
  
  - this：通过 this 对象访问
  
  - window：在浏览器中通过 window 对象访问
  
  - umd：通过 AMD 或 CommonJS require 形式访问
  
修改 `webpack.config.js` 配置

**var**

先试一下 `libraryTarget: var` 的效果

```js
module.exports = {
    mode: 'development',
    entry: './src/index.js',
    output: {
        filename: 'demo.js', // 输出文件的文件
        path: path.resolve(process.cwd(), 'dist'),
        library: 'doDemoLib', // 暴露出去的名字，随便取
        libraryTarget: 'var'
    },
}
```

打包后运行：

```js
demo
typeof doDemoLib // "object"
doDemoLib // {}
```

此时在模块外就多了一个 `doDemoLib` 对象，但是这个对象并没有我们定义的 `deDemo` 方法，因为我们没有将 `deDemo` 导出，继续修改

```js
export function demo(){
  console.log('demo')
}
demo()
```

查看结果：

```js
demo
typeof doDemoLib // "object"
doDemoLib // { doDemo: F}
doDemoLib.doDemo() // demo
```

**this**

```js
// webpack.config.js
    output: {
        filename: 'demo.js', // 输出文件的文件
        path: path.resolve(process.cwd(), 'dist'),
        library: 'doDemoLib', // 暴露出去的名字，随便取
        libraryTarget: 'this'
    }
```

输出结果：

```js
demo
typeof this.doDemoLib // "object"
this.doDemoLib // { doDemo: F}
this.doDemoLib.doDemo() // demo
```

`doDemoLib` 挂载在了 `this` 对象上，在浏览器中相当于 `window` 对象了，所以`libraryTarget: 'window'` 也是同理

**umd**

```js
// webpack.config.js
    output: {
        filename: 'demo.js', // 输出文件的文件
        path: path.resolve(process.cwd(), 'dist'),
        library: 'doDemoLib', // 暴露出去的名字，随便取
        libraryTarget: 'umd'
    }
```

此时打包出来的 `demo.js` 就可以被其它模块以  AMD 或 CommonJS 形式访问

**不仅如此，使用 `umd` 打包后的模块也是可以直接以 `script` 标签引入或者通过 `this` 直接访问的**

[详解webpack的out.libraryTarget属性](https://www.xlaoyu.info/2018/01/05/webpack-output-librarytarget/)

[webpack-创建 library](https://v4.webpack.docschina.org/guides/author-libraries/)