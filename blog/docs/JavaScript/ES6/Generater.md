# Generater

Generator 函数是 ES6 提供的一种异步编程解决方案, 语法上，首先可以把它理解成，Generator 函数是一个状态机，封装了多个内部状态

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

## yield

由于 Generator 函数返回的遍历器对象，只有调用 `next` 方法才会遍历下一个内部状态，所以其实提供了一种可以暂停执行的函数。`yield` 表达式就是暂停标志

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

调用 Generator 函数后，返回的遍历器对象，需要通过 `nect` 方法移动内部指针，每次调用 `next` 方法，内部指针就从函数头部或上一次停下来的地方开始执行，直到遇到下一个 `yield` 表达式（或 `return` 语句）为止

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

注意，由于 `next` 方法的参数表示上一个 `yield` 表达式的返回值，所以在第一次使用 `next` 方法时，传递参数是无效的。V8 引擎直接忽略第一次使用 `next` 方法时的参数，只有从第二次使用 `next` 方法开始，参数才是有效的。从语义上讲，第一个 `next` 方法用来启动遍历器对象，所以不用带有参数

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

`throw` 方法可以接受一个参数，该参数会被 `catch` 语句接收，建议抛出 `Error` 对象的实例

```js
var g = function* () {
  try {
    yield;
  } catch (e) {
    console.log(e);
  }
};

var i = g();
i.next();
i.throw(new Error('出错了！'));
// Error: 出错了！(…)

```