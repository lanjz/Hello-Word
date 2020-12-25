const HtmlWebpackPlugin = require('html-webpack-plugin');
const glob = require("glob");

function multiEntryAndPlugin(options) {
    const htmlPlugin = [];
    const entry = {};
    //读取src目录所有page入口
    glob.sync('./src/views/*/index.js')
        .forEach(function (filePath) {
            var name = filePath.match(/\/src\/views\/(.+)\/index.js/);
            name = name[1];
            entry[name] = [filePath];
            if(options.mode !== 'production') {
              entry[name].push('webpack-hot-middleware/client?reload=true')
            }
           // 添加对应的 HtmlWebpackPlugin
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
    return {
      entry,
      htmlPlugin
    };
};

function webpackMulti(options){
    const { entry, htmlPlugin } = multiEntryAndPlugin(options)
    options.entry = entry
    options.plugins = [...options.plugins, ...htmlPlugin]
    return options
}
module.exports = webpackMulti