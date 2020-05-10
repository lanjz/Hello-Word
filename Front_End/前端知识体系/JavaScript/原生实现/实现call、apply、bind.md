
## call

实现自定义`call`的思路：

假设要执行的上下文为`ctx`。我们知道执行函数的`this`是指向调用该函数的环境的，所以可以将要调用的函数复制给`ctx`的某个属性，
然后执行`ctx`的这个属性，这样这个函数`this`就指向这个`ctx`环境

具体实现代码如下：

```
 const dom = {
      name: 'is dom'
    }
 const obj = {
      name: 'lanjz',
      showName(...arg) {
        console.log('name:', this.name, arg)
      }
    }
obj.showName(1,2,3) // lanjz (3) [1, 2, 3]
// 方式一
Function.prototype._call= function (ctx, ...arg) {
    ctx.doFn = this 
    ctx.doFn(...arg)
    delete ctx.doFn
}
obj.showName._call(dom, 1,2,3) // name: is dom (3) [1, 2, 3]

// 方式二
function _call(fn, ctx, ...arg) {
      ctx.doFn = fn
      ctx.doFn(...arg)
    }
_call(obj.showName, dom, 1,2,3) // name: is dom (3) [1, 2, 3]
```

## apply

`apply`与`call`的区别就只是传参的形式不同

```
const dom = {
  name: 'is dom'
}
const obj = {
  name: 'lanjz',
  showName(...arg) {
    console.log('name:', this.name, arg)
  }
}
obj.showName(1,2,3) // lanjz (3) [1, 2, 3]
Function.prototype._apply = function (ctx, arg) {
      ctx.doFn = this
      ctx.doFn(...arg)
      delete ctx.doFn
}
obj.showName._apply(dom, [1,2,3]) // name: is dom (3) [1, 2, 3]
function _apply(fn, ctx, arg) {
  ctx.doFn = fn
  ctx.doFn(...arg)
}
_apply(obj.showName, dom, [1,2,3]) // name: is dom (3) [1, 2, 3]
```

## bind

`bind`执行完是返回一个函函

```
Function.prototype._bind = function (ctx, ...arg) {
      const fn = (...arg2) => {
        let binArg = arg.concat(arg2)
        ctx.doFn = this
        const val = ctx.doFn(...binArg)
        delete ctx.doFn
        return val
      }
      return fn
}
const bindFn = obj.showName._bind(dom, 1)
bindFn(2,3) // name: is dom (3) [1, 2, 3]
```

注意上面的`fn`要使用箭头函数的形式，如果像下面这样写内部的`this`将指向`window`


```
Function.prototype._bind = function (ctx, ...arg) {
      const fn = function(...arg2) {
        let binArg = arg.concat(arg2)
        ctx.doFn = this
        const val = ctx.doFn(...binArg)
        delete ctx.doFn
        return val
      }
      return fn
}
const bindFn = obj.showName._bind(dom, 1) // 报错 `ctx.doFn`不是function
```