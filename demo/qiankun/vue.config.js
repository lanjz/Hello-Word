module.exports = {
  lintOnSave: false,
  configureWebpack: {
    resolve: {
      extensions: ['.tsx','.ts', '.mjs', '.js', '.jsx', '.vue', '.json', '.wasm']
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: 'ts-loader',
          exclude: /node_modules/,
          options: {
            appendTsSuffixTo: [/\.vue$/],
          }
        }
      ]
    }
  },
}