通常我们需要将采用ES6编写的代码转换成目前已经支持良好的ES5代码，包含如下两件事：

- 将新的ES6语法转用ES5实现，例如ES6的class语法用ES5的`prototype`实现

- 为新的API注入polyfill，例如使用新的`fetch`API时在注入对应的 polyfill后才能让低端浏览器正常运行

## Babel

在Babel执行编译的过程中，会从项目根目录下的`.babelrc`文件中读取配置。`.babelrc` 是一个JSON文件，内容大致如下：

```
{
  "plugins": [
    [
      "transform-runtime",
      {
        "polyfill": false
      }
    ],
  ],
  "presets": [
    [
      "es2015",
      {
        "modules":false
      }
    ],
    "stage-2",
    "react"
  ]
}

```

上面配置项中主要配置的`pluigns`和`presets`

### plugins

plugins属性告诉Babel要使用哪些插件，这些插件可以控制如何转换代码。

以上配置里的`transform-runtime`对应的插件全名叫作`babel-plugin-transform-runtime`，即在前面加上了`babel-plugin-`。要让Babel正常运行，我们必须安装这个插件：

`npm i -D babel-plugin-transform-runtime`

`babel-plugin-transform-runtime`是官方提供的一个插件，作用是减少冗余的代码。Babel在将ES6代码转换成ES5代码时，通常需要一些ES6编写的辅助函数来完成新语法的实现，例如在转换`class extent`语法时会在转换后的ES5代码里没注入`_extent`辅助函数用于实现继承：

```
  function _extent(target) {
    for(var i = 1; i<arguments.length; i++) {
      var source = arguments[i]
      for(var key in source) {
        if(Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key]
        }
      }
    }
   return target
  }
```

这会导致每个使用`class extent`语法的文件都被注入重复的`_extent`辅助函数，`babel-plugin-transform-runtime`的作用在于将原来注入JavaScript文件里的辅助函数换成一条导入语句：

`var _extent = require('babel-runtime/helper/_extent')`

这样就能减小Babel编译出来的代码的文件大小

同时需要注意到的是，由于`babel-plugin-transform-runtime`注入了`vrequire('babel-runtime/helper/_extent')`语句到编译后的代码中，需要安装babel-runtime依赖到我们的项目后，代码才能正常运行。也就是说`babel-plugin-transform-runtime`和`babel-runtime`需要配套使用，在使用`babel-plugin-transform-runtime`后一定需要使用`babel-runtime`

### Presets

`presets`属性告诉Bable要转换的源码使用了哪些新的语法特性，一个Presets对一组新语法的特性提供了支持，多个Presets可以叠加。Presets其实就是一组Plugins集合，每个Plugin完成一个新语法的转换工作。Presets是按照ECMAScript草案来组织的，通常可以分为以下三大类。

1. 已经被写入ECMAScript标准里的特性，由于之前每年都有新特性被加入到标准里，所以又细分如下。

- ES2015：包含在2015年加入的新特性

- ES2016：包含在2016年加入的新特性

- ES2017：包含在2017年加入的新特性

- Env：包含当前所有EAMAScript标准里的最新特性

2. 被社区提出来的但还未写入ECMAScript标准里的特性，这其中又分为以下四种。

- stage0：只是一个美好激进的想法，一些Babel插件实现了对这些特性的支持，但是不确定是否会被定为标准

- stage1：值得被纳入标准的特性

- statge2：该特性规范已经被起草，将会纳入标准进而

- state3：该特性规范已经定稿，各大浏览器厂商和Node.js社区已开始着手实现

- state4：在接下的一年里将会加入标准中

3. 用于支持一些特定应用场景下的语法的特性，和ECMAScript标准没有关系，例如`babel-preset-react`用于支持React开发里的JSX语法

## 接入Babel

Weback使用babel的配置：

```
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['babel-loader']
      }
    ]
  },
  devtool: 'source-map'
}
```

以上配置需安装以下模块

Webpack接入Babel必须依赖的模块：

`npm i -D babel-core babel-loader`

根据我们的需求选择不同的Plugins或Presets

`npm i -D babel-preset-env`
