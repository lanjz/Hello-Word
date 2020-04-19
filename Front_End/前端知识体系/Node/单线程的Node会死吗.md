# 单线程的Node缺点

# 为什么Node不设计为多线程

# 单线的Node容易“死”吗？

Node.js 是单线程，所以经常被人诟病“太脆弱，动不动就崩溃”。但是，真的是这样的吗？

在实际项目应用中，Node是可以非常好地应对并发的，如果了解用法，就不会出现单线程脆弱的问题

以一个 I/O例子为例：

```
// 用模块 koa 启了一个服务，当访问服务的时候，会访问并不存在 some.txt 文件
const fs = require('fs')
const Koa = require('koa')
const app = new Koa()

app.use(ctx => {
    fs.readFile('some.txt', function(err, data){
        if (err) throw err
        console.log(data)
        ctx.body = 'Hello Kos'
    })
})
app.listen(3000)
```

执行`node app.js`，然后访问`http://localhost:3000/`， 界面将显示 `Not Found`,
并助我们的终端也报错了，node 服务也崩溃了

```
        if (err) throw err
                 ^

[Error: ENOENT: no such file or directory, open 'some.txt'] {
  errno: -2,
  code: 'ENOENT',
  syscall: 'open',
  path: 'some.txt'
}
```

这里通过`node app.js`启动服务，很明显只启动了一个 Node.js进程， Node.js又是单进程的，所以实际上本次操作只使用了一个线程来处理 Node.js 代码的具体逻辑，如果代码出错，那这个线程肯定要崩溃的。

在实际使用中当然不能因为一个接口异常，导致整个服务挂了，因此有几种方法来防止这种情况发生

## uncaughtException

使用捕获 `uncauchtExcetion` 异常就可以解决上面提到的问题，改过后的代码如下：

```
const fs = require('fs')
const Koa = require('koa')
const app = new Koa()

app.use(ctx => {
    fs.readFile('some.txt', function(err, data){
        if (err) throw err
        console.log(data)
        ctx.body = 'Hello Kos'
    })
})
process.on('uncaughtException', function(err){
    console.log('err')
})
app.listen(3000)
```

运行后并访问后，界面仍是显示的是 `Not Found`，但是 Node 服务并没有崩溃，
因为错误被我们捕获了

## 异常捕获

异常捕获即使用`try...catch`

```
const fs = require('fs')
const Koa = require('koa')
const app = new Koa()

app.use(ctx => {
    fs.readFile('some.txt', function(err, data){
        try{
            if (err) throw err
            console.log(data)
            ctx.body = 'Hello Kos'
        } catch(err) {
            console.log('err')
        }
    })
})
app.listen(3000)
```
但是使用`try...catch`需要注意以下几点：

- Node 里约定，同步代码才能捕获异常，异步代码不能用`try/catch`（与你采用的异步流程控制方式有关，如果使用 Promise， 就使用Promise的异常处理方法）

- 代码中都是`try/catch`有弊端

- 使用`try/catch`成本较高，除非必要，一般不建议使用

## forever

进程因异常退出是常见的事，当遇到崩溃退出的时候，重启就可以了。`forever`就是这么一个可以帮我重启的模块

- `yarn add forever -g`

- `forever start app.js`

启动服务并访问，程序崩溃后，然后使用 `forever` 处理 `crash`事件， 再启动一个新的 Node 进程， `forever`就是`打不死的小强`

## PM2

- `yarn global add pm2`

- `pm2 start app.js`

也很跟`forever`一样的崩溃重启功能，而且功能更加强大

