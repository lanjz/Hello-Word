const HtmlWebpackPlugin = require('html-webpack-plugin');

class FirstScreen{
	constructor(options) {
		console.log('FirstScreen-options', options)
	}
	apply (compiler) {
		compiler.hooks.compilation.tap('FirstScreen', (compilation) => {
			console.log('The compiler is starting a new compilation...')
			HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tapAsync(
				'FirstScreen', // <-- Set a meaningful name here for stacktraces
				(data, cb) => {
					console.log('data', data)
					data.html += 'The Magic Footer'
					cb(null, data)
				}
			)
		})
	}
}
module.exports = FirstScreen