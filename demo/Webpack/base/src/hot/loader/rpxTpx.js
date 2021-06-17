module.exports = function (content) {
  return content.replace(/rpx/g, 'px')
}