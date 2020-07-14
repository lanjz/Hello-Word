const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const webpack = require('webpack');
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const smp = new SpeedMeasurePlugin()
const HappyPack = require('happypack')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const happyThreadPool = HappyPack.ThreadPool({size: 5})

const config = (env) => {
    const devMode = process.env.NODE_ENV !== 'production'
    const plugins = []
    if(!env.multi){
        plugins.push(
          new HtmlWebpackPlugin({
              title: 'Output Management',
              template: './index.html'
          })
        )
    }
    return {
        entry: {
            index: './src/index.js'
        },
        output: {
            filename: '[name].[hash].js', // 输出文件的文件
            chunkFilename: '[name].[chunkhash].js', // 非入口打包出的文件名称
            path: path.resolve(process.cwd(), 'dist'),
        },
        resolveLoader: {
            modules: ['./node_modules', './my_loader'] // 配置loader的查找目录
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
/*        optimization: { // 作用同于 new webpack.optimize.CommonsChunkPlugin(
            // minimize: false,
            splitChunks: {
                minChunks: 2,
                cacheGroups: {
                    /!*  commons: {
                           name: "commons",
                           chunks: "all",
                          minSize: 1,
                          priority: 0
                       },*!/
                    vendor: {
                        name: 'vendor',
                        test: /[\\/]node_modules[\\/]/,
                        chunks: 'all',
                    }
                }
            }
        },*/
        devtool: 'sourcemap',
        plugins: [
             ...plugins,
            new CleanWebpackPlugin(),
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': JSON.stringify('production'),
                'NODE_ENV': JSON.stringify(env),
            }),
            new MiniCssExtractPlugin({
                filename: devMode ? '[name].css' : '[name].[contenthash].css',
                chunkFilename: devMode ? '[id].css' : '[id].[contenthash].css',
            }),
            new HappyPack({
                // 定义唯一标识符id
                id: 'babel',
                // 定义这个HappyPack使用哪个loader，用法和Loader配置一样
                loaders: ['babel-loader?cacheDirectory'],
                // 使用共享进程池中的子进程去处理任务
                threadPool: happyThreadPool
            }),
            new VueLoaderPlugin()
        ]
    }
}

module.exports = (env) => smp.wrap(config(env))
