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

Promise 新建后就会立即执行传入的函数，并且已同步的方式执行

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
 可传递参数，该参数会被 Promise 实例的 `then` 方法的每个参数接收。
 
 注意当 `resolve()` 传递的参数是一新的个 Promise 时，那么原来的 Promise 状态将会被这个新的 Promise 参数的影响

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

- 无论是在 `Promise` 中还是在 `then` , `catch` 中，抛出的错误总能被后面 `catch` 捕获  

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

`finally()` 方法用于指定不管 Promise 对象最后状态如何，都会执行的操作, 并且返回一个设置了 `finally` 回调函数的 Promise 对象

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

`finally()` 虽然与 `.then(onFinally, onFinally)` 类似，它们不同的是:

- 由于无法知道 `Promise` 的最终状态，所以 `finally` 的回调函数中不接收任何参数，它仅用于无论最终结果如何都要执行的情况

- 与 `Promise.resolve(2).then(() => {}, () => {})` （ `resolved` 的结果为 `undefined` ）不同，`Promise.resolve(2).finally(() => {})` `resolved` 的结果为 `2`。

- 同样，`Promise.reject(3).then(() => {}, () => {})` ( `resolved` 的结果为 `undefined` ), `Promise.reject(3).finally(() => {}`) `rejected` 的结果为 `3`

## Promise.resolve()

`Promise.resolve()` 等价于下面的写法

```js
Promise.resolve('foo')
// 等价于
new Promise(resolve => resolve('foo'))
```

`Promise.resolve` 方法的参数分成四种情况

**参数是一个 Promise 实例**

如果参数是 Promise 实例，那么 `Promise.resolve` 将不做任何修改、原封不动地返回这个实例

**参数是一个 `thenable` 对象**

`thenable` 对象指的是具有 `then` 方法的对象，比如下面这个对象

```js
let thenable = {
  then: function(resolve, reject) {
    resolve(42);
  }
}
```

`Promise.resolve `方法会将这个对象转为 Promise 对象，然后就立即执行 `thenable` 对象的 `then` 方法。

```js
let thenable = {
  then: function(resolve, reject) {
    resolve(42);
  }
};

let p1 = Promise.resolve(thenable);
p1.then(function(value) {
  console.log(value);  // 42
});

```
**参数不是具有then方法的对象，或根本就不是对象**

如果参数是一个原始值，或者是一个不具有 `then` 方法的对象，则 `Promise.resolve` 方法返回一个新的 Promise 对象，状态为 `resolved`

```js
const p = Promise.resolve('Hello');

p.then(function (s){
  console.log(s)
});
// Hello
```

**不带有任何参数**

`Promise.resolve()` 方法允许调用时不带参数，直接返回一个 `resolved` 状态的 Promise 对象

## Promise.reject() 

`Promise.reject(reason)` 方法也会返回一个新的 Promise 实例，该实例的状态为 `rejected`

```js
const p = Promise.reject('出错了');
// 等同于
const p = new Promise((resolve, reject) => reject('出错了'))

p.then(null, function (s) {
  console.log(s)
});
// 出错了

```

## Promise.all()

`Promise.all()` 方法用于将多个 Promise 实例，包装成一个新的 Promise 实例

```js
const p = Promise.all([p1, p2, p3])
```

上面例子中 `p` 的状态由 `p1`、`p2`、`p3` 决定

- 只有 `p1`、 `p2`、 `p3` 的状态都变成 `fulfilled` ，`p` 的状态才会变成 `fulfilled` ，此时 `p1` 、`p2` 、 `p3` 的返回值组成一个数组，传递给 `p` 的回调函数

- 只要 `p1` 、`p2`、`p3` 之中有一个被 `rejected`，`p` 的状态就变成 `rejected`，此时第一个被`reject` 的实例的返回值，会传递给 `p` 的回调函数

```js
Promise.all([Promise.resolve(), Promise.reject('err')])
.then(res => {
  console.log(res)
})
.catch(err => {
  console.log(err) // err
})
```

如果作为参数的 Promise 实例，自己定义了 `catch` 方法，那么它一旦被 `rejected`，并不会触发 `Promise.all()` 的 `catch` 方法

```js
const catchPro = Promise.reject('err')
  .catch(err => console.log(err))

Promise.all([Promise.resolve('res'), catchPro])
  .then(res => {
    console.log(res) // ["res", undefined]
  })
  .catch(err => {
    console.log(err)
  })
```

因为 `catchPro` 定义了 `catch`， 所以不会触发 `Promise.all()` 的 `catch` 方法, 因为 `catchPro.catch` 返回也是一个 `Promise` ， 所以上面 `Promise.all` 每个 Promise 实例实际上是 `catchPro.catch` 返回的 Promise

```js
const catchPro = Promise.reject('err')
  .catch(err => {
    throw Error('err')
  })
Promise.all([Promise.resolve('res'), catchPro])
  .then(res => {
    console.log(res)
  })
  .catch(err => {
    console.log('err', err) // err Error: err
  })
```

如果 `catch` 内抛出错误且当前 Promise 实例后面没有 `catch` 接收，这时才会被 `Promise.all` 的 `catch` 接收


## Promise.race()

`Promise.race()` 方法同样是将多个 Promise 实例，包装成一个新的 Promise 实例

```js
const p = Promise.race([p1, p2, p3]);
```

上面代码中，只要 `p1`、`p2`、`p3` 之中有一个实例率先改变状态，`p` 的状态就跟着改变。那个率先改变的 Promise 实例的返回值，就传递给 `p` 的回调函数

```js
function fetch(time){
  return new Promise((resolve, reject) => {
    setTimeout(resolve(10), time)
  })
}
const catchPro = Promise.reject('err')
Promise.race([catchPro, fetch(1000)])
  .then(res => {
    console.log(res)
  })
  .catch(err => {
    console.log('err', err) // err, err
  })
```

下面是一个例子，如果指定时间内没有获得结果，就将 Promise 的状态变为 `reject`，否则变为 `resolve`

```js
const p = Promise.race([
  fetch('/resource-that-may-take-a-while'),
  new Promise(function (resolve, reject) {
    setTimeout(() => reject(new Error('request timeout')), 5000)
  })
]);

p
.then(console.log)
.catch(console.error);
```

上面代码中，如果 `5` 秒之内 `fetch` 方法无法返回结果，变量p的状态就会变为 `rejected` ，从而触发 `catch` 方法指定的回调函数

## Promise.allSettled()

`Promise.allSettled()` 方法接受一组 Promise 实例作为参数，包装成一个新的 Promise 实例。只有等到所有这些参数实例都返回结果，不管是 `fulfilled `还是 `rejected` ，包装实例才会结束。该方法由 ES2020 引入

```js
Promise.allSettled([fetch(2000, false), fetch(1000)])
  .then(res => {
    console.log(res)
  })
  .catch(err => {
    console.log('err', err)
  })
```

上面的代码将在 3 秒后输出结果：

```js
0: {status: "rejected", reason: 10}
1: {status: "fulfilled", value: 10}
```

返回数组对象都有 `status` 属性，该属性的值只可能是字符串 `fulfilled` 或字符串 `rejected`

- `fulfilled` 时，对象有 `value` 属性

- `rejected` 时，对象有 `reason` 属性

该方法返回的新的 Promise 实例，一旦结束，状态总是 `fulfilled`，不会变成 `rejected`

## Promise.any()

`Promise.any()` 方法接受一组 Promise 实例作为参数，包装成一个新的 Promise 实例。只要参数实例有一个变成 `fulfilled` 状态，包装实例就会变成 `fulfilled` 状态；如果所有参数实例都变成 `rejected` 状态，包装实例就会变成 `rejected` 状态。该方法目前是一个第三阶段的提案

`Promise.any()` 跟 `Promise.race()` 方法很像，只有一点不同，就是不会因为某个 Promise 变成 `rejected` 状态而结束

```js
function fetch(time, sue = true){
  return new Promise((resolve, reject) => {
    let callback = sue ? resolve : reject
    setTimeout(() => {
      callback(10)
    }, time)
  })
}
// 待验证，浏览器目前不支持此方法
Promise.any([fetch(1000, false), fetch(1000)])
  .then(res => {
    console.log(res)
  })
  .catch(err => {
    console.log('err', err) // err, err
  })
```

Promise.any() 抛出的错误，不是一个一般的错误，而是一个 `AggregateError` 实例。它相当于一个数组，每个成员对应一个被 `rejected` 的操作所抛出的错误

```js
// 待验证
```

## Promise.try()

// todo

## 应用

**Generator 函数与 Promise 的结合**

使用 Generator 函数管理流程，遇到异步操作的时候，通常返回一个Promise对象

```js
function getFoo () {
  return new Promise(function (resolve, reject){
    resolve('foo');
  });
}

const g = function* () {
  try {
    const foo = yield getFoo();
    console.log(foo);
  } catch (e) {
    console.log(e);
  }
};

function run (generator) {
  const it = generator();

  function go(result) {
    if (result.done) return result.value;

    return result.value.then(function (value) {
      return go(it.next(value));
    }, function (error) {
      return go(it.throw(error));
    });
  }

  go(it.next());
}

run(g);

```

上面代码的 Generator 函数 `g` 之中，有一个异步操作 `getFoo`，它返回的就是一个 Promise 对象。函数`run` 用来处理这个 Promise 对象，并调用下一个 `next` 方法。

