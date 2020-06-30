# Set和WeakSet

Set 对象允许你存储任何类型的唯一值，无论是原始值或者是对象引用

`new Set([iterable])`: 参数是一个可迭代对象，如果不指定此参数或其值为null，则新的 Set为空

```js
const set1 = new Set([1, 2, 3, 4, 5]);
const fn = function(){}
const obj = {}
set1.add(fn)
set1.add(obj)
set1.add(null)
set1.add(undefined)

console.log(set1.has(1)); // true
console.log(set1.has(null)); // true
console.log(set1.has(undefined)); // true
console.log(set1.has(fn)); // true
console.log(set1.has({})); // false 因为地址不同
```

## Set作用

Set 可以用做数组去重

```js
var array = [1,3,4,5,1,3,4,5,3]
console.log([...new Set(array)]) // [1, 3, 4, 5]
[...new Set('ababbc')].join('') // "abc"
```

Set 判断元素是否相等是使用叫做 “Same-value-zero equality” 的算法， 它类似于精确相等运算符（`===`），主要的区别是向 Set 加入值时认为 `NaN` 等于自身，而精确相等运算符认为 `NaN` 不等于自身

```js
let set = new Set();
let a = NaN;
let b = NaN;
set.add(a);
set.add(b);
set // Set {NaN}
```

两个对象总是不相等的

```js
let set = new Set();

set.add({});
set.size // 1

set.add({});
set.size // 2
```
上面代码表示，由于两个空对象不相等，所以它们被视为两个值

## Set 实例的属性和方法

**属性**

- `Set.prototype.constructor`：构造函数，默认就是 Set 函数

- `Set.prototype.size`：返回 Set 实例的成员总数

**方法**

- `Set.prototype.add(value)`：添加某个值，返回 Set 结构本身

- `Set.prototype.delete(value)`：删除某个值，返回一个布尔值，表示删除是否成功。

- `Set.prototype.has(value)`：返回一个布尔值，表示该值是否为Set的成员。

- `Set.prototype.clear()`：清除所有成员，没有返回值

```js
const s = new Set()
s.add(1).add(2).add(2);
// 注意2被加入了两次

s.size // 2

s.has(1) // true
s.has(2) // true
s.has(3) // false

s.delete(3); // false
s.delete(2); // true
s.has(2) // false
```

## 遍历操作

Set 结构的实例有四个遍历方法，可以用于遍历成员

- `Set.prototype.keys()`：返回键名的遍历器

- `Set.prototype.values()`：返回键值的遍历器

- `Set.prototype.entries()`：返回键值对的遍历器

- `Set.prototype.forEach()`：使用回调函数遍历每个成员

由于 Set 结构没有键名所以 `Set.prototype.values()`和`Set.prototype.keys()`返回的结果是一样的

需要特别指出的是，Set的遍历顺序就是插入顺序。这个特性有时非常有用，比如使用 Set 保存一个回调函数列表，调用时就能保证按照添加顺序调用

```js
let set = new Set(['red', 'green', 'blue']);

for (let item of set.keys()) {
  console.log(item);
}
// red
// green
// blue

for (let item of set.values()) {
  console.log(item);
}
// red
// green
// blue

for (let item of set.entries()) {
  console.log(item);
}
// ["red", "red"]
// ["green", "green"]
// ["blue", "blue"]

```


扩展运算符跟`Array.from` 方法可以将 Set 结构转为数组

```js
let set = new Set(['red', 'green', 'blue']);
let arr = [...set];
// ['red', 'green', 'blue']
```

# WeakSet

WeakSet 结构与 Set 类似，也是不重复的值的集合。但是，它与 Set 有两个区别。

首先，WeakSet 的成员只能是对象，而不能是其他类型的值

```js
const ws = new WeakSet();
ws.add(1)
// TypeError: Invalid value used in weak set
ws.add(Symbol())
// TypeError: invalid value used in weak set

const a = [[1, 2], [3, 4]];
const ws = new WeakSet(a);
// WeakSet {[1, 2], [3, 4]}
```

要注意的是 WeakSet 中的对象都是弱引用，即垃圾回收机制不考虑 WeakSet 对该对象的引用，也就是说，如果其他对象都不再引用该对象，那么垃圾回收机制会自动回收该对象所占用的内存，不考虑该对象还存在于 WeakSet 之中。因此，WeakSet 适合临时存放一组对象，以及存放跟对象绑定的信息。只要这些对象在外部消失，它在 WeakSet 里面的引用就会自动消失

## 属性方法

- `WeakSet.prototype.add(value)`：向 WeakSet 实例添加一个新成员。

- `WeakSet.prototype.delete(value)`：清除 WeakSet 实例的指定成员。

- `WeakSet.prototype.has(value)`：返回一个布尔值，表示某个值是否在

WeakSet 没有 Set 的 `size` 属性和 `clear`, `forEach`,`keys`, `values` , `entries`方法

WeakSet 的一个用处，是储存 DOM 节点，而不用担心这些节点从文档移除时，会引发内存泄漏

```js
const foos = new WeakSet()
class Foo {
  constructor() {
    foos.add(this)
  }
  method () {
    if (!foos.has(this)) {
      throw new TypeError('Foo.prototype.method 只能在Foo的实例上调用！');
    }
  }
}
```