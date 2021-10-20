const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const {ModuleFederationPlugin} = require("webpack").container;
const path = require('path')

module.exports = {
    mode: 'development',
    entry: path.resolve(__dirname, './index.js') ,
    output: {
        filename: 'demo.js', // 输出文件的文件
        path: path.resolve(process.cwd(), 'dist'),
    },

    plugins: [
        new ModuleFederationPlugin({
            name: "app2",
            filename: "remoteEntry.js",
            remotes: {
                app1: "app1@http://localhost:3001/remoteEntry.js",
            },
            /*            exposes: {
                            "./Button": "./src/Button",
                        },*/
            /*            shared: {
                            ...deps,
                            react: {
                                singleton: true,
                            },
                            "react-dom": {
                                singleton: true,
                            },
                        },*/
        }),
        new webpack.HotModuleReplacementPlugin(),
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            title: 'Output Management',
            template: './index.html'
        })
    ]
}
