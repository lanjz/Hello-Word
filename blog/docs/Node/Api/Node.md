# Node 架构

说到 Nodejs 架构, 首先要说到 Nodejs 与 V8 和 libUV 的关系和作用:

- V8：执行 JS 的引擎. 也就是翻译 JS. 包括我们熟悉的编译优化, 垃圾回收等等.

- libUV: 提供 async I/O, 提供消息循环. 可见, 是操作系统 API 层的一个抽象层

那么 Nodejs 如何组织它们呢? 如下图:

![](https://user-gold-cdn.xitu.io/2018/3/6/161fb632c82b19bd?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

Nodejs 通过一层 `C++ Binding`, 把 JS 传入 V8, V8 解析后交给 libUV 发起 `asnyc I/O`, 并等待消息循环调度. 再看看下面的图:

![](https://user-gold-cdn.xitu.io/2018/3/6/161fb632c27bb476?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)


# 事件循环

事件循环使 Node.js 可以通过将操作转移到系统内核中来执行非阻塞 I/O 操作（尽管 JavaScript 是单线程的）

由于大多数现代内核都是多线程的，因此它们可以处理在后台执行的多个操作。 当这些操作之一完成时，内核会告诉 Node.js，以便可以将适当的回调添加到轮询队列中以最终执行。 我们将在本文的后面对此进行详细说明

Node 启动时会初始化事件循环机制，每次事件循环会包含如下6个阶段

```
   ┌───────────────────────────┐
┌─>│           timers          │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │     pending callbacks     │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │       idle, prepare       │
│  └─────────────┬─────────────┘      ┌───────────────┐
│  ┌─────────────┴─────────────┐      │   incoming:   │
│  │           poll            │<─────┤  connections, │
│  └─────────────┬─────────────┘      │   data, etc.  │
│  ┌─────────────┴─────────────┐      └───────────────┘
│  │           check           │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
└──┤      close callbacks      │
   └───────────────────────────┘
```

## Time Phase

执行`setTimeout()`和`setInterval()`设定的回调

这些回调被保存在一个最小堆(min heap) 中. 这样引擎只需要每次判断头元素, 如果符合条件就拿出来执行, 直到遇到一个不符合条件或者队列空了, 才结束 Timer Phase.

Timer Phase 中判断某个回调是否符合条件的方法也很简单. 消息循环每次进入 Timer Phase 的时候都会保存一下当时的系统时间, 然后只要看上述最小堆中的回调函数设置的启动时间是否超过进入 Timer Phase 时保存的时间, 如果超过就拿出来执行.

此外, Nodejs 为了防止某个 Phase 任务太多, 导致后续的 Phase 发生饥饿的现象, 所以消息循环的每一个迭代(iterate) 中, 每个 Phase 执行回调都有个最大数量. 如果超过数量的话也会强行结束当前 Phase 而进入下一个 Phase. 这一条规则适用于消息循环中的每一个 Phase,

##  I/O Callback Phase

执行绝大部分回调（如`fs.read`, `socket` 等 `IO` 操作的回调函数），除了 `close`，`timers`和`setImmediate()`设定的回调

## Idle, Prepare Phase

仅内部使用

## Poll Phase

这是整个消息循环中最重要的一个 Phase, 作用是等待异步请求和数据, 在适当的条件下，Node会在这里阻塞

说它最重要是因为它支撑了整个消息循环机制. Poll Phase 首先会执行 `·watch_queue` 队列中的 IO 请求, 一旦 `watch_queue` 队列空, 则整个消息循环就会进入 `sleep` (在不同的平台上使用不同的技术. 比如 Linux 下使用 epoll, Win 下则是 IOCP, OS X 是 kqueue), 从而等待被内核事件唤醒

当然 Poll Phase 不能一直等下去. 它有着精妙的设计. 简单来说,

1. 它首先会判断后面的 Check Phase 以及 Close Phase 是否还有等待处理的回调. 如果有, 则不等待, 直接进入下一个 Phase

2. 如果没有其他回调等待执行, 它会给 epoll 这样的方法设置一个 timeout. 可以猜一下, 这个 timeout 设置为多少合适呢? 答案就是 Timer Phase 中最近要执行的回调启动时间到现在的差值, 假设这个差值是 detal. 因为 Poll Phase 后面没有等待执行的回调了. 所以这里最多等待 delta 时长, 如果期间有事件唤醒了消息循环, 那么就继续下一个 Phase 的工作; 如果期间什么都没发生, 那么到了 timeout 后, 消息循环依然要进入后面的 Phase, 让下一个迭代的 Timer Phase 也能够得到执行.

Nodejs 就是通过 Poll Phase, 对 IO 事件的等待和内核异步事件的到达来驱动整个消息循环的

## Check Phase

接下来是 Check Phase. 这个阶段只处理 `setImmediate` 的回调函数

那么为什么这里要有专门一个处理 `setImmediate` 的 Phase 呢? 简单来说, 是因为 Poll Phase 阶段可能设置一些回调, 希望在 Poll Phase 后运行. 所以在 Poll Phase 后面增加了这个 Check Phase

## Close Callbacks Phase

专门处理一些 close 类型的回调. 比如 `socket.on('close', ...)`. 用于资源清理

> 在每次事件循环运行之间，Node.js 会检查它是否正在等待任何异步 I/O 或 timers，如果没有，则将其干净地关闭

[](https://juejin.im/entry/5a9e90136fb9a028c8126341)

[](https://learnku.com/articles/38802)