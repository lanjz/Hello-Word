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
    minimize: false,
    minimizer: [new TerserPlugin()],
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
