# 前端优化之 Http 相关优化总结

## 减少静态资源文件大小

代码层次

- 代码分割

网络传输方面

- Http 启用压缩传输方式

  ``` 
  Content-Encoding: gzip
  ```
  
- 合并请求

## 预加载

使用 `link` 标签创建

```
<!-- 使用 link 标签静态标记需要预加载的资源 -->
<link rel="preload" href="/path/to/style.css" as="style">

<!-- 或使用脚本动态创建一个 link 标签后插入到 head 头部 -->
<script>
const link = document.createElement('link');
link.rel = 'preload';
link.as = 'style';
link.href = '/path/to/style.css';
document.head.appendChild(link);
</script>
```
使用 HTTP 响应头的 Link 字段创建

```
Link: <https://example.com/other/styles.css>; rel=preload; as=style
```

使用 preload 场景示例：

如果需要，你可以完全以脚本化的方式来执行这些预加载操作。例如，我们在这里创建一个HTMLLinkElement 实例，然后将他们附加到 DOM 上：

```
var preloadLink = document.createElement("link");
preloadLink.href = "myscript.js";
preloadLink.rel = "preload";
preloadLink.as = "script";
document.head.appendChild(preloadLink);
```

这意味着浏览器将预加载这个JavaScript文件，但并不实际执行它。

如果要对其加以执行，在需要的时候，你可以执行：

```
var preloadedScript = document.createElement("script");
preloadedScript.src = "myscript.js";
document.body.appendChild(preloadedScript);
```

## 懒加载

## 利用缓存

## HTTP2.0

## 使用CDN

## 小图片使用base64

## 图片合并