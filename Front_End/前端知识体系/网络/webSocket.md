# WebSocket

Websocket是一个持久化的协议

## WebSocket 机制

WebSocket是HTML5下一种新的协议。它实现了浏览器与服务器全双工通信，能更好的节省服务器资源和带宽并达到实时通讯的目的。它与HTTP一样通过已建立的TCP连接来传输数据，但是它和HTTP最大不同是：

- WebSocket是一种双向通信协议。在建立连接后，WebSocket服务器端和客户端都能主动向对方发送或接收数据，就像Socket一样；

- WebSocket需要像TCP一样，先建立连接，连接成功后才能相互通信

相比HTTP长连接，WebSocket有以下特点：

- 无跨域问题。
 
- 支持双向通信，实时性更强；

- 可以发送文本，也可以二进制文件

- 协议标识符是 ws，加密后是 wss

- HTTP长连接中，每次数据交换除了真正的数据部分外，服务器和客户端还要大量交换`HTTP header`。
Websocket协议通过第一个`request`建立了TCP连接之后，之后交换的数据都不需要发送 `HTTP header`就能交换数据

- 支持扩展。ws协议定义了扩展，用户可以扩展协议，或者实现自定义的子协议。（比如支持自定义压缩算法等）

- 不同的URL可以复用同一个WebSocket连接等功能。这些都是HTTP长连接不能做到的。

# WebSocket的API

使用构造函数`new WebSocket("ws://localhost:3001")`建立 WebSocket 连接, 并返回一个 WebSocket 对象

WebSocket 对象包含以下属性：

- `onclose`：用于指定连接关闭后的回调函数

- `onerror`： 用于指定连接失败后的回调函数

- `onmessage`： 用于指定当从服务器接受到信息时的回调函数

- `onopen`： 用于指定连接成功后的回调函数

- `readyState`(只读) ： 当前的链接状态

- `url`(只读): WebSocket 的绝对路径

- `bufferedAmount`(只读)： 未发送至服务器的字节数

- `protocol` (只读) ： 服务器选择的下属协议

WebSocket 对象包含以下方法：

`close`: 关闭当前链接

`send`: 向服务器发送数据

# 示例

node使用 实现 websocket 服务的模块：`ws`

见demo






