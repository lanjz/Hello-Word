将网页的静态资源上传到CDN服务上，在获取这些静态资源时需要通过CDN服务提供的地址去访问

要注意的是CDN服务一般都会为资源开启很长时间的缓存，例如用户在获取index.html这个文件后，即使之后的发布操作将index.html文件重新覆盖了，但是用户在很长一段时间内还是会运行之前的版本，这会导致新的发布不能立即生效。

- 针对HTML文件：不开启缓存，将HTML放在自己的服务器上，而不是CDN服务上，同时关闭自己服务器的缓存。自己的服务器只提供HTML文件和数据接口。

- 针对静态的JavaScript，CSS，图片等文件：开启CDN和缓存，上传到CDN服务上，同时为每个文件名带上由文件内容算出的Hash值。

如果对形如`//cdn.com/id/app_a....css`这样的URL感到陌生，则我们需要知道这种URL省掉了前端的http:或者https:前缀。这样做的好处是，在访问这些资源时会自动根据当前的HTML的URL采用什么模式去决定是采用HTTP还是HTTPS模式。

## Webpack实现CDN的接入

- 静态资源的导入URL需要变成指向CDN服务的绝对路径的URL，而不是相对于HTML文件的URL

- 静态资源的文件名需要带上由文件内容算出来的Hash值，以防止被缓存

- 将不类型的资源放在不同域名的CDN服务上，以防止资源的并行加载被阻塞。

Webapck的配置如下：

```
const path = require("path")
  const ExtractTextPlugin = require('extract-text-webpack-plugin')
  const { WebPlugin } = require('web-webpack-plugin')
  module.exports = {
    output: {
      filename: '[name]_[chunkhash:8].js',
      path: path.resolve(__dirname, './dist'),
      publishpath: '//js.cdn.com/id/',
    },
    modules: {
      rules: [
        {
          test: /\.css/,
          use: ExtractTextPlugin.extract({
            // 压缩css代码
            use:['css-loader?minimize'],
            // 指定存放css中导入的资源（例如图片）的CDN目录URL
            publishPath: '//img.cdn.com/id/'
          })
        },
        {
          test: /\.png/,
          use: ExtractTextPlugin.extract({
            // 压缩css代码
            use: ['file-loader?name=[name]_[hssh:8].[ext]'],
          })
        }
      ]
    },
    plugins: [
      new WebPlugin({
        template: './template.html',
        filename: 'index.html',
        stylePublishPath: '//css.cdn.com/id/',
      }),
      new ExtractTextPlugin({
        // 为输出的css文件名加上Hash值 
        filename: '[name]_[contenthash:8].css'
      })
    ]
  }
```

在以上代码中最核心的部分是通过publicPath，参数设置存放静态资源的CDN目录URL 。为了让不同类型的资源输出不同的CDN，需要分别进行如下设置。

- 在output.publicPath中设置JavaScript的地址。

- css-loader.publicPath 中设置被CSS导入的资源的地址。

- WebPlugin-stylePublishPath中设置CSS文件的地址

设置好publishPath后，WebPlugin在生成HTML文件并将css-loader转换CSS代码时，会考虑到配置中的publishPath,用对应的线上替换原来的相对地址
