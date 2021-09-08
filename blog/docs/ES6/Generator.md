# Generator

传统的编程语言，早有异步编程的解决方案（其实是多任务的解决方案）。其中有一种叫做“协程”（coroutine），意思是多个线程互相协作，完成异步任务。

## 协程

协程有点像函数，又有点像线程，它的运行流程大致如下：

1. 第一步，协程 A 开始执行；

2. 第二步，协程 A 执行到一半，进入暂停，执行权转移到协程 B；

3. 第三步，（一段时间后）协程 B 交还执行权；

4. 第四步，协程 A 恢复执行；

**Generator 函数是类似协程的一种实现，最大特点就是可以交出函数的执行权（即暂停执行）。**

## Generator函数

Generator 函数是 ES6 提供的一种异步编程解决方案, 语法上，首先可以把它理解成一个状态机，封装了多个内部状态

执行 Generator 函数会返回一个遍历器对象，然后可以依次遍历 Generator 函数内部的每一个状态

Generator 函数是一个普通函数，但是有两个特征

1. `function` 关键字与函数名之间有一个星号

2. 函数体内部使用 `yield` 表达式，定义不同的内部状态（ `yield` 在英语里的意思就是“产出”）

```js
function* helloWorldGenerator() {
  yield 'hello';
  yield 'world';
  return 'ending';
}

var hw = helloWorldGenerator()

hw.next()
// { value: 'hello', done: false }
hw.next()
// { value: 'world', done: false }
hw.next()
// { value: 'ending', done: true }
hw.next()
// { value: undefined, done: true }
```

与普通函数相比， 调用 Generator 函数并不会立马执行函数代码内容，返回的也不是函数运行结果，而是一个指向内部状态的指针对象(遍历器对象)

然后调用遍历器对象的 `next` 方法，使得指针移向下一个状态。也就是说，每次调用 `next` 方法，内部指针就从函数头部或上一次停下来的地方开始执行，直到遇到下一个 `yield` 表达式（或 `return` 语句）为止。换言之，Generator 函数是分段执行的， `yield` 表达式是暂停执行的标记，而 `next` 方法可以恢复执行

使用 Generator 有两个重要的关键字 `yield` 和 `next`

## yield

Generator 函数类似一种可以暂停执行的函数,`yield` 表达式就是暂停的标志

遍历器对象的 `next` 方法的运行逻辑如下

1. 遇到 `yield` 表达式，就暂停执行后面的操作，并将紧跟在 `yield` 后面的那个表达式的值，作为返回的对象的 `value` 属性值

2. 下一次调用 `next` 方法时，再继续往下执行，直到遇到下一个 `yield` 表达式

3. 如果没有再遇到新的 `yield` 表达式，就一直运行到函数结束，直到 `return语` 句为止，并将 `return` 语句后面的表达式的值，作为返回的对象的 `value `属性值。

4. 如果该函数没有 `return` 语句，则返回的对象的 `value` 属性值为 `undefined`

**使用yield的注意点**

- `yield` 表达式只能用在 Generator 函数里面，用在其他地方都会报错。

- `yield` 表达式如果用在另一个表达式之中，必须放在圆括号里面

  ```js
  function* demo() {
    console.log('Hello' + yield); // SyntaxError
    console.log('Hello' + yield 123); // SyntaxError

    console.log('Hello' + (yield)); // OK
    console.log('Hello' + (yield 123)); // OK
  }
  ```

- `yield` 表达式用作函数参数或放在赋值表达式的右边，可以不加括号

  ```js
  function* demo() {
    foo(yield 'a', yield 'b'); // OK
    let input = yield; // OK
  }
  ```

## next

调用 Generator 函数后，返回的遍历器对象，需要通过 `next` 方法依次执行内部代码，每次调用 `next` 方法，内部指针就从函数头部或上一次停下来的地方开始执行，直到遇到下一个 `yield` 表达式（或 `return` 语句）为止

**next 方法的参数**

`next` 方法可以带一个参数，该参数就会被当作上一个 `yield` 表达式的返回值

```js
function* f() {
  for(var i = 0; true; i++) {
    var reset = yield i;
    if(reset) { i = -1; }
  }
}

var g = f();

g.next() // { value: 0, done: false }
g.next() // { value: 1, done: false }
g.next(true) // { value: 0, done: false }
```

上面代码先定义了一个可以无限运行的 Generator 函数 `f`，如果 `next` 方法没有参数，每次运行到 `yield` 表达式，变量 `reset `的值总是 `undefined `。当 `next` 方法带一个参数 `true` 时，变量 `reset` 就被重置为这个参数（即 `true` ），因此 `i` 会等于 `-1` ，下一轮循环就会从 `-1` 开始递增。

再看一个例子

```js
function* foo(x) {
  var y = 2 * (yield (x + 1));
  var z = yield (y / 3);
  return (x + y + z);
}

var a = foo(5);
a.next() // Object{value:6, done:false}
a.next() // Object{value:NaN, done:false}
a.next() // Object{value:NaN, done:true}

var b = foo(5);
b.next() // { value:6, done:false }
b.next(12) // { value:8, done:false }
b.next(13) // { value:42(13+24+5), done:true }
```

上面代码中，第二次运行 `next` 方法的时候不带参数，导致 `y` 的值等于 `2 * undefined`（即 `NaN` ），除以 `3` 以后还是 `NaN` ，因此返回对象的 `value` 属性也等于 `NaN` 。第三次运行 `Next` 方法的时候不带参数，所以 `z` 等于 `undefined` ，返回对象的 `value` 属性等于 `5 + NaN + undefined` ，即 `NaN` 。

如果向 `next` 方法提供参数，返回结果就完全不一样了。上面代码第一次调用 `b` 的 `next` 方法时，返回 `x+1` 的值 `6` ；第二次调用 `next` 方法，将上一次 `yield` 表达式的值设为 `12` ，因此 `y` 等于 `24` ，返回 `y / 3` 的值 `8` ；第三次调用 `next` 方法，将上一次 `yield` 表达式的值设为 `13` ，因此 `z` 等于 `13` ，这时 `x` 等于 `5` ，`y` 等于 `24` ，所以 `return` 语句的值等于 `42` 。

### 首次next()

由于 `next` 方法的参数表示上一个 `yield` 表达式的返回值，所以在第一次使用 `next` 方法时，传递参数是无效的。V8 引擎直接忽略第一次使用 `next` 方法时的参数，只有从第二次使用 `next` 方法开始，参数才是有效的。

所以实质上第一个 `next` 方法用来启动遍历器对象，所以不用带有参数

如果想要第一次调用 `next` 方法时，就能够输入值，可以在 Generator 函数外面再包一层

```js
function wrapper(generatorFunction) {
  return function (...args) {
    let generatorObject = generatorFunction(...args);
    generatorObject.next();
    return generatorObject;
  };
}

const wrapped = wrapper(function* () {
  console.log(`First input: ${yield}`);
  return 'DONE';
});

wrapped().next('hello!')
// First input: hello!

```

### for...of 循环

`for...of` 循环可以自动遍历 Generator 函数运行时生成的 Iterator对象，且此时不再需要调用 `next` 方法

```js
function* foo() {
  yield 1;
  yield 2;
  yield 3;
  yield 4;
  yield 5;
  return 6;
}

for (let v of foo()) {
  console.log(v);
}
// 1 2 3 4 5
```

下面是一个利用 Generator 函数和 `for...of` 循环，实现斐波那契数列的例子

```js
function* fibonacci() {
  let [prev, curr] = [0, 1];
  for (;;) {
    yield curr;
    [prev, curr] = [curr, prev + curr];
  }
}

for (let n of fibonacci()) {
  if (n > 1000) break;
  console.log(n);
}
```

原生的 JavaScript 对象没有遍历接口，无法使用 `for...of` 循环，通过 Generator 函数为它加上这个接口，就可以用了

```js
function* objectEntries(obj) {
  let propKeys = Reflect.ownKeys(obj);

  for (let propKey of propKeys) {
    yield [propKey, obj[propKey]];
  }
}

let jane = { first: 'Jane', last: 'Doe' };

for (let [key, value] of objectEntries(jane)) {
  console.log(`${key}: ${value}`);
}
// first: Jane
// last: Doe
```

加上遍历器接口的另一种写法是，将 Generator 函数加到对象的 `Symbol.iterator` 属性上面

```js
function* objectEntries() {
  let propKeys = Object.keys(this);

  for (let propKey of propKeys) {
    yield [propKey, this[propKey]];
  }
}

let jane = { first: 'Jane', last: 'Doe' };

jane[Symbol.iterator] = objectEntries;

for (let [key, value] of jane) {
  console.log(`${key}: ${value}`);
}
// first: Jane
// last: Doe

```

除了 `for...of` 循环以外，扩展运算符（`...`）、解构赋值和 `Array.from` 方法内部调用的，都是遍历器接口。这意味着，它们都可以将 Generator 函数返回的 Iterator 对象，作为参数

```js
function* numbers () {
  yield 1
  yield 2
  return 3
  yield 4
}

// 扩展运算符
[...numbers()] // [1, 2]

// Array.from 方法
Array.from(numbers()) // [1, 2]

// 解构赋值
let [x, y] = numbers();
x // 1
y // 2

// for...of 循环
for (let n of numbers()) {
  console.log(n)
}
// 1
// 2

```

## Generator.prototype.throw()

Generator 函数返回的遍历器对象，都有一个 `throw` 方法，可以在函数体外抛出错误，然后在 Generator 函数体内捕获

```js
var g = function* () {
  try {
    yield;
  } catch (e) {
    console.log('内部捕获', e);
  }
};

var i = g();
i.next();

try {
  i.throw('a');
  i.throw('b');
} catch (e) {
  console.log('外部捕获', e);
}
// 内部捕获 a
// 外部捕获 b
```

上面代码中，遍历器对象i连续抛出两个错误。第一个错误被 Generator 函数体内的 `catch` 语句捕获。`i` 第二次抛出错误，由于 Generator 函数内部的 `catch` 语句已经执行过了，不会再捕捉到这个错误了，所以这个错误就被抛出了 Generator 函数体，被函数体外的 `catch` 语句捕获

如果 Generator 函数内部没有部署 `try...catch` 代码块，那么 `throw` 方法抛出的错误，将被外部 `try...catch` 代码块捕获

```js
var g = function* () {
  while (true) {
    yield;
    console.log('内部捕获', e);
  }
};

var i = g();
i.next();

try {
  i.throw('a');
  i.throw('b');
} catch (e) {
  console.log('外部捕获', e);
}
// 外部捕获 a
```

如果 Generator 函数内部和外部，都没有部署 `try...catch` 代码块，那么程序将报错，直接中断执行

### 使用throw的注意点

**`throw` 方法抛出的错误要被内部捕获，前提是必须至少执行过一次 `next` 方法**

```js
function* gen() {
  try {
    yield 1;
  } catch (e) {
    console.log('内部捕获');
  }
}

var g = gen();
g.throw(1);
// Uncaught 1
```

上面代码中，`g.throw(1)` 执行时，`next` 方法一次都没有执行过。这时，抛出的错误不会被内部捕获，而是直接在外部抛出，导致程序出错。

这种行为其实很好理解，因为第一次执行 `next` 方法，等同于启动执行 Generator 函数的内部代码，否则 Generator 函数还没有开始执行，这时 `throw` 方法抛错只可能抛出在函数外部

**throw方法被捕获以后，会附带执行下一条yield表达式。也就是说，会附带执行一次next方法**

```js
var gen = function* gen(){
  try {
    yield console.log('a');
  } catch (e) {
    // ...
  }
  yield console.log('b');
  yield console.log('c');
}

var g = gen();
g.next() // a
g.throw() // b
g.next() // c
```

上面代码中，`g.throw` 方法被捕获以后，自动执行了一次 `next` 方法，所以会打印 `b`。另外，也可以看到，只要 Generator 函数内部部署了`try...catch` 代码块，那么遍历器的 `throw` 方法抛出的错误，不影响下一次遍历

Generator 函数体外抛出的错误，可以在函数体内捕获；反过来，Generator 函数体内抛出的错误，也可以被函数体外的 `catch` 捕获

```js
function* foo() {
  var x = yield 3;
  var y = x.toUpperCase();
  yield y;
}

var it = foo();

it.next(); // { value:3, done:false }

try {
  it.next(42);
} catch (err) {
  console.log(err);
}
```

## Generator.prototype.return()

Generator 函数返回的遍历器对象，还有一个 `return` 方法，可以返回给定的值，并且终结遍历 Generator 函数

如果 `return` 有传入参数，则该参数会作为 **终结遍历 Generator 函数** 时的 `value` 值

```js
function* gen() {
  yield 1;
  yield 2;
  yield 3;
}

var g = gen();

g.next()        // { value: 1, done: false }
g.return('foo') // { value: "foo", done: true }
g.next()        // { value: undefined, done: true }
```

上面代码中，遍历器对象 `g` 调用 `return` 方法后，返回值的 `value` 属性就是 `return` 方法的参数 `foo` 。并且，Generator 函数的遍历就终止了，返回值的 `done` 属性为 `true` ，以后再调用 `next` 方法，`done` 属性总是返回 `true`

如果 `return` 方法调用时，不提供参数，则返回值的 `value` 属性为 `undefined`

如果 Generator 函数内部有 `try...finally` 代码块，且正在执行 `try` 代码块，那么 `return` 方法会导致立刻进入 `finally` 代码块，执行完以后，整个函数才会结束

```js
function* numbers () {
  yield 1;
  try {
    yield 2;
    yield 3;
  } finally {
    yield 4;
    yield 5;
  }
  yield 6;
}
var g = numbers();
g.next() // { value: 1, done: false }
g.next() // { value: 2, done: false }
g.return(7) // { value: 4, done: false }
g.next() // { value: 5, done: false }
g.next() // { value: 7, done: true }
```

## yield* 表达式

如果在 Generator 函数内部，调用另一个 Generator 函数。需要在前者的函数体内部，自己手动完成遍历

```js
function* foo() {
  yield 'a';
  yield 'b';
}

function* bar() {
  yield 'x';
  // 手动遍历 foo()
  for (let i of foo()) {
    console.log(i);
  }
  yield 'y';
}

for (let v of bar()){
  console.log(v);
}
// x
// a
// b
// y
```

ES6 提供了 `yield*` 表达式，用来解决一个 Generator 函数里面执行另一个 Generator 函数

```js
function* bar() {
  yield 'x';
  yield* foo();
  yield 'y';
}

// 等同于
function* bar() {
  yield 'x';
  yield 'a';
  yield 'b';
  yield 'y';
}

// 等同于
function* bar() {
  yield 'x';
  for (let v of foo()) {
    yield v;
  }
  yield 'y';
}

for (let v of bar()){
  console.log(v);
}
// "x"
// "a"
// "b"
// "y"
```

另个例子

```js
function* inner() {
  yield 'hello!';
}

function* outer1() {
  yield 'open';
  yield inner();
  yield 'close';
}

var gen = outer1()
gen.next().value // "open"
gen.next().value // 返回一个遍历器对象
gen.next().value // "close"

function* outer2() {
  yield 'open'
  yield* inner()
  yield 'close'
}

var gen = outer2()
gen.next().value // "open"
gen.next().value // "hello!"
gen.next().value // "close"
```

上面例子中，`outer2` 使用了 `yield*` ，`outer1`没使用。结果就是，`outer1` 返回一个遍历器对象，`outer2` 返回该遍历器对象的内部值

## 作为对象属性的 Generator 函数

如果一个对象的属性是 Generator 函数，可以简写成下面的形式:

```js
let obj = {
  * myGeneratorMethod() {
    ···
  }
};

// 等价于
let obj = {
  myGeneratorMethod: function* () {
    // ···
  }
};
```

上面代码中，`myGeneratorMethod` 属性前面有一个星号，表示这个属性是一个 Generator 函数

## Generator 函数的this

Generator 函数总是返回一个遍历器，ES6 规定这个遍历器是 Generator 函数的实例，也继承了 Generator 函数的 `prototype` 对象上的方法

```js
function* g() {}

g.prototype.hello = function () {
  return 'hi!';
};

let obj = g();

obj instanceof g // true
obj.hello() // 'hi!'
```

如果把 `g` 当作普通的构造函数，并不会生效，因为g返回的总是遍历器对象，而不是 `this` 对象

```js
function* g() {
  this.a = 11;
}

let obj = g();
obj.next();
obj.a // undefined
```

Generator 函数也不能跟 `new` 命令一起用，会报错

```js
function* F() {
  yield this.x = 2;
  yield this.y = 3;
}

new F()
// TypeError: F is not a constructor
```

下面是一个变通方法。首先，生成一个空对象，使用 `call` 方法绑定 Generator 函数内部的 `this` 。这样，构造函数调用以后，这个空对象就是 Generator 函数的实例对象了

```js
function* F() {
  this.a = 1;
  yield this.b = 2;
  yield this.c = 3;
}
var obj = {};
var f = F.call(obj);

f.next();  // Object {value: 2, done: false}
f.next();  // Object {value: 3, done: false}
f.next();  // Object {value: undefined, done: true}

obj.a // 1
obj.b // 2
obj.c // 3
```

## Generator 与状态机

Generator 是实现状态机的最佳结构。比如，下面的 `clock` 函数就是一个状态机

```js
var ticking = true;
var clock = function() {
  if (ticking)
    console.log('Tick!');
  else
    console.log('Tock!');
  ticking = !ticking;
}
```

上面代码的 `clock` 函数一共有两种状态（ `Tick` 和 `Tock` ），每运行一次，就改变一次状态。这个函数如果用 Generator 实现，就是下面这样

```js
var clock = function* () {
  while (true) {
    console.log('Tick!');
    yield;
    console.log('Tock!');
    yield;
  }
};
```

## Generator 的上下文 

JavaScript 代码运行时，会产生一个全局的上下文环境（ context，又称运行环境），包含了当前所有的变量和对象。然后，执行函数（或块级代码）的时候，又会在当前上下文环境的上层，产生一个函数运行的上下文，变成当前（active）的上下文，由此形成一个上下文环境的堆栈（context stack）。

这个堆栈是“后进先出”的数据结构，最后产生的上下文环境首先执行完成，退出堆栈，然后再执行完成它下层的上下文，直至所有代码执行完成，堆栈清空。

Generator 函数不是这样，它执行产生的上下文环境，一旦遇到 `yield` 命令，就会暂时退出堆栈，但是并不消失，里面的所有变量和对象会冻结在当前状态。等到对它执行 `next` 命令时，这个上下文环境又会重新加入调用栈，冻结的变量和对象恢复执行

```js
function* gen() {
  yield 1;
  return 2;
}

let g = gen();

console.log(
  g.next().value,
  g.next().value,
);
```

上面代码中，第一次执行 `g.next()` 时，Generator 函数 `gen` 的上下文会加入堆栈，即开始运行 `gen` 内部的代码。等遇到 `yield 1` 时， `gen` 上下文退出堆栈，内部状态冻结。第二次执行 `g.next()` 时，`gen` 上下文重新加入堆栈，变成当前的上下文，重新恢复执行

## 应用

### 异步操作的同步化表达

**同步化AJAX**

```js
function* main() {
  var result = yield request("http://some.url");
  var resp = JSON.parse(result);
  console.log(resp.value);
}

function request(url) {
  makeAjaxCall(url, function(response){
    it.next(response);
  });
}

var it = main();
it.next();
```

**逐行读取文本文件**

```js
function* numbers() {
  let file = new FileReader("numbers.txt");
  try {
    while(!file.eof) {
      yield parseInt(file.readLine(), 10);
    }
  } finally {
    file.close();
  }
}
```

### 控制流管理

如果有一个多步操作非常耗时，采用回调函数，可能会写成下面这样

```js
step1(function (value1) {
  step2(value1, function(value2) {
    step3(value2, function(value3) {
      step4(value3, function(value4) {
        // Do something with value4
      });
    });
  });
});
```

采用 Promise 改写上面的代码

```js
Promise.resolve(step1)
  .then(step2)
  .then(step3)
  .then(step4)
  .then(function (value4) {
    // Do something with value4
  }, function (error) {
    // Handle any error from step1 through step4
  })
  .done();
```

上面代码已经把回调函数，改成了直线执行的形式，但是加入了大量 Promise 的语法。Generator 函数可以进一步改善代码运行流程

```js
function* longRunningTask(value1) {
  try {
    var value2 = yield step1(value1);
    var value3 = yield step2(value2);
    var value4 = yield step3(value3);
    var value5 = yield step4(value4);
    // Do something with value4
  } catch (e) {
    // Handle any error from step1 through step4
  }
}
```

然后，使用一个函数，按次序自动执行所有步骤

```js
scheduler(longRunningTask(initialValue));

function scheduler(task) {
  var taskObj = task.next(task.value);
  // 如果Generator函数未结束，就继续调用
  if (!taskObj.done) {
    task.value = taskObj.value
    scheduler(task);
  }
}
```

注意，上面这种做法，只适合同步操作，即所有的 `task` 都必须是同步的，不能有异步操作。因为这里的代码一得到返回值，就继续往下执行，没有判断异步操作何时完成。如果要控制异步的操作流程

### 部署 Iterator 接口

利用 Generator 函数，可以在任意对象上部署 Iterator 接口

```js
function* iterEntries(obj) {
  let keys = Object.keys(obj);
  for (let i=0; i < keys.length; i++) {
    let key = keys[i];
    yield [key, obj[key]];
  }
}

let myObj = { foo: 3, bar: 7 };

for (let [key, value] of iterEntries(myObj)) {
  console.log(key, value);
}

// foo 3
// bar 7
```

上述代码中，`myObj` 是一个普通对象，通过 `iterEntries` 函数，就有了 Iterator 接口。也就是说，可以在任意对象上部署next方法。

下面是一个对数组部署 Iterator 接口的例子，尽管数组原生具有这个接口

```js
function* makeSimpleGenerator(array){
  var nextIndex = 0;

  while(nextIndex < array.length){
    yield array[nextIndex++];
  }
}

var gen = makeSimpleGenerator(['yo', 'ya']);

gen.next().value // 'yo'
gen.next().value // 'ya'
gen.next().done  // true
```

### Generator 的异步应用

#### Thunk 函数

将参数放到一个临时函数之中，再将这个临时函数传入函数体。这个临时函数就叫做 Thunk 函数

```js
function f(m) {
  return m * 2;
}

f(x + 5);

// 等同于

var thunk = function () {
  return x + 5;
};

function f(thunk) {
  return thunk() * 2;
}

```

上面代码中，函数 `f` 的参数 `x + 5` 被一个函数替换了。凡是用到原参数的地方，对  Thunk函数求值即可。

这就是 Thunk 函数的定义，它是“传名调用”的一种实现策略，用来替换某个表达式

#### co 模块

co 模块用于 Generator 函数的自动执行

下面是一个 Generator 函数，用于依次读取两个文件

```js
var gen = function* () {
  var f1 = yield readFile('/etc/fstab');
  var f2 = yield readFile('/etc/shells');
  console.log(f1.toString());
  console.log(f2.toString());
};

```

co 模块可以让你不用编写 Generator 函数的执行器。

```js
var co = require('co');
co(gen);
```

上面代码中，Generator 函数只要传入 co 函数，就会自动执行。

co 函数返回一个 `Promise` 对象，因此可以用 `then` 方法添加回调函数

```js
co(gen).then(function (){
  console.log('Generator 函数执行完成');
})
```

#### co 模块的原理

Generator 就是一个异步操作的容器。它的自动执行需要一种机制，当异步操作有了结果，能够自动交回执行权

两种方法可以做到这一点

1. 回调函数。将异步操作包装成 Thunk 函数，在回调函数里面交回执行权

2. Promise 对象。将异步操作包装成 Promise 对象，用then方法交回执行权

co 模块其实就是将两种自动执行器（Thunk 函数和 Promise 对象），包装成一个模块。使用 co 的前提条件是，Generator 函数的yield命令后面，只能是 Thunk 函数或 Promise 对象.如果数组或对象的成员，全部都是 Promise 对象，也可以使用 co

**基于 Promise 对象的自动执行**

```js
function fetch(time, sue = true, info){
    return new Promise((resolve, reject) => {
      let callback = sue ? resolve : reject
      setTimeout(() => {
        callback(info)
      }, time)
    })
  }

  var gen = function* (){
    var r1 = yield fetch(1000, true, 1)
    console.log(r1);
    var r2 = yield fetch(1000, true, 2)
    console.log(r2);
    var r3 = yield fetch(1000, true, 3)
    console.log(r3);
  };
  var g = gen();

  g.next().value.then(function(data){
    g.next(data).value.then(function(data){
      g.next(data);
    });
  });
```

上面是一个手动执行的例子，手动执行其实就是用 `then` 方法，层层添加回调函数。理解了这一点，就可以写出一个自动执行器

```js
  var gen = function* (){
    var r1 = yield fetch(1000)
    var r2 = yield fetch(1000)
    var r3 = yield fetch(1000)
  };
  function co(fn) {
    const g = fn()
    function next() {
      const gg = g.next()
      if(gg.done) return gg.value
      gg.value.then(res => {
        console.log('res', res)
        next()
      })
    }
    next()
  }
  co(gen)
```

**co 模块的源码**

首先，co 函数接受 Generator 函数作为参数，返回一个 Promise 对象

```js
function co(gen) {
  var ctx = this;

  return new Promise(function(resolve, reject) {
  });
}
```

在返回的 Promise 对象里面，co 先检查参数 `gen` 是否为 Generator 函数。如果是，就执行该函数，得到一个内部指针对象；如果不是就返回，并将 Promise 对象的状态改为 `resolved` 。

```js
function co(gen) {
  var ctx = this;

  return new Promise(function(resolve, reject) {
    if (typeof gen === 'function') gen = gen.call(ctx);
    if (!gen || typeof gen.next !== 'function') return resolve(gen);
  });
}

```

接着，co 将 Generator 函数的内部指针对象的 `next` 方法，包装成 `onFulfilled` 函数。这主要是为了能够捕捉抛出的错误

```js
function co(gen) {
  var ctx = this;

  return new Promise(function(resolve, reject) {
    if (typeof gen === 'function') gen = gen.call(ctx);
    if (!gen || typeof gen.next !== 'function') return resolve(gen);

    onFulfilled();
    function onFulfilled(res) {
      var ret;
      try {
        ret = gen.next(res);
      } catch (e) {
        return reject(e);
      }
      next(ret);
    }
  });
}
```

最后，就是关键的 `next` 函数，它会反复调用自身

```js
function next(ret) {
  if (ret.done) return resolve(ret.value);
  var value = toPromise.call(ctx, ret.value);
  if (value && isPromise(value)) return value.then(onFulfilled, onRejected);
  return onRejected(
    new TypeError(
      'You may only yield a function, promise, generator, array, or object, '
      + 'but the following object was passed: "'
      + String(ret.value)
      + '"'
    )
  );
}

```

上面代码中，`next` 函数的内部代码，一共只有四行命令。

第一行，检查当前是否为 Generator 函数的最后一步，如果是就返回。

第二行，确保每一步的返回值，是 Promise 对象。

第三行，使用 `then` 方法，为返回值加上回调函数，然后通过 `onFulfilled` 函数再次调用 `next` 函数。

第四行，在参数不符合要求的情况下（参数非 Thunk 函数和 Promise 对象），将 Promise 对象的状态改为 `rejected`，从而终止执行

**处理并发的异步操作**

co 支持并发的异步操作，即允许某些操作同时进行，等到它们全部完成，才进行下一步。

这时，要把并发的操作都放在数组或对象里面，跟在 `yield` 语句后面

```js
// 数组的写法
co(function* () {
  var res = yield [
    Promise.resolve(1),
    Promise.resolve(2)
  ];
  console.log(res);
}).catch(onerror);

// 对象的写法
co(function* () {
  var res = yield {
    1: Promise.resolve(1),
    2: Promise.resolve(2),
  };
  console.log(res);
}).catch(onerror);

// 下面是另一个例子

co(function* () {
  var values = [n1, n2, n3];
  yield values.map(somethingAsync);
});

function* somethingAsync(x) {
  // do something async
  return y
}
```

上面的代码允许并发三个 `somethingAsync` 异步操作，等到它们全部完成，才会进行下一步