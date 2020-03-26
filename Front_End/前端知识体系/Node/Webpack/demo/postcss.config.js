
module.exports = ({env}) => ({
    parser: 'sugarss',
    map: false,
    plugins: (loader) =>  [
        // require('postcss-cssnext')(),
        // require('autoprefixer')(),
        // require('cssnano')()
    ]
})