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

- 