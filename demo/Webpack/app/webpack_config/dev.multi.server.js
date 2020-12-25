// dev-server.js
const express = require('express')
const webpack = require('webpack')
const path = require('path')
const webpackHotMiddleware = require('webpack-hot-middleware')
const WebpackDevMiddleware = require('webpack-dev-middleware')
const multyWebpack = require('./webpack.multi')
const app = express();
// webpack编译器

const env = {}
process.argv.slice(2).forEach(item => {
    const getValue = item.match(/(?<=--env\.)(.+)/g)
    const join = getValue[0].split('=')
    if(join.length === 1) {
        env[join[0]] = true
    } else {
        env[join[0]] = join[1]
    }
})

const webpackConfig = multyWebpack(require('./webpack.config')(env))
const compiler = webpack(webpackConfig);

const devMiddleware = WebpackDevMiddleware(compiler, {
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
app.get('*', function(req, res, next) {
    const pageKeys = Object.keys(webpackConfig.entry)
    const pageList = pageKeys.map(item => {
        return `<h2><a href="/${item}">${item}.html</a></h2>`
    })
    res.set('content-type', 'text/html');
    res.send(pageList.join(''));
    res.end();
/*    var viewname = req.params.viewname
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
    })*/;
});
/*app.get('/', function(){
    console.log('/')
    console.log('__dirname', __dirname)
})*/
app.use(express.static(path.join(__dirname, '../')));
module.exports = app.listen(8000, function(err) {
    if (err) {
        // do something
        return;
    }
    console.log('Listening at http://localhost:' + '8080' + '\n')
})
