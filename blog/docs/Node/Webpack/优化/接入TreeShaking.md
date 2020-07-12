Tree Shaking可以用来删除JavaScript中没用到的死代码。

需要注意的是，要让Tree Shaking正常工作的前提是，提交给Webpack的JavaScript代码必须是采用了ES6的模块化语法，因为ES6模块化的语法是静态的，这让Webpack可以简单地分析出哪些export的被import了。如果采用了ES5中的模块化，则Webpack无法分析出可以剔除哪些代码。

## 接入Tree Shaking

为了将采用ES6的模块交给Webpack处理，需要配置Babel以让其保留ES6模块化语句。修改`.babelrc`文件如下：

```
 {
    "presets":[
      [
        "env",
        {
          "modules": false
        }
      ]
  ]
  }
```

其中，` "modules": false`的含义是关闭Babel的模块转换功能，保留原本的ES6模块化语句

然后重新构建项目，我们会发现输出的文件中，没用到语句上多了一行注释` /* unused harmony export ... */`

要将这些代码从文件删除还需要配置UglifyJS，配置UglifyJSPlugin压缩代码的同时，将删除这些没用到的代码
