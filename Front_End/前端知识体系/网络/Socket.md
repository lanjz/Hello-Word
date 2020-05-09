# Socket

Socket 是应用于应用层和传输层之间抽象层，它把 TCP/IP 层复杂的操作抽象为几个简单的接口供应用层调用已实现进程在网络中通信

要想理解 socket 首先得熟悉一下TCP/IP协议族

## TCP/IP

TCP/IP（Transmission Control Protocol/Internet Protocol）即传输控制协议/网间协议，定义了主机如何连入因特网及数据如何再它们之间传输的标准

从字面意思来看TCP/IP是TCP和IP协议的合称，但实际上TCP/IP协议是指因特网整个TCP/IP协议族。不同于ISO模型的七个分层，
TCP/IP协议参考模型把所有的TCP/IP系列协议归类到四个抽象层中

应用层：TFTP，HTTP，SNMP，FTP，SMTP，DNS，Telnet 等等

传输层：TCP，UDP

网络层：IP，ICMP，OSPF，EIGRP，IGMP

数据链路层：SLIP，CSLIP，PPP，MTU

每一抽象层建立在低一层提供的服务上，并且为高一层提供服务，看起来大概是这样子的

![](https://images0.cnblogs.com/blog/349217/201312/05230830-04807bb739954461a8bfc7513707f253.jpg)

在TCP/IP协议中两个因特网主机通过两个路由器和对应的层连接。各主机上的应用通过一些数据通道相互执行读取操作

![](https://images0.cnblogs.com/blog/349217/201312/05221430-6bd4ce2a2cf7434ca9216c0a5b6a0985.png)

## socket

我们知道两个进程需要进行通讯最基本的一个前提条件是能够知道进程的唯一标识，在本地进程通讯中我们可以使用PID来唯一标示一个进程，但PID只在本地唯一，网络中的两个进程PID冲突几率很大，这时候我们需要另辟它径了，我们知道IP层的ip地址可以唯一标示主机，而TCP层协议和端口号可以唯一标示主机的一个进程，这样我们可以利用`ip地址＋协议＋端口号`唯一标示网络中的一个进程。

能够唯一标示网络中的进程后，它们就可以利用socket进行通信了

![](https://images0.cnblogs.com/blog/349217/201312/05225723-2ffa89aad91f46099afa530ef8660b20.jpg)

**socket通信流程**

socket是`打开—读/写—关闭`模式的实现，以使用TCP协议通讯的socket为例，其交互流程大概是这样子的

![](https://images0.cnblogs.com/blog/349217/201312/05232335-fb19fc7527e944d4845ef40831da4ec2.png)

**socket 通信过程**

服务端

1. 服务器根据地址类型（ipv4,ipv6）、socket类型、协议创建socket

2. 服务器为socket绑定ip地址和端口号

3. 服务器socket监听端口号请求，随时准备接收客户端发来的连接，这时候服务器的socket并没有被打开

客户端

4. 客户端创建socket

5. 客户端打开socket，根据服务器ip地址和端口号试图连接服务器socket

服务端

6. 服务器socket接收到客户端socket请求，被动打开，开始接收客户端请求，直到客户端返回连接信息。这时候socket进入阻塞状态，所谓阻塞即accept()方法一直到客户端返回连接信息后才返回，开始接收下一个客户端连解请求

7. 客户端连接成功，向服务器发送连接状态信息

8. 服务器`accept`方法返回，连接成功

9. 客户端向`socket`写入信息

10. 服务器读取信息

11. 客户端关闭

12. 服务器端关闭

服务器socket与客户端socket建立连接的部分其实就是大名鼎鼎的三次握手

> [简单理解Socket](https://www.cnblogs.com/dolphinx/p/3460545.html)