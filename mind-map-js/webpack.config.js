const path = require('path')
const TerserPlugin = require('terser-webpack-plugin');

const config = {
  // mode: 'development',
  mode: 'production',
  entry: {
    index: './lib/index.js',
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
  optimization: {
    usedExports: true,
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          output: {
            beautify: true,
          },
          compress: {
            pure_funcs: ["console.log", "Math.abs"]
          }
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
  }
}
module.exports = config
