const path = require('path')
const common = require('./webpack.common.js');
const merge = require('webpack-merge');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require('webpack');
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const HappyPack = require('happypack')
const happyThreadPool = HappyPack.ThreadPool({size: 5})
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const config = {
	mode: 'development',
	entry: {},
	output: {
		filename: '[name].[hash].js', // 输出文件的文件
		chunkFilename: '[name].[chunkhash].js', // 非入口打包出的文件名称
		path: path.resolve(__dirname, 'dist'),
	},
	module: {
		rules: [
			{
				test: /\.vue$/,
				exclude: /node_modules/,
				use:[
					"vue-loader"
				]
			},
			{
				test: /\.(css|less)$/,
				use: [
					{
						loader: MiniCssExtractPlugin.loader,
						options: {
							// 这里可以指定一个 publicPath
							// 默认使用 webpackOptions.output中的publicPath
							// publicPath的配置，和plugins中设置的filename和chunkFilename的名字有关
							// 如果打包后，background属性中的图片显示不出来，请检查publicPath的配置是否有误
							publicPath: './',
							// publicPath: devMode ? './' : '../',   // 根据不同环境指定不同的publicPath
							hmr: true, // 仅dev环境启用HMR功能
						},
					},
					'css-loader',
					'postcss-loader',
					{
						loader: 'px2rem-loader',
						options: {
							remUnit: 75,
							remPrecision: 8
						}
					},
					'less-loader'
				],
			},
			{
				test: /\.txt$/,
				use: 'raw-loader'
			},
			{
				test: /\.(png|svg|jpg|gif)$/,
				use: [
					{
						loader: 'url-loader',
						options: {
							name: '[name].[ext]',
							outputPath: 'images/',
							// publicPath: '/assets/',
						}
					}
				]
			},
			{
				test: /\.(woff|woff2|eot|ttf|otf)$/,
				use: [
					'file-loader'
				]
			},
			{
				test: /\.js$/,
				use: ['happypack/loader?id=babel'],
			}
		
		]
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
		new CleanWebpackPlugin(),
		new VueLoaderPlugin(),
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify('production'),
			'NODE_ENV': JSON.stringify('env'),
		}),
		new MiniCssExtractPlugin({
			filename: true ? '[name].css' : '[name].[contenthash].css',
			chunkFilename: true ? '[id].css' : '[id].[contenthash].css',
		}),
		new HappyPack({
			// 定义唯一标识符id
			id: 'babel',
			// 定义这个HappyPack使用哪个loader，用法和Loader配置一样
			loaders: ['babel-loader?cacheDirectory'],
			// 使用共享进程池中的子进程去处理任务
			threadPool: happyThreadPool
		}),
	]
}
const c = merge(common({}), {
	mode: 'development',
	// devtool: 'inline-source-map',
	devServer: {
		contentBase: './dist',
		hot: true,
		open: true
	},
	devtool: 'sourcemap',
	plugins: [
		new webpack.NamedModulesPlugin(),
		new webpack.HotModuleReplacementPlugin(),
		new CleanWebpackPlugin(),
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify('production'),
			'NODE_ENV': JSON.stringify('env'),
		}),
		new MiniCssExtractPlugin({
			filename: true ? '[name].css' : '[name].[contenthash].css',
			chunkFilename: true ? '[id].css' : '[id].[contenthash].css',
		}),
		// new DashboardPlugin()
		/*new Jarvis({
        port: 1337 // optional: set a port
    })*/
	]
})
module.exports = config
