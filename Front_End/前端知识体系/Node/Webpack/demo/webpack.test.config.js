const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const config = {
	mode: 'development',
	entry: {
		index: './src/index2.js',
	},
	output: {
		filename: '[chunkhash].js',
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
	},
	plugins: [
		new CleanWebpackPlugin(),
	]
}
module.exports = config
