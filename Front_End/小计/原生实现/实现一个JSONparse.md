### `eval`方式

```
function strToJson(str) {
  return eval('('+str+')')
}
```

### `new Functoin()`方式

> [神奇的eval()与new Function()](https://imys.net/20151222/eval-with-new-function.html)

```
function strToJson(str) {
  return (new Function('return' + str))()
}
```

`eval` 与 `Function`都有着动态编译js代码的作用，存在XSS风险

### 其它方式

> [JSON.parse 三种实现方式](https://github.com/youngwind/blog/issues/115
