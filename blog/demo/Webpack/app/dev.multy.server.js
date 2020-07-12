// dev-server.js
var express = require('express')
var webpack = require('webpack')
var path = require('path')
var webpackHotMiddleware = require('webpack-hot-middleware')
var WebpackDevMiddleware = require('webpack-dev-middleware')
var multyWebpack = require('./webpack.multy')
var webpackConfig = multyWebpack(require('./webpack.config')({}))
var app = express();
// webpack编译器
var compiler = webpack(webpackConfig);
// return
// webpack-dev-server中间件
var devMiddleware = WebpackDevMiddleware(compiler, {
    publicPath: '/',
    // publicPath: webpackConfig.output.publicPath,
    stats: {
        colors: true,
        chunks: false
    },
    progress: true,
    inline: true,
    hot: true
});

app.use(devMiddleware)
app.use(webpackHotMiddleware(compiler))

// 路由
app.get('/:viewname?', function(req, res, next) {
    var viewname = req.params.viewname 
        ? req.params.viewname + '.html' 
        : 'index.html';

    var filepath = path.join(compiler.outputPath, viewname);

    // 使用webpack提供的outputFileSystem
    compiler.outputFileSystem.readFile(filepath, function(err, result) {
        if (err) {
            // something error
            return next(err);
        }
        res.set('content-type', 'text/html');
        res.send(result);
        res.end();
    });
});
app.use(express.static(path.join(__dirname, '../')));
module.exports = app.listen(8080, function(err) {
    if (err) {
        // do something
        return;
    }
    console.log('Listening at http://localhost:' + '8000' + '\n')
})
