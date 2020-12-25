const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const baseConfig = require('./webpack.base')
const { merge } = require('webpack-merge')

const config = merge(baseConfig,{
  mode: 'development',
  // mode: 'production',
  entry: {
    index: './src/src-vue/index.js',
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js' //内部为正则表达式  vue结尾的
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        exclude: /node_modules/,
        loader: 'vue-loader',
        options: {
          loaders: {
            'scss': 'style-loader!css-loader!sass-loader'
          }
        }
      },
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
  ]
})
module.exports = config
