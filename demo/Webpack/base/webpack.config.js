const libraryConfig = require('./src/library/webpack.config')
const splitConfig = require('./src/output/webpack.config')
const firstScreen = require('./src/firstScreen/webpack.config')
const hot = require('./src/hot/webpack.config')
const shaking = require('./src/shaking/webpack.config')
const scopeHoisting = require('./src/scopeHoisting/webpack.config')

module.exports = scopeHoisting