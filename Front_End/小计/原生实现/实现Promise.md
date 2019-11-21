> [Promise实现原理（附源码）](https://juejin.im/post/5b83cb5ae51d4538cc3ec354#heading-2)

![](https://user-gold-cdn.xitu.io/2019/3/28/169c500344dfe50a?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

`Promies`用法

```
const pro = new Promise((resolve, reject) => {
  setTimeout(()=>{resolve('执行成功')}, 2000)
})
pro.then(res =>{console.log(res)})
```

### 简单版：

```
class myPromise{
    constructor(handle) {
      this.status = 'PENDING'
      try{
        handle(this.resolve.bind(this), this.reject.bind(this))
      } catch (e){
        this.reject(e)
      }
      this.doResolve = null
      this.doReject = null
    }
    resolve(val){
      if(this.status !== 'PENDING') return
      this.status === 'FULFILLED'
      this.doResolve(val)
    }
    reject(val){
      if(this.status !== 'PENDING') return
      this.status === 'REJECTED'
      this.doReject(val)
    }
    then(fn) {
      this.doResolve = fn
    }
    catch(fn) {
      this.doReject = fn
    }
  }
  var pro = new myPromise((resolve, reject) => {
    setTimeout(() => {resolve('执行成功')}, 2000)
  })
  pro.then(res => {console.log(res)})
```

这里关键是这句`  handle(this.resolve.bind(this), this.reject.bind(this))`这句，一时间没想到

### 支持多个`then`

```
  class myPromise{
    constructor(handle) {
      this.status = 'PENDING'
      try{
        handle(this.resolve.bind(this), this.reject.bind(this))
      } catch (e){
        this.reject(e)
      }
      this.doResolve = []
      this.doReject = null
    }
    resolve(val){
      if(this.status !== 'PENDING') return
      this.status === 'FULFILLED'
      this.doResolve.forEach(itemFn => {
        itemFn(val)
      })
    }
    reject(val){
      if(this.status !== 'PENDING') return
      this.status === 'REJECTED'
      this.doReject(val)
    }
    then(fn) {
      this.doResolve.push(fn)
    }
    catch(fn) {
      this.doReject = fn
    }
  }
  var pro = new myPromise((resolve, reject) => {
    setTimeout(() => {resolve('执行成功')}, 2000)
  })
  pro.then(res => {console.log(res)})
  pro.then(res => {console.log('then2'+res)})
```

### `then`返回promise

```
 class myPromise{
    constructor(handle) {
      this.status = 'PENDING'
      try{
        handle(this.resolve.bind(this), this.reject.bind(this))
      } catch (e){
        this.reject(e)
      }
      this.doResolve = []
      this.doReject = null
      this.sonResovle = null
      this.sonReject = null
    }
    resolve(val){
      if(this.status !== 'PENDING') return
      this.status === 'FULFILLED'
      this.doResolve.forEach(itemFn => {
        itemFn(val)
        this.sonResovle(val)
      })
    }
    reject(val){
      if(this.status !== 'PENDING') return
      this.status === 'REJECTED'
      this.doReject(val)
    }
    then(fn) {
      this.doResolve.push(fn)
      const _this = this
      return new myPromise((resolve, reject) => {
        _this.sonResovle = resolve
        _this.sonReject = reject
      })
    }
    catch(fn) {
      this.doReject = fn
    }
  }
  var pro = new myPromise((resolve, reject) => {
    setTimeout(() => {resolve('执行成功')}, 2000)
  })
  pro.then(res => {console.log(res)})
  pro.then(res => {console.log('then2'+res)})
    .then(res => console.log('sonThen' + res))
    .then(res => console.log('sonThen2' + res))

```
