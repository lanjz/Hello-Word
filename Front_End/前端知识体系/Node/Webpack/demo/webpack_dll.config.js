const path = require('path')
const DllPlugin = require('webpack/lib/DllPlugin')
modules.exports = {
    // JavaScript执行文件
    entry: {
        // 将React相关的模块放到一个单独的动态链接库中
        react:['react', 'react-dom'],
        // 将项目需要所有的polyfill放到一个单独的动态链接库中
        polyfill:['core-js/fn/object/assign', 'core-js/fn/promise', 'whatwg-fetch'],
    },
    output: {
        // 输出的动态链接库的文件名称，[name]代表当前动态链接库的名称
        filename: '[name].dll.js',
        // 将输出的文件都放到dist目录下
        path: path.resolve(__dirname, 'dist'),
        // 设置动态链接库全局变量名，对于react就是_dll_react
        // 加上前缀_dll是为了防止与其它全局变量冲突
        library: '_dill_[name]'
    },
    plugins:[
        // 接入DllPlugin
        new DllPlugin({
            // 动态链接库的全局变量名称，需要和output.library中的保持一致
            // 该字段的值也就是输出mainfest.json文件中name字段的值
            // 例如在react_mainfest.jon中就有"name"："_dii_react"
            name: '_dll_[name]',
            // 描述动态链接库的mainfest.json文件输出时的文件名称
            path: path.join(__dirname,'dist', '[name].mainfest.json')
        })
    ]
}