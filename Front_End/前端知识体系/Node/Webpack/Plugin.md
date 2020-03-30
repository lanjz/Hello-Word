# 自定义插件

简单的DEMO

```
class BasicPlugin{
  // 在构造函数中获取用户给该插件传入的配置
  constructor(options){
  }

  // Webpack 会调用 BasicPlugin 实例的 apply 方法给插件实例传入 compiler 对象
  apply(compiler){
    compiler.plugin('compilation',function(compilation) {
    })
  }
}

// 导出 Plugin
module.exports = BasicPlugin;
```

1. 在 webpack 启动后，它会去执行我们配置的 `new BasicPlugin(options)` 初始化一个插件实例

2. 在初始化 `compiler` 对象之后，会调用 `basicPlugin .apply(compiler)` 方法将 `compiler` 传入

3. 插件获得 `compiler` 对象后，就可以通过 `compiler.plugin('事件名', 回调函数)` 的方式进行监听 webpack 广播出来的事件了


```
class HelloWorldPlugin {
  constructor (options) {
    console.log(options)
  }
  apply (compiler) {
    console.log(`Hello World`)
    // compilation（'编译器'对'编译ing'这个事件的监听）
    compiler.plugin('compile', function () {
      console.log(`The compiler is starting to compile...-----`)
    })
    // compilation（'编译器'对'编译ing'这个事件的监听）
    compiler.plugin('compilation', function (compilation) {
      console.log(`The compiler is starting a new compilation...-----`)
      compilation.plugin('optimize', function () {
        console.log('The compilation is starting to optimize files...')
      })
    })
    compiler.plugin('done', function () {
      console.log(`done......`)
    })
  }
}

module.exports = HelloWorldPlugin
```

- compiler 对象包含 webpack 所有的配置信息，包括 options 、plugins和 loader等等，这个对象在 webpack 启动的时候被初始化，是全局唯一的，我们可以理解成它是 webpack 实例

- compilation 对象包含了当前的模块资源、编译生成资源、变化的文件等等。
当 webpack 以开发模式运行时，每一个文件变化，一个新的 compilation 就会被创建

[webpack hook](https://www.webpackjs.com/api/compiler-hooks/)

# 优化类

以下跟 Webpack构建过程中，可以帮助优化构建性能和速度的插件

## speed-measure-webpack-plugin

简称 SMP，在构建时会输出 Webpack 打包过程中 Loader 和 Plugin 的耗时，有助于找到构建过程中的性能瓶颈

```
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin")
const smp = new SpeedMeasurePlugin()
module.exports = smp.wrap(config)
// config是当前webpack的配置
```


在使用这个插件的时候，`config`不要直接包含`devServer：hot`的配置，要不要会报`Module Replacement is disabled`的错误，
暂时不知道原因，所以使用的时候用在不包含不要直接包含`devServer：hot`，`common.webpack`的配置中

## webpack-bundle-analyzer

1. `yarn add -D webpack-bundle-analyzer`

2. webpack 添加配置

  ```
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
  plugins: [
  new BundleAnalyzerPlugin(
             {
                analyzerMode: 'server',
                analyzerHost: '127.0.0.1',
                analyzerPort: 8889,
                reportFilename: 'report.html',
                defaultSizes: 'parsed',
                openAnalyzer: true,
                generateStatsFile: false,
                statsFilename: 'stats.json',
                statsOptions: null,
                logLevel: 'info'
                  }
         ),
  ]
  ```

3. 在`package.json`的`scripts`里加入下面这句话，就可以`yarn build`之后看到`webpack-bundle-analyzer`的效果：

  `"analyz": "NODE_ENV=production npm_config_report=true npm run build"`


## webpack-merge

提取公共配置，减少重复配置代码

```
const merge = require('webpack-merge');
const config = merge(common, {config})
```

- clear-webpack-plugin: 打包的时候清除目录

- html-webpack-plugin: 自动生成首页

## webpack-dashboard

`webpack-dashboard`是一统计和优化webpack日志的工具，可以以表格形势展示日志信息。其中包括构建过程和状态、日志以及涉及的模块列表

![](https://img-blog.csdn.net/20180630231931550?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2FjaGVueXVhbg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)

```
const DashboardPlugin = require('webpack-dashboard/plugin');
 plugins: [
        new DashboardPlugin()
    ]
```

这个插件暂时没试出效果～

## mini-css-extract-plugin插

webpack 4.0以前，我们通过`extract-text-webpack-plugin`插件

webpack 4.0以后，官方推荐使用`mini-css-extract-plugin`插件来打包css文件。

```
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const devMode = process.env.NODE_ENV !== 'production'

module.exports = {
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,  // 可以打包后缀为sass/scss/css的文件
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              // 这里可以指定一个 publicPath
              // 默认使用 webpackOptions.output中的publicPath
              // publicPath的配置，和plugins中设置的filename和chunkFilename的名字有关
              // 如果打包后，background属性中的图片显示不出来，请检查publicPath的配置是否有误
              publicPath: './',  
              // publicPath: devMode ? './' : '../',   // 根据不同环境指定不同的publicPath
              hmr: devMode, // 仅dev环境启用HMR功能
            },
          },
          'css-loader',
          'sass-loader'
        ],
      },
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      // 这里的配置和webpackOptions.output中的配置相似
      // 即可以通过在名字前加路径，来决定打包后的文件存在的路径
      filename: devMode ? 'css/[name].css' : 'css/[name].[hash].css',
      chunkFilename: devMode ? 'css/[id].css' : 'css/[id].[hash].css',
    })
  ]
}

```

