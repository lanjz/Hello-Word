# Iterator

遍历器（Iterator）是一种接口，为各种不同的数据结构提供统一的访问机制。任何数据结构只要部署 Iterator 接口，就可以完成遍历操作（即依次处理该数据结构的所有成员）

Iterator 的作用有三个:

1. 为各种数据结构，提供一个统一的、简便的访问接口

2. 使得数据结构的成员能够按某种次序排列

3.  ES6 创造了一种新的遍历命令 `for...of` 循环，Iterator 接口主要供 `for...of` 消费

Iterator 的遍历过程:

1. 创建一个指针对象，指向当前数据结构的起始位置。也就是说，遍历器对象本质上，就是一个指针对象

2. 第一次调用指针对象的 `next` 方法，可以将指针指向数据结构的第一个成员

3. 第二次调用指针对象的 `next` 方法，指针就指向数据结构的第二个成员

3. 不断调用指针对象的 `next` 方法，直到它指向数据结构的结束位置

每一次调用 `next` 方法，都会返回数据结构的当前成员的信息。具体来说，就是返回一个包含 `value` 和 `done` 两个属性的对象。其中，`value` 属性是当前成员的值，`done` 属性是一个布尔值，表示遍历是否结束

模拟 `next` 方法返回值的例子:

```js
var it = makeIterator(['a', 'b']);

it.next() // { value: "a", done: false }
it.next() // { value: "b", done: false }
it.next() // { value: undefined, done: true }

function makeIterator(array) {
  var nextIndex = 0;
  return {
    next: function() {
      return nextIndex < array.length ?
        {value: array[nextIndex++], done: false} :
        {value: undefined, done: true};
    }
  };
}
```

ES6 规定，默认的 Iterator 接口部署在数据结构的 `Symbol.iterator` 属性，或者说，一个数据结构只要具有 `Symbol.iterator` 属性，就可以认为是“可遍历的”（iterable）。`Symbol.iterator` 属性本身是一个函数，就是当前数据结构默认的遍历器生成函数。执行这个函数，就会返回一个遍历器。至于属性名 `Symbol.iterator` ，它是一个表达式，返回 Symbol 对象的 `iterator` 属性，这是一个预定义好的、类型为 Symbol 的特殊值，所以要放在方括号内

```js
const obj = {
  [Symbol.iterator] : function () {
    return {
      next: function () {
        return {
          value: 1,
          done: true
        };
      }
    };
  }
}
```

ES6 的有些数据结构原生具备 Iterator 接口（比如数组），即不用任何处理，就可以被 `for...of` 循环遍历。原因在于，这些数据结构原生部署了 `Symbol.iterator` 属性

原生具备 Iterator 接口的数据结构如下:

- `Array`

- `Map`

- `Set`

- `String`

- `TypedArray`

- 函数的 `arguments` 对象

- `NodeList` 对象

```js
let arr = ['a', 'b', 'c'];
let iter = arr[Symbol.iterator]();

iter.next() // { value: 'a', done: false }
iter.next() // { value: 'b', done: false }
iter.next() // { value: 'c', done: false }
iter.next() // { value: undefined, done: true }
```

对象类型没有实现 `Symbol.iterator` 接口， 所以不能使用 `for...of` 遍历方法

一个对象如果要具备可被 `for...of` 循环调用的 Iterator 接口，就必须在 `Symbol.iterator` 的属性上部署遍历器生成方法（原型链上的对象具有该方法也可）

```js
class RangeIterator {
  constructor(start, stop) {
    this.value = start;
    this.stop = stop;
  }

  [Symbol.iterator]() { return this; }

  next() {
    var value = this.value;
    if (value < this.stop) {
      this.value++;
      return {done: false, value: value};
    }
    return {done: true, value: undefined};
  }
}

function range(start, stop) {
  return new RangeIterator(start, stop);
}

for (var value of range(0, 3)) {
  console.log(value); // 0, 1, 2
}
```
例子二：

```js
  let obj = {a: 1, b: 2}
  obj[Symbol.iterator] = function (){
    let self = this
    let index = 0
    return {
      next() {
        console.log('this', this) // 指向 return 出来的对象
        console.log('self', self)
        if(index < Object.keys(self).length){
          return {value: Object.keys(self)[index++], done: false}
        }
        return {value: undefined, done: true}
      }
    }
  }
  for(let i of obj){
    console.log(i) // 输出 a, b
  }
```


## 调用 Iterator 接口的场合

有一些场合会默认调用 Iterator 接口（即Symbol.iterator方法），除了下文会介绍的 `for...of` 循环，还有几个别的场合。

- 解构赋值

- 扩展运算符

- `yield*`

  `yield*` 后面跟的是一个可遍历的结构，它会调用该结构的遍历器接口。

  ```js
  let generator = function* () {
    yield 1;
    yield* [2,3,4];
    yield 5;
  };

  var iterator = generator();

  iterator.next() // { value: 1, done: false }
  iterator.next() // { value: 2, done: false }
  iterator.next() // { value: 3, done: false }
  iterator.next() // { value: 4, done: false }
  iterator.next() // { value: 5, done: false }
  iterator.next() // { value: undefined, done: true }
  ```

- `for...of`

- `Array.from()`

- `Map()`, `Set()`, `WeakMap()`, `WeakSet()`（比如 `new Map([['a',1],['b',2]])` ）

- `Promise.all()`

- `Promise.race()`

- 字符串的

  字符串是一个类似数组的对象，也原生具有 Iterator 接口

  ```js
  var someString = "hi";
  typeof someString[Symbol.iterator]
  // "function"

  var iterator = someString[Symbol.iterator]();

  iterator.next()  // { value: "h", done: false }
  iterator.next()  // { value: "i", done: false }
  iterator.next()  // { value: undefined, done: true }
  ```


## Iterator 接口与 Generator 函数

Symbol.iterator方法的最简单实现，还是使用 Generator 函数

```js
let myIterable = {
  [Symbol.iterator]: function* () {
    yield 1;
    yield 2;
    yield 3;
  }
}
[...myIterable] // [1, 2, 3]

// 或者采用下面的简洁写法

let obj = {
  * [Symbol.iterator]() {
    yield 'hello';
    yield 'world';
  }
};

for (let x of obj) {
  console.log(x);
}
// "hello"
// "world"

```

## 遍历器对象的 return()，throw()

遍历器对象除了具有 `next` 方法，还具有两个方法

- `return`： 如果 `for...of`循环提前退出（通常是因为出错，或者有 `break` 语句），就会调用 `return` 方法。如果一个对象在完成遍历前，需要清理或释放资源，就可以部署 `return` 方法

  ```js
  // 情况一
  for (let line of readLinesSync(fileName)) {
    console.log(line);
    break;  
  }

  // 情况二
  for (let line of readLinesSync(fileName)) {
    console.log(line);
    throw new Error();  
  }

  ```

- `throw`: `throw` 方法主要是配合 Generator 函数使用，一般的遍历器对象用不到这个方法

`return` 方法和 `throw` 方法是否部署是可选的。
