# JS类型

 JS一共有七个类型，这七个类型又可以分为两大类：`基本`类型和`复杂`类型

`基本`类型：`string`、`number`、`null`、`undefined`、`boolean`、`symbol`

`复杂`类型：函数、 数组、 对象

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

## typeof 操作符

- `undefind` -- 如果这个值未定义

- `boolean` -- 如果这个值是布尔类型

- `string` -- 如果这个值是字符串

- `number` -- 如果这个值是数字

- `object` -- 如果这个值是对象或者`null`

- `function` -- 如果这个值是函数

`typeof`是一个操作符，所以在使用的时候，`typeof`后面可以有括号，也可以没有

```javascript
typeof (110) === typeof 110
```

## object 类型

```
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

```
var o = new Object()
o.a = 123
o.hasOweProperty('a') // true
o.hasOweProperty('b') // false
```


- `propertyIsEnumerable`: 检查属性是否可以通过`for - in`枚举出来 

- `toLocalString()`：返回对象的字符串表示

```
o.toLocalString() // "[object Object]"
```

- `toString()`： 返回对象的字符串表示

- `valueOf()`： 返回对象的字符串、数值或布尔表示，通常与`toString()`方法返回的值相同

# 操作符

> 只能操作一个值的操作符叫做**一元操作符**

`--a`:：前置递减

`++a`：前置递加

`a--`：后置递减

`--a`：前置递加

执行前置时，变量的值都是语句被求值以前改变的。（在计算机科学领域，这种情况被 称作**副效应**）

```
var age = 29
var anotherAge = --age + 2
alert(age) // 28
alert(anotherAge) = 30
```
```
var num1 = 2
var num2 = 20
var num3 = --num1 + num2 // 21 
var num4 = num1 + num2 // 21
```

执行后置运算时，递增和背叛是在包含它们的语句被求值之后才执行的。

```
var num1 = 2
var num2 = 20
var num3 = num1-- + num2 // 22
var num4 = num1 + num2 // 21
```


# 高级

## 原型链

> [继承与原型链](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Inheritance_and_the_prototype_chain)

JavaScript中的每个实例对象（Object）都有一个私有属性（`__proto__`）
指向它的构造函数的原型对象（`prototype`）。该原型对象也有一个自己的
原型对象（`__proto__`）指向它的构造函数的原型对象（`prototype`），这样层层向上直到一个对象的原型对象为`null`。所以
`null`是原型链中的最后一个环节

所以上文提到的一层层的`__proto__`就组成了原型链

> 几乎所有 JavaScript 中的对象都是位于原型链顶端的 Object 的实例。

## 继承属性

当试图访问一个对象时，它不仅仅在该对象上搜寻，还会从该对象的原型链上搜索，
直到找到一个匹配的属性或达到原型链的末尾

> 遵循ECMAScript标准，`someObject.[[Prototype]]` 符号是用于指向 `someObject` 的原型。
>从 ECMAScript 6 开始，`[[Prototype]]` 可以通过 `Object.getPrototypeOf()` 和 `Object.setPrototypeOf()` 访问器来访问。
>这个等同于 JavaScript 的非标准但许多浏览器实现的属性` __proto__`。

```
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

**不要在`f`函数的原型上直接定义 `f.prototype = {b:3,c:4}`;这样会直接打破原型链**
  
> 但它不应该与构造函数`func`的 `prototype `属性相混淆。被构造函数创建的实例对象的 `[[prototype]]` 指向 `func` 的 `prototype` 属性。
>`Object.prototype` 属性表示 Object 的原型对象

### 性能影响

上文提到了当访问某个对象的属性时，如果当前对象不存在这个属性时，会从这个对象的原型链中查找，直到遍历整个原型链，这个过程比较耗时，
对性能有副作用。

遍历对象的属性时，原型链上的每个可枚举属性都会被枚举出来。要检查对象是否具有自己定义的
属性，而不是其原型链上的某个属性，可以使用`Object.prototyp.hasOwnProperty`方法`
```
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

## 创建对象和原型链

### 使用语法结构创建的对象

创建普通对象

   ```
   var o = {a: 1};
   ```
  
  - 对象都继承于 `Object.prototype` ,`Object.prototype` 中包含 `hasOwnProperty`, `toString` 等方法
 
  - 原型链如下: `o ---> Object.prototype ---> null`
  
创建数组

  ```
  var a = ["yo", "whadup", "?"];
  ```
  - 数组都继承于 `Array.prototype` ,`Array.prototype` 中包含 `indexOf`, `forEach` 等方法
  
  - 原型链如下: `a ---> Array.prototype ---> Object.prototype ---> null`

创建函数
 
   ```
    function f(){
      return 2;
    }
   ```
   - 函数都继承于 `Function.prototype`，`Function.prototype` 中包含 `call`, `bind`等方法
   
   - 原型链如下: `f ---> Function.prototype ---> Object.prototype ---> null`
 
 ### 使用构造器创建的对象
 
在 JavaScript 中，构造器其实就是一个普通的函数。当使用 `new `操作符 来作用这个函数时，它就可以被称为构造方法（构造函数）。
 
```
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

### 使用 Object.create 创建的对象

可以调用`Object.create`方法来创建一个新对象。新对象的原型就是调用 `create` 方法时传入的第一个参数

```
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

### 使用 class 关键字创建的对象

```
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
```

**JavaScript中的`class` 仍然是基于原型的**

## prototype和Object.getPrototypeOf()

`Object.getPrototypeOf()`方法与`__proto__`作用一样，都是指向该对象的构造函数的`protype`属性

```
function A() {
  this.a = 1;
  this.b = 2;
}
A.prototype.doSomething = function(){console.log(this)};

var a1 = new A()
var a2 = new A()
```

像上面的例子中，可以得到以下信息

- `a1.doSomething` 事实上会指向 `Object.getPrototypeOf(a1).doSomething`，它就是你在 `A.prototype.doSomething` 中定义的内容。

- 也就是说：`Object.getPrototypeOf(a1).doSomething` == `Object.getPrototypeOf(a2).doSomething` == `A.prototype.doSomething`,

- 实际上，执行 `a1.doSomething()` 相当于执行` Object.getPrototypeOf(a1).doSomething.call(a1)==A.prototype.doSomething.call(a1)`

## new 方法

当执行 `var a1 = new A()`,内部做了以下工作：

- 创建一个新对象

- 新对象有`__proto__`指向`A.prototype`，即`a1.[[Prototype]] = A.prototype`

- 运行函数 `A()` 把 `this` 指向新对象之前设置

然后当您访问实例的属性时，JavaScript 首先会检查它们是否直接存在于该对象上，如果不存在，则会 `[[Prototype]]` 中查找。

自己实现`new`方法

```
function _new(fn, ...arg){
    const obj = {}
    obj.__proto__ = fn.protype
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

注意自己实现的`_new`方法并不是与`new`完成一样,继续上个例子来简单做下演示：

```
console.log('获取构造方法：'， t1.constructor) // 获取构造方法: ƒ Object() { [native code] }

t1.constructor === Object.prototype.constructor // true

// 使用原生new
var t3 = new t(5)
console.log('获取构造方法：'， t1.constructor) // 获取构造方法: ƒ t(arg){ this.a = arg }

```

# 扩展

## `String()`,`toString()`,`valueOf()`,`toLocalString()`区别



### toString()

- `String.prototype.toString()`: `toString()` 方法返回指定对象的字符串形式。

  ```
  var x = new String("Hello world");
  alert(x.toString())      // 输出 "Hello world"
  ```
  
- `Number.prototype.toString([radix])`: `toString([radix])` 方法返指定`Number`对象的字符串表示形式。
  
  `radix`参数指定要用于数字到字符串的转换的基数(从2到36)。如果未指定 `radix` 参数，则默认值为 `10`。
  
  ```
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

- `Object.prototype.toString()`: `toString()` 方法返回一个表示该对象的字符串。

  ```
  var obj = {}
  obj.toString() // "[object Object]"
  ```
- `Function.prototype.toString()`: `toString()` 方法返回一个表示当前函数源代码的字符串。

  ```
  function sum(a, b) {
    return a + b;
  }

  sum.toString() 
 
  // "function sum(a, b) {
  //  return a + b;
  //}"
  ```

- `Array.prototype.toString()`: `toString` 返回一个字符串，表示指定的数组及其元素。

  ```
  const array1 = [1, 2, 'a', '1a'];

  array1.toString() // "1,2,a,1a"
  ```

- `Boolean.prototype.toString()`: `toString()` 方法返回指定的布尔对象的字符串形式。

  ```
  var bol = true
  bol.toString() // "true"
  ```
- `RegExp.prototype.toString()`: `toString()` 返回一个表示该正则表达式的字符串。

  ```
  var reg1 = new RegExp("bar", "g");
  reg1.toString() // "/bar/g"
  var reg2 = /a(?!b)c/g
  reg2.toString() // "/a(?!b)c/g"
  
  ```

- `Date.prototype.toString()`: `toString()` 方法返回一个字符串，表示该`Date对象`。

  ```
  var date = new Date()
  date.toString()
  "Wed Feb 05 2020 00:23:26 GMT+0800 (中国标准时间)"
  ```

- `Error.prototype.toString()`: `toString()` 方法返回一个指定的错误对象（Error object）的字符串表示。

  ```
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

  ```
  Symbol("desc").toString();   // "Symbol(desc)"
  // well-known symbols
  Symbol.iterator.toString();  // "Symbol(Symbol.iterator)
  // global symbols
  Symbol.for("foo").toString() // "Symbol(foo)"
  ```
  
### String()

跟`toString()`结果一样，区别在于`toString()`无法转换`null`和`undefined`

```
let a;
let b=null;
a.toString();//Uncaught TypeError: Cannot read property 'toString' of undefined
b.toString(); //Uncaught TypeError: Cannot read property 'toString' of null
String(a); //"undefined"
String(b);//"null"
```

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

```
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

### toLocalString  

略

## `Object.prototype.toString.call()`,`Object.prototype.toString`,`Object.toString()`区别

每个对象都有一个`toString()`方法，当该对象被表示为一个文本值时，或者一个对象以预期的字符串方式引用时自动调用。
默认情况下，`toString() `方法被每个 `Object` 对象继承。所以它根据对象的类型具体实现不同，
如果此方法在自定义对象中未被覆盖，`toString() `返回 `"[object type]"`，其中 `type` 是对象的类型

所以为了区分上面几个方法的不同，得先确定调用`toStirng()`的对象的类型

- `Object.toString()`
  
  ```
  typeof Object // function
  // 这里看得到Object原来是个函数
  // 那么函数的toString()方法就是显示函数字符串
  Object.toString() // "function Object() { [native code] }"
  ```

- `Object.prototype.toString()`

   ```
   typeof Object.prototype // object
   // Object.prototype是个对象，所以对象调用toString()返回"[object Object]"
   Object.prototype.toString() // "[object Object]"
   ```
  
- `Oject.prototype.toString.call()`

为了调用未被重写的`Oject.prototype.toString()`方法，所以使用`call`方法的作用是改变`this`指向，返回 `"[object type]"`
  
  ```
  // 以数组为例
  var arr = [1]
  // Array对象重写了toString()方法，返回数组元素字符串
  arr.toString()// 1
  
  Object.prototype.toString.call(arr) // "[object Array]"
  
  ```

