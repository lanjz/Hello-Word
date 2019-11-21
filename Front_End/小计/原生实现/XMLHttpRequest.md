> [你真的会使用XMLHttpRequest吗？](https://segmentfault.com/a/1190000004322487)

# XMLHttpRequest使用例子

```
  var url = '/test'
  var data = new formatDate()
  data.append('username', 'lanjz')
  var xhr = new XMLHttpRequest()
  xhr.open('get', url, true) // 第三个参数表示异步执行
  xhr.setRequestHeader()
  xhr.timeout = 3000 // 请求过期时间
  xhr.responseType = 'text'
  xhr.onreadystatechange(stateChange)
  function stateChange() {
    if(xhr.readyState === 4) {
      if(xhr.status === 200) {
        console.log(xhr.responseText)
      }
    }
  }
  xhr.ontimeout = function (e) {
    console.log('请求超时', e)
  }
  xhr.onerror = function (e) {
    console.log('请求发生错误', e)
  }
  xhr.upload.onprogress = function (e) {
    console.log('当前进度', e)
  }
  xhr.send(data)
```

# readyState

-  0：初始化状态，未打开，此时`xhr`对象被成功构造，`open()`方法还未被调用

- 1：已经打开，未发送，`open()`已打开，`send()`还没被调用

  注意：只有`xhr`处于OPENED状态，才能调用`xhr.setRequestHeader()`和`xhr.send()`，否则会报错

- 2：`send()`方法已经被调用，响应头和响应状态已经返回

- 3：响应体正在下载中，此状态下通过`xhr.response`可能已经有了响应数据

- 4：整个数据传输过程结束，不管本次请求是成功还是失败
