Cookie作用：

- 会话状态管理

- 个性化设置

- 浏览器行为跟踪

## Cookie有效时间

默认情况下，Cookie只在会话期有效。关闭浏览器后Cookie就自动删除了，当然不是所有的浏览器都这么正常，有的浏览器提供了会话恢复功能。我们可以通过设置来控制Cookie的时效性

## Cookie的属性

- Expires：为Cookie设置一个绝对时间，当到这个时间后，Cookie就被删除

- Max-age：设置一个相对秒数，种下Cookie之后经历多少秒删除这个Cookie

问1：如果我在 Cookie 中同时设置了 expires 和 max-age 会发生什么？

所有支持 max-age 的浏览器会忽略 expires 的值，只有 IE 另外，IE 会忽略 max-age 只支持 expires。

- HttpOnly：标记了`HttpOnly`的Cookie，它们只应该发送给服务端。不能被JavaScript脚本调用

- Secure：标记了`Secure`后，Cookie只能被HTTPS协议传输

- Domain：即Cookie应该发送给哪些URL，默认当前文档的主机。如果指定了Domain，则一般包含子域名。为了保证安全性，cookie无法设置除当前域名或者其父域名之外的其他domain。所以想用这个解决跨域问题，只能针对域名拥有相同父域名的情况。

比如有两个域名`a.lan.com`和`b.lan.com`

如果访问`a.lan.com`时，Cookie的Doman设成`lan.com`，那么`b.lan.com`也能访问到该Cookie


- Path：指定了主机下的哪些路径可以接受Cookie（该URL路径必须存在于请求URL中）。例如，设置 Path=/docs，则以下地址都会匹配：

  - /docs

  - /docs/Web/

  - /docs/Web/HTTP

  Path的默认取值

  - 当cookie的path设置了值不为null的时候，以设置的值为准。

  - 当cookie的path为null时候，获取请求的URI的path值 
当URI的path值是以“/”结尾的时候，直接设置为cookie的path值

  - 当URI的path值不是以“/”结尾的时候，查看path里面是否有“/” 

  - 如果有“/”的话，直接截取到最后一个“/”，然后设置为cookie的path值。
如果没有“/”的话，将cookie的path设置为”/”
