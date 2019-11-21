Scope Hoisting可以让Webpack打包出来的代码文件更小，运行更快，它又被译作“作用域提升”

## Scope Hoisting的原理

分析模块之间依赖关系，尽可能将被打散的模块合并到一个函数中，但前提是不会造成代码冗余。因此只有那些被引用了一次的模块才能被合并

由于Scope Hoisting需要依赖模块之间的依赖关系，所以源码必须采用ES6模块化语句，不然它将无法生效。

## Webpack中使用Scope Hoisting

```
 const ModuleConcanationPlugin = require('webpack/lib/optimize/ModuleConcatenationPlugin')
  module.exports = {
    plugins: [
      new ModuleConcanationPlugin()
    ]
  }
```

同时，考虑到Scope Hoisting依赖源码时需采用ES6模块化语句，所以还需要配置mainFileds

对于采用了非ES6模块化语法的代码，Webpack会降级处理且不使用Scope Hoisting优化，为了知道Webapck对哪些代码做了降级处理，我们可以在启动Webpack带上`--display-optimization-bailout`参数，这样在输出日志中就会包含一些日志

其中的ModuleConcatenation bailout告诉我们哪个文件因为什么原因导致了降级处理

开启Scope Hoising并发最大作用的配置如下（参考）：

```
const ModuleConcanationPlugin = require('webpack/lib/optimize/ModuleConcatenationPlugin')
  module.exports = {
    resolve: {
      mainFields: ['jsnext:main', 'browser', 'main']
    },
    plugins: [
      // 开户Scope Hoisting
      new ModuleConcanationPlugin()
    ]
  }
```
