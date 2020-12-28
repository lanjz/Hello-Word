const webpack = require('webpack')
const { merge } = require('webpack-merge')
const baseConfig = require('./base.js')
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')

module.exports = merge(baseConfig, {
  entry: {
    app: './src/src-vue/server/entry-client.js'
  },
  optimization: {
    splitChunks: {
      name: "manifest",
      minChunks: Infinity
    }
  },
  plugins: [
    // 此插件在输出目录中
    // 生成 `vue-ssr-client-manifest.json`。
    new VueSSRClientPlugin()
  ]
})