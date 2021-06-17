# Plugin

Webpack 中的插件是基于事件流框架 `Tapable`，插件可以扩展 Webpack 的功能，在 Webpack 运行的生命周期中会广
播出许多事件，Plugin 可以监听这些事件，在合适的时机通过 Webpack 提供的 API 改变输出结果。

Plugin 在 `plugins` 中单独配置，类型为数组，每一项是一个 `Plugin` 的实例，参数都通过构造函数传入。

## 自定义插件

简单的DEMO
// 旧版本写法
```js
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

// 新写法
class BasicPlugin{
  // 在构造函数中获取用户给该插件传入的配置
  constructor(options){
  }

  // Webpack 会调用 BasicPlugin 实例的 apply 方法给插件实例传入 compiler 对象
  apply(compiler){
    compiler.hooks.compilation.tap('BasicPlugin', (compilation) => {
    	console.log('compilation')
	})
  }
}

```

1. 在 webpack 启动后，它会去执行我们配置的 `new BasicPlugin(options)` 初始化一个插件实例

2. 在初始化 `compiler` 对象之后，会调用 `basicPlugin.apply(compiler)` 方法将 `compiler` 传入

3. 插件获得 `compiler` 对象后，就可以通过 `compiler.hooks.someHook.tap('当前插件名', 回调函数)` 的方式进行监听 Webpack 广播出来的事件了

```js
class HelloWorldPlugin {
  constructor (options) {
    console.log(options)
  }
  apply (compiler) {
    console.log(`Hello World`)
    // compilation（'编译器'对'编译ing'这个事件的监听）
    compiler.hooks.compile.tap('HelloWorldPlugin', function () {
      console.log(`The compiler is starting to compile...-----`)
    })
    // compilation（'编译器'对'编译ing'这个事件的监听）
    compiler.hooks.compilation.tap('HelloWorldPlugin', function (compilation) {
      console.log(`The compiler is starting a new compilation...-----`)
      compilation.hooks.optimize.tap('HelloWorldPlugin', function () {
        console.log('The compilation is starting to optimize files...')
      })
    })
    compiler.hooks.done.tap('HelloWorldPlugin', function () {
      console.log(`done......`)
    })
  }
}

module.exports = HelloWorldPlugin
```

- `compiler` 对象包含 `webpack` 所有的配置信息，包括 `options` 、`plugins` 和 `loader` 等等，这个对象在 Webpack 启动的时候被初始化，是全局唯一的，我们可以理解成它是 Webpack 实例

- `compilation` 对象包含了当前的模块资源、编译生成资源、变化的文件等等。
当 Webpack 以开发模式运行时，每一个文件变化，一个新的 `compilation` 就会被创建

[webpack hook](https://www.webpackjs.com/api/compiler-hooks/)

### 粟子

制作一个给输出的 HTML 页面添加内容的插件，用于解决单文件项目首屏空白问题

```js
const HtmlWebpackPlugin = require('html-webpack-plugin');
class FirstScreen{
	constructor() {}
	apply (compiler) {
		compiler.hooks.compilation.tap('FirstScreen', (compilation) => {
			HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tapAsync(
				'FirstScreen', 
				(data, cb) => {
					console.log('data', data)
					data.html = data.html.replace('<div id="app"></div>',`<div id="app">我的骨架屏</div>`)
					cb(null, data)
				}
			)
		})
	}
}
module.exports = FirstScreen
```

## 常用插件

### speed-measure-webpack-plugin

简称 SMP，在构建时会输出 Webpack 打包过程中 Loader 和 Plugin 的耗时，有助于找到构建过程中的性能瓶颈

```js
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin")
const smp = new SpeedMeasurePlugin()
module.exports = smp.wrap(config)
// config是当前webpack的配置
```

在使用这个插件的时候，`config` 不要直接包含 `devServer：hot` 的配置，要不要会报 `Module Replacement is disabled` 的错误，暂时不知道原因

### webpack-bundle-analyzer

帮助我们分析输出文件的大小

1. `yarn add -D webpack-bundle-analyzer`

2. webpack 添加配置

  ```js
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

3. 在 `package.json` 的 `scripts` 里加入下面这句话，就可以 `yarn build` 之后看到 `webpack-bundle-analyzer` 的效果：

  `"analyz": "NODE_ENV=production npm_config_report=true npm run build"`

### webpack-dashboard

`webpack-dashboard` 是一统计和优化 `webpack` 日志的工具，可以以表格形势展示日志信息。其中包括构建过程和状态、日志以及涉及的模块列表

![](https://img-blog.csdn.net/20180630231931550?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2FjaGVueXVhbg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)

```js
const DashboardPlugin = require('webpack-dashboard/plugin');
 plugins: [
        new DashboardPlugin()
    ]
```

这个插件暂时没试出效果～

### webpack.DefinePlugin

`DefinePlugin`允许我们编译时为项目注入全局变量

```js
 plugins: [
    new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('production'),
        'NODE_ENV': JSON.stringify(env),
    }),
]
```

打包出来的项目就可以使用 `process.env.NODE_ENV` 和 `NODE_ENV` 访问到我们设置的值的了

这个插件一般会配合我们设置的环境变量使用， Webpack 中配置环境变量也很简单，直接在 `package.json` 中的
`script` 命令行中添加 `--env` 属性，然后在 Webpack 使用函数的形式来返回我们配置，这个函数的参数 `env` 就包含了我们的设置的所有值

```js
// package.json
"start": "webpack-dev-server --colors --env.bool --env.moke=1",
```

- `--env.bool`: 定义了一个`bool`变量，但没赋值，此时这个变量的值为`true`

- `--env.moke=1`: 设置了一个值为`1`的变量`moke`

```js
// webpack.config.s
module.exports = env => {
  // Use env.<YOUR VARIABLE> here:
  console.log('NODE_ENV: ', env.NODE_ENV); // 'local'
  console.log('Production: ', env.production); // true

  return {
    entry: './src/index.js',
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist')
    }
  };
};
```

### HtmlWebpackPlugin

`HtmlWebpackPlugin`简化了 HTML 文件的创建，这个插件可以自动为你生成一个HTML文件，并引入打包后的 `bundle` 文件

```js
plugin: [
    new HtmlWebpackPlugin({
        title: 'Output Management'
    }),
]
```

### web-webpack-plugin

作用同 HtmlWebpackPlugin

[文档](https://github.com/gwuhaolin/web-webpack-plugin/blob/master/readme_zh.md)

### clean-webpack-plugin

目录清理

```js
plugins: [
 new CleanWebpackPlugin()
]
```

### terser-webpack-plugin

功能与 `uglifyjs-webpack-plugin` 类似，进行代码压缩

```js
const UglifyJSPlugin = require('terser-webpack-plugin'); 
 plugins: [
            new UglifyJSPlugin({
                sourceMap: true
            }),

        ]
```

x5 之后的版本这个插件已经内置了

```js
module.exports = {
  optimization: {
    minimize: true,
  },
};
```

### mini-css-extract-plugin

webpack 4.0以前，我们通过 `extract-text-webpack-plugin` 插件

webpack 4.0以后，官方推荐使用 `mini-css-extract-plugin` 插件来打包css文件，支持按需加载 

```js
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

### VueLoaderPlugin

配置 `vue` 需要这个插件

### HotModuleReplacementPlugin

模块热更新需要使用这个，HotModuleReplacementPlugin 的作用就是将 HMR runtime 注入到 bundle.js，使得 bundle.js 可以和 HMR server 建立 websocket 的通信连接

webpack-dev-sever 内部对 `HotModuleReplacementPlugin` 插件做了判断，当配置了 `devServer.hot:true` 时，就自动添加这个插件

