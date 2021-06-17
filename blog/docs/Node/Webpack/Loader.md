# Loader

**Loader 本质就是一个函数，在该函数中对接收到的内容进行转换，返回转换后的结果。** 因为 Webpack 只认识 JavaScript，所以 Loader 就成了翻译官，
对其他类型的资源进行转译的预处理工作。

Loader 在 `module.rules` 中配置，作为模块的解析规则，类型为数组。每一项都是一个 `Object`，
内部包含了 `test`(类型文件)、`loader`、`options` (参数)等属性。

以处理SCSS文件为例：

```js
 module.export = {
    module: {
      rules: [
        {
          // 增加对SCSS文件的支持
          test: /\.scss/,
          // SCSS文件的处理顺序为先sass-loader，再css-loader，再style-loader
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                minimize: true
              },
            },
            'sass-loader'
          ],

        }
      ]
    }
  }
```

- 先将 SCSS 源码交给 sass-loader 处理，转换成 CSS

- sass-loader 再将转换的 css 结果再交给 css-loader 处理

- css-loader输出的 css 再提交给 style-loader 处理，转换成通过脚本加载的 JavaScript 代码

从上面粟子可以看出配置多个 loader 执行顺序是倒序的

## Loader工作方式

Webpack是运行在Node.js上的，所以一个Loader其实就是一个Node模块，这个模块需要导出一个函数，这个导出的函数的工作就是获得处理前的内容，
对原内容执行处理后，返回处理后的内容。

一个Loader的职责是单一的，只需要完成一次转换。如果一个源文件需要经历多步转换那么就通过多个Loader去转换。

一个最简单的Loader的源码如下：

```js
  module.exports = function (source) {
    // source为compiler传递给Loader的一个文件的原内容
    // 该函数需要返回处理后的内容，这里为了简单起见，直接将原内容返回了，相当于该Loader没有做任何转换
    return source 
  }
```

由于Loader是运行在Node.js上的，所以可以调用任意的Node.js自带的API

## Loader进阶

### 获得Loader的options

在最上面处理SCSS文件的Webpack配置中，将options参数传递给了css-loader，以控制css-loader。如何在自己编写的Loader中获取用户传入的options呢？需要这样做：

```js
 const loaderUtils = require('loader-utils')
  module.exports = function (source) {
    // source为compiler传递给Loader的一个文件的原内容
    // 该函数需要返回处理后的内容，这里为了简单起见，直接将原内容返回了，相当于该Loader没有做任何转换
    const options = loaderUtils.getOptions(this)
    return source
  }
```

### 返回其它结果 

上面的Loader都只是返回了原内容转换的内容，但是某些场景下还需要返回除了内容之后的东西。

以用label-loader转换ES6代码为例，它还需要输出转换后的ES5代码对应的Source Map，以方便调试源码。为了将Source Map也一起随着ES5代码返回给Webpack，还可以这样写：

```js
const loaderUtils = require('loader-utils')
  module.exports = function (source) {
    // 通过this.callback告诉Webpack返回的结果 
    this.callback(null, source, sourceMaps)
    // 当我们使用this.callback返回内容时，该Loader必须返回undefined,
    // 当让Webpack知道该Loader返回的结果 在this.callback中，而不是return中
    return
  }
```

其中的`this.csllback`是Webpack向Loader注入的API，以方便Loader和Webpack之间通信。`this.callback`的详细使用方法如下：

```js
 this.callback(
    // 当无法转换原内容时，为Webpack返回一个Error
    err: Error | null,
    // 原内容转换后的内容
    content: string | Buffer,
    // 用于通过转换后的内容得出原内容的Source Map，以方便调试
    sourceMap?: SourceMap,
    // 如果本次转换为原内容生成了AST语法树，则可以将这个AST返回，
    // 以方便之后需要AST的Loader利用该AST，避免重复生成AST，提升性能
    abstractSyntaxTree?: AST
  )
```

Source Map的生成很耗时，通常在开发环境下才会生成Source Map，在其它环境下不用生成，以加快构建。因此，Webpack为Loader提供了`this.sourceMap`API去告诉Loader在当前构建环境下用户是否需要Source Map

### 同步与异步

Loader也有同步与异步之分，上面介绍的Loader都是同步的Loader，因为它们的转换流程都是同步的，转换完后再返回结果 。但在某些场景下转换的步骤只能是迅步完成的，例如我们需要通过网络请求才能得出结果，如果采用同样的方式，则网络请求会阻塞整个构建 ，导致构建非常缓慢。

如果是异步转换，则我们可以这样做：

```js
  module.exoprts = function (source) {
    var callback = this.async()
    someAsyncOperation(source, function (err, result, sourceMaps, ast) {
      // 通过callback返回异步执行的结果 
      callback(err, result, sourceMaps, ast)
      
    })
  }
```

### 缓存加速

在某些情况下，有些转换操作需要大量的计算，非常耗时，如果每次构建都重新执行重复的转换操作，则构建操作会变得非常缓慢。为此，Webpack会默认缓存所有Loader的处理结果，也就是需要被处理的文件或者其依赖的文件没有发生变化时，是不会重新调用对应的Loader去执行转换操作的。

如果我们不想让Webpack缓存该Loader的处理结果，则可以这样：

```js
 module.exoprts = function (source) {
   // 关闭该Loader的缓存功能
    this.cacheable(false)
    return source
  }
  module.exports.raw = true
```

### 其他Loader API

除了以上提到的在Loader中能调用的Webpack API，还存在以下常用的API。

- this.context：当前处理的文件所在目录，假如当前Loader处理的文件`/src/main.js`，则`this.context`等于`/src`

- this.resource：当前处理的文件的完整请求路径，包括querystring，例如`/src/main.js?name=1`

- this.resourcePath：当前处理的文件的路径，例如`/src/main.js`

- this.resourcePath：当前处理的文件的querystring

- this.target：等于Webpack配置中的Target

- this.loadModule：当Loader在处理一个文件时，如果依赖其他文件的处理结果才能得到当前文件的结果，就可以通过`this.loadModule(request: string, callback:function(err,source, sourceMap, module))`去获取require对应的文件的处理结果 

- this.resolve：像require语句一样获得指定文件的完整路径，使用方法为`resolve(context:string, request:string,callback:function(err, result:string))`

- this.addDependency：为当前处理的文件添加其依赖的文件，以便其依赖的文件发生变化 时，重新调用Loader处理该文件。使用方法为`addDependency(file: string)`

- this.addContextDependency：和addDependency类似，但addContextDependency是将整个目录加入当前正在处理的文件的依赖中。使用方法为`addContextDependency(directory: string)`

- this.clearDependencies：清除当前正在处理文件的所有依赖，使用方法为`clearDepentdencies()`

- this.emitFile：输出一个文件，使用方法为`emitFile(name: string, content: Buffer|string, sourceMap:{})`

## loader执行顺序

正常情况下 loader 的执行顺序是倒序的

但可以通过enforce属性去改变执行顺序：

- `enforce:'pre'` 前置 权重最高

- `enforce:'normal'` 不变 权重第二

- `enforce:'inline'` 行内 权重第三

- `enforce:'post'` 后置 权重第四

## 加载本地Loader

正常在 Webpack 使用的 Loader 都是从 `node_modules` 文件中查找，如果直接使用本地的Loader呢？

### npm link

npm link专门用于开发和调试本地的 npm 模块，能做到在不发布模块的情况下，将本地的一个正在开发的模块的源码链接到项目的 `node_modules` 目录下，让项目可以直接使用本地的 npm 模块。由于是通过软链接的方式实现的，编辑了本地的 npm 模块的代码，所以在项目中也能使用到编辑后的代码。

完成 npm link 的步骤如下：

- 确保在开发的 npm 模块（也就是正在开发的Loader）的 package.json 已经正确配置好

- 在本地的 npm 模块根目录执行 `npm link`，将本地模块注册到全局

- 在项目根目录下执行 `npm link loader-name` 将第2步注册到全局的本地 npm 模块链到项目的 `node_modules` 下，其中的 `loader-name` 是指第一步的 package.json 文件中配置的模块名称

之后我们就可以像使用一个真正的 npm 模块一样使用本地的 Loader 了

### resolveLoader

`resolveLoader` 用于告诉 Webpack 如何寻找 Loader，默认情况下只会在 `node_modules` 目录下寻找。可以通 `resolveLoader` 告诉 Webpack 额外的查找的目录

假设本地项目中的 Loader 目录位置为 `./laoder/loader-name.js` 下，则需要如下配置：

```js
 module.exports = {
    resolveLoader: {
      // 去哪些目录下寻找Loader，有先后顺序之分
      modules: ['node_modules', path.resolve(__dirname, 'loader')]
    }
  }
// 或通过别名来指定一个loader 的使用位置
 module.exports = {
   resolveLoader: {
       alias: {
           'loader-name': path.resolve(__dirname, 'loader/loader-name.js'),
       }
   },
  }
```

## 实战

### 粟子一

编写一个 Loader 将`./css/app.less` 里的 `rpx` 单位转换为 `px`

**编写Loader**

```js
// loader/rpxTpx.js
module.exports = function (content) {
  return content.replace(/rpx/g, 'px')
}
```

**Webpack 添加 Loader**

```js
module.exports = {
    resolveLoader: {
        alias: {
            'rpxTpx-loader': path.resolve(__dirname, 'loader/rpxTpx.js'), // 配置 Loader 位置
        }
    },
    module: {
        rules: [
            {
                test: /\.(css|less)$/,
                use: [
                    {
                        loader: "style-loader",
                    },
                    {
                        loader: "css-loader",
                    },
                    {
                        loader: "less-loader",
                        options: {
                            lessOptions: {
                                strictMath: true,
                            },
                        },
                    }
                ],
            },
            {
                test: /\.(css|less)$/,
                use: [
                    {
                        loader: "rpxTpx-loader",
                    },
                ],
                include: path.resolve(__dirname, 'css')
            },
        ],
    },
}

```

注意上面配置了两处对 `css|less` 文件的处理，我们自定义 `rpxTpx-loader` 放在下面优先执行

### 粟子二

编写一个 comment-require-loader 的 Loader ，作用是该注释语法：

`// @reuiqre '../style/index.css'` 转换成： `require('../style/index.css')`

该Loader的使用场景是针对 Fis3 编写的 JavaScript，这些 JavaScript 中通过注释的方式依赖的CSS文件

该Loader的使用方式如下：

```js
module.exports = {
    module: {
      loaders: [
        {
          test: /\.js$/,
          loaders: ['common-require-loader'],
          include: [path.resolve(__dirname, 'node_modules/imui')]
        }
      ]
    }
  }
```

该Loader的实现代码：

```js
  function replace(source) {
    return source.replace(/(\/\/ *@require) + (('|").+('|")).*/, 'require($2);')
  }
  module.exports = function (content) {
    return replace(content)
  }
```






