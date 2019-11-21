# 概念

简单来说HTTPS就是安全版的HTTP，HTTP是基于TCP/IP的应用层协议，HTTPS经由HTTP进行通信，但利用SSL/TLS来加密数据包。HTTPS的主要作用是，提供网站服务器的身份认证，保护交换数据的隐私与完整性。

# HTTPS工作流程

- TCP三次握手

- 客户端验证服务器数字证书

- DH 算法协商对称加密算法的密钥、hash 算法的密钥

- SSL安全加密隧道协商完成

- 网页以加密的方法传输，用协商的对称加密算法和密钥加密，保证数据机密性；用协商的hash算法进行数据完整性保护，保证数据不被篡改

# HTTP和HTTPS的区别

- HTTP 明文传输，数据都是未加密的，安全性较差，HTTPS（SSL+HTTP） 数据传输过程是加密的，安全性较好。

- 使用 HTTPS 协议需要到 CA（Certificate Authority，数字证书认证机构） 申请证书，一般免费证书较少，因而需要一定费用。证书颁发机构如：Symantec、Comodo、GoDaddy 和 GlobalSign 等。

- HTTP 页面响应速度比 HTTPS 快，主要是因为 HTTP 使用 TCP 三次握手建立连接，客户端和服务器需要交换 3 个包，而 HTTPS除了 TCP 的三个包，还要加上 ssl 握手需要的 9 个包，所以一共是 12 个包。

- http 和 https 使用的是完全不同的连接方式，用的端口也不一样，前者是 80，后者是 443。

- HTTPS 其实就是建构在 SSL/TLS 之上的 HTTP 协议，所以，要比较 HTTPS 比 HTTP 要更耗费服务器资源
