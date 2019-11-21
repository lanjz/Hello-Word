## call

```
Function.prototype.myCall= function (ctx, ...arg) {
    ctx.doFn = this 
    ctx.doFn(...arg)
    delete ctx.doFn
}

let test = {
	name:'test'
}
let o = {
	name:'o',
	fn:function(){
		console.log(this.name, ...arguments);  //这里把参数显示一下
	}
}
o.fn(1,2,3) // "o" 1 2 3
o.fn.call(test,1,2,3) // "test" 1 2 3
o.fn.myCall(test,1,2,3) // "test" 1 2 3
```

1. ` ctx.doFn = this `

 `this`指向调用`myCall`的那个对象，如`o.fn.myCall(test,1,2,3)`，那么this指向`o.fn`，相当于将`fn`方法复制到ctx对象中

2. `ctx.doFn(...arg)`

 执行ctx对象中fn方法，那么this指向ctx

## apply

```
Function.prototype.myApply = function (ctx, arg) {
    ctx.doFn = this // this指向调用myCll的那个对象o.fn.myCall(test,1,2,3),那么this指向o.fn，相当于当要fn方法复制到ctx对象中
    ctx.doFn(arg) // 执行ctx对象中fn方法，那么this指向ctx
    delete ctx.doFn
}

//测试
let test = {
	name:'test'
}
let o = {
	name:'o',
	fn:function(){
		console.log(this.name, ...arguments);  //这里把参数显示一下
	}
}
o.fn(1,2,3) // "o" 1 2 3
o.fn.call(test,1,2,3) // "test" 1 2 3
o.fn.myApply(test,1,2,3) // "test" 1 2 3
```

跟`call`相比，就处理参数不同


## bind

```
	Function.prototype.myBind = function (ctx, ...arg) {
		return (...arg2) => {
			let binArg = arg.concat(arg2)
            ctx.doFn = this
            const val = ctx.doFn(...binArg)
            delete ctx.doFn
            return val
        }
	}

	//测试
	let test = {
		name:'test'
	}
	let o = {
		name:'o',
		fn:function(){
			console.log(this.name, ...arguments);  //这里把参数显示一下
		}
	}
	o.fn(1,2,3) // "o" 1 2 3
	o.fn.call(test,1,2,3) // "test" 1 2 3
	var testB = o.fn.myBind(test)
	testB(1,2,3)// "test" 1 2 3
```
