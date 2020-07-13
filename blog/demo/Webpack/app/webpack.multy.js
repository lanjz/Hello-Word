const HtmlWebpackPlugin = require('html-webpack-plugin');
const glob = require("glob");

function multyEntry() {
    const entry = {};
    //读取src目录所有page入口
    glob.sync('./src/views/*/index.js')
        .forEach(function (filePath) {
            console.log('filePath', filePath)
            var name = filePath.match(/\/src\/views\/(.+)\/index.js/);
            name = name[1];
            entry[name] = [filePath, 'webpack-hot-middleware/client?reload=true&noInfo=true'];
            // entry[name] = [filePath]
        });
    return entry;
};

function multyHtmlWebpackPlugin(){
    const htmlPlugin = [];
    glob.sync('./src/views/*/index.js')
        .forEach(function (filePath) {
            var name = filePath.match(/\/src\/views\/(.+)\/index.js/);
            name = name[1];
            console.log('name', name)
            htmlPlugin.push(
                new HtmlWebpackPlugin({
                    title: 'Output Management',
                    filename: './' + name + '/index.html',
                    template: './index.html',
                    inject: true,
                    chunks: [name]
                })
            )
        });
    return htmlPlugin;
}

function webpackMulty(options){
    options.entry = multyEntry()
    options.plugins = [...options.plugins, ...multyHtmlWebpackPlugin()]
    return options
}
module.exports = webpackMulty