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