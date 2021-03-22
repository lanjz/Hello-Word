const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const path = require('path')

module.exports = {
    mode: 'development',
    entry: path.resolve(__dirname, './index.js') ,
    output: {
        filename: 'demo.js', // 输出文件的文件
        path: path.resolve(process.cwd(), 'dist'),
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            title: 'Output Management',
            template: './index.html'
        })
    ]
}
