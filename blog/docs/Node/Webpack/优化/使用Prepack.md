之前提到的优化方法中提到了代码压缩和分块，这些都是网络传输方面的优化。除此之后，还可以在运行效率上做优化，Prepack就为此而生

## Prepack优化原理：

编译代码时提前将计算结果放在编译后的代码中，而不是在代码运行时才去求值

以如下代码为例：

```
 import React, { Component } from 'react'
  import { renderToString } from 'react-dom/server'
  function hello(name) {
    return 'hello' + name
    
  }
  class Button extends Component{
    render() {
      return hello(this.props.name)
    }
  }
  console.log(renderToString(<Button name='webpack'>))
```

被Prepack转换后竟然直接输出：

`console.log('hello webpack')`

可以看出Prepack通过在编译阶段预先执行源码来得到执行结果 ，再直接运行结果输出以提升性能

## Prepack 运行原理

- 通过Babel将JavaScript源码解析成语法树(AST)，以更细粒度分析源码

- Prepack实现了一个JavaScript解释器，用于执行源码。借助这个解释器，Prepack才能理解源码具体如何执行的，并将执行过程中的结果返回到输出中。

Prepack还处于初期也仅仅是 ，所以还有一些局限性：

- 不能识别DOM API和部分Node.js，如果在源码中有调用依赖运行环境的API，就会导致Prepack报错

- 代码在优化的性能可能更差

- 代码在优化后，文件的尺寸可会大大增加

## Webpack接入Prepack

```
  const PrepackWebpackPlugin = require('prepack-webpack-plugin').default
  module.exports = {
    plugins: [
      new PrepackWebpackPlugin()
    ]
  }
```
