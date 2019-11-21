[MDN-HTTP访问控制](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Access_control_CORS) 

# HTTP响应首部字段

- Accept-Control-Allow-Origin： 用于设置允许访问该资源的外部URL

- Accept-Control-Expose-Headers：对跨域访问在跨域访问时，XMLHttpRequest对象的getResponseHeader()方法只能拿到一些最基本的响应头，`Cache-Contro`l、`Content-Language`、`Content-Type`、`Expires`、`Last-Modified、Pragma`，如果要访问其他头，则需要服务器设置本响应头。

Access-Control-Expose-Headers 头让服务器把允许浏览器访问的头放入白名单，例如：

```
Access-Control-Expose-Headers: X-My-Custom-Header, X-Another-Custom-Header
```
- Access-Control-Max-Age：指定了preflight请求的结果能够被缓存多久

- Access-Control-Allow-Credentials：指定了当浏览器的credentials设置为true时是否允许浏览器读取response的内容。

- Access-Control-Allow-Methods：首部字段用于预检请求的响应。其指明了实际请求所允许使用的 HTTP 方法。

# HTTP请求头部字段

- origin：发起请求的源站URL，不包含路径
   
  注意：无论是否跨域请求，`origin`都会被发送

- Accept-Control-Request-Method：用于预检请求，将实际所请求的方法告诉服务器

  在项目中如果是跨域请求时，我们发现同一个请求有两次发送，第一次是`options`，第二次才是真正的请求。第一次请求就是预检请求，请求头中会带上`Accept-Control-Request-Method`，值是我们真正要请求的方法

- Accept-Control-Request-Headers：用于预检请求时，将实际请求中的首部字段发送给服务器

