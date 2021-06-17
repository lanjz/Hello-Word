function replace(source) {
  return source.replace(/(\/\/ *@require) + (('|").+('|")).*/, 'require($2);')
}
module.exports = function (content) {
  console.log('运行了2', content)
  return replace(content)
}