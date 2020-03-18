Webapck构建过程就是对文件进行解析和转换，所以构建是谁的读写和计算密集型的。运行在Node.js之后的Webapck是单线程模型的，也就是说Webapck需要一个一个地处理任务，不能同时处理多个任务。

HappyPack的作用就是能让Webpack在同一时刻处理多个任务，发挥多核CPU电脑的功能，他将任务分到给多个子进程去并发执行，子进程处理完后再将结果发送给主进程。

由于JavaScript是单线程模型，所以要想发挥多核CPU的功能，就只能通过多进程实现，而无法通过多线程实现。

## 使用HappyPack

```
  const path = require('path')
  const ExtractTextPlugin = require('extract-text-webpack-plugin')
  const HappyPack = require('happypack')
  
  module.exports = {
    module: {
      rules: [
        {
          test: /\.js$/,
          // 将js文件的处理交给id为babel的happypack实例
          use: ['happypack/loader?id=babel'],
          // 排除node_modules下的目录，因为node_modeles目录下的文件采用了ES5语法，没必要再通过Babel去转换
          exclude: path.resolve(__dirname, 'node_modules'),
        },
        {
          test: /\.css/,
          // 将css文件的处理交给id为babel的happypack实例
          use: ExtranctTextPlugin.extract({
            use: ['happypack/loader?id=css']
          }),
        }
      ]
    },
    plugins: [
      new HappyPack({
        // 定义唯一标识符id
        id: 'babel',
        // 定义这个HappyPack使用哪个loader，用法和Loader配置一样
        loaders: ['babel-loader?cacheDirectory']
      }),
      new HappyPack({
        id: 'css',
        loaders: ['css-loader']
      }),
      new ExtractTextPlugin({
        filename: '[name].css'
      })
    ]
  }
```

以上配置做了以下几件事情：

-  在Loader配置，将文件的处理将给`happypack/loader`，使用时后面紧跟的`querystring?id=bable`表示使用哪个HappyPack实例

- 在Pugin配置中，添加了两个HappyPack实例，分别配置了不同的`loaders`，用于告诉`happypack/loader`如何处理`.js`和`.css`文件。id属性的值和上面querystring的`?id=bable`对应

在实例HappyPack时，除了可以传入id和loaders外还支持以下属性

- threads：代表开启几个子进程去处理这一类的文件，默认是3个，必须是整数

- verbose：是否允许HappyPack输出日志，默认开户

- threadPool：代表共享进程池，即多个HappyPay实例都使用同一个共享进程池的子进程去处理任务，以防止资源占用太多，相关代码如下

```
  const path = require('path')
  const ExtractTextPlugin = require('extract-text-webpack-plugin')
  const HappyPack = require('happypack')
  const happyThreadPool = HappyPack.ThreadPool({size: 5})

  module.exports = {
    module: {
      rules: [
        {
          test: /\.js$/,
          // 将js文件的处理交给id为babel的happypack实例
          use: ['happypack/loader?id=babel'],
          // 排除node_modules下的目录，因为node_modeles目录下的文件采用了ES5语法，没必要再通过Babel去转换
          exclude: path.resolve(__dirname, 'node_modules'),
        },
        {
          test: /\.css/,
          // 将css文件的处理交给id为babel的happypack实例
          use: ExtranctTextPlugin.extract({
            use: ['happypack/loader?id=css']
          }),
        }
      ]
    },
    plugins: [
      new HappyPack({
        // 定义唯一标识符id
        id: 'babel',
        // 定义这个HappyPack使用哪个loader，用法和Loader配置一样
        loaders: ['babel-loader?cacheDirectory'],
        // 使用共享进程池中的子进程去处理任务
        threadPool: happyThreadPool
      }),
      new HappyPack({
        id: 'css',
        loaders: ['css-loader'],
        // 使用共享进程池中的子进程去处理任务
        threadPool: happyThreadPool
      }),
      new ExtractTextPlugin({
        filename: '[name].css'
      })
    ]
  }
```

接入HappyPack后，需要为项目安装新的依赖：

`npm i -D HappyPack`

安装成功后重新执行构建，如果有看到由HappyPack输出的日志说明HappyPack配置生效了

## HappyPack原理

每通过`new HappyPack`实例化一个HappyPack，并定义该实例使用哪些Loader去转换一类文件，并且可以指定如何为这类转换操作分配进程。

核心调度器的逻辑代码在主进程中，也就是运行Webapck的进程中，核心调度器会将一个个任务分配给当前空闲的子进程中，子进程处理完后将结果发送给核心调度器，它们之间的数据交换是通过进程间的通信API完成的。

核心调度器收到来自子进程处理完毕的结果后，会通知Webapck该文件已处理完毕。
