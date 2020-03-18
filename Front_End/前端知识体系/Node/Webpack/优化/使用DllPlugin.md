## 认识Dll

在window系统中经常看以`.dll`为后缀的文件，这些文件叫作动态链接库，在一个动态链接库中可以包含为其他模块调用的函数的数据

要web中引用动态链接库的思想，需要完成以下事情

- 将网页依赖的基础模块抽离出来，打到一个个单独的动态链接库中。在一个动态链接库可以包含多个模块

- 将需要导入的模块存在于动态链接库时，不需要重新打包，而是从动态链接库直接导入

- 页面依赖的所有动态链接库都需要被加载

大量的可以利用的模块不需要编译，而是直接使用动态链接库中的代码，所以大大提升了构建速度。如`react`、`react-dom`，所以只要不升级这些模块的版本，动态链接库就不用重新编译。

## webpack中使用dll

- DllPlugin插件：用于打包一个个单独的动态链接库文件。

- DllReferencePlugin插件：用于在主要的配置文件中引入DllPlugin插件打包好的动态链接库文件

以React项目为例，为其接入DllPlugin。最终构建出的目录结构：

|-- main.js
|-- polyfill.dll.js
|-- polyfill.mainfest.json
|-- react.dll.js
|-- react.mainifest.json

其中包含两个动态链接库文件

- polyfill.dll.js ：里面包含项目所有依赖的polyfill,例如Promise、fetch等Api

- react.dll.js：里面包含React的基础运行环境，即react和react-dom模块

以react.dll.js文件为例，其文件内容大致如下：

```
var _dll_react = (function (modules){
  // ......
})(
  function(module, exports, __webpack_require__){
    // ID为0的模块对应的代码
  }，
  function(module, exports, __webpack_require__){
    // ID为1的模块对应的代码
  }
  // .....
])
```

可见，一个动态链接库包含了大量模块的代码，这些模块被存放在一个数组里，用数组的索引号作为ID，并且通过__dll_react_ 变量将自己暴露在全局中，即可以通过window.__dll_react访问到其中包含的模块。

其中`polyfill.mainifest.json`和`react.mainfest.json`文件也是由DllPlugin生成的，用于描述在动态链接库文件中包含哪些模块

`main.js`文件是被编译出来的执行入口文件，在遇到其依赖的模块在`dll.js`文件中时，会直接通过`dll.js`文件暴露的全局变量获取打包在`dll.js`文件中的模块，所以在`index.html`文件中需要将依赖的两个dll.js文件加载进去。
此时`index.html`内容如下：

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<body>
<div id="app"></div>

</body>
<!--导入依赖的动态链接库-->
<sciprt src="./dist/polyfill.dll.js"></sciprt>
<sciprt src="./dist/react.dll.js"></sciprt>
<!--导入执行的入口文件-->
<sciprt src="./dist/main.js"></sciprt>
</html>

```

### webapck配置dll

上文构建输出的的文件

|-- polyfill.dll.js
|-- polyfill.mainfest.json
|-- react.dll.js
|-- react.mainifest.json

和|-- main.js

是由两不同的构建输出的

动态链接库文件相关的文件需要由一份独立的构建输出，用于主构建使用。新建一个Webpack配置文件`webpack_dll.config.js`专门构建他们。

```
  const path = require('path')
  const DllPlugin = require('webpack/lib/DllPlugin')
  modules.exports = {
    // JavaScript执行文件
    entry: {
      // 将React相关的模块放到一个单独的动态链接库中
      react:['react', 'react-dom'],
      // 将项目需要所有的polyfill放到一个单独的动态链接库中
      polyfill:['core-js/fn/object/assign', 'core-js/fn/promise', 'whatwg-fetch'],
    },
    output: {
      // 输出的动态链接库的文件名称，[name]代表当前动态链接库的名称
      filename: '[name].dll.js',
      // 将输出的文件都放到dist目录下
      path: path.resolve(__dirname, 'dist'),
      // 设置动态链接库全局变量名，对于react就是_dll_react
      // 加上前缀_dll是为了防止与其它全局变量冲突
      library: '_dill_[name]'
    },
    plugins:[
      // 接入DllPlugin
      new DllPlugin({
        // 动态链接库的全局变量名称，需要和output.library中的保持一致
        // 该字段的值也就是输出mainfest.json文件中name字段的值
        // 例如在react_mainfest.jon中就有"name"："_dii_react"
        name: '_dll_[name]',
        // 描述动态链接库的mainfest.json文件输出时的文件名称
        path: path.join(__dirname,'dist', '[name].mainfest.json')
      })
    ]
  }

```

## 使用动态链接库文件

构建出的动态链接库文件用于其他地方使用，在这里用在执行入口使用。

用于输出main.js的主Weapack配置文件的内容如下：

```
  const path = rquire('path')
  const DllReferencePlugin = require('webpack/lib/DllReferencePlugin.js')
  module.exports = {
    entry: {
      // 定义入口Chunk
      main: './main.js'
    },
    output:{
      // 输出文件的名称
      filename: '[name].js',
      path: path.resolve(__dirname, 'dist'),
    },
    module: {
      rules: [
        {
          // 项目源码使用了ES6和JSX语法，需要使用babel-loader转换
          test: /\.js$/,
          use: ['babel-loader'],
          exclude: path.resolve(__dirname, 'node_modules')
        }
      ]
    },
    plugins: [
      // 告诉 Webpack使用了哪些链接库
      new DllReferencePlugin({
        // 描述react动态链接库的文件内容
        mainfest: require('./dist/react.mainfest.json')
      }),
      // 告诉 Webpack使用了哪些链接库
      new DllReferencePlugin({
        // 描述polyfill动态链接库的文件内容
        mainfest: require('./dist/polyfill.mainfest.json')
      })
    ],
    devtool: 'source-map'
  }
```

注意：

在`webapck_dll.config.js`文件中，DllPlugin中的`name`参数必须和`output.library`中的保持一致。原因在于DllPlugin中的name参数会影响输出`mainfest.json`文件中的name字段的值。而在`webapck.config.js`文件中，DllReferencePlugin会去`mainfest.json`文件中读取name字段的值，将值的内容作为在全局变量中获取动态链接库的内容时的全局变量名

## 执行构建

执行构建需要注意的是，需要先将动态链接库相关的文件编译出来，因为主Webpack配置文件定义的DllReferencePlugin依赖这些文件。

执行构建的流程如下

- 如果动态链接还没编译出来，需要选将它们编译出来。执行命令行

`webapck --config webpack_dll.config.js`

- 在确保动态链接库存在时，才能正常编译入口的文件
