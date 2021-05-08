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

| 对象   | 字符串             | 数字  | 布尔值 |
| ----- | ------------------| ----- |-----:|
| {}    | "[object Object]" | NaN   | true |
| []    | ""                | 0     | true |
| [9]   | "9"               | 9     | true |
| ['a'] | "a"               | NaN   | true |

从上表中可以看到有几个点需要注意：

- `true` 转数字为 `1`

- `false`转数字为 `0`

- 空字符串转数字为 `0`

- `Null` 转数字为 `0`

- 原始值到对象的转换也是非常简单，原始值是通过`new String()`、`new Number`或`new Boolean()`构造函数，转换为它们各自的包装对象

### 基本类型的转换

**显示类型转换**

使用`String()`,`Number()`，`Boolean()`或`Object()`可以做显式类型转换

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

### 基本类型调用toString方法

为什么基本类型会有一些对象方法呢?

因为当原始数据类型（boolean，Number、String）在调用方法时，JS 将会创建对象，以便调用方法属性，而在使用完毕后将会销毁该对象

这里着重讲了解一下数字类型调用 `toString` 方法的奇怪的地方,比如粟子：

```js
var a = 1
a.toString() // '1'
1.toString() // 报错
1..toString() // 1
1...toString() // 报错
```

**1.toString()**： 这是因为javascript引擎在解释代码 `1.toString()` 时认为 `.` 是浮点符号，此时但因小数点后面的字符是非法的，所以报语法错误

**1..toString()**: javascript引擎认为第一个 `.` 是表示小数点，（JS 中 `1.`、`.1` 这样形式是合法），之后第二个 `.` 被解析为属性访问语法，所以都能正确解释执行

**1...toString()**： 继上面之后属性访问语法访问的是一个 `.`，所以报语法错误

**相关题目**

**Q**

`2 == [[[2]]]` 

`[[[2]]]` 应该会不断得 `toString()`, `[[[2]]] => '2'`  `2==2`

答案 `true`

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

## 比较操作符

JavaScript 有两种比较方式：严格比较运算符和转换类型比较运算符

JS进行比较时，有以下特征

- 严格比较运算符（===）：仅当两个操作数的类型相同且值相等为 `true`

- 转换类型比较运算符（==）：会在进行比较之前，将两个操作数转换成相同的类型再进行比较

- 对于关系运算符（比如 <=）来说，会先将操作数转为原始值，使它们类型相同，再进行比较运算

- 字符串比较则是使用基于标准字典的 Unicode 值来进行比较的

### 转换类型比较运算符

当两个操作数类型不相等时，会在比较前尝试将其转换为相同类型，转换规则如下：

- 对象==对象：比较两个对象的引用地址

- 对象==字符串：对象先转化为字符串，然后做比较

- 对象==布尔类型：布尔类型会转换成数字(false是0，true是1),对象类型先隐式调用 `toString` 方法，然后再 `Number()`

- 对象==数字：对象类型先隐式调用 `toString` 方法，然后再 `Number()`

- 数字==布尔：布尔类型会转换成数字(false是0，true是1)，再进行比较

- 数字==字符串：把字符串转化为数字，再比较

- null==null: true

- null == 非(null|undefined)：false

- undefined == undefined: true

- undefined == 非(null|undefined)：false

规律：

- 有 boolean 值时，先将 boolean 转换为数字，再进行比较

- 有数字值时，先将另个值转化为数字，再进行比较

- 字符串与非（boolean|数字）比较时，先将另个值转化为字符串，再进行比较

- `null` 和 `undefined` 除了与自身和彼此比较时为 `true` ，其余都为 `false`

**最后看个题目**

`[1 < 2 < 3, 3 < 2 < 1]`

这个题会让人误以为是 2 > 1 && 2 < 3 其实不是的.

这个题等价于

```js
 1 < 2 => true;
 true < 3 =>  1 < 3 => true;
 3 < 2 => false;
 false < 1 => 0 < 1 => true;
```

答案是 [true, true]

**平时要注意判断变量是否是 `undefined` 或 `null` 的情况注意：检查属性是否 `undefined` 还不够。该属性可能存在，但其值恰好设置为 `undefined`。**

- 不要直接使用 `!变量` 来判断变量是否有值，当变量的值为 `0` 时，将会被误判成 `false`

- 使用 `undefined` 和 `null` 除了跟`undefined` 和 `null` 比较为 `true` 以外跟其它值都是 `false` ，所以可以根据这个特性来判断变量是否是`undefined` 或 `null`。 如 `变量 === undefind||变量 === null`

  ```js
  var abc
  abc === undefined // true
  abc == undefined // true
  abc == 'undefined' // false
  abc === 'undefined' // false
  abc == null // true
  abc === null // false 类型不同
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

o.hasOwnProperty('a') // true
o.hasOwnProperty('b') // true
o.hasOwnProperty('c') // false
o.__proto__.hasOwnProperty('c') // true
```

`o`自身没有名为 `hasOwnProperty`的属性,`hasOwnProperty` 是 `Object.prototype` 的属性.因此 `o` 继承了 `Object.prototype` 的 `hasOwnProperty`
   
`hasOwnProperty`是 JavaScript 中处理属性并且不会遍历原型链的方法之一,另一种方法是`Object.keys()`


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

可以调用 `Object.create` 方法来创建一个新对象。这个对象的 `__proto__` 指定调用 `create` 方法时传入的第一个参数

```js
var a = {a: 1}; 
// a.__proto__ ---> Object.prototype.__proto__ ---> null

var b = Object.create(a);
// b.__proto__ ---> a
// a.__proto__---> Object.prototype.__proto__ ---> null
console.log(b.a); // 1 (继承而来)

var c = Object.create(b);
// c.__proto__ ---> b
// b.__proto__ ---> a
// a.__proto__---> Object.prototype.__proto__ ---> null

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

- 新对象的 `__proto__` 指向 `A.prototype`，即 `a1.[[Prototype]] = A.prototype`

- 运行函数 `A()` 把 `this` 指向新对象之前设置

然后当您访问实例的属性时，JavaScript 首先会检查它们是否直接存在于该对象上，如果不存在，则会 `[[Prototype]]` 中查找。

自己实现`new`方法`

```js
function _new(fn, ...arg){
    const obj = {}
    console.log(obj.constructor) // function Object() { [native code] }
    obj.__proto__ = fn.prototype
    fn.apply(obj, arg)
    console.log(obj.constructor) // function t(arg){this.a = arg}
    return obj
}

// 效果一样
function _new(fn, ...arg){
	
    const obj = Object.create(fn.prototype)
    console.log(obj.constructor) // function t(arg){this.a = arg}
    fn.apply(obj, arg)
    return obj
    // 以下测试使用
    const ttt = Object.create({})
    console.log(obj.constructor) // function Object() { [native code] }
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

上面的 `constructor` 指向让人感觉有点困惑

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
// console.log(SubType.prototype.constructor) // SuperType
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