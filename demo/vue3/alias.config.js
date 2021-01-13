/**
 * webstorm 配置使用
 * */

const resolve = dir => require('path').join(__dirname, dir)

module.exports = {
  resolve: {
    alias: {
      '@': resolve('')
    }
  }
}