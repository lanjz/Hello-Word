# Set

Set 对象允许你存储任何类型的唯一值，无论是原始值或者是对象引用

`new Set([iterable])`: 参数是一个可迭代对象，如果不指定此参数或其值为null，则新的 Set为空

```js
const set1 = new Set([1, 2, 3, 4, 5]);

console.log(set1.has(1));
// expected output: true

console.log(set1.has(5));
// expected output: true

console.log(set1.has(6));
// expected output: false
```

## Set作用

Set 可以用做数组去重

```js
var array = [1,3,4,5,1,3,4,5,3]
console.log([...new Set(array)]) // [1, 3, 4, 5]

[...new Set('ababbc')].join('') // "abc"
```

向 Set 加入值的时候，不会发生类型转换，所以 `5` 和 `"5"` 是两个不同的值。Set 内部判断两个值是否不同，使用的算法叫做“Same-value-zero equality”，它类似于精确相等运算符（`===`），主要的区别是向 Set 加入值时认为 `NaN` 等于自身，而精确相等运算符认为 `NaN` 不等于自身

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



扩展运算符跟`Array.from` 方法可以将 Set 结构转为数组