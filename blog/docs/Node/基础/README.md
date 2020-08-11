# Node 架构

Nodejs 的运行依赖于 V8 和 libUV 两大环境。

- V8：执行 JS 的引擎. 也就是翻译 JS. 包括我们熟悉的编译优化, 垃圾回收等等.

- libUV: 提供 async I/O, 提供消息循环. 可见, 是操作系统 API 层的一个抽象层

那么 Nodejs 如何组织它们呢? 如下图:

![](../static/node-1.png)

Nodejs 通过一层 `C++ Binding`, 把 JS 传入 V8, V8 解析后交给 libUV 发起 `asnyc I/O`, 并等待消息循环调度. 再看看下面的图:

![](../static/node-2.png)
