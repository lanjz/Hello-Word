module.exports = ({ file, options, env }) => {
    return ({
        parser: file.extname === '.sss' ? 'sugarss' : false,
        plugins: {
            'postcss-cssnext': { // 这个插件包含了autoprefixer 不包含 browsers属性则没办法自动添加兼容前缀
                browsers: ['last 15 versions']
            },
            'cssnano': {
                preset: 'default'
            }
        }
    })
}
/*
- autoprefixer：自动补全css前缀，使用于要配置 browsers 属性，要不然没办法自动添加兼容前缀
- postcss-cssnext：这个插件包含了autoprefixer的功能， 使用于要配置 browsers 属性，要不然没办法自动添加兼容前缀
- cssnano：
    删除空格和最后一个分号
    删除注释
    优化字体权重
    丢弃重复的样式规则
    优化calc()
    压缩选择器
    减少手写属性
    合并规则
*/
