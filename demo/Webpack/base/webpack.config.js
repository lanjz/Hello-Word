const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const path = require('path')

module.exports = {
    mode: 'development',
    entry: './src/index.js',
    output: {
        filename: 'demo.js', // 输出文件的文件
        path: path.resolve(process.cwd(), 'dist'),
        // library: 'doDemoLib',
        // libraryTarget: 'umd'
    },
/*    devServer: {
        contentBase: './dist',
        hot: true,
        open: true,
        port:5050
    },*/
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            title: 'Output Management',
            template: './index.html'
        })
    ]
}
