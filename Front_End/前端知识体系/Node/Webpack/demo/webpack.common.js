const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const webpack = require('webpack');
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const smp = new SpeedMeasurePlugin()
const devMode = process.env.NODE_ENV !== 'production'

const config = {
    entry: {
        index: './src/index.js',
    },
    output: {
        filename: '[name].js',
        chunkFilename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    resolveLoader: {
        modules: ['./node_modules', './my_loader'] // 配置loader的查找目录
    },
    module: {
        rules: [
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
                            hmr: devMode, // 仅dev环境启用HMR功能
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
                    'less-loader',
                ]
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
                use: [
					{
						loader: 'babel-loader',
						options: {
							cacheDirectory: true
						}
					}
				]
            }

        ]
    },
    optimization: { // 作用同于 new webpack.optimize.CommonsChunkPlugin(
        minimize: false,
        splitChunks: {
            cacheGroups: {
                /*  commons: {
                       name: "commons",
                       chunks: "all",
                      minSize: 1,
                      priority: 0
                   },*/
                vendor: {
                    name: 'vendor',
                    test: /[\\/]node_modules[\\/]/,
                    chunks: 'all',
                }
            }
        }
    },
    devtool: 'inline-source-map',
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Output Management'
        }),
        new CleanWebpackPlugin(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        }),
        new MiniCssExtractPlugin({
            filename: devMode ? '[name].css' : '[name].[hash].css',
            chunkFilename: devMode ? '[id].css' : '[id].[hash].css',
        })
    ]
}
module.exports = smp.wrap(config)
