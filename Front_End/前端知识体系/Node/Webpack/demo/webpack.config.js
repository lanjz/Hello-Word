const merge = require('webpack-merge');
const webpack = require('webpack')
const common = require('./webpack.common.js');
const Dashboard = require('webpack-dashboard');
const DashboardPlugin = require('webpack-dashboard/plugin');
// const dashboard = new Dashboard();
// const Jarvis = require("webpack-jarvis")
const config = merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        contentBase: './dist',
        hot: true
    },
    plugins: [
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        // new DashboardPlugin()
        /*new Jarvis({
            port: 1337 // optional: set a port
        })*/
    ]
})
module.exports = config