const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const UglifyJSPlugin = require('terser-webpack-plugin'); // 使用terser-webpack-plugin 替换 uglifyjs-webpack-plugin进行代码压缩
const webpack = require('webpack')
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin")
const smp = new SpeedMeasurePlugin()
const config = smp.wrap(
    merge(common, {
        mode: 'production',
        devtool: 'source-map',
        plugins: [
            new UglifyJSPlugin({
                sourceMap: true
            }),

        ]
    }
))
module.exports = config