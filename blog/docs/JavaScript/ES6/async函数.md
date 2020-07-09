# async 函数

async 函数是 Generator 函数的语法糖，使得我们可以用同步的方式用于处理异步任务

```js
  function fetch(time, sue = true){
    return new Promise((resolve, reject) => {
      let callback = sue ? resolve : reject
      setTimeout(() => {
        callback('ye~')
      }, time)
    })
  }
  fetch(1000)
  .then(res => {
      console.log(res)
  })
  // async 写法
  const res = await fetch(1000)
  console.log(res)
```

`async` 函数返回一个 Promise 对象，可以使用 `then` 方法添加回调函数

```js
  async function asy(){
    const res = await fetch(1000)
    return res
  }
  asy()
  .then(res => {
      console.log('async', res)
    })
```

## 错误处理

处理 `async` 函数错误有几个几种：

**调用async函数时使用catch捕获错误**

`async` 函数内部抛出错误，会导致返回的 Promise 对象变为 `reject` 状态。抛出的错误对象会被 `catch` 方法回调函数接收到

```js
function fetch(time, sue = true, info){
    return new Promise((resolve, reject) => {
      let callback = sue ? resolve : reject
      setTimeout(() => {
        callback(info)
      }, time)
    })
  }

  async function asy(){
    const res = await fetch(1000, false, '给你一个错')
    return res
  }
  asy()
  .catch(err => {
      console.log('async', err)
    })
    // async 给你一个错
```

**try...catch**

```js
  async function asy(){
    try{
      const res = await fetch(1000, false, '给你一个错')
    } catch(err){
      console.log('err', err)
    }
  }
  asy()

```

如果错误已经被异步函数的 `catch` 捕获， 错误将不会冒泡到 `async` 函数

```js
async function asy(){
const res = await fetch(1000, false, '给你一个错')
    .catch(err => {
    console.log('我在里面处理了错误', err)
    return 'OK'
    })
    console.log('async', res)
}
asy()
// 我在里面处理了错误 给你一个错

// async OK
```

## 注意点

`await` 命令只能用在 `async` 函数之中，如果用在普通函数，就会报错

```js
  function fetch(time, sue = true, info){
    return new Promise((resolve, reject) => {
      let callback = sue ? resolve : reject
      setTimeout(() => {
        callback(info)
      }, time)
    })
  }

  let docs = [fetch, fetch, fetch];

  // 可能得到错误结果
  docs.forEach(async function (doc, index) {
    const res = await doc(1000, true, 'ye~');
    console.log('index', res)
  });
  // 1秒后同时输出 3个 index ye~

```

上面代码不会像预期那样的工作，原因是 `forEach` 内部循环了三个 `async` 函数，这时三个 `doc` 操作将是并发执行，也就是同时执行。正确的写法是采用 `for` 循环

```js
let docs = [fetch, fetch, fetch];
  

async function doAs(){
  for (let doc of docs) {
    const res = await doc(1000, true, 'ye~');
    console.log(res)
  }
}
doAs()
```

如果确实希望多个请求并发执行，可以使用 `Promise.all` 方法。当三个请求都会 `resolved` 时，下面两种写法效果相同

```js
async function dbFuc(db) {
  let docs = [{}, {}, {}];
  let promises = docs.map((doc) => db.post(doc));

  let results = await Promise.all(promises);
  console.log(results);
}

// 或者使用下面的写法

async function dbFuc(db) {
  let docs = [{}, {}, {}];
  let promises = docs.map((doc) => db.post(doc));

  let results = [];
  for (let promise of promises) {
    results.push(await promise);
  }
  console.log(results);
}
```

## async 函数的实现原理

async 函数的实现原理，就是将 Generator 函数和自动执行器，包装在一个函数

```js
async function fn(args) {
  // ...
}

// 等同于

function fn(args) {
  return spawn(function* () {
    // ...
  });
}
```
所有的 `async` 函数都可以写成上面的第二种形式，其中的 `spawn` 函数就是自动执行器。

下面给出 `spawn` 函数的实现，基本就是前文自动执行器的翻版

```js
function spawn(genF) {
  return new Promise(function(resolve, reject) {
    const gen = genF();
    function step(nextF) {
      let next;
      try {
        next = nextF();
      } catch(e) {
        return reject(e);
      }
      if(next.done) {
        return resolve(next.value);
      }
      Promise.resolve(next.value).then(function(v) {
        step(function() { return gen.next(v); });
      }, function(e) {
        step(function() { return gen.throw(e); });
      });
    }
    step(function() { return gen.next(undefined); });
  });
}
```