# Function模式

## 偏应用

偏应用就是将参数的传入工作分开进行，在有的时候一系列的操作可能会有某一个或几个参数始终完全一样，那么我们就可以先定义一个偏函数，然后再去执行这个函数（执行时传入剩余的不同参数）

举个例子，代码如下：

```js
function partial(fn) {
    var args = Array.prototype.slice.call(arguments, 1);
    return function() {
        return fn.apply(this, [...args, ...arguments]);
    }
}

const obj = {
    age: 50,
    add: function(a, b){
        return this.age + a + b
    }
}

const abc = partial(obj.add, 1)
console.log(abc.call(obj, 2))
```

为了方便理解 `this` 的指向，再来一箭头函数版本

```js
function partial(fn) {
    var args = Array.prototype.slice.call(arguments, 1);
    return (...arg) => {
        return fn.call(this, ...args, ...arg);
    }
}

const obj = {
    age: 50,
    add: function(a, b){
        return this.age + a + b
    }
}

const abc = partial.call(obj, obj.add, 1)
console.log(abc.call(obj, 2))
```

## 柯里化（Currying）

`Currying` 是函数式编程的一个特性，将多个参数的处理转化成单个参数的处理，类似链式调用。

举一个简单的 `add` 函数的例子：

```js
 // 普通方式
    var add1 = function(a, b, c){
        return a + b + c;
    }
    // 柯里化
    var add2 = function(a) {
        return function(b) {
            return function(c) {
                return a + b + c;
            }
        }
    }
```

通过柯里化方法：

```js
function currying(fn, ...arg){
    const len = fn.length
    if(arg.length >= len){
        return fn.apply(this, arg)
    }
    return function(...argument){
        Array.prototype.push.apply(arg, argument)
        return currying(fn, ...arg)
    }
}

function add(a,b,c,d,e,f){
    return a + b + c + d + e + f
}

currying(add)(1)(2)(3,4,5)(10)
```

柯里化就是偏函数的升级版

## 立即执行的函数

```js
// 声明完函数以后，立即执行该函数
(function () {
    console.log('watch out!');
} ());

//这种方式声明的函数，也可以立即执行
!function () {
    console.log('watch out!');
} ();

// 如下方式也都可以哦
~function () { /* code */ } ();
-function () { /* code */ } ();
+function () { /* code */ } ();
```

## 自声明函数

一般是在函数内部，重写同名函数代码，比如：

```js
var scareMe = function () {
    alert("Boo!");
    scareMe = function () {
        alert("Double boo!");
    };
};
```

运行结果：

```js
// 1. 添加新属性
scareMe.property = "properly";
// 2. scareMe赋与一个新值
var prank = scareMe;
// 3. 作为一个方法调用
var spooky = {
    boo: scareMe
};
// 使用新变量名称进行调用
prank(); // "Boo!"
prank(); // "Boo!"
console.log(prank.property); // "properly"
// 使用方法进行调用
spooky.boo(); // "Boo!"
spooky.boo(); // "Boo!"
console.log(spooky.boo.property); // "properly"


scareMe(); // Double boo!
scareMe(); // Double boo!
console.log(scareMe.property); // undefined
```