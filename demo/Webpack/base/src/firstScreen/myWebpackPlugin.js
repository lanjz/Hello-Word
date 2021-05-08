const HtmlWebpackPlugin = require('html-webpack-plugin');

class FirstScreen{
	constructor(options) {
		console.log('FirstScreen-options', options)
	}
	apply (compiler) {
		console.log(`Hello World`)
		// compilation（'编译器'对'编译ing'这个事件的监听）
		compiler.hooks.compile.tap('FirstScreen', function () {
			console.log(`The compiler is starting to compile...-----`)
		})
		// compilation（'编译器'对'编译ing'这个事件的监听）
		compiler.hooks.compilation.tap('FirstScreen', function (compilation) {
			console.log(`The compiler is starting a new compilation...-----`)
			compilation.hooks.optimize.tap('FirstScreen', function () {
				console.log('The compilation is starting to optimize files...')
			})
		})
		compiler.hooks.done.tap('FirstScreen', function () {
			console.log(`done......`)
		})
	}
}
module.exports = FirstScreen