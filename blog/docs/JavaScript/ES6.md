# ES6

## 解构赋值

在使给解构赋值添加默认值时，只在当匹配的值为 `undefined` 时能生效，意味着如果值为 `null` ，则赋值仍为 `null`

```js
let [x = 1] = [undefined];
x // 1

let [x = 1] = [null];
x // null
```

## 数组

### 扩展运算符

扩展运算符（spread）是三个点（...）。它好比 `rest` 参数的逆运算，将一个数组转为用逗号分隔的参数序列。扩展运算符有应用：

**替代函数的 apply 方法**

由于扩展运算符可以展开数组，所以不再需要 `apply` 方法，将数组转为函数的参数了

```js
// ES5 的写法
function f(x, y, z) {
  // ...
}
var args = [0, 1, 2];
f.apply(null, args);

// ES6的写法
function f(x, y, z) {
  // ...
}
let args = [0, 1, 2];
f(...args);
```

**复制数组**

数组是复合的数据类型，直接复制的话，只是复制了指向底层数据结构的指针，而不是克隆一个全新的数组

```js
// ES5
const a1 = [1, 2];
const a2 = a1.concat();

a2[0] = 2;
a1 // [1, 2]

// ES6
const a1 = [1, 2];
// 写法一
const a2 = [...a1];
// 写法二
const [...a2] = a1;
```

**合并数组**

```js
const arr1 = ['a', 'b'];
const arr2 = ['c'];
const arr3 = ['d', 'e'];

// ES5 的合并数组
arr1.concat(arr2, arr3);
// [ 'a', 'b', 'c', 'd', 'e' ]

// ES6 的合并数组
[...arr1, ...arr2, ...arr3]
// [ 'a', 'b', 'c', 'd', 'e' ]
```

**与解构赋值结合**

```js
const [first, ...rest] = [1, 2, 3, 4, 5];
first // 1
rest  // [2, 3, 4, 5]

const [first, ...rest] = [];
first // undefined
rest  // []

const [first, ...rest] = ["foo"];
first  // "foo"
rest   // []
```

**字符串**

扩展运算符还可以将字符串转为真正的数组

```js
[...'hello']
// [ "h", "e", "l", "l", "o" ]

// 扩展运算符能够正确识别四个字节的 Unicode 字符
'x\uD83D\uDE80y'.length // 4
[...'x\uD83D\uDE80y'].length // 3
```

**实现了 Iterator 接口的对象**

任何定义了遍历器（Iterator）接口的对象（参阅 Iterator 一章），都可以用扩展运算符转为真正的数组。

```js
let nodeList = document.querySelectorAll('div');
let array = [...nodeList];

Number.prototype[Symbol.iterator] = function*() {
  let i = 0;
  let num = this.valueOf();
  while (i < num) {
    yield i++;
  }
}

console.log([...5])
```

对于那些没有部署 Iterator 接口的类似数组的对象，扩展运算符就无法将其转为真正的数组

```js
let arrayLike = {
  '0': 'a',
  '1': 'b',
  '2': 'c',
  length: 3
};

// TypeError: Cannot spread non-iterable object.
let arr = [...arrayLike];
```

上面代码中，`arrayLike` 是一个类似数组的对象，但是没有部署 Iterator 接口，扩展运算符就会报错。这时，可以改为使用 `Array.from` 方法将 `arrayLike` 转为真正的数组。

### 数组创建

#### Array.of

`Array.of()`将参数中所有值作为元素形成数组

```js
Array.of(3, 11, 8) // [3,11,8]
Array.of(3) // [3]
Array.of(3).length // 1
```

`Array.of` 方法可以弥补数组构造函数 `Array()` 的不足。因为参数个数的不同，会导致 `Array()` 的行为有差异 

```js
Array() // []
Array(3) // [, , ,]
Array(3, 11, 8) // [3, 11, 8]
```

`Array.of` 基本上可以用来替代 `Array()` 或 `new Array()` ，并且不存在由于参数不同而导致的重载。它的行为非常统一

```js
Array.of() // []
Array.of(undefined) // [undefined]
Array.of(1) // [1]
Array.of(1, 2) // [1, 2]
```

`Array.of` 总是返回参数值组成的数组。如果没有参数，就返回一个空数组

#### Array.from()

`Array.from()` 方法从一个类似数组或可迭代对象（iterable）创建一个新的，浅拷贝的数组实例

`Array.from(arrayLike[, mapFn[, thisArg]])` 可接收三个参数

- `arrayLike`: 想要转换成数组的伪数组对象或可迭代对象

- `mapFn`: 如果指定了该参数，新数组中的每个元素会执行该回调函数, 类似 `map` 方法

- `thisArg`: 可选参数，执行回调函数 `mapFn` 时 `this` 对象。

```js
let arrayLike = {
    '0': 'a',
    '1': 'b',
    '2': 'c',
    length: 3
};

// ES5的写法
var arr1 = [].slice.call(arrayLike); // ['a', 'b', 'c']

// ES6的写法
let arr2 = Array.from(arrayLike); // ['a', 'b', 'c']

// NodeList对象
let ps = document.querySelectorAll('p');
Array.from(ps).filter(p => {
  return p.textContent.length > 100;
});

// arguments对象
function foo() {
  var args = Array.from(arguments);
  // ...
}
```

只要是部署了 Iterator 接口的数据结构，`Array.from` 都能将其转为数组

```js
Array.from('hello')
// ['h', 'e', 'l', 'l', 'o']

let namesSet = new Set(['a', 'b'])
Array.from(namesSet) // ['a', 'b']
```
上面代码中，字符串和 Set 结构都具有 Iterator 接口，因此可以被 `Array.from` 转为真正的数组

**Array.from和扩展运算符的区别**

扩展运算符（`...`）也可以将某些数据结构转为数组

```js
// arguments对象
function foo() {
  const args = [...arguments];
}

// NodeList对象
[...document.querySelectorAll('div')]
```

扩展运算符: 扩展运算符背后调用的是遍历器接口（Symbol.iterator），如果一个对象没有部署这个接口，就无法转换

`Array.from`: 支持两类对象转为真正的数组：类似数组的对象（array-like object）和可遍历（iterable）的对象，所谓类似数组的对象，本质特征只有一点，即必须有 `length` 属性

```js
Array.from({ length: 3 });
// [ undefined, undefined, undefined ]
```

`Array.from` 还可以接受第二个参数，作用类似于数组的 `map` 方法，用来对每个元素进行处理，将处理后的值放入返回的数组

```js
Array.from(arrayLike, x => x * x);
// 等同于
Array.from(arrayLike).map(x => x * x);

Array.from([1, 2, 3], (x) => x * x)
// [1, 4, 9]
```

`Array.from()` 的另一个应用是，将字符串转为数组，然后返回字符串的长度。因为它能正确处理各种 Unicode 字符，可以避免 JavaScript 将大于 `\uFFFF` 的 Unicode 字符，算作两个字符的 bug


### 数组遍历方法

`entries()`，`keys()` 和 `values()`用于遍历数组。它们都返回一个遍历器对象

- `entries()`: 对键值对的遍历

- `keys()`: 键名的遍历

- `values()`: 对键值的遍历

```js
for (let index of ['a', 'b'].keys()) {
  console.log(index);
}
// 0
// 1

for (let elem of ['a', 'b'].values()) {
  console.log(elem);
}
// 'a'
// 'b'

for (let [index, elem] of ['a', 'b'].entries()) {
  console.log(index, elem);
}
// 0 "a"
// 1 "b"
```

如果不使用 `for...of` 循环，可以手动调用遍历器对象的 `next` 方法，进行遍历

```js
let letter = ['a', 'b', 'c'];
let entries = letter.entries();
console.log(entries.next().value); // [0, 'a']
console.log(entries.next().value); // [1, 'b']
console.log(entries.next().value); // [2, 'c']
```

### 数组元素查找

ES6 新增的数组元素查找方法有 `find`， `findIdex`，`includes`

#### find()

数组实例的 `find` 方法，用于找出第一个符合条件的数组成员

`find(fn, targe)` 接收两个参数

- `fn(value, index, arr)`: 处理当前值的回调函数，所有数组成员依次执行该回调函数，直到找出第一个返回值为 `true` 的成员，然后返回该成员。如果没有符合条件的成员，则返回 `undefined`, 这个回调接收三个参数

  - `value`: 当前的值

  - `index`: 当前的位置

  - `arr`: 原数组

- `targe`: 绑定回调函数的 `this` 对象

```js
let person = {name: 'John', age: 9};
[1, 5, 10, 15].find(function(value, index, arr) {
  return value > this.age;
}) // 10
```

#### findIndex

数组实例的 `findIndex` 方法的用法与 `find` 方法非常类似，返回第一个符合条件的数组成员的位置，如果所有成员都不符合条件，则返回 `-1`，用法跟 `find` 一样

`find` 和 `findIndex` 这两个方法都可以发现 `NaN` ，弥补了数组的 `indexOf` 方法的不足

```js
[NaN].indexOf(NaN)
// -1

[NaN].findIndex(y => Object.is(NaN, y))
// 0
```

上面代码中，`indexOf` 方法无法识别数组的NaN成员，但是 `findIndex` 方法可以借助 `Object.is` 方法做到

#### includes

`Array.prototype.includes(value, start)` 方法返回一个布尔值，表示某个数组是否包含给定的值，与字符串的 `includes`方法类似

`includes(value, start)`接收两个参数：

- `value`: 要搜索的值

- `start`: 表示搜索的起始位置，默认为 `0`, 如果为负数，则表示倒数的位置，如果这时它大于数组长度（比如第二个参数为  `-4` ，但数组长度为 `3` ），则会重置为从 `0` 开始

**`includes` 和 `indexOf` 的区别：**

`includes` 和 `indexOf` 都使用 `while` 循环做遍历

`includes` 比较值的方式是：

```js
1. If Type(x) is different from Type(y), return false.
2. If Type(x) is Number, then
  1. If x is NaN and y is NaN, return true.
  1. If x is +0 and y is -0, return true.
  1. If x is -0 and y is +0, return true.
  1. If x is the same Number value as y, return true.
3. Return false.
4. Return SameValueNonNumber(x, y).
```

`indexOf` 内部使用严格相等运算符（ `===` ）进行判断，也因此 `indexOf` 会导致对 `NaN` 的误判

```js
[NaN].indexOf(NaN)
// -1

[NaN].includes(NaN)
// true
```

ES5 查找数组元素的方法有： `indexOf()`, `every()` 和 `some()`

`every()` 和 `some()` 和 `find` 接收的参数和用法都一致

### 数组结构打平flat()，flatMap()

`flat()` 方法会按照一个可指定的深度递归遍历数组，并将所有元素与遍历到的子数组中的元素合并为一个新数组返回。该方法返回一个新数组，对原数据没有影响

`var newArray = arr.flat([depth])`

- `depth`: 指定要提取嵌套数组的结构深度，默认值为 `1`, `Infinity` 表示无限层级

```js
var arr1 = [1, 2, [3, 4]];
arr1.flat(); 
// [1, 2, 3, 4]

var arr2 = [1, 2, [3, 4, [5, 6]]];
arr2.flat();
// [1, 2, 3, 4, [5, 6]]

var arr3 = [1, 2, [3, 4, [5, 6]]];
arr3.flat(2);
// [1, 2, 3, 4, 5, 6]

//使用 Infinity，可展开任意深度的嵌套数组
var arr4 = [1, 2, [3, 4, [5, 6, [7, 8, [9, 10]]]]];
arr4.flat(Infinity);
// [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
```

`flatMap()` 方法对原数组的每个成员执行一个函数（相当于执行 `Array.prototype.map()` ），然后对返回值组成的数组执行 `flat()` 方法。该方法返回一个新数组，不改变原数组

`flatMap(callback, thisArg)`接收的参数：

- `callback`: 处理当前值的回调函数， 回调函数可以传入三个参数：

  - `currentValue`: 当前正在数组中处理的元素

  - `index`: 选的。数组中正在处理的当前元素的索引

  - `array`: 可选的。被调用的 map 数组

- `thisArg`: 可选的。执行 `callback` 函数时 使用的 `this` 值

```js
var arr1 = [1, 2, 3, 4];

arr1.map(x => [x * 2]); 
// [[2], [4], [6], [8]]

arr1.flatMap(x => [x * 2]);
// [2, 4, 6, 8]

// only one level is flattened
arr1.flatMap(x => [[x * 2]]);
// [[2], [4], [6], [8]]
```

### `copyWithin()`和`fill()`

#### copyWithin()

数组实例的 `copyWithin()` 方法，在当前数组内部，将指定位置的成员复制到其他位置（会覆盖原有成员），然后返回当前数组。也就是说，使用这个方法，会修改当前数组。

```js
Array.prototype.copyWithin(target, start = 0, end = this.length)
```

它接受三个参数:

- `target`（必需）：从该位置开始替换数据。如果为负值，表示倒数

- `start`（可选）：从该位置开始读取数据，默认为 `0` 。如果为负值，表示从末尾开始计算

- `end`（可选）：到该位置前停止读取数据，默认等于数组长度。如果为负值，表示从末尾开始计算

```js
[1, 2, 3, 4, 5].copyWithin(0, 3)
// [4, 5, 3, 4, 5]
```

上面代码表示将从 3 号位直到数组结束的成员（4 和 5），复制到从 0 号位开始的位置，结果覆盖了原来的 1 和 2

其它例子：

```js
// 将3号位复制到0号位
[1, 2, 3, 4, 5].copyWithin(0, 3, 4)
// [4, 2, 3, 4, 5]

// -2相当于3号位，-1相当于4号位
[1, 2, 3, 4, 5].copyWithin(0, -2, -1)
// [4, 2, 3, 4, 5]

// 将3号位复制到0号位
[].copyWithin.call({length: 5, 3: 1}, 0, 3)
// {0: 1, 3: 1, length: 5}

// 将2号位到数组结束，复制到0号位
let i32a = new Int32Array([1, 2, 3, 4, 5]);
i32a.copyWithin(0, 2);
// Int32Array [3, 4, 5, 4, 5]

// 对于没有部署 TypedArray 的 copyWithin 方法的平台
// 需要采用下面的写法
[].copyWithin.call(new Int32Array([1, 2, 3, 4, 5]), 0, 3, 4);
// Int32Array [4, 2, 3, 4, 5]
```

#### fill()

`fill` 方法用一个固定值填充一个数组中从起始索引到终止索引内的全部元素。不包括终止索引

`arr.fill(value[, start[, end]])` 接收的参数

- `value`: 用来填充数组元素的值

- `start`: 可选，起始索引，默认值为0。

- `end`: 可选,终止索引，默认值为 `this.length`

```js
[1, 2, 3].fill(4);               // [4, 4, 4]
[1, 2, 3].fill(4, 1);            // [1, 4, 4]
[1, 2, 3].fill(4, 1, 2);         // [1, 4, 3]
[1, 2, 3].fill(4, 1, 1);         // [1, 2, 3]
[1, 2, 3].fill(4, 3, 3);         // [1, 2, 3]
[1, 2, 3].fill(4, -3, -2);       // [4, 2, 3]
[1, 2, 3].fill(4, NaN, NaN);     // [1, 2, 3]
[1, 2, 3].fill(4, 3, 5);         // [1, 2, 3]
Array(3).fill(4);                // [4, 4, 4]
[].fill.call({ length: 3 }, 4);  // {0: 4, 1: 4, 2: 4, length: 3}

// Objects by reference.
var arr = Array(3).fill({}) // [{}, {}, {}];
// 需要注意如果fill的参数为引用类型，会导致都执行都一个引用类型
// 如 arr[0] === arr[1] 为true
arr[0].hi = "hi"; // [{ hi: "hi" }, { hi: "hi" }, { hi: "hi" }]
```

### 数组的空位

ES5 对空位的处理，已经很不一致了，大多数情况下会忽略空位

- `forEach()`, `filter()`, `reduce()`, `every()` 和 `some()` 都会跳过空位

- `map()` 会跳过空位，但会保留这个值

- `join()` 和 `toString()` 会将空位视为 `undefined`，而 `undefined` 和 `null` 会被处理成空字符串

```js
// forEach方法
[,'a'].forEach((x,i) => console.log(i)); // 1

// filter方法
['a',,'b'].filter(x => true) // ['a','b']

// every方法
[,'a'].every(x => x==='a') // true

// reduce方法
[1,,2].reduce((x,y) => x+y) // 3

// some方法
[,'a'].some(x => x !== 'a') // false

// map方法
[,'a'].map(x => 1) // [,1]

// join方法
[,'a',undefined,null].join('#') // "#a##"

// toString方法
[,'a',undefined,null].toString() // ",a,,"
```

ES6 则是明确将空位转为 `undefined`

```js
// Array.from方法会将数组的空位，转为undefined，也就是说，这个方法不会忽略空位
Array.from(['a',,'b']) // [ "a", undefined, "b" ]

// 扩展运算符（...）也会将空位转为undefined
[...['a',,'b']] // [ "a", undefined, "b" ]

// copyWithin()会连空位一起拷贝
[,'a','b',,].copyWithin(2,0) // [,"a",,"a"]

// fill()会将空位视为正常的数组位置
new Array(3).fill('a') // ["a","a","a"]

// for...of循环也会遍历空位
let arr = [, ,];
for (let i of arr) {
  console.log(1);
}
// 1
// 1
```

`entries()`、`keys()`、`values()`、`find()` 和 `findIndex()` 会将空位处理成 `undefined`

```js
// entries()
[...[,'a'].entries()] // [[0,undefined], [1,"a"]]

// keys()
[...[,'a'].keys()] // [0,1]

// values()
[...[,'a'].values()] // [undefined,"a"]

// find()
[,'a'].find(x => true) // undefined

// findIndex()
[,'a'].findIndex(x => true) // 0

```

### ES5数组方法

#### map

`map()` 方法根据一人数组创建一个新数组，其结果是该数组中的每个元素是调用一次提供的函数后的返回值

`map()` 接收两个参数

- `callback`: 生成新数组元素的函数，使用三个参数:

  - `currentValue`: `callback` 数组中正在处理的当前元素

  - `index`: `callback` 数组中正在处理的当前元素的索引

  - `array`: `map` 方法调用的数组

- `thisArg`: 执行 `callback` 函数时值被用作 `this`

#### filter

`filter()` 方法创建一个新数组, 过滤使用

参数和 `map` 一致，返回值是通过过滤的数组， 没有则为空数组

#### every

`every()` 方法测试一个数组内的所有元素是否都能通过某个指定函数的测试。它返回一个布尔值

参数和 `map` 一致，返回值是通过过滤的数组， 没有则为空数组

#### some

`some()` 方法测试数组中是不是至少有1个元素通过了被提供的函数测试。它返回的是一个Boolean类型的值

参数和 `map` 一致，返回值是通过过滤的数组， 没有则为空数组

#### reducer

`reduce()` 方法对数组中的每个元素执行一个由您提供的 `reducer` 函数(升序执行)，将其结果汇总为单个返回值

`arr.reduce(callback(accumulator, currentValue[, index[, array]])[, initialValue])` 函数接收4个参数:

- `callback`: 执行数组中每个值 (如果没有提供 `initialValue` 则第一个值除外)的函数，包含四个参数

  - `accumulator`: 累计器累计回调的返回值; 它是上一次调用回调时返回的累积值，或 `initialValue`

  - `currentValue`: 数组中正在处理的元素

  - `index`: 可选， 数组中正在处理的当前元素的索引

  - `array`: 可选，调用reduce()的数组

- `initialValue`: 作为第一次调用 `callback` 函数时的第一个参数的值。 如果没有提供初始值，则将使用数组中的第一个元素。 在没有初始值的空数组上调用 `reduce` 将报错

```js
[0, 1, 2, 3, 4].reduce(function(accumulator, currentValue, currentIndex, array){
  return accumulator + currentValue;
})
```

### 数组方法的性能对比

#### for，map和forEach性能

性能： **`for` > `forEach` > `map`**

- `for` 循环当然是最简单的，因为它没有任何额外的函数调用栈和上下文

- `forEach` 其次，因为它其实比我们想象得要复杂一些，它的函数签名实际上是 `array.forEach(function(currentValue, index, arr), thisValue)` 它不是普通的 `for` 循环的语法糖，还有诸多参数和上下文需要在执行的时候考虑进来，这里可能拖慢性能；

- `map` 最慢，因为它的返回值是一个等长的全新的数组，数组创建和赋值产生的性能开销很大

但是 `for/for-in/for-of` 这类遍历方法很有可能改变外部的其他变量，这本身就会有一定风险，看起来是不可控的，代码也不优雅

#### for in 和for of的区别

**for in**

`for...in` 语句以任意顺序遍历一个对象的除 `Symbol` 以外的可枚举属性，可用于数组也可以用于对象

使用 `for...in` 要注意的问题：

- 遍历所有属性，不仅是自身属性，也包括原型链上的所有属性

  ```js
  var obj = {a:1, c: 3, b:2};
  obj.__proto__.d = 4  
  for (var prop in obj) {
    console.log("obj." + prop + " = " + obj[prop]);
  } 
  // obj.a = 1
  // obj.c = 3
  // obj.b = 2
  // obj.d = 4
  ```

- `index` 索引为字符串型数字，不能直接进行几何运算

- 必须按特定顺序遍历，先遍历所有数字键，然后按照创建属性的顺序遍历剩下的

  ```js
  var obj = {a:1, c: 3, b:2, 1:3}; 
   for (var prop in obj) {
      console.log("obj." + prop + " = " + obj[prop]);
  } 
  // obj.1 = 3
  // obj.a = 1
  // obj.c = 3
  // obj.b = 2
  ```

- 会忽略 `enumerable` 为 `false` 的属性

**for...of**

`for...of` 语句用于可迭代的对象上，即实现了 `遍历器Iterator` 的实例（包括 `Array`，`Map`，`Set`，`String`，`TypedArray`，`arguments` 对象等等）上创建一个迭代循环，调用自定义迭代钩子，并为每个不同属性的值执行语句

**`for...of` 不能用于对象中， 因为对象没有实现遍历器 `Iterator`**

```js
const array1 = ['a', 'b', 'c'];

for (const element of array1) {
  console.log(element);
}

// expected output: "a"
// expected output: "b"
// expected output: "c"
```

`for...of` 会修改源数据中的值

```js
let iterable = [10, 20, 30];

for (let value of iterable) {
    value += 1;
    console.log(value);
}
// 11
// 21
// 31
```

**`for...of` 与 `for...in` 的区别**

- `for...in` 语句以任意顺序迭代对象的可枚举属性

- `for...of` 语句遍历可迭代对象定义要迭代的数据

**迭代String**

```js
let iterable = "boo";

for (let value of iterable) {
  console.log(value);
}
// "b"
// "o"
// "o"
```

**迭代Map**

```js
let iterable = new Map([["a", 1], ["b", 2], ["c", 3]]);

for (let entry of iterable) {
  console.log(entry);
}
// ["a", 1]
// ["b", 2]
// ["c", 3]

for (let [key, value] of iterable) {
  console.log(value);
}
// 1
// 2
// 3

```

**关闭迭代器**

`for...of` 可以像 `for`循环那样，使用`break`, `throw`, `continue`这些循环控制语句

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

