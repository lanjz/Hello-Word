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

## 创建子进程

Node中使用 `child_process` 模块来实现多进程的支持

`child_process` 模块中包括了很多创建子进程的方法:

- `child_process.exec(command[, options][,callback])`： 执行一条`command <shell命令>` ，通过回调参数返回结果

- `child_process.execFile(file[, options][,callback])`：运行一个可执行文件的名称或路径

- `child_process.spawn(command[, args][,callback])`：适用于返回大量数据，例如图像处理，二进制数据处理

- `child_process.fork(modulePath[, args][,callback])`： 衍生新的进程，进程之间是相互独立的，每个进程都有自己的 V8 实例、内存

下面来了解了解这个四种创建进程的基本用法

### exec

`child_process.exec` 使用子进程执行命令，缓存子进程的输出，并将子进程的输出以回调函数参数的形式一次性返回。`exec` 方法会从子进程中返回一个完整的 `buffer` 。默认情况下，这个 `buffer` 的大小应该是 `200k`。如果子进程返回的数据大小超过了 `200k`，程序将会崩溃，同时显示错误信息 `Error：maxBuffer exceeded` 。你可以通过在 `exec` 的可选项中设置一个更大的 `buffer` 体积来解决这个问题，但是你不应该这样做，因为 `exec` 本来就不是用来返回很多数据的方法

`child_process.exec(command[, options][, callback])` 的参数：

- `command <string>`: 要运行的命令，并带上以空格分隔的参数

- `options <object>`: 配置选项

- `callback <Function>`: 当进程终止时调用并传入输出

  - `error <Error>`

  - `stdout <string> | <Buffer>`

  - `stderr <string> | <Buffer>`

栗子：

```js
require('child_process').exec('dir', {encoding: 'utf-8'}, function(err, stdout, stderr) {
    if (err) {
        console.log(error.stack);
        console.log('Error code: ' + error.code);
        console.log('Signal received: ' + error.signal);
    }
    //console.log(err, stdout, stderr);
    console.log('data : ' + stdout);
}).on('exit', function (code) {
    console.log('子进程已退出, 退出码 ' + code);
});
```

### execFile

`child_process.execFile()` 函数类似于 `child_process.exec()`，但默认情况下不会衍生 `shell`,可接收参数：

- `file <string>` 要运行的可执行文件的名称或路径

- `args <string[]>` 字符串参数的列表

- `options <object>`: 配置选项

- `callback <Function>`: 当进程终止时调用并传入输出

  - `error <Error>`

  - `stdout <string> | <Buffer>`

  - `stderr <string> | <Buffer>`

栗子：

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

### spawn

`child_process.spawn` 使用指定的命令行参数创建新进程。`spawn` 会返回一个带有 `stdout` 和 `stderr` 流的对象。你可以通过 `stdout` 流来读取子进程返回给Node.js的数据。`stdout` 拥有 `data`, `end` 以及一般流所具有的事件。当你想要子进程返回大量数据给 Node 时，比如说图像处理，读取二进制数据等等，你最好使用 `spawn`方法

`child_process.spawn(command[, args][, options])` 接收参数：

- `command <string> `: 要运行的命令

- `arg <string> `: 字符串参数的列表

- `options<Object>`: 配置项

栗子：

```js
var child_process = require('child_process');
var spawnObj = child_process.spawn('ping', ['127.0.0.1'], {encoding: 'utf-8'});
spawnObj.stdout.on('data', function(chunk) {
    console.log('stdout data' + chunk.toString());
});
spawnObj.stderr.on('data', (data) => {
  console.log('stderr data' + data);
});
spawnObj.on('close', function(code) {
    console.log('close code : ' + code);
})
spawnObj.on('exit', (code) => {
    console.log('exit code : ' + code);
})
```

### fork

`child_process.fork()` 可传递的参数：

- `modulePath <string> `: 要在子进程中运行的模块

- `arg <string> `: 字符串参数的列表

- `options<Object>`: 配置项

返回: `<ChildProcess>`

`child_process.fork()` 方法是 `child_process.spawn()` 的特例，专门用于衍生新的 Node.js 进程。 与 `child_process.spawn()` 一样返回 `ChildProcess` 对象。 返回的 `ChildProcess` 会内置额外的通信通道（ IPC 通道），允许消息在父进程和子进程之间来回传递

**通信方法**

当父进程和子进程之间已建立了一个 IPC 通道时（例如，使用 `child_process.fork()`）， `subprocess.send()` 方法可用于发送消息到子进程。 当子进程是一个 Node.js 实例时，则消息可以通过 `message` 事件接收。

::: warning
消息通过序列化和解析进行传递，接收到消息可能跟最初发送的不完全一样
:::

栗子：我们使用 `child_process.fork` 优化一下之前的服务

```js
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

```js
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

`fork` 确实可以开启多个进程，但是并不建议衍生出来太多的进程，通常要根据系统 **CPU 核心数** 来设置。cpu 核心数的获取方式 `const cpus = require('os').cpus()` ; 这里 `cpus` 返回一个对象数组，包含所安装的每个 CPU/内核的信息，二者总和的数组哦。假设主机装有两个 cpu，每个 cpu 有 `4` 个核，那么总核数就是 `8`

:::tips
开启多进程不是为了解决高并发，主要是解决了单进程模式下 Node.js CPU 利用率不足的情况，充分利用多核 CPU 的性能
:::

## 孤儿进程和僵尸进程

当父进程退出后，子进程会被 `init` 进程接管，此时它就成了孤儿进程（orphan process）。

当子进程退出时，在进程表中还有条目保存进程信息，直到父进程使用 `wait` 读取子进程退出状态才会清理进程表中的条目。如果父进程不读取，该进程就成了僵尸进程（zombie process）

[Node.js 进阶之进程与线程](https://www.imooc.com/article/288006)

[分享 10 道 Nodejs 进程相关面试题](https://juejin.im/post/5d082214f265da1bb564f97b)
