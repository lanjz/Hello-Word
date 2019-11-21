> [解决CORS跨域不能传递cookies的问题](https://juejin.im/post/5c8faf386fb9a0710a1bbfbe)

## 跨域请求时，服务端获取不到Cookie问题

![](https://user-gold-cdn.xitu.io/2019/3/18/16991605d284590b?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

koa配置相关Header：

```
// 响应头表示是否可以将对请求的响应暴露给页面
Access-Control-Allow-Credentials: true
// 允许跨域操作的具体域名,不能设为*，要设为具体域名
Access-Control-Allow-Origin: "http://localhost:8080"
// 允许跨域的HTTP方法
Access-Control-Allow-Methods: ["GET","POST","DELETE"]
// 列出将会在正式请求的 Access-Control-Expose-Headers 字段中出现的首部信息
Access-Control-Allow-Headers: ["Content-Type", "Authorization", "Accept"]
```

前端处理

```
// 表示跨域请求时是否需要使用凭证
axios.defaults.withCredentials = true
```
