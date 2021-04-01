# ShareWorker

SharedWorker 接口代表一种特定类型的 worker，可以从几个浏览上下文中访问，例如几个窗口、iframe 或其他 worker，使用 ShareWorker 可以让我们多个页面同时控制一个脚本，这个脚本运行在独立的进程中，我们可以借用 ShareWorker 实现页面之间的通信和数据共享

**使用的页面和 worker.js 必需是同源的**

## 使用

```js
// worker.js
var clients = [];
onconnect = function(e) {
    var port = e.ports[0];
    clients.push(port);
    port.addEventListener('message', function(e) {
        for (var i = 0; i < clients.length; i++) {
            var eElement = clients[i];
            eElement.postMessage(e.data)
        }
    });
    port.start();
}
```

```html
<!--page1.html-->
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<button>发送</button>
<div></div>
<body>
<script>
    let testData = 0
    // 这段代码是必须的，打开页面后注册SharedWorker，显示指定worker.port.start()方法建立与worker间的连接
    if (typeof Worker === "undefined") {
        alert('当前浏览器不支持webworker')
    } else {
        let worker = new SharedWorker('worker.js?type=1')
        worker.port.addEventListener('message', (e) => {
            console.log('来自worker的数据：', e.data)
            document.querySelector('div').innerText = e.data
        }, false)
        worker.port.start()
        window.worker = worker
    }
    // 获取和发送消息都是调用postMessage方法，我这里约定的是传递'get'表示获取数据。
    document.querySelector('button').onclick = function() {
        window.worker.port.postMessage(testData++)
    }
</script>
</body>

</html>
```

```html
<!--page2.html-->
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<button>发送</button>
<div></div>
<body>
<script>
    let testData = 10000
    // 这段代码是必须的，打开页面后注册SharedWorker，显示指定worker.port.start()方法建立与worker间的连接
    if (typeof Worker === "undefined") {
        alert('当前浏览器不支持webworker')
    } else {
        let worker = new SharedWorker('worker.js?type=1')
        worker.port.addEventListener('message', (e) => {
            console.log('来自worker的数据：', e.data)
            document.querySelector('div').innerText = e.data
        }, false)
        worker.port.start()
        window.worker = worker
    }
    // 获取和发送消息都是调用postMessage方法，我这里约定的是传递'get'表示获取数据。
    document.querySelector('button').onclick = function() {
        window.worker.port.postMessage(testData--)
    }
</script>
</body>

</html>
```

无论哪个页面触发了发送按钮，两个页面都将收到通信
