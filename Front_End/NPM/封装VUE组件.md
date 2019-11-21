> 参数 [vue封装组件，类似elementUI组件库打包发布到npm上](https://blog.csdn.net/cscscssjsp/article/details/82501745)

1. 通过`vue init webpack-simple`，新建一个vue项目

2. 在`src`目录下新一个`lib`文件夹，放置需要封装的vue组件

3. 修改`webpack.config.js`文件

```
{
   entry: './src/lib/index.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: '/dist/',
    filename: 'black-hook-ui.min.js',
    library: 'blackHookUI'
  },
}
```

4. 修改`packpack.json`文件

```
{
 "main": "/dist/black-hook-ui.min.js",
 "files": [
    "dist",
    "src/lib"
  ],
}
```

5. 执行`yarn build`命令生成`dist`目录

6. npm 上传
