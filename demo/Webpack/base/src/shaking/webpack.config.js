const path = require('path')

module.exports = {
    mode: 'development',
    optimization: {
        usedExports: true,
    },
    // mode: 'production',
    entry: path.resolve(__dirname, './index.js') ,
    output: {
        path: path.resolve(process.cwd(), 'dist'),
    },
}
