### 什么是错误优先的回调函数？

错误优先的回调函数用于传递错误和数据。第一个参数始终应该是一个错误对象， 用于检查程序是否发生了错误。其余的参数用于传递数据。例如：

```
fs.readFile(filePath, function(err, data) {  
    if (err) {
        //handle the error
    }
    // use the data object
});
```

### 如何避免回调地狱

你可以有如下几个方法：

- 模块化：将回调函数分割为独立的函数

- 使用Promises

- 使用`yield`


## 什么是孤儿进程？

父进程创建子进程之后，父进程退出了，但是父进程对应的一个或多个子进程还在运行，这些子进程会被系统的 init 进程收养，对应的进程 ppid 为 1，这就是孤儿进程。通过以下代码示例说明。

```
// master.js
const fork = require('child_process').fork;
const server = require('net').createServer();
server.listen(3000);
const worker = fork('worker.js');

worker.send('server', server);
console.log('worker process created, pid: %s ppid: %s', worker.pid, process.pid);
process.exit(0); // 创建子进程之后，主进程退出，此时创建的 worker 进程会成为孤儿进程

```

```
// worker.js
const http = require('http');
const server = http.createServer((req, res) => {
    res.end('I am worker, pid: ' + process.pid + ', ppid: ' + process.ppid); // 记录当前工作进程 pid 及父进程 ppid
});

let worker;
process.on('message', function (message, sendHandle) {
    if (message === 'server') {
        worker = sendHandle;
        worker.on('connection', function(socket) {
            server.emit('connection', socket);
        });
    }
});

```

控制台进行测试，输出当前工作进程 pid 和 父进程 ppid

```
worker process created, pid: 32971 ppid: 32970
```

由于在 master.js 里退出了父进程，活动监视器所显示的也就只有工作进程

![](https://ask.qcloudimg.com/http-save/yehe-3057196/2o9udya025.jpeg?imageView2/2/w/1620)

再次验证，打开控制台调用接口，可以看到工作进程 32971 对应的 ppid 为 1（为 init 进程），此时已经成为了孤儿进程

```
curl http://127.0.0.1:3000
I am worker, pid: 32971, ppid: 1
```

## 什么是僵尸进程

一个进程使用fork创建子进程，如果子进程退出，而父进程并没有调用wait或waitpid获取子进程的状态信息，那么子进程的进程描述符仍然保存在系统中。这种进程称之为僵死进程。任何一个子进程(init除外)在exit()之后，并非马上就消失掉，而是留下一个称为僵尸进程(Zombie)的数据结构，等待父进程处理。一旦有很多只处理少量任务的子进程完成任务后就退出，然后父进程又不管子进程的退出，然后就会产生很多的僵死进程，这样会对程序产生一定的危害

## 什么是 IPC 通信，如何建立 IPC 通信？什么场景下需要用到 IPC 通信？

IPC (Inter-process communication) ，即进程间通信技术，由于每个进程创建之后都有自己的独立地址空间，实现 IPC 的目的就是为了进程之间资源共享访问，实现 IPC 的方式有多种：管道、消息队列、信号量、Domain Socket，Node.js 通过 `pipe`来实现。

看一下 Demo，未使用 IPC 的情况

```
// pipe.js
const spawn = require('child_process').spawn;
const child = spawn('node', ['worker.js'])
console.log(process.pid, child.pid); // 主进程id3243 子进程3244
```

```
// worker.js
console.log('I am worker, PID: ', process.pid);
```

控制台执行 node pipe.js，输出主进程id、子进程id，但是子进程 worker.js 的信息并没有在控制台打印，原因是新创建的子进程有自己的stdio 流

创建一个父进程和子进程之间传递消息的 IPC 通道实现输出信息

修改 pipe.js 让子进程的 stdio 和当前进程的 stdio 之间建立管道链接，还可以通过 spawn() 方法的 stdio 选项建立 IPC 机制，

```
const spawn = require('child_process').spawn;
const child = spawn('node', ['worker.js'])
child.stdout.pipe(process.stdout);
console.log(process.pid, child.pid);

```

再次验证，控制台执行 `node pipe.js`，`worker.js` 的信息也打印了出来

```
$ 42473 42474
I am worker, PID:  42474

```


## 关于父进程与子进程是如何通信的

父进程在创建子进程之前会先去创建 IPC 通道并一直监听该通道，之后开始创建子进程并通过环境变量（NODECHANNELFD）的方式将 IPC 通道的文件描述符传递给子进程，子进程启动时根据传递的文件描述符去链接 IPC 通道，从而建立父子进程之间的通信机制

![](https://ask.qcloudimg.com/http-save/yehe-3057196/ooc03o3ckg.jpeg?imageView2/2/w/1620

## Node为什么是单线程

Javascript 为什么是单线程？这个问题需要从浏览器说起，在浏览器环境中对于 DOM 的操作，试想如果多个线程来对同一个 DOM 操作是不是就乱了呢，那也就意味着对于DOM的操作只能是单线程，避免 DOM 渲染冲突。在浏览器环境中 UI 渲染线程和 JS 执行引擎是互斥的，一方在执行时都会导致另一方被挂起，这是由 JS 引擎所决定的

## 如何让一个 js 文件在 Linux 下成为一个可执行命令程序

1. 新建 hello.js 文件，头部须加上 `#!/usr/bin/env node`，表示当前脚本使用 Node.js 进行解析

2. 赋予文件可执行权限 `chmod +x chmod +x /${dir}/hello.js`，目录自定义

3. 在 `/usr/local/bin` 目录下创建一个软链文件 `sudo ln-s/${dir}/hello.js/usr/local/bin/hello`，文件名就是我们在终端使用的名字

4. 终端执行 hello 相当于输入 node hello.js

```
#!/usr/bin/env node

console.log('hello world!')
```

终端测试

```
$ hello
hello world
```

## 进程的当前工作目录是什么? 有什么作用?

进程的当前工作目录可以通过 process.cwd() 命令获取，默认为当前启动的目录，如果是创建子进程则继承于父进程的目录，可通过 process.chdir() 命令重置，例如通过 spawn 命令创建的子进程可以指定 cwd 选项设置子进程的工作目录。


有什么作用？例如，通过 fs 读取文件，如果设置为相对路径则相对于当前进程启动的目录进行查找，所以，启动目录设置有误的情况下将无法得到正确的结果。还有一种情况程序里引用第三方模块也是根据当前进程启动的目录来进行查找的。

```
process.chdir('/Users/may/Documents/test/') // 设置当前进程目录

console.log(process.cwd()); // 获取当前进程目录
```