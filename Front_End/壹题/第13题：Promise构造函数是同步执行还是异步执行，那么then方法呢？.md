```
const promise = new Promise((resolve, reject) => {
  console.log(1)
  resolve()
  console.log(2)
})

promise.then(() => {
  console.log(3)
})

console.log(4)
```

从例子可以说明

- `proimse`构造函数是同步执行的，`then`方法是异步代码,会放入（micro tast）微任务中