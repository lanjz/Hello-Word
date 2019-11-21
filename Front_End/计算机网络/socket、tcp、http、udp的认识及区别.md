> [写给那些让我糊里糊涂的HTTP、TCP、UDP、Socket](https://jackchan1999.github.io/2017/04/30/java/%E5%86%99%E7%BB%99%E9%82%A3%E4%BA%9B%E8%AE%A9%E6%88%91%E7%B3%8A%E9%87%8C%E7%B3%8A%E6%B6%82%E7%9A%84HTTP%E3%80%81TCP%E3%80%81UDP%E3%80%81Socket/)

网络由下往上分为：物理层、数据链路层、网络层、传输层、会话层、表示层、应用层

IP协议属于网络层，TCP协议属于传输层，HTTP协议属于应用层，三者本质上没有可比性，socket则是对TCP/IP协议的封闭和应用

可以说，TCP/IP属性传输层协议，主要解决数据如何在网络中传输，而HTTP是应用层协议，主要是解决如果包装数据;socket是对TCP/IP协议的封装，Socket本身并不是协议，而是一个调用接口（API），通过socket，我们才能使用TCP/IP协议

socket是对TCP/IP协议的封装，从而形成了我们知道的一些最基本的函数接口，比如`create`、`listen`、`connect`、`accept`等等

实际上，传输层的TCP是基于网络层的IP协议，而应用层的HTTP是基于传输层的TCP协议的
