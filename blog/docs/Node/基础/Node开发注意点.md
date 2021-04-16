# Node开发注意点

在 Node.js 中，有两种类型的线程：一个事件循环线程（也被称为主循环，主线程，事件线程等）。另外一个是在工作线程池里的 k 个工作线程（也被称为线程池）。

**哪种代码运行在事件轮询线程上?**

当 Node.js 程序运行时，程序首先完成初始化部分，即处理 require 加载的模块和注册事件回调。 然后，Node.js 应用程序进入事件循环阶段，通过执行对应回调函数来对客户端请求做出回应。 此回调将同步执行，并且可能在完成之后继续注册新的异步请求。 这些异步请求的回调也会在事件轮询线程中被处理。

事件循环中同样也包含很多非阻塞异步请求的回调，如网络 I/O。

总体来说，事件轮询线程执行事件的回调函数，并且负责对处理类似网络 I/O 的非阻塞异步请求

**哪种代码运行在工作线程池?**

Node.js 使用工作线程池来处理“高成本”的任务。 这包括一些操作系统并没有提供非阻塞版本的 I/O 操作，以及一些 CPU 密集型的任务。

Node.js 模块中有如下这些 API 用到了工作线程池：

- I/O 密集型任务：

  -DNS：dns.lookup()，dns.lookupService()。

  - 文件系统：所有的文件系统 API。除 fs.FSWatcher() 和那些显式同步调用的 API 之外，都使用 libuv 的线程池。

- CPU 密集型任务：

  - Crypto：crypto.pbkdf2()、crypto.scrypt()、crypto.randomBytes()、crypto.randomFill()、crypto.generateKeyPair()。

  - Zlib：所有 Zlib 相关函数，除那些显式同步调用的 API 之外，都适用 libuv 的线程池
  
虽然有 Node 有线程池加持提高 I/O 操作的性能，但是仍然只一个主线程（事件循环线程）来统一执行回调。所以如果主线程在处理某一个客户端请求时或回调时被阻塞了，它就无法处理其它客户端的请求了。因为**不要阻塞你的事件轮询线程**

## 不要阻塞你的事件轮询线程

事件轮询线程关注着每个新的客户端连接，协调产生一个回应。 所有这些进入的请求和输出的应答都要通过事件轮询线程。 这意味着如果你的事件轮询线程在某个地方花费太多的时间，所有当前和未来新的客户端请求都得不到处理机会了

**避免发生的阻塞的基本原则就是：尽量不要产生复杂的计算或循环**，比如下面示例随着 `n` 的增大，运行时间也会越久

```js
for (let i = 0; i < n; i++)
  sum += i;
let avg = sum / n;
console.log('avg: ' + avg);
```
如果无避免耗时计算使用的时候可以使用一些的优化手段：

**任务拆分**

可以把你的复杂计算拆分开，然后让每个计算分别运行在事件循环中

```js
function asyncAvg(n, avgCB) {
  // Save ongoing sum in JS closure.
  var sum = 0;
  function help(i, cb) {
    sum += i;
    if (i == n) {
      cb(sum);
      return;
    }

    // "Asynchronous recursion".
    // Schedule next operation asynchronously.
    setImmediate(help.bind(null, i+1, cb));
  }

  // Start the helper, with CB to call avgCB.
  help(1, function(sum){
      var avg = sum/n;
      avgCB(avg);
  });
}

asyncAvg(n, function(avg){
  console.log('avg of 1-n: ' + avg);
});
```

这种方案的缺点是：当前线程都将增加空间和时间开销

**任务分流**

- 通过开发 C++ 插件 的方式使用内置的 Node.js 工作池。使用 N-API。 node-webworker-threads 提供了一个仅用 JavaScript 就可以访问 Node.js 的工作池的方式

- 使用 `Child Process` 将分配一个进程执行任务，之后通信进程通信获取结果

这类方法的缺点是它增大了通信开销 

## 总结

Node.js 擅长于 I/O 密集型任务，但对于昂贵的计算，它可能不是最好的选择

> [不要阻塞你的事件循环（或是工作线程池）](https://nodejs.org/zh-cn/docs/guides/dont-block-the-event-loop/)