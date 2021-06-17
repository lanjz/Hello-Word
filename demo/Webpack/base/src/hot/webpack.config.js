const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const path = require('path')
console.log( '----', path.resolve(__dirname, 'loader'))
module.exports = {
    mode: 'development',
    entry: path.resolve(__dirname, './index.js') ,
    output: {
        filename: 'demo.js', // 输出文件的文件
        path: path.resolve(process.cwd(), 'dist'),
    },
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        hot: true
    },
    resolveLoader: {
        // 去哪些目录下寻找Loader，有先后顺序之分
        modules: ['node_modules', path.resolve(__dirname, 'loader')],
        alias: {
            // 'rpxTpx-loader': path.resolve(__dirname, 'loader/rpxTpx.js'),
            // 'rpxTpx-loader2': path.resolve(__dirname, 'loader/rpxTpx2.js'),
        }
    },
    module: {
        rules: [
            {
                test: /\.(css|less)$/,
                use: [
                    {
                        loader: "style-loader",
                    },
                    {
                        loader: "css-loader",
                    },
                    {
                        loader: "less-loader",
                        options: {
                            lessOptions: {
                                strictMath: true,
                            },
                        },
                    },
                ],
            },
            {
                test: /\.(css|less)$/,
                use: [
                    {
                        loader: "rpxTpx",
                    },
                ],
                include: path.resolve(__dirname, 'css')
            },
        ],
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
