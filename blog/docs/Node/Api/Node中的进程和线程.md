# Node中的进程和线程

Node.js 是 Javascript 在服务端的运行环境，**构建在 chrome 的 V8 引擎之上，基于事件驱动、非阻塞I/O模型**，充分利用操作系统提供的异步 I/O 进行多任务的执行，适合于 I/O 密集型的应用场景，因为异步，程序无需阻塞等待结果返回，而是基于回调通知的机制，原本同步模式等待的时间，则可以用来处理其它任务

::: tip
科普：在 Web 服务器方面，著名的 Nginx 也是采用此模式（事件驱动），避免了多线程的线程创建、线程上下文切换的开销，
Nginx 采用 C 语言进行编写，主要用来做高性能的 Web 服务器，不适合做业务。
:::

注意上面所说的 Node 所谓的非阻塞是针对定时器，IO操作，请求这类的情况，对于需要 CPU 耗时的操作时候就不适用了，比如以下服务：

```js
// compute.js
const http = require('http');
const longComputation = () => {
  let sum = 0;
  for (let i = 0; i < 1e10; i++) {
    sum += i;
  };
  return sum;
};
const server = http.createServer();
server.on('request', (req, res) => {
  if (req.url === '/compute') {
    console.info('计算开始',new Date());
    const sum = longComputation();
    console.info('计算结束',new Date());
    return res.end(`Sum is ${sum}`);
  } else {
    res.end('Ok')
  }
});

server.listen(3000);
```

查看打印结果，当我们调用 `127.0.0.1:3000/compute`的时候，如果想要调用其他的路由地址比如 `127.0.0.1/` 大约需要 `15秒` 时间，也可以说一个用户请求完第一个 `compute接口` 后需要等待 `15秒` ，这对于用户来说是极其不友好的。对于这种需要耗时计算，则需要通过开启开进程或者多线程方式去解决

## Node中的进程操作

Node.js 中提供了一个 `Process` 全局对象，提供了有关当前 Node 进程的信息， `Process` 对象无需 `require` 就可以直接使用,下面是 `Process` 常用属性：

- `process.env`：环境变量，例如通过 `process.env.NODE_ENV` 获取不同环境项目配置信息

- `process.nextTick`：这个在谈及 `Event Loop` 时经常为会提到,将回调放在事件循环的何一阶段结束之后执行

- `process.pid`：获取当前`进程id`

- `process.ppid`：当前进程对应的父进程

- `process.cwd()`：获取当前进程工作目录

- `process.platform`：获取当前进程运行的操作系统平台

- `process.uptime()`：当前进程已运行时间，例如：`pm2` 守护进程的 `uptime` 值

- `process.title` 指定进程名称，有的时候需要给进程指定一个名称


进程事件：

- `process.on('uncaughtException', cb)`: 捕获异常信息

- `process.on('exit', cb）`:进程推出监听

三个标准流:

- `process.stdout`: 标准输出

- `process.stdin` 标准输入

- `process.stderr` 标准错误输出

### 创建子进程

Node中使用 `child_process` 模块来实现多进程的支持

`child_process` 模块中包括了很多创建子进程的方法:

- `child_process.exec(command[, options][,callback])`： 执行一条`command <shell命令>` ，通过回调参数返回结果
  
  - `command <string>` 要运行的命令，并带上以空格分隔的参数。

  ```js
  const { exec } = require('child_process');

  exec('ls', (err, stdout, stderr) => {
      if (err) {
          console.error(`exec error: ${err}`);
          return;
      }
      console.log(`Number of files ${stdout}`);
  });
  // Number of files app1.js
  //app2.js
  //app3.js
  //mod.js
  //node_modules
  //package.json
  //yarn.lock
  //待看.md
  ```
  适用于小量数据，`maxBuffer` 默认值为 `200 * 1024` 超出这个默认值将会导致程序崩溃，数据量过大可采用 `spawn`

- `child_process.execFile(file[, options][,callback])`：

  - `file <string>` 要运行的可执行文件的名称或路径

  - `args <string[]>` 字符串参数的列表

  类似 `child_process.exec()`，区别是不能通过 `shell` 来执行，不支持像 I/O 重定向和文件查找这样的行为

  ```js
  const { execFile } = require('child_process');
  const child = execFile('node', ['--version'], (error, stdout, stderr) => {
    if (error) {
      throw error;
    }
    console.log(stdout);
  });
  // v13.1.0
  ```

- `child_process.spawn(command[, args][,callback])`：适用于返回大量数据，例如图像处理，二进制数据处理

- `child_process.fork(modulePath[, args][,callback])`： 衍生新的进程，进程之间是相互独立的，每个进程都有自己的 V8 实例、内存，系统资源是有限的，不建议衍生太多的子进程出来，通长根据系统** CPU 核心数**设置。

  我们使用`child_process.fork`优化一下之前的服务

  ```
  const http = require('http');
  const fork = require('child_process').fork;
  const server = http.createServer();
  server.on('request', (req, res) => {
    if (req.url === '/compute') {
      const compute = fork('./fork_compute.js');
      compute.send('开启一个新的子进程');
      // 当一个子进程使用 process.send() 发送消息时会触发 'message' 事件
      compute.on('message', sum => {
          res.end(`Sum is ${sum}`);
          compute.kill();
      });
      // 子进程监听到一些错误消息退出
      compute.on('close', (code, signal) => {
          console.log(`收到close事件，子进程收到信号 ${signal} 而终止，退出码 ${code}`);
          compute.kill();
      })

    } else {
      res.end('Ok')
    }
  });

  server.listen(3000)
  ```

  ```
  // chchild_processild.js
  const computation = () => {
      let sum = 0;
      console.info('计算开始');
      console.time('计算耗时');

      for (let i = 0; i < 1e10; i++) {
          sum += i
      };

      console.info('计算结束');
      console.timeEnd('计算耗时');
      return sum;
  };

  process.on('message', msg => {
      console.log(msg, 'process.pid', process.pid); // 子进程id
      const sum = computation();

      // 如果Node.js进程是通过进程间通信产生的，那么，process.send()方法可以用来给父进程发送消息
      process.send(sum);
  })

  ```

`fork` 确实可以开启多个进程，但是并不建议衍生出来太多的进程，cpu核心数的获取方式`const cpus = require('os').cpus()`;这里 `cpus` 返回一个对象数组，包含所安装的每个 CPU/内核的信息，二者总和的数组哦。假设主机装有两个cpu，每个cpu有4个核，那么总核数就是`8`

### child_process.exec(command[, options][, callback])

`command` <string> 要运行的`shell命令`，并带上以空格分隔的参数



# 单线程的Node

[nodejs多线程，真正的非阻塞](https://cnodejs.org/topic/518b679763e9f8a5424406e9)
[平台模块tagg2，让node多线程支持](https://cnodejs.org/topic/51976afe63e9f8a542484e66)

Node.js 虽然是单线程模型，但是其基于事件驱动、异步非阻塞模式，可以应用于高并发场景，避免了线程创建、线程之间上下文切换所产生的资源开销。
但这仅限时定时器，IO操作，请求这类的情况
对于需要大量计算，CPU 耗时的操作就不适用了，比如以下服务



[分享 10 道 Nodejs 进程相关面试题](https://juejin.im/post/5d082214f265da1bb564f97b)

[](https://cnodejs.org/topic/58b9459ce418a986315f3b59)