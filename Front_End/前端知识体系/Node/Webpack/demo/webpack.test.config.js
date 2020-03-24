const path = require('path')
const config = {
	mode: 'development',
	entry: {
		index: './src/index.js',
	},
	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, 'dist'),
	},
	module: {
		rules: [
			{
				test: /\.js/,
				use: [
					'babel-loader'
				]
			}
		
		]
	}
}
module.exports = config
