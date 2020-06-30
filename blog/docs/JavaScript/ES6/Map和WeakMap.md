# Map和WeakMap

ES6 提供了 Map 数据结构。它类似于对象，也是键值对的集合，但是“键”的范围不限于字符串，各种类型的值（包括对象）都可以当作键。也就是说，Object 结构提供了“字符串—值”的对应，Map 结构提供了“值—值”的对应，是一种更完善的 Hash 结构实现

```js
const m = new Map();
const o = {p: 'Hello World'};

m.set(o, 'content')
m.get(o) // "content"

m.has(o) // true
m.delete(o) // true
m.has(o) // false
```

Map 也可以接受一个具有 Iterator 接口、且每个成员都是一个双元素的数组的数据结构,也就是说数组，Set 和 Map 都可以用来生成新的 Map

```js
const map = new Map([
  ['name', '张三'],
  ['title', 'Author']
]);

const items = [
  ['name', '张三'],
  ['title', 'Author']
];

// Map构造函数接受数组作为参数，实际上执行的是下面的算法
const map = new Map();

items.forEach(
  ([key, value]) => map.set(key, value)
);

const set = new Set([
  ['foo', 1],
  ['bar', 2]
]);
const m1 = new Map(set);
m1.get('foo') // 1

const m2 = new Map([['baz', 3]]);
const m3 = new Map(m2);
m3.get('baz') // 3

```

Map 的 `key` 可以是对象，但是只有对同一个对象的引用，Map 结构才将其视为同一个键

```js
const map = new Map();

map.set(['a'], 555);
map.get(['a']) // undefined

const map = new Map();

const k1 = ['a'];
const k2 = ['a'];

map
.set(k1, 111)
.set(k2, 222);

map.get(k1) // 111
map.get(k2) // 222
```

由上可知，Map 的键实际上是跟内存地址绑定的，只要内存地址不一样，就视为两个键。

如果 Map 的键是一个简单类型的值（数字、字符串、布尔值），则只要两个值严格相等，Map 将其视为一个键，比如 `0` 和 `-0` 就是一个键，布尔值 `true` 和字符串 `true` 则是两个不同的键。另外，`undefined` 和 `null` 也是两个不同的键。虽然 `NaN` 不严格相等于自身，但 Map 将其视为同一个键

```js

let map = new Map();

map.set(-0, 123);
map.get(+0) // 123

map.set(true, 1);
map.set('true', 2);
map.get(true) // 1

map.set(undefined, 3);
map.set(null, 4);
map.get(undefined) // 3

map.set(NaN, 123);
map.get(NaN) // 123
```

## 实例的属性和操作方法 

- `Map.prototype.size`: 属性返回 Map 结构的成员总数

- `Map.prototype.set(key, value)`: `set` 方法设置键名 `key` 对应的键值为 `value`，然后返回整个 Map 结构。如果 `key` 已经有值，则键值会被更新，否则就新生成该键

  ```js
  const m = new Map();

  m.set('edition', 6)        // 键是字符串
  m.set(262, 'standard')     // 键是数值
  m.set(undefined, 'nah')    // 键是 undefined 
  // set方法返回的是当前的Map对象，因此可以采用链式写法
  let map = new Map()
   .set(1, 'a')
   .set(2, 'b')
   .set(3, 'c');
  ```

- `Map.prototype.get(key)`: `get` 方法读取 `key` 对应的键值，如果找不到 `key` ，返回 `undefined`

- `Map.prototype.has(key)`: `has` 方法返回一个布尔值，表示某个键是否在当前 Map 对象之中

- `Map.prototype.delete(key)`: `delete` 方法删除某个键，返回 `true`。如果删除失败，返回 `false`

- `Map.prototype.clear()`: `clear` 方法清除所有成员，没有返回值

## 遍历方法

- `Map.prototype.keys()`：返回键名的遍历器

- `Map.prototype.values()`：返回键值的遍历器

- `Map.prototype.entries()`：返回所有成员的遍历器

- `Map.prototype.forEach()`：遍历 Map 的所有成员

需要特别注意的是，Map 的遍历顺序就是插入顺序

```js
const map = new Map([
  ['F', 'no'],
  ['T',  'yes'],
]);

for (let key of map.keys()) {
  console.log(key);
}
// "F"
// "T"

for (let value of map.values()) {
  console.log(value);
}
// "no"
// "yes"

for (let item of map.entries()) {
  console.log(item[0], item[1]);
}
// "F" "no"
// "T" "yes"

// 或者
for (let [key, value] of map.entries()) {
  console.log(key, value);
}
// "F" "no"
// "T" "yes"

// 等同于使用map.entries()
for (let [key, value] of map) {
  console.log(key, value);
}
// "F" "no"
// "T" "yes"
```

## 与其他数据结构的互相转

**Map 转为数组**

Map 结构转为数组结构，比较快速的方法是使用扩展运算符（...）

```js
const map = new Map([
  [1, 'one'],
  [2, 'two'],
  [3, 'three'],
]);

[...map.keys()]
// [1, 2, 3]

[...map.values()]
// ['one', 'two', 'three']

[...map.entries()]
// [[1,'one'], [2, 'two'], [3, 'three']]

[...map]
// [[1,'one'], [2, 'two'], [3, 'three']]
```

结合数组的 `map` 方法、`filter` 方法，可以实现 Map 的遍历和过滤（Map 本身没有 `map` 和 `filter` 方法）

```js
const map0 = new Map()
  .set(1, 'a')
  .set(2, 'b')
  .set(3, 'c');

const map1 = new Map(
  [...map0].filter(([k, v]) => k < 3)
);
// 产生 Map 结构 {1 => 'a', 2 => 'b'}

const map2 = new Map(
  [...map0].map(([k, v]) => [k * 2, '_' + v])
    );
// 产生 Map 结构 {2 => '_a', 4 => '_b', 6 => '_c'}
```

**数组 转为 Map**

将数组传入 Map 构造函数，就可以转为 Map

```js
new Map([
  [true, 7],
  [{foo: 3}, ['abc']]
])
// Map {
//   true => 7,
//   Object {foo: 3} => ['abc']
// }
```

**Map 转为对象**

如果所有 Map 的键都是字符串，它可以无损地转为对象

```js
function strMapToObj(strMap) {
  let obj = Object.create(null);
  for (let [k,v] of strMap) {
    obj[k] = v;
  }
  return obj;
}

const myMap = new Map()
  .set('yes', true)
  .set('no', false);
strMapToObj(myMap)
// { yes: true, no: false }
```

如果有非字符串的键名，那么这个键名会被转成字符串，再作为对象的键名

**对象转为 Map**

对象转为 Map 可以通过 `Object.entries()`

```js
let obj = {"a":1, "b":2};
let map = new Map(Object.entries(obj))
// 也可以自己实现一个转换函数
function objToStrMap(obj) {
  let strMap = new Map();
  for (let k of Object.keys(obj)) {
    strMap.set(k, obj[k]);
  }
  return strMap;
}

objToStrMap({yes: true, no: false})
// Map {"yes" => true, "no" => false}

```

**Map 转为 JSON**

```js
function strMapToObj(strMap) {
  let obj = Object.create(null);
  for (let [k,v] of strMap) {
    obj[k] = v;
  }
  return obj;
}

function strMapToJson(strMap) {
  return JSON.stringify(strMapToObj(strMap));
}

let myMap = new Map().set('yes', true).set('no', false);
strMapToJson(myMap)
// '{"yes":true,"no":false}'
```

**JSON 转为 Map**

```js
function jsonToStrMap(jsonStr) {
  return new Map(Object.entries(JSON.parse(jsonStr)));
}

jsonToStrMap('{"yes": true, "no": false}')
// Map {'yes' => true, 'no' => false}

// 如果JSON是数组
function jsonToMap(jsonStr) {
  return new Map(JSON.parse(jsonStr));
}

jsonToMap('[[true,7],[{"foo":3},["abc"]]]')
// Map {true => 7, Object {foo: 3} => ['abc']}
```

# WeakMap

WeakMap结构与Map结构类似，也是用于生成键值对的集合, WeakMap与Map的区别有两点

**WeakMap只接受对象作为键名（null除外），不接受其他类型的值作为键名**

```js
// WeakMap 可以使用 set 方法添加成员
const wm1 = new WeakMap();
const key = {foo: 1};
wm1.set(key, 2);
wm1.get(key) // 2

// WeakMap 也可以接受一个数组，
// 作为构造函数的参数
const k1 = [1, 2, 3];
const k2 = [4, 5, 6];
const wm2 = new WeakMap([[k1, 'foo'], [k2, 'bar']]);
wm2.get(k2) // "bar"


const map = new WeakMap();
map.set(1, 2)
// TypeError: 1 is not an object!
map.set(Symbol(), 2)
// TypeError: Invalid value used as weak map key
map.set(null, 2)
// TypeError: Invalid value used as weak map key
```

**WeakMap的键名所指向的对象，不计入垃圾回收机制**

它的键名所引用的对象都是弱引用，即垃圾回收机制不将该引用考虑在内。因此，只要所引用的对象的其他引用都被清除，垃圾回收机制就会释放该对象所占用的内存。也就是说，一旦不再需要，WeakMap 里面的键名对象和所对应的键值对会自动消失，不用手动删除引用

```js
var m = new WeakMap()
var a = {}
m.set(a, 1)
m.get(a) // 1
a = null
m.get(a) // undefined
```

## 属性方法

WeakMap 与 Map 相比，没有 `size` 属性， 没有遍历操作（即没有 `keys()`、`values()`、`clear` 和 `entries()` 方法）

WeakMap只有四个方法可用：`get()`、`set()`、`has()`、`delete()`

