# keep-alive

HTTP `keep-alive` 也称为 HTTP 长连接, 是一个通用消息头。它通过重用一个 TCP 连接来发送/接收多个 HTTP请求，来减少创建/关闭多个 TCP 连接的开销。

在 Http 1.0 中，Keep-Alive是没有官方支持的，但是也有一些 Server 端支持

Http1.1 以后，Keep-Alive 已经默认支持并开启

## 使用`keep-alive`

客户端（包括但不限于浏览器）发送请求时会在 Header 中增加一个请求头 `Connection: Keep-Alive`，当服务器收到附带有 `Connection: Keep-Alive` 的请求时，也会在响应头中添加 `Keep-Alive`, 这样一来，客户端和服务器之间的 HTTP 连接就会被保持，不会断开（断开方式下面介绍），当客户端发送另外一个请求时，就可以复用已建立的连接。

```js
HTTP/1.1 200 OK
Connection: Keep-Alive
Content-Encoding: gzip
Content-Type: text/html; charset=utf-8
Date: Thu, 11 Aug 2016 15:23:13 GMT
Keep-Alive: timeout=5, max=1000
Last-Modified: Mon, 25 Jul 2016 04:32:39 GMT
Server: Apache

(body)

```

- `timeout`: 空闲时保持打开状态的最小时长（以秒为单位）

- `max`: 在连接关闭之前，在此连接可以发送的请求的最大值

## `keep-alive`不足之处

保持连接是比较浪费资源的，可能会非常影响性能，因为它在文件被请求之后还保持了不必要的连接很长时间，额外占用了服务端的连接数

## Http 连接复用后怎样断开连接

Http 协议规定了两种关闭复用连接的方式：

**通过 Keep-Alive Timeout 标识**

如果服务端 Response Header 设置了 `Keep-Alive:timeout={timeout}`，客户端会就会保持此连接 `timeout`（单位秒）时间，超时之后关闭连接。

`Keep-Alive: timeout=5, max=1000`

**Connection close**

客户端发送Header头：`Connection: close`

## 服务端开启keep-alive

Httpd 守护进程，一般都提供了 `keep-alive timeout` 时间设置参数, `nginx` 本身仅支持一个` keepalive_timeout` 指令

```js
location /cqjt/ {   
    alias /url/var/www/html/;   
    keepalive_timeout  75;   
    expires 5m;   
} 
```

## tcp keep-alive

`tcp keep-alive` 与 `http keep-alive`，不是同一回事

`tcp keep-alive` 是TCP的一种检测TCP[连接]状况的保鲜机制,定时发送一个空的 TCP Segment，来监测连接是否存活

**如何设置它?**

KeepAlive都支持哪些设置项

- `tcp_keepalive_time: KeepAlive` 的空闲时长，或者说每次正常发送心跳的周期，默认值为`7200s（2小时）`

- `tcp_keepalive_intvl`: KeepAlive探测包的发送间隔，默认值为75s

- `tcp_keepalive_probes`: 在`tcp_keepalive_time`之后，没有接收到对方确认，继续发送保活探测包次数，默认值为9（次）

[聊聊 TCP 中的 KeepAlive 机制](https://zhuanlan.zhihu.com/p/28894266)
