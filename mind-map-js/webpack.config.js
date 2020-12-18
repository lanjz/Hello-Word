const path = require('path')
const TerserPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const config = {
  mode: 'development',
  // mode: 'production',
  entry: {
    index: './src/index.js',
    // main: './src/main.js',
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  optimization: {
    usedExports: true,
    minimize: true,
    splitChunks: {
      // chunks: 'all',
    },
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          output: {
            beautify: true,
          },
        }
      })
    ],
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
    new HtmlWebpackPlugin({
      title: 'Development',
    }),
  ]
}
module.exports = config
