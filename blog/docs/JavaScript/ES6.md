# ES6

## 解构赋值

在使给解构赋值添加默认值时，只在当匹配的值为 `undefined` 时能生效，意味着如果值为 `null` ，则赋值仍为 `null`

```js
let [x = 1] = [undefined];
x // 1

let [x = 1] = [null];
x // null
```

## 函数

ES6 中的函数增加了以下扩展：

- 支持默认参数

- 函数参数支持角构赋值

- 箭头函数

但是使用这些新功能的时候需要知道一些注意点

### 默认参数的使用

使用参数默认值时，函数不能有同名参数

```js
// 不报错
function foo(x, x, y) {
  // ...
}

// 报错
function foo(x, x, y = 1) {
  // ...
}
// SyntaxError: Duplicate parameter name not allowed in this context
```

参数默认值不是传值的，而是每次都重新计算默认值表达式的值。也就是说，参数默认值是惰性求值的

```js
let x = 99;
function foo(p = x + 1) {
  console.log(p);
}

foo() // 100

x = 100;
foo() // 101
```

当使用默认参数的时候，应该把这些带有默认值的参数放在后面

#### 默认参数对 length 的影响

函数的 `length` 表示函数定义时的实际参数个数

```js
function fn(a, b, c){
    console.log(fn.length) // 3
}
fn(1)
```

但使用默认值以后，函数的 `length` 属性，将返回没有指定默认值的参数个数。也就是说，指定了默认值后，`length` 属性将失真, 实际 `length` 的值等于函数的参数个数减去指定了默认值的参数个数

```js
(function (a) {}).length // 1
(function (a = 5) {}).length // 0
(function (a, b, c = 5) {}).length // 2
```

**如果设置了默认值的参数不是尾参数，那么length属性也不再计入后面的参数了**

```js
(function (a = 0, b, c) {}).length // 0
(function (a, b = 1, c) {}).length // 1
```

#### 默认参数对 作用域 的影响

一旦设置了参数的默认值，函数进行声明初始化时，参数会形成一个单独的作用域（context）。等到初始化结束，这个作用域就会消失。这种语法行为，在不设置参数默认值时，是不会出现的

```js
var x = 1;

function f(x, y = x) {
  console.log(y);
}

f(2) // 2
```

上面代码中，参数y的默认值等于变量 `x` 。调用函数f时，参数形成一个单独的作用域。在这个作用域里面，默认值变量 `x `指向第一个参数 `x` ，而不是全局变量 `x` ，所以输出是 `2`

再看下面的例子

```js
let x = 1;

function f(y = x) { // 参数作用域并没有找到 x，所以指向外层的全局变量 x
  let x = 2;
  console.log(y); // 1
}

f() // 1
```

如果此时，全局变量x不存在，就会报错

```js
function f(y = x) {
  let x = 2;
  console.log(y);
}

f() 
```

下面这样写，也会报错

```js
var x = 1;

function foo(x = x) {
  // ...
}

foo()
```

参数 `x = x` 形成一个单独作用域。实际执行的是 `let x = x` ，由于暂时性死区的原因，这行代码会报错 `”x 未定义“`

### rest 参数

`arguments` 对象不是数组，而是一个类似数组的对象。所以为了使用数组的方法，必须使用 `Array.prototype.slice.call` 先将其转为数组。`rest` 参数就不存在这个问题，它就是一个真正的数组，数组特有的方法都可以使用

注意，`rest` 参数之后不能再有其他参数（即只能是最后一个参数），否则会报错。

```js
// 报错
function f(a, ...b, c) {
  // ...
}
```

#### rest 参数对函数的 length 属性的影响

```js
(function(a) {}).length  // 1
(function(...a) {}).length  // 0
(function(a, ...b) {}).length  // 1
```

### 箭头函数

```js
var f = function (name) {
  return {
      name,
      age: 18
  };
};
// 等同于
var f = v => {
    return {
      name,
      age: 18
  };
};

// 等同于
var f = v => ({name, age: 18});

// 以下写法错误
var f = v => {name, age: 18}; // Uncaught SyntaxError: Unexpected token ':'

```

最后一例子因为`{}`内的代码被当做是语句了，等同于以下代码：

```js
var f = v => {
    name, age: 18 // Uncaught SyntaxError: Unexpected token ':'
}
```

所以如果想到返回一个对象格式，则需要使用 `()` 包括。使用大括号内的代码被当做表达式，刚不是一个语句

箭头函数可以与变量解构结合使用。

```js
const full = ({ first, last }) => first + ' ' + last;

// 等同于
function full(person) {
  return person.first + ' ' + person.last;
}
```

**箭头函数与普通函数的注意点**

- 函数体内没有自己的 `this` 对象

  箭头函数里的 `this` 是外面的作用域中的 `this`, 所以网上很多人说箭头函数的 `this` 是在定义时确定的，因为函数的作用域就是在定义里确定的

- 不可以当作构造函数，也就是说，不可以使用 `new` 命令，否则会抛出一个错误

- 因为没有自己的 `this` 所以也不能使用 `call`，`bind`,`apply`方法

- 不可以使用 `arguments` 对象，该对象在函数体内不存在。如果要用，可以用 `rest` 参数代替

- 不可以使用 `yield` 命令，因此箭头函数不能用作 `Generator` 函数

- 除了 `this` 和 `arguments`，也没有 `super` 、`new.target`

### 尾调用优化

尾调用（Tail Call）是函数式编程的一个重要概念，本身非常简单，一句话就能说清楚，就是指某个函数的最后一步是调用另一个函数

```js
function f(x){
  return g(x); // 函数f的最后一步是调用函数g，这就叫尾调用
}
```

以下三种情况，都不属于尾调用

```js
// 情况一
function f(x){
  let y = g(x); // 函数g之后，还有赋值操作，所以不属于尾调用
  return y;
}

// 情况二
function f(x){
  return g(x) + 1; // 函数g之后，还有赋值操作，所以不属于尾调用
}

// 情况三
function f(x){
  g(x); // 函数g之后，后面默认还有一个 return undefined
}
```

**什么是属调用优化**

我们知道，函数调用会在内存形成一个执行上下文，保存着对象变量，作用域等信息，这个执行上下文会进入到执行栈中执行，如果在函数A的内部调用函数B，此时在执行中将暂停函数A的执行，将B的执行上下文压入到栈中执行，等到B运行结束，函数B的执行上下文将从栈中弹出，然后再继续执行栈中的函数A未执行完的剩余部分

尾调用优化的目的就是在函数的最后一步调用内层函数时，不需要保留外层函数的执行上下文，这样就可以节省内存，防止栈溢出。如何才能让一个上下文从栈中推出？那就是当内部变量等信息都不需要再使用的时候

**是否是尾调用，实质就是函数尾部执行另一个函数时，当前的函数上下文是否从执行栈中退出**

上面三种函数，在执行 `g(x)` 的时候, `f` 的上下文都还在执行栈中，因为执行完 `g(x)`后还需要回到 `f` 的上下文继续执行
，然后 `f` 函数才能从执行栈中弹出

**注意，目前只有 Safari 浏览器支持尾调用优化，Chrome 和 Firefox 都不支持**

#### 尾递归

函数调用自身，称为递归。如果尾调用自身，就称为尾递归。

递归非常耗费内存，因为需要同时保存成千上百个调用帧，很容易发生“栈溢出”错误（stack overflow）。但对于尾递归来说，由于只存在一个调用帧，所以永远不会发生“栈溢出”错误。

```js
function factorial(n) {
  if (n === 1) return 1;
  return n * factorial(n - 1);
}

factorial(5) // 120
```

上面代码是一个阶乘函数，计算 `n` 的阶乘，最多需要保存n个调用记录，复杂度 `O(n)` 。

如果改写成尾递归，只保留一个调用记录，复杂度 `O(1)`

```js
function factorial(n, total) {
  if (n === 1) return total;
  return factorial(n - 1, n * total);
}

factorial(5, 1) // 120
```

还有一个比较著名的例子，就是计算 `Fibonacci` 数列，也能充分说明尾递归优化的重要性。

非尾递归的 `Fibonacci` 数列实现如下

```js
function Fibonacci (n) {
  if ( n <= 1 ) {return 1};

  return Fibonacci(n - 1) + Fibonacci(n - 2);
}

Fibonacci(10) // 89
Fibonacci(100) // 超时
Fibonacci(500) // 超时
```

尾递归优化过的 Fibonacci 数列实现如下。

```js
function Fibonacci2 (n , ac1 = 1 , ac2 = 1) {
  if( n <= 1 ) {return ac2};

  return Fibonacci2 (n - 1, ac2, ac1 + ac2);
}

Fibonacci2(100) // 573147844013817200000
Fibonacci2(1000) // 7.0330367711422765e+208
Fibonacci2(10000) // Infinity
```

由此可见，“尾调用优化”对递归操作意义重大，所以一些函数式编程语言将其写入了语言规格。ES6 亦是如此，第一次明确规定，所有 ECMAScript 的实现，都必须部署“尾调用优化”。这就是说，ES6 中只要使用尾递归，就不会发生栈溢出（或者层层递归造成的超时），相对节省内存

#### 递归函数的改写

尾递归的实现，往往需要改写递归函数，确保最后一步只调用自身。做到这一点的方法，就是把所有用到的内部变量改写成函数的参数。比如上面的例子，阶乘函数 `factorial` 需要用到一个中间变量 `total` ，那就把这个中间变量改写成函数的参数。这样做的缺点就是不太直观，第一眼很难看出来，为什么计算5的阶乘，需要传入两个参数 `5` 和 `1` ?

两个方法可以解决这个问题。方法一是在尾递归函数之外，再提供一个正常形式的函数。

```js
function tailFactorial(n, total) {
  if (n === 1) return total;
  return tailFactorial(n - 1, n * total);
}

function factorial(n) {
  return tailFactorial(n, 1);
}

factorial(5) // 120

```

上面代码通过一个正常形式的阶乘函数 `factorial` ，调用尾递归函数 `tailFactorial` ，看起来就正常多了。

函数式编程有一个概念，叫做柯里化（currying），意思是将多参数的函数转换成单参数的形式。这里也可以使用柯里化

```js
function currying(fn, n) {
  return function (m) {
    return fn.call(this, m, n);
  };
}

function tailFactorial(n, total) {
  if (n === 1) return total;
  return tailFactorial(n - 1, n * total);
}

const factorial = currying(tailFactorial, 1);

factorial(5) // 120
```

上面代码通过柯里化，将尾递归函数 `tailFactorial` 变为只接受一个参数的 `factorial`

第二种方法就简单多了，就是采用 ES6 的函数默认值

```js
function factorial(n, total = 1) {
  if (n === 1) return total;
  return factorial(n - 1, n * total);
}

factorial(5) // 120

```

上面代码中，参数 `total` 有默认值 `1` ，所以调用时不用提供这个值。

总结一下，递归本质上是一种循环操作。纯粹的函数式编程语言没有循环操作命令，所有的循环都用递归实现，这就是为什么尾递归对这些语言极其重要。对于其他支持“尾调用优化”的语言（比如 Lua，ES6），只需要知道循环可以用递归代替，而一旦使用递归，就最好使用尾递归。

### 尾递归优化的实现

尾递归优化只在严格模式下生效，那么正常模式下，或者那些不支持该功能的环境中，有没有办法也使用尾递归优化呢？回答是可以的，就是自己实现尾递归优化。

它的原理非常简单。尾递归之所以需要优化，原因是调用栈太多，造成溢出，那么只要减少调用栈，就不会溢出。怎么做可以减少调用栈呢？就是采用“循环”换掉“递归”。

下面是一个正常的递归函数

```js
function sum(x, y) {
  if (y > 0) {
    return sum(x + 1, y - 1);
  } else {
    return x;
  }
}

sum(1, 100000)
```

上面代码中，`sum` 是一个递归函数，参数 `x` 是需要累加的值，参数 `y` 控制递归次数。一旦指定 `sum` 递归 `100000`  次，就会报错，提示超出调用栈的最大次数。

**蹦床函数**

蹦床函数（trampoline）可以将递归执行转为循环执行

```js
function trampoline(f) {
  while (f && f instanceof Function) {
    f = f();
  }
  return f;
}
```
上面就是蹦床函数的一个实现，它接受一个函数 `f` 作为参数。只要 `f` 执行后返回一个函数，就继续执行。注意,这里是返回一个函数，然后执行该函数，而不是函数里面调用函数，这样就避免了递归执行，从而就消除了调用栈过大的问题。

然后，要做的就是将原来的递归函数，改写为每一步返回另一个函数

```js
function sum(x, y) {
  if (y > 0) {
    return sum.bind(null, x + 1, y - 1);
  } else {
    return x;
  }
}
```

执行

```js
trampoline(sum(1, 100000)) // 100001
```

蹦床函数并不是真正的尾递归优化，下面的实现才是。

#### 尾递归优化的实现

```js
function tco(f) {
  var value;
  var active = false;
  var accumulated = [];

  return function accumulator() {
    accumulated.push(arguments);
    if (!active) {
      active = true;
      while (accumulated.length) {
        value = f.apply(this, accumulated.shift());
      }
      active = false;
      return value;
    }
  };
}

var sum = tco(function(x, y) {
  if (y > 0) {
    return sum(x + 1, y - 1)
  }
  else {
    return x
  }
});

sum(1, 100000)
// 100001
```

上面代码中，`tco` 函数是尾递归优化的实现，它的奥妙就在于状态变量 `active` 。默认情况下，这个变量是不激活的。一旦进入尾递归优化的过程，这个变量就激活了。然后，每一轮递归 `sum` 返回的都是 `undefined` ，所以就避免了递归执行；而 `accumulated` 数组存放每一轮 `sum` 执行的参数，总是有值的，这就保证了 `accumulator` 函数内部的 `while` 循环总是会执行。这样就很巧妙地将“递归”改成了“循环”，而后一轮的参数会取代前一轮的参数，保证了调用栈只有一层。

