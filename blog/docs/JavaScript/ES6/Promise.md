# Promise

Promise 对象是一个构造函数，用来生成 Promise 实例

```js
const promise = new Promise(function(resolve, reject) {
  // ... some code

  if (/* 异步操作成功 */){
    resolve(value);
  } else {
    reject(error);
  }
});
```

Promise 新建后就会立即执行传入的函数，并且已同步的方法执行

```js
let promise = new Promise(function(resolve, reject) {
  console.log('Promise');
  resolve();
});

promise.then(function() {
  console.log('resolved.');
});

console.log('Hi!');

// Promise
// Hi!
// resolved
```

## resolve方法

当调用 `resolve()` 方法， Promise 的状态将从 `pending` 置为 `fulfilled`，`resolve()`
 可传递参数，该参数会被 Promise 实例的 `then` 方法的每个参数接收

当调用 `resolve()` 方法， Promise 的状态将从 `pending` 置为 `fulfilled`，可是当 `resolve()` 传递的参数是个 Promise 时，那么状态将被这个参数 Promise 的状态影响

```js
const p1 = new Promise(function (resolve, reject) {
  setTimeout(() => reject(new Error('fail')), 3000)
})

const p2 = new Promise(function (resolve, reject) {
  setTimeout(() => resolve(p1), 1000)
})

p2
  .then(result => console.log(result))
  .catch(error => console.log(error))
// Error: fail
```

上面代码中，`p1` 是一个 Promise，3 秒之后变为 `rejected` 。`p2` 的状态在 1 秒之后改变，`resolve` 方法返回的是 `p1` 。由于 `p2` 返回的是另一个 Promise，导致 `p2` 自己的状态无效了，由 `p1` 的状态决定 `p2` 的状态。所以，后面的 `then` 语句都变成针对后者（`p1`）。又过了 2 秒，`p1` 变为 `rejected`，导致触发 `catch` 方法指定的回调函数

调用 `resolve` 或 `reject`  并不会终结 Promise 的参数函数的执行

```js
new Promise((resolve, reject) => {
  resolve(1);
  console.log(2);
}).then(r => {
  console.log(r);
});
// 2
// 1
```

## reject方法

当调用 `resolve()` 方法， Promise 的状态将从 `pending` 置为 `rejected`


## Promise.prototype.then()

`then()` 的作用是为 Promise 实例添加状态改变时的回调函数。 `then` 方法的第一个参数是 `resolved` 状态的回调函数，第二个参数（可选）是 `rejected` 状态的回调函数

`then` 方法返回的是一个新的 Promise 实例（注意，不是原来那个 Promise 实例）。因此可以采用链式写法，即 `then` 方法后面可以再调用 `then` 方法

```js
function fetch(time){
    return new Promise((resolve, reject) => {
      setTimeout(resolve, time)
    })
  }
const p1 = new Promise(function (resolve, reject) {
  fetch(2000, true)
  .then(res => {
    resolve('data1')
  })
})
p1.then(res => {
  console.log(res) // 2秒后 打印 data1
  return fetch(1000)
})
.then(res => {
  console.log(res) // 再过1秒后 打印 undefind
  return 'end'
})
.then(res => {
    console.log(res) // 基本跟上一次打印同时输出 'end'
})
```

## Promise.prototype.catch()

`Promise.prototype.catch()` 方法是 `.then(null, rejection)` 或 `.then(undefined, rejection)` 的别名，用于指定发生错误时的回调函数

```js
p.then((val) => console.log('fulfilled:', val))
  .catch((err) => console.log('rejected', err));

// 等同于
p.then((val) => console.log('fulfilled:', val))
  .then(null, (err) => console.log("rejected:", err));
```

`catch` 不仅可以接收 Promise 内部执行 `reject` 方法触发的错误，也可以接收 `then` 方法中错误

```js
Promise.resolve('执行成功')
.then(res => {
  console.log(res) // 执行成功
  throw Error("then 错误")
})
.then(res => {
  console.log(res) 
  return 'end'
})
.catch(err => {
    console.log('err1:', err)  // err1: Error then 错误
    return "catch 继续走"
})
.then(res => {
  console.log('then', res) // thenr catch 继续走
  throw Error("then 错误2")
})
.catch(err => {
    console.log('err2:', err)  // err1: Error then 错误
    return Promise.reject('catch2')
})
.catch(err => {
    console.log('err3:', err)  // catch2
})
```

从上面的例子可以看到几点规律：

- `catch` 方法也可以支持链式调用

- 无论是在 `Promise` 中还是在 `then` , `catch` 中，抛出的错误总能被后面 `catch` 

- `catch` 的 `return` 的值会被后面的 `then` 方法继续接收

如果 Promise 状态已经变成 `resolved` ，再抛出错误是无效的

```js
const promise = new Promise(function(resolve, reject) {
  resolve('ok');
  throw new Error('test');
});
promise
  .then(function(value) { console.log(value) })
  .catch(function(error) { console.log(error) });
// ok

```

如果没有使用 `catch()` 方法指定错误处理的回调函数，Promise 对象抛出的错误不会传递到外层代码，即不会有任何反应

```js
const someAsyncThing = function() {
  return new Promise(function(resolve, reject) {
    // 下面一行会报错，因为x没有声明
    resolve(x + 2);
  });
};

someAsyncThing().then(function() {
  console.log('everything is great');
});

setTimeout(() => { console.log(123) }, 2000);
// Uncaught (in promise) ReferenceError: x is not defined
// 123

```

## Promise.prototype.finally()

`finally()` 方法用于指定不管 Promise 对象最后状态如何，都会执行的操作

```js
promise
.then(result => {···})
.catch(error => {···})
.finally(() => {···});
```

`finally` 方法的回调函数不接受任何参数，这意味着没有办法知道，前面的 Promise 状态到底是 `fulfilled` 还是 `rejected` 。这表明，`finally` 方法里面的操作，应该是与状态无关的，不依赖于 Promise 的执行结果

```js
Promise.resolve('执行成功')
.then(res => {
  console.log(res) // 执行成功
  return 'then'
})
.finally(() => {
  console.log('finally') // finally
  return 'F'
})
.then(res => {
  console.log(res') // then
})
```

- `finally` 后面可以链式调用 `then` 方法收接前面的 `resolve` 任务，当然也可以使用 `catch` 方法收接前面的 `reject` 错误