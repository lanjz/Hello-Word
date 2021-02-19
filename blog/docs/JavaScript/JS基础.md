# JS基础

# JS类型

 JS一共有七个类型，这七个类型又可以分为两大类：基本类型和复杂类型

基本类型：`string`、`number`、`null`、`undefined`、`boolean`、`symbol`

复杂类型：函数、 数组、 对象

## 基本类型

### undefined类型和null

声明了一个变量，但未对其赋值，那么这个值将为undefined

`null`是一个空对象的指针，所以 `typeof null`将等于object

`null`使用立场：如果一个变量将来要赋值为一个对象，则可以先将此变量赋值为`null`，以表示这个值是属性对象类型

`null == undefined` 结果为`true`  因为`==`会尝试将两边的变量做类型转换，所以他们的结果会相同。

`null === undefined`  结果为`false`

### boolean类型

使用`Boolean()`函数，可以将任何类型转换为`boolean类型`

### number类型

- 八进制：以0（零）开头

- 十六进制：以0x开关

浮点数值的最高精度是17位小数，但在进行算术计算时其精确度远远不如整数。例如`0.1+0.2 = 0.3000000000000004`

> 关于浮点数计算会产生舍入误差的问题，这是使用基于IEEE754数值的浮点计算的通病

#### 数值范围

- `Number.MIN_VALUE` ：最小值 

- `Number.MAX.VALUE` ：最大值 

使用`isFinite()`函数可以判定一个值是否是有穷的：既位于最大与最小数之间时会返回`true`

### NaN类型

`NaN`表示不是数值的类型

作用: 在其它语言中，任何数值除以非数值都会导致错误，从而停止代码执行。但在ECMAScript中，任何数值除以非数值会返回`NaN`，所以不会影响其他代码执行

`NaN`特点：

1. `NaN`不等于任意值，包括`NaN`本身

```
NaN == NaN // false
```

2. 任何涉及`NaN`的操作都会返回`NaN`

`isNaN()`：对于不是数值或不能转换成数值的值结果返回`true`

例如:

```
isNaN(true) // false
isNaN('srt') // true

``` 

`isNaN()`也适用于对象，在基于对象使用时，首先会调用该对象的`valueof()`方法，然后对这个结果进行数值转换，如果不能转换，对这个`valueof()`返回的结果再调用`toString()`，再测试返回值。

```
isNaN(null) // false
isNaN({a: 1}) // true
```

## Object 类型

```js
// 以通过执行`new`操作符后跟要创建的对象类型的名称来创建
var o = new Object()
// 也可以省略后面的括号
var o = new Object
// 也可以通过语法结构来创建
var o = {}
```

`Object`的每个实例都具有下列属性和方法

- `constructor`： 保存着创建该实例的函数。对于前面的例子，构建函数（constructor）就是Object

- `hasOwnProperty`: 检查某个属性是否存在于当前实例中（不是检查是否在该实例的原型中）

  ```js
  const object1 = {};
  object1.property1 = 42;
  console.log(object1.hasOwnProperty('property1'));
  // expected output: true
  console.log(object1.hasOwnProperty('toString'));
  // expected output: false
  console.log(object1.hasOwnProperty('hasOwnProperty'));
  // expected output: false
  ```

- `propertyIsEnumerable`: 检查属性是否可以通过`for - in`枚举出来 

- `toLocalString()`：返回对象的字符串表示

  ```js
  o.toLocalString() // "[object Object]"
  ```

- `toString()`： 返回对象的字符串表示

- `valueOf()`： 返回对象原始值


## 类型转换

| 空值        | 字符串      | 数字  | 布尔值 | 对象             |
| ---------- | ---------- | ----- | ----- | --------------  |
| undefine   | "unefined" | NaN   | false | throw TypeError |
| null       | "null"     | 0     | false | throw TypeError |

| 布尔值    | 字符串     | 数字  | 对象               |
| -------- | ----------| ---- | ------------------ |
| true     | "true"    | 1    | new Boolean(true)  |
| false    | "false"   | 0    | new Boolean(false) |

| 字符串        | 数字  | 布尔值  | 对象              |
| ------------ | ---- |-----   |------------------ |
| ""(空字符串)  | 0   | false   | new String("")    |
| "1.2"        | 1.2  | true   | new String("1.2") |
| "one"        | NaN  | true   | new String("one") |

| 数字        | 字符串       | 布尔值 | 对象                  |
| ---------- | ----------- | ----- | --------------------- |
| 0          | "0"         | false | new Number(0)         |
| -0         | "0"         | false | new Number(-0)        |
| NaN        | "NaN"       | false | new Number(NaN)       |
| Infinity   | "Infinity"  | true  | new Number(Infinity)  |
| -Infinity  | "-Infinity" | true  | new Number(-Infinity) |
| -1         | "-1"        | true  | new Number(-1)        |
| 1          | "1"         | true  | new Number(1)         |

| 对象   | 字符串 | 数字  | 布尔值 |
| ----- | ------| ----- |-----:|
| {}    | "[object Object]"    | --    | true |
| []    | ""    | 0     | true |
| [9]   | "9"   | 9     | true |
| ['a'] | "a"   | NaN  | true |

从上表中可以看到有几个点需要注意：

- `true` 转数字为 `1`

- `false`转数字为 `0`

- 空字符串转数字为 `0`

- `Null` 转数字为 `0`

- 原始值到对象的转换也是非常简单，原始值是通过`new String()`,`new Number`或`new Boolean()`构造函数，转换为它们各自的包装对象

### 基本类型的转换

**显示类型转换**

使用`String()`,`Number`，`Boolean()`或`Object()`可以做显式类型转换

```js
Number('3') // 3
String(false) // 'false'
Boolean([]) // true
Object(3) // new Number(3)
```

**隐式类型转换**

- 如果运算符 `+` 的一个操作数是字符串，它会把另外一个操作转换为字符串

- 一元运算符 `+` 可以将其操作符转换为数字

- 一元运算符 `!` 可以将其操作符转换为布尔值并取反

```js
x + '' // 等价于String(x)
+x  // 等价于Number(x)
!!x // 等价于Boolen(x)
```

### 对象值转基本类型

**对象值转布尔值**

所有的对象（包括数组和函数）都转换为`true`, 包括包装对象

```js
!!(new Boolean(false)) // true
```

**对象转字符串**

1. 如果对象具有`toString()`方法，则调用这个方法，然后再转换为字符串

2. 如果对象没有`toString()`方法，则调用`valueOf()`方法，然后再返回字符串结果

3. 如果对象没有`toString()`和`valueOf()`方法，则抛出错误异常

**对象转数字**

1. 如果对象具有`valueOf()`方法，则调用这个方法，然后再转换为数字

2. 如果对象没有`valueOf()`方法，则调用`toString()`方法，然后再返回数字结果

3. 如果对象没有`toString()`和`valueOf()`方法，则抛出错误异常


## 类型判断

### typeof 操作符

- `undefind` -- 如果这个值未定义

  ```js
  var a;
  typeof a // "undefined"
  ```

- `boolean` -- 如果这个值是布尔类型

  ```js
  var a = true;
  typeof a // "boolean"
  ```

- `string` -- 如果这个值是字符串

  ```js
  var a = 'str';
  typeof a // "string"
  ```

- `number` -- 如果这个值是数字

  ```js
  var a = 10;
  typeof a // "number"
  ```

- `object` -- 如果这个值是对象或者`null`

  ```js
  var a = {};
  typeof a // "object"
  var b = [];
  typeof a // "object"
  var c = null;
  typeof a // "object"
  ```

- `function` -- 如果这个值是函数

  ```js
  var a = function(){};
  typeof a // "function"
  ```

`typeof`是一个操作符，所以在使用的时候，`typeof`后面可以有括号，也可以没有

```javascript
typeof (110) = typeof 110
```

`typeof`只能判断基本类型，对于对象类型并不能得到其准确类型

### toString()

平时我们需要对对象类型做精准判断的时候会使用`Object.prototype.toString.call()`方法

```js
var obj = {}
Object.prototype.toString.call(obj) // "[object Object]"

var arr = []
Object.prototype.toString.call(arr) // "[object Array]"

var fn = function(){}
Object.prototype.toString.call(fn) // "[object Function]"
```

`Object.prototype.toString.call()`和`toString()`区别

每个对象都有一个`toString()`方法,这个方法实际上调用的`Object.prototyp.toString()`方法，它的作用是当该对象被表示为一个文本值时，或者一个对象以预期的字符串方式引用时自动调用(啥意思呢？)，默认情况下，调用`toString()` 返回 `"[object type]"`

```js
var obj = {}
obj.toString() // "[object Object]"
```

但是数组及函数类型的却没有返回预期的结果

```js
var obj = ['a']
obj.toString() // "a"

var obj = function(){}
obj.toString() // "function(){}"
```

这是因为数组及函数类型也是继承于`Object`对象的，正常他们也具有`toString()`方法，但是它们的原型对象上也实现了自己的`toString()`方法，所以当我们在这些对象上调用`toString()`方法时，比如`[].toString()`执行的不是`Object.prototype.toString()`方法，而是执行的`Array.prototype.toString()`方法，`Function`及其它类型的也是如此

- `Function.prototype.toString()`: `toString()` 方法返回一个表示当前函数源代码的字符串。

  ```js
  function sum(a, b) {
    return a + b;
  }

  sum.toString() 
 
  // "function sum(a, b) {
  //  return a + b;
  //}"
  ```

- `Array.prototype.toString()`: `toString` 返回一个字符串，表示指定的数组及其元素。

  ```js
  const array1 = [1, 2, 'a', '1a'];

  array1.toString() // "1,2,a,1a"
  ```

- `String.prototype.toString()`: `toString()` 方法返回指定对象的字符串形式。

  ```js
  var x = new String("Hello world");
  alert(x.toString())      // 输出 "Hello world"
  ```
  
- `Number.prototype.toString([radix])`: `toString([radix])` 方法返指定`Number`对象的字符串表示形式。
  
  `radix`参数指定要用于数字到字符串的转换的基数(从2到36)。如果未指定 `radix` 参数，则默认值为 `10`。
  
  ```js
  var count = 10;
  
  console.log(count.toString());    // 输出 '10'
  console.log((17).toString());     // 输出 '17'
  console.log((17.2).toString());   // 输出 '17.2'
  var x = 6;
  console.log(x.toString(2));       // 输出 '110'
  console.log((254).toString(16));  // 输出 'fe'
  console.log((-10).toString(2));   // 输出 '-1010'
  console.log((-0xff).toString(2)); // 输出 '-11111111'
  ```

- `Boolean.prototype.toString()`: `toString()` 方法返回指定的布尔对象的字符串形式。

  ```js
  var bol = true
  bol.toString() // "true"
  ```
- `RegExp.prototype.toString()`: `toString()` 返回一个表示该正则表达式的字符串。

  ```js
  var reg1 = new RegExp("bar", "g");
  reg1.toString() // "/bar/g"
  var reg2 = /a(?!b)c/g
  reg2.toString() // "/a(?!b)c/g"
  
  ```

- `Date.prototype.toString()`: `toString()` 方法返回一个字符串，表示该`Date对象`。

  ```js
  var date = new Date()
  date.toString()
  "Wed Feb 05 2020 00:23:26 GMT+0800 (中国标准时间)"
  ```

- `Error.prototype.toString()`: `toString()` 方法返回一个指定的错误对象（Error object）的字符串表示。

  ```js
  var e = new Error("fatal error");
  e.toString() // "Error: fatal error"
  e.name = '134'
  e.toString() //"134: fatal error"
  e.name = ''
  e.toString() // "fatal error"
  e.message = undefined
  e.toString() // ""
  e.message = 'msg'
  e.toString() // "msg"
  ```

- `Symbol.prototype.toString()`:`toString()` 方法返回当前 `symbol` 对象的字符串表示。

  ```js
  Symbol("desc").toString();   // "Symbol(desc)"
  // well-known symbols
  Symbol.iterator.toString();  // "Symbol(Symbol.iterator)
  // global symbols
  Symbol.for("foo").toString() // "Symbol(foo)"
  ```

因此，为了让`[].toString()`调用的是`Object.prototype.toString()`方法，所以就有了`Object.prototype.toString.call([])`方法

### valueOf()

`valueOf()` 方法返回指定对象的原始值。

不同类型对象的`valueOf()`方法的返回值如下：

- Array： 返回数组对象本身

- Boolean： 布尔值

- Date： 存储的时间是从 1970 年 1 月 1 日午夜开始计的毫秒数 UTC

- Function： 函数本身

- Number： 数字值

- Object： 对象本身。这是默认情况

- String： 字符串值

**Math 和 Error 对象没有 valueOf 方法。**

```js
// Array：返回数组对象本身
var array = ["ABC", true, 12, -5];
console.log(array.valueOf() === array);   // true

// Date：当前时间距1970年1月1日午夜的毫秒数
var date = new Date(2013, 7, 18, 23, 11, 59, 230);
console.log(date.valueOf());   // 1376838719230

// Number：返回数字值
var num =  15.26540;
console.log(num.valueOf());   // 15.2654

// 布尔：返回布尔值true或false
var bool = true;
console.log(bool.valueOf() === bool);   // true

// new一个Boolean对象
var newBool = new Boolean(true);
// valueOf()返回的是true，两者的值相等
console.log(newBool.valueOf() == newBool);   // true
// 但是不全等，两者类型不相等，前者是boolean类型，后者是object类型
console.log(newBool.valueOf() === newBool);   // false

var bol = true

bol.valueOf() === bol // true

// Function：返回函数本身
function foo(){}
console.log( foo.valueOf() === foo );   // true
var foo2 =  new Function("x", "y", "return x + y;");
console.log( foo2.valueOf() );
/*
ƒ anonymous(x,y
) {
return x + y;
}
*/

// Object：返回对象本身
var obj = {name: "张三", age: 18};
console.log( obj.valueOf() === obj );   // true

// String：返回字符串值
var str = "http://www.xyz.com";
console.log( str.valueOf() === str );   // true

// new一个字符串对象
var str2 = new String("http://www.xyz.com");
// 两者的值相等，但不全等，因为类型不同，前者为string类型，后者为object类型
console.log( str2.valueOf() === str2 );   // false
```

## 操作符

> 只能操作一个值的操作符叫做**一元操作符**

`--a`:：前置递减

`++a`：前置递加

`a--`：后置递减

`--a`：前置递加

执行前置时，变量的值都是语句被求值以前改变的。（在计算机科学领域，这种情况被 称作**副效应**）

```js
var age = 29
var anotherAge = --age + 2
alert(age) // 28
alert(anotherAge) = 30
```

```js
var num1 = 2
var num2 = 20
var num3 = --num1 + num2 // 21 
var num4 = num1 + num2 // 21
```

执行后置运算时，递增和背叛是在包含它们的语句被求值之后才执行的。

```js
var num1 = 2
var num2 = 20
var num3 = num1-- + num2 // 22
var num4 = num1 + num2 // 21
```

## 原型链

> [继承与原型链](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Inheritance_and_the_prototype_chain)

JavaScript中的每个实例对象（Object）都有一个私有属性（`__proto__`）指向它的构造函数的原型对象（`prototype`）。该原型对象也有一个自己的原型对象（`__proto__`）指向它的构造函数的原型对象（`prototype`），这样层层向上直到一个对象的原型对象为`null`。所以`null`是原型链中的最后一个环节

所以上文提到的一层层的`__proto__`就组成了原型链

> 几乎所有 JavaScript 中的对象都是位于原型链顶端的 Object 的实例。

**继承属性**

当试图访问一个对象时，它不仅仅在该对象上搜寻，还会从该对象的原型链上搜索，直到找到一个匹配的属性或达到原型链的末尾

> 遵循ECMAScript标准，`someObject.[[Prototype]]` 符号是用于指向 `someObject` 的原型。
>从 ECMAScript 6 开始，`[[Prototype]]` 可以通过 `Object.getPrototypeOf()` 和 `Object.setPrototypeOf()` 访问器来访问。
>这个等同于 JavaScript 的非标准但许多浏览器实现的属性` __proto__`。

```js
function f() {
  this.a = 1;
  this.b = 2;
}
let o = new f(); // {a: 1, b: 2}

// 在f函数的原型上定义属性
f.prototype.b = 3;
f.prototype.c = 4;

constole.log(o.__proto__) // {b:3,c:4}
o.a // 1
o.b // 2
o.c // 4 o的原型对象上的`c`属性
o.__proto__ === f.protype // true // o的__proto__指向它的构造函数的protype属性
```

**不要在`f`函数的原型上直接定义 `f.prototype = {b:3,c:4}`;这样会重写整`prototype`属性，直接打破原型链**

**性能影响**

上文提到了当访问某个对象的属性时，如果当前对象不存在这个属性时，会从这个对象的原型链中查找，直到遍历整个原型链，这个过程比较耗时，
对性能有副作用。

遍历对象的属性时，原型链上的每个可枚举属性都会被枚举出来。要检查对象是否具有自己定义的属性，而不是其原型链上的某个属性，可以使用`Object.prototyp.hasOwnProperty`方法`

```js
function f() {
  this.a = 1;
  this.b = 2;
}
f.prototype.b = 3;
f.prototype.c = 4;

var o = new f()

o.hasOwnProperty(a) // true
o.hasOwnProperty(b) // true
o.hasOwnProperty(c) // false
o.__proto__.hasOwnProperty('c') // true
```

`o`自身没有名为 `hasOwnProperty`的属性,`hasOwnProperty` 是 `Object.prototype` 的属性.因此 `o` 继承了 `Object.prototype` 的 `hasOwnProperty`
   
`hasOwnProperty`是 JavaScript 中处理属性并且不会遍历原型链的方法之一,另一种方法是`Object.keys()`)

注意：检查属性是否 `undefined` 还不够。该属性可能存在，但其值恰好设置为 `undefined`。

### 创建对象及原型链

创建对象的方式有很多种：

**使用语法结构创建的对象**

创建普通对象：

```js
var o = {a: 1};
```
  
- 对象都继承于 `Object.prototype` ,`Object.prototype` 中包含 `hasOwnProperty`, `toString` 等方法

- 原型链如下: `o ---> Object.prototype ---> null`
  
创建数组：

```js
var a = ["yo", "whadup", "?"];
```
- 数组都继承于 `Array.prototype` ,`Array.prototype` 中包含 `indexOf`, `forEach` 等方法

- 原型链如下: `a ---> Array.prototype ---> Object.prototype ---> null`

创建函数：
 
```js
function f(){
  return 2;
}
```
- 函数都继承于 `Function.prototype`，`Function.prototype` 中包含 `call`, `bind`等方法

- 原型链如下: `f ---> Function.prototype ---> Object.prototype ---> null`
 
**使用构造器创建的对象**
 
在 JavaScript 中，构造器其实就是一个普通的函数。当使用 `new `操作符 来作用这个函数时，它就可以被称为构造方法（构造函数）。
 
```js
function Graph() {
  this.vertices = [];
  this.edges = [];
}

Graph.prototype = {
  addVertex: function(v){
    this.vertices.push(v);
  }
};

var g = new Graph();
```

- `g` 是生成的对象，他的自身属性有 `vertices` 和 `edges`。

- 在 `g` 被实例化时，`g.__proto__` 指向了 `Graph.prototype`

**使用 `Object.create` 创建的对象**

可以调用`Object.create`方法来创建一个新对象。新对象的原型就是调用 `create` 方法时传入的第一个参数

```js
var a = {a: 1}; 
// a ---> Object.prototype ---> null

var b = Object.create(a);
// b ---> a ---> Object.prototype ---> null
console.log(b.a); // 1 (继承而来)

var c = Object.create(b);
// c ---> b ---> a ---> Object.prototype ---> null

var d = Object.create(null);
// d ---> null
console.log(d.hasOwnProperty); // undefined, 因为d没有继承Object.prototype
```

**使用 `class` 关键字创建的对象**

```js
class Polygon {
  constructor(height, width) {
    this.height = height;
    this.width = width;
  }
}

class Square extends Polygon {
  constructor(sideLength) {
    super(sideLength, sideLength);
  }
  get area() {
    return this.height * this.width;
  }
  set sideLength(newLength) {
    this.height = newLength;
    this.width = newLength;
  }
}

var square = new Square(2);
square instanceof Square // true
square instanceof Polygon // true
```

> JavaScript中的`class` 仍然是基于原型的

### 获取原型链

`Object`提供了`getPrototypeOf()`来获取原型链，`Object.getPrototypeOf()`方法与`__proto__`作用一样，都是指向该对象的构造函数的`protype`属性

```js
function A() {
  this.a = 1;
  this.b = 2;
}
A.prototype.doSomething = function(){console.log(this)};

var a1 = new A()
var a2 = new A()
```

从上面的例子中，可以得到以下信息

- `a1.doSomething` 事实上会指向 `Object.getPrototypeOf(a1).doSomething`，它就是你在 `A.prototype.doSomething` 中定义的内容。

- 也就是说：`Object.getPrototypeOf(a1).doSomething == Object.getPrototypeOf(a2).doSomething == A.prototype.doSomething`,

实际上，执行 `a1.doSomething()` 相当于执行` Object.getPrototypeOf(a1).doSomething.call(a1)==A.prototype.doSomething.call(a1)`

### 关于 new 方法

当执行 `var a1 = new A()`,内部做了以下工作：

- 创建一个新对象

- 新对象有`__proto__`指向`A.prototype`，即`a1.[[Prototype]] = A.prototype`

- 运行函数 `A()` 把 `this` 指向新对象之前设置

然后当您访问实例的属性时，JavaScript 首先会检查它们是否直接存在于该对象上，如果不存在，则会 `[[Prototype]]` 中查找。

自己实现`new`方法

```js
function _new(fn, ...arg){
    const obj = {}
    obj.__proto__ = fn.protype
    fn.apply(obj, arg)
    return obj
}

// 效果一样
function _new(fn, ...arg){
    const obj = Object.create(fn)
    fn.apply(obj, arg)
    return obj
}

function t(arg){
    this.a = arg
}

var t1 = _new(t, 1)
var t2 = _new(t, 10)
t1.a // 1
t2.a // 10
t1.__proto__ === t2.__proto__ // true

```

注意自己实现的`_new`方法并不是与`new`完全一样,继续上个例子来简单做下演示：

```js
console.log('获取构造方法：', t1.constructor) // 获取构造方法: ƒ Object() { [native code] }
t1.constructor === Object.prototype.constructor // true
// 使用原生new
var t3 = new t(5)
console.log('获取构造方法：', t3.constructor) // 获取构造方法: ƒ t(arg){ this.a = arg }
```

## Javascript内存模式

JS内存空间分为栈(stack)、堆(heap)、池(一般也会归类为栈中)。 其中栈存放变量，堆存放复杂对象，池存放常量

### 基础数据类型与栈内存

JS中的基础数据类型，这些值都有固定的大小，往往都保存在栈内存中（闭包除外），由系统自动分配存储空间。我们可以直接操作保存在栈内存空间的值，因此基础数据类型都是按值访问，数据在栈内存中的存储与使用方式类似于数据结构中的堆栈数据结构，**遵循后进先出的原则**

### 引用数据类型与堆内存

JS的引用数据类型，比如数组`Array`，它们值的大小是不固定的。引用数据类型的值是保存在堆内存中的对象。JS不允许直接访问堆内存中的位置，因此我们不能直接操作对象的堆内存空间。在操作对象时，实际上是在操作对象的引用而不是实际的对象。因此，引用类型的值都是按引用访问的。这里的引用，我们可以粗浅地理解为保存在栈内存中的一个地址，该地址与堆内存的实际值相关联

### JavaScript 内存生命周期

JS环境中分配的内存一般有如下生命周期：

1. 内存分配：当我们申明变量、函数、对象的时候，系统会自动为他们分配内存

2. 内存使用：即读写内存，也就是使用变量、函数等

3. 内存回收：使用完毕，由垃圾回收机制自动回收不再使用的内存

### JavaScript 的内存回收机制

JavaScript 的内存回收机制原理很简单，就是找出那些不再继续使用的值，然后释放其占用的内存。垃圾收集器会每隔固定的时间段就执行一次释放操作
主要有两种：引用计数垃圾收集和标记-清除算法

**引用计数垃圾收集**

这是最初级的垃圾收集算法。此算法把“对象是否不再需要”简化定义为“对象有没有其他对象引用到它”。如果没有引用指向该对象（零引用），对象将被垃圾回收机制回收。

当声明了一个变量并将一个引用类型值赋给该变量时，刚这个值的引用次数就是 1 。如果同一个值又被赋值给另一个变量，则该值的引用次数加 1 。相反，如果引用这个值的变量重新赋值了另外一个值，则这个值的引用次数减1。当这个值的引用次数变成 0 时，则说明没有办法再访问这个值了，因而就可以将其占用的内存空间回收回来

```js
var o = { 
  a: {
    b:2
  }
}; 
// 两个对象被创建，一个作为另一个的属性被引用，另一个被分配给变量o
// 很显然，没有一个可以被垃圾收集

var o2 = o; // o2变量是第二个对“这个对象”的引用
o = 1;      // 现在，“这个对象”只有一个o2变量的引用了，“这个对象”的原始引用o已经没有
var oa = o2.a; // 引用“这个对象”的a属性
               // 现在，“这个对象”有两个引用了，一个是o2，一个是oa
o2 = "yo"; // 虽然最初的对象现在已经是零引用了，可以被垃圾回收了
           // 但是它的属性a的对象还在被oa引用，所以还不能回收
oa = null; // a属性的那个对象现在也是零引用了
           // 它可以被垃圾回收了
```

引用计数的缺陷：循环引用

```js
function f(){
  var o = {};
  var o2 = {};
  o.a = o2; // o 引用 o2
  o2.a = o; // o2 引用 o

  return "azerty";
}
f();
```

两个对象被创建，并互相引用，形成了一个循环。它们被调用之后会离开函数作用域，所以它们已经没有用了，可以被回收了。然而，引用计数算法考虑到它们互相都有至少一次引用，所以它们不会被回收

**标记-清除算法**

这是当前主流的GC算法，V8里面就是用这种。当对象，无法从根对象沿着引用遍历到，即不可达（unreachable），进行清除。

[V8垃圾回收GC](https://libin1991.github.io/2019/11/19/V8%E5%9E%83%E5%9C%BE%E5%9B%9E%E6%94%B6GC/)

[JavaScript 内存机制（前端同学进阶必备）](https://juejin.im/post/5b10ba336fb9a01e66164346#heading-2)

## 继承

### 原型链继承

利用原型链让子类的原型链引用另一个引用类型的属性和方法，从而达到继承的目的

```js
function SuperType() {
    this.superColor = ['red']
}
SuperType.prototype.getSuperColor = function(){
    return this.superColor
}
function SubType(){
    this.subClor = ['black']
}
SubType.prototype = new SuperType()
SubType.prototype.getSubColor = function(){
    return this.subClor
}
const instance = new SubType()
console.log(instance.getSuperColor()) // ['red']
```

原型链继承的问题：最主要的问题来自 如果父类构造函数有引用类型的属性时，子类修改了这个属性也会修改父类的属性，导致其它的子类也会跟着发生变化

```js
function SuperType() {
    this.superColor = ['red']
}
SuperType.prototype.getSuperColor = function(){
    return this.superColor
}
function SubType(){
    this.subClor = ['black']
}
SubType.prototype = new SuperType()
SubType.prototype.getSubColor = function(){
    return this.subClor
}
const instance = new SubType()
const instance2 = new SubType()
instance.superColor.push('green')
console.log(instance.getSuperColor()) // ["red", "green"]
console.log(instance2.getSuperColor()) // ["red", "green"]
```

从上面的例子中可以看到`instance.superColor.push('green')`的代码同时也影响了`instance2.superColor`

### 构造函数继承

构选函数继承的实现思想就是在子类构造函数内部调用超类的构造函数，并且调用的时候使用`call`，`apply`方法将超类的属性添加到当前子类中

```js
function SuperType(c = 'red') {
    this.color = [c]
}
SuperType.prototype.getSuperColor = function(){
    return this.color
}
SuperType.prototype.name = 'super'
function SubType(){
    SuperType.call(this, 'black')
}
const instance = new SuperType()
const instance2 = new SubType()
instance.color.push('green')
console.log(instance.color) // ["red", "green"]
console.log(instance2.color) // ["black"]
```
可以看到 构造函数继承 解决了 原型链继承 中父类包含引用类型属性的问题，但是也暴露出了另一个问题，构造函数继承是在子类的构造函数调用父类的构造函数方法，将父类构造函中的属性复制到当前子类中，但是对于父类原型中的方法就无法继承了

```js
console.log(instance2.name) // undefined
```

### 组合继承

组合继承就是将原型链和构造函数继承结合在一起，使用构造函数实现对父类属性的继承，使用原型继承实现对父类原型属性和方法的继承

```js
function SuperType(c = 'red') {
    this.color = [c]
}
SuperType.prototype.getColor = function(){
    return this.color
}

function SubType(){
    SuperType.call(this, 'black')
}
SubType.prototype = new SuperType()
SubType.prototype.constructor = SubType
const instance = new SuperType()
const instance2 = new SubType()
instance.color.push('green')
console.log(instance.getColor())
console.log(instance2.getColor())
```

组合继承同时解决了 构造函数继承 和 原型链继承 的缺点，但是它也存在自己的不足。组成继承最大的问题就是会执行父类构造函数两次,结合上面的例子

第一次

```js
function SubType(){
    SuperType.call(this, 'black') // 执行了一次 SuperType 方法
}
```

第二次

```js
SubType.prototype = new SuperType() // 又执行了一次 SuperType 方法
```

### 寄生组合继承

寄生组合继承即使用构造函数继承来继承父类属性，再通过原型链的混成形式来继承原型链的方法和属性

```js
function SuperType(c = 'red') {
    this.color = [c]
}
SuperType.prototype.getColor = function(){
    return this.color
}
function SubType(){
    SuperType.call(this, 'black')
}
SubType.prototype = Object.create(SuperType.prototype)
SubType.prototype.constructor = SubType
const instance = new SuperType()
const instance2 = new SubType()
instance.color.push('green')
console.log(instance.getColor())
console.log(instance2.getColor())
```

**Object.create**

`Object.create()`方法创建一个新对象，使用现有的对象来提供新创建的对象的`__proto__`

等同于以下效果

```js
function createObj(obj){
    function F(){}
    F.prototype = obj
    return new F()
}
```

## 事件循环

JavaScript有一个基于事件循环的并发模型，事件循环负责执行代码、收集和处理事件以及执行队列中的子任务

### 栈

函数调用形成了一个由若干帧组成的栈

```js
function foo(b) {
  let a = 10;
  return a + b + 11;
}

function bar(x) {
  let y = 3;
  return foo(x * y);
}

console.log(bar(7)); // 返回 42
```

当调用 `bar`函数 时，第一个帧包含了 `bar` 的参数和局部变量`y`被放入栈中。 当 `bar` 调用 `foo` 时，第二个帧被创建并被压入栈中，这个帧是放在第一个帧之上的，帧中包含 `foo` 的参数和局部变量。当 `foo` 执行完毕然后返回时，第二个帧就被弹出栈（剩下 `bar` 函数的调用帧 ）。当 `bar` 也执行完毕然后返回时，第一个帧也被弹出，栈就被清空了

### 堆

对象被分配在堆中

### 队列

一个 JavaScript 运行时包含了一个待处理消息的消息队列

在 事件循环 期间的某个时刻，运行时会处理队列中的消息。被处理的消息会被移出队列，并执行对应的回调函数。**调用一个函数总是会为其创造一个新的栈帧。**

函数的处理会一直进行到执行栈再次为空为止；然后事件循环将会处理队列中的下一个消息（如果还有的话）





在事件循环中，每进行一次循环操作称为 `tick`，每一次 `tick `的任务处理模型是比较复杂的，但关键步骤如下：

- 执行一个宏任务（执行栈中没有就从事件队列中获取）

- 执行过程中如果遇到异步任务并不会一直等待其返回结果，而是会将这个事件挂起，继续执行执行栈中的其他任务

  - 异步导任务完成后，异步的结果将添加到任务队列

- 主线程处于闲置状态时，主线程会去查找任务队列是否有任务。如果有，那么主线程会从中取出排在第一位的事件，
并把这个事件对应的回调放入执行栈中（依次执行）

- 当前宏任务执行完毕，开始检查渲染，然后GUI线程接管渲染

- 渲染完毕后，JS线程继续接管，开始下一个宏任务（从事件队列中获取）

流程图如下：

![](https://camo.githubusercontent.com/47479c8773d91e8eef4a359eca57bb1361183b9e/68747470733a2f2f692e6c6f6c692e6e65742f323031392f30322f30382f356335643661353238626461662e6a7067)

![](https://camo.githubusercontent.com/dd47eccb5d9f224f911f0a1cbdf3fb5c9f3fa24a/68747470733a2f2f692e6c6f6c692e6e65742f323031392f30322f30382f356335643764383530353663372e706e67)

### JS代码执行

首先需要明白以下几件事情：

- JS分同步任务和异步任务

- 同步任务都在主线程上进行，形成一个执行栈

- 主线程之外，还一个任务队列，专门存放异步任务的结果

- 当主线程的任务都执行完之后，系统会读取任务队列，将可以执行异步任务添加到执行栈中，开始执行

根据规范，事件循环是通过任务队列的机制来进行协调的。一个 Event Loop 中，
可以有一个或者多个任务队列(task queue)，一个任务队列便是一系列有序任务(task)的集合；每个任务都有一个任务源(task source)，
源自同一个任务源的 task 必须放到同一个任务队列，从不同源来的则被添加到不同队列。 
`setTimeout/Promise` 等API便是任务源，而进入任务队列的是他们指定的具体执行任务

# 宏任务和微任务

异步任务可分为两类：微任务（`micro task`）和宏任务（`macro task`）

macrotask（又称为宏任务）：script(整体代码)、`setTimeout`、`setInterval`、`I/O`、`UI交互事件`、`postMessage`、`MessageChannel`、`setImmediate`(Node.js 环境)

microtask（又称为微任务）: `Promise.then`、`MutaionObserver`、`process.nextTick`(Node.js 环境)

在一个事件循环中，异步事件返回结果后会被放到一个任务队列中。然而，根据这个异步事件的类型，
这个事件实际上会被对应的宏任务队列或者微任务队列中去

当前执行栈为空的时候，主线程会查看`微任务队列`是否有事件存在。如果不存在，那么再去`宏任务队列中`查看是否有事件存在

## 事件任务与浏览器渲染关系

浏览器为了能够使JS内部宏任务与DOM任务能够有序的执行， **会在一个宏任务执行结束后，在下一个宏任务开始执行前，对
页面进行重新渲染**，流程如下：

`(macro)task->渲染->(macro)task->...`

这就可以解释平时工作中为了让某段代码能正确实现，然后故意放在`setTimeout`中执行，目的就是为了之前代码能先在页面中先生效

# 例子

写出这段代码输出顺序

```javascript
//请写出输出内容
async function async1() {
    console.log('async1 start');
    await async2();
    console.log('async1 end');
}
async function async2() {
	console.log('async2');
}

console.log('script start');

setTimeout(function() {
    console.log('setTimeout');
}, 0)

async1();

new Promise(function(resolve) {
    console.log('promise1');
    resolve();
}).then(function() {
    console.log('promise2');
});
console.log('script end');

// script start
// async1 start
// async2
// promise1
// script end
// async1 end
// promise2
// setTimeout
```


# Promise和async中的立即执行

我们知道Promise中的异步体现在then和catch中，所以写在Promise中的代码是被当做同步任务立即执行的。而在async/await中，在出现await出现之前，其中的代码也是立即执行的。那么出现了await时候发生了什么呢？

## await做了什么

从字面意思上看await就是等待，await 等待的是一个表达式，这个表达式的返回值可以是一个promise对象也可以是其他值。

由于因为async await 本身就是promise+generator的语法糖。所以await后面的代码是microtask。所以对于本题中的

```javascript
async function async1() {
	console.log('async1 start');
	await async2();
	console.log('async1 end');
}
```

等价于

```javascript
async function async1() {
	console.log('async1 start');
	Promise.resolve(async2()).then(() => {
                console.log('async1 end');
        })
}
```

# 回到本题 

以上就本道题涉及到的所有相关知识点了，下面我们再回到这道题来一步一步看看怎么回事儿。

首先，事件循环从宏任务(macrotask)队列开始，这个时候，宏任务队列中，只有一个script(整体代码)任务；当遇到任务源(task source)时，则会先分发任务到对应的任务队列中去。所以，上面例子的第一步执行如下图所示：

![](https://camo.githubusercontent.com/15b3ae9733b0b5b6a144f519396ff88eaeca40fb/68747470733a2f2f692e6c6f6c692e6e65742f323031392f30322f30382f356335643639623432316166332e706e67)

然后我们看到首先定义了两个async函数，接着往下看，然后遇到了 console 语句，直接输出 script start。输出之后，script 任务继续往下执行，遇到 setTimeout，其作为一个宏任务源，则会先将其任务分发到对应的队列中：

![](https://camo.githubusercontent.com/0a6e6cd2cc52d18a0f97ec01659058e830305a45/68747470733a2f2f692e6c6f6c692e6e65742f323031392f30322f30382f356335643639623432353530612e706e67)

script 任务继续往下执行，执行了async1()函数，前面讲过async函数中在await之前的代码是立即执行的，所以会立即输出async1 start。

遇到了await时，会将await后面的表达式执行一遍，所以就紧接着输出async2，然后将await后面的代码也就是console.log('async1 end')加入到microtask中的Promise队列中，接着跳出async1函数来执行后面的代码。

![](https://camo.githubusercontent.com/93ec5469b0846f0f161641fc718005dbe994d190/68747470733a2f2f692e6c6f6c692e6e65742f323031392f30322f31382f356336616435383333376165642e706e67)

script任务继续往下执行，遇到Promise实例。由于Promise中的函数是立即执行的，而后续的 .then 则会被分发到 microtask 的 Promise 队列中去。所以会先输出 promise1，然后执行 resolve，将 promise2 分配到对应队列。

![](https://camo.githubusercontent.com/6f617a237607ce7a71fabcab61d2952a8b412205/68747470733a2f2f692e6c6f6c692e6e65742f323031392f30322f31382f356336616435383334376135652e706e67)

script任务继续往下执行，最后只有一句输出了 script end，至此，全局任务就执行完毕了。

根据上述，每次执行完一个宏任务之后，会去检查是否存在 Microtasks；如果有，则执行 Microtasks 直至清空 Microtask Queue。

因而在script任务执行完毕之后，开始查找清空微任务队列。此时，微任务中， Promise 队列有的两个任务async1 end和promise2，因此按先后顺序输出 async1 end，promise2。当所有的 Microtasks 执行完毕之后，表示第一轮的循环就结束了。

# 变式一

```javascript
async function async1() {
    console.log('async1 start');
    await async2();
    console.log('async1 end');
}
async function async2() {
    //async2做出如下更改：
    new Promise(function(resolve) {
    console.log('promise1');
    resolve();
}).then(function() {
    console.log('promise2');
    });
}
console.log('script start');

setTimeout(function() {
    console.log('setTimeout');
}, 0)
async1();

new Promise(function(resolve) {
    console.log('promise3');
    resolve();
}).then(function() {
    console.log('promise4');
});

console.log('script end');

// script start
// async1 start
// promise1
// promise3
// script end
// promise2
// async1 end
// promise4
// setTimeout
```

变式二

```javascript
async function async1() {
    console.log('async1 start');
    await async2();
    //更改如下：
    setTimeout(function() {
        console.log('setTimeout1')
    },0)
}
async function async2() {
    //更改如下：
	setTimeout(function() {
		console.log('setTimeout2')
	},0)
}
new Promise(function(resolve) {
    console.log('promise2');
    setTimeout(() => {
    	 resolve();
    }, 10)
    console.log('promise2 resolve2')
}).then(function() {
    console.log('promise3');
});
console.log('script start');

setTimeout(function() {
    console.log('setTimeout3');
}, 0)
async1();

new Promise(function(resolve, reject) {
    console.log('promise1');
    reject();
    console.log('promise1 resolve')
}).then(function() {
    console.log('promise2');
}).catch(function(){
	 console.log('reject2');
});
console.log('script end');

// promise2
// promise2 resolve2
// script start
// async1 start
// promise1
// promise1 resolve
// script end
// reject2
// setTimeout3
// setTimeout2
// setTimeout1
// promise3
```

# 注意点

1. `Promise`中`resove()`或者`reject()`后的代码也会立即执行

2. `await`紧跟的函数也会立即执行，await后面语句才会加入microtask中

[](http://blog.poetries.top/browser-working-principle/guide/part4/lesson18.html#%E5%BE%AE%E4%BB%BB%E5%8A%A1)

### Q&A

**setTimeout**

`setTimeout`的延迟时间只是代表了消息被实际加入到队列的最小延迟时间，并不能表示实际的执行时间，具体什么时间执行还得根据这个队列在执行这个消息之前有没有其它消息