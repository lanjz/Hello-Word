# Preload和Prefetch

## Prefetch

告诉浏览器这个资源将来可能需要，但是什么时间加载这个资源是由浏览器来决定的

## 缓存行为

资源被 preload 或者 prefetch 后，会从网络堆栈传输到 HTTP 缓存并进入渲染器的内存缓存。 如果资源可以被缓存（例如，存在有效的 cache-control 和 max-age），它将存储在 HTTP 缓存中，可用于当前和未来的会话。 如果资源不可缓存，则不会将其存储在 HTTP 缓存中。 相反，它会被缓存到内存缓存中并保持不变直到它被使用


[https://blog.fundebug.com/2019/04/11/understand-preload-and-prefetch/](https://blog.fundebug.com/2019/04/11/understand-preload-and-prefetch/)

## 使用注意点

- 对同一资源一起使用 `preload` 和 `prefetch` 会导致二次获取

## DNS Prefetch

DNS prefetching 允许浏览器在用户浏览页面时在后台运行 DNS 的解析。如此一来，DNS 的解析在用户点击一个链接时已经完成，所以可以减少延迟。可以在一个 link 标签的属性中添加 rel="dns-prefetch' 来对指定的 URL 进行 DNS prefetching

```html
 <link rel="dns-prefetch" href="//fonts.googleapis.com">
 <link rel="dns-prefetch" href="//www.google-analytics.com">
 <link rel="dns-prefetch" href="//opensource.keycdn.com">
 <link rel="dns-prefetch" href="//cdn.domain.com">
```

## Prerende

Prerender 和 prefetch 非常相似，它们都优化了可能导航到的下一页上的资源的加载，区别是 prerendering 在后台渲染了整个页面，整个页面所有的资源。如下:

```html
<link rel="prerender" href="https://www.keycdn.com">
```

要小心的使用 prerender，因为它将会加载很多资源并且可能造成带宽的浪费

## Preconnect

preconnect 允许浏览器在一个 HTTP 请求正式发给服务器前预先执行一些操作，这包括 DNS 解析，TLS 协商，TCP 握手，这消除了往返延迟并为用户节省了时间

preconnect 可以直接添加到 HTML 中 link 标签的属性中，也可以写在 HTTP 头中或者通过 JavaScript 生成，如下是一个为 CDN 使用 preconnect 的例子：

```html
<link href="https://cdn.domain.com" rel="preconnect" crossorigin>
```

[](https://cloud.tencent.com/developer/article/1552083)
[](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Preloading_content)