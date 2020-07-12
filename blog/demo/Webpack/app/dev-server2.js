var path = require('path')
var express = require('express')
var webpack = require('webpack')
var webpackConfig = require('./webpack.config')({multy: 1})
var HtmlWebpackPlugin = require('html-webpack-plugin')
var WebpackDevMiddleware = require('webpack-dev-middleware')
var WebpackHotMiddleware = require('webpack-hot-middleware')
// Express实例
var app = express()
// entry中添加HotUpdate地址
var hotMiddlewareScript = 'webpack-hot-middleware/client?reload=true'
// 重置入口entry
const entries = webpackConfig.entry
webpackConfig.entry = {}
// 设置output为每个页面[name].js
webpackConfig.output.filename = '[name].js'
webpackConfig.output.path = path.join(__dirname, 'dist')
console.log('entries', entries)
Object.keys(entries).forEach(function (name) {
    // 每个页面生成一个entry
    // 这里修改entry实现HotUpdate
    webpackConfig.entry[name] = [entries[name], hotMiddlewareScript]
    
    // 每个页面生成一个[name].html
    var plugin = new HtmlWebpackPlugin({
        // 生成出来的html文件名
        filename: name + '.html',
        // 每个html的模版，这里多个页面使用同一个模版
        template: './index.html',
        // 自动将引用插入html
        inject: true,
        // 每个html引用的js模块，也可以在这里加上vendor等公用模块
        chunks: [name]
    })
    webpackConfig.plugins.push(plugin)
})
webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin())
// webpack编译器
var compiler = webpack(webpackConfig)
// webpack-dev-server中间件
app.use(WebpackDevMiddleware(compiler, {
    publicPath: '/',
    stats: {
        colors: true,
        chunks: false
    },
    progress: true,
    inline: true,
    hot: true
}))
app.use(WebpackHotMiddleware(compiler))
// 路由
app.get('/:pagename?', function (req, res, next) {
    var pagename = req.params.pagename
        ? req.params.pagename + '.html'
        : 'index.html'
    var filepath = path.join(compiler.outputPath, pagename)
    // 使用webpack提供的outputFileSystem
    compiler.outputFileSystem.readFile(filepath, function (err, result) {
        if (err) {
            // something error
            return next('输入路径无效，请输入目录名作为路径，有效路径有：\n/' + Object.keys(entries).join('\n/'))
        }
        // 发送获取到的页面
        res.set('content-type', 'text/html')
        res.send(result)
        res.end()
    })
})
module.exports = app.listen(8080, function (err) {
    if (err) {
        // do something
        return
    }
    console.log('Listening at http://localhost:8080\n')
})
