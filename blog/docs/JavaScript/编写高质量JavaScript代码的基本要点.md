# 编写高质量JavaScript代码的基本要点

可维护的代码意味着：

- 可读的

- 一致的

- 可预测的

- 看上去就像是同一个人写的

## 最小全局变量(Minimizing Globals)

全局变量的问题在于，你的JavaScript应用程序和web页面上的所有代码都共享了这些全局变量，他们住在同一个全局命名空间，所以当程序的两个不同部分定义同名但不同作用的全局变量的时候，命名冲突在所难免

由于JavaScript的两个特征，不自觉地创建出全局变量是出乎意料的容易。首先，你可以甚至不需要声明就可以使用变量；第二，JavaScript有隐含的全局概念，意味着你不声明的任何变量都会成为一个全局对象属性。参考下面的代码：

```js
function sum(x, y) {
   // 不推荐写法: 隐式全局变量 
   result = x + y;
   return result;
}
```

此段代码中的`result`没有声明。代码照样运作正常，但在调用函数后你最后的结果就多一个全局命名空间，这可以是一个问题的根源。

所以始终使用`var`声明变量，正如改进版的`sum()`函数所演示的：

```js
function sum(x, y) {
   var result = x + y;
   return result;
}
```

另一个创建隐式全局变量的反例就是使用任务链进行部分`var`声明。下面的片段中，`a`是本地变量但是b确实全局变量，这可能不是你希望发生的：

```js
// 反例，勿使用 
function foo() {
   var a = b = 0;
   // ...
}
```

此现象发生的原因在于这个从右到左的赋值，首先，是赋值表达式`b = 0`，此情况下`b`是未声明的。这个表达式的返回值是`0`，然后这个`0`就分配给了通过`var`定义的这个局部变量`a`。换句话说，就好比你输入了：

```js
var a = (b = 0);
```

如果你已经准备好声明变量，使用链分配是比较好的做法，不会产生任何意料之外的全局变量，如:

```js
function foo() {
   var a, b;
   // ... a = b = 0; // 两个均局部变量
}
```

另外一个避免全局变量的原因是可移植性。如果你想你的代码在不同的环境下（主机下）运行，使用全局变量如履薄冰，因为你会无意中覆盖你最初环境下不存在的主机对象

### 忘记`var`的副作用(Side Effects When Forgetting var)

隐式全局变量和明确定义的全局变量间有些小的差异，就是通过`delete`操作符让变量未定义的能力

- 通过`var`创建的全局变量（任何函数之外的程序中创建）是不能被删除的。

- 无`var`创建的隐式全局变量（无视是否在函数中创建）是能被删除的

这表明，在技术上，隐式全局变量并不是真正的全局变量，但它们是全局对象的属性。属性是可以通过`delete`操作符删除的，而变量是不能的：

```js
// 定义三个全局变量
var global_var = 1;
global_novar = 2; // 反面教材
(function () {
   global_fromfunc = 3; // 反面教材
}());

// 试图删除
delete global_var; // false
delete global_novar; // true
delete global_fromfunc; // true

// 测试该删除
typeof global_var; // "number"
typeof global_novar; // "undefined"
typeof global_fromfunc; // "undefined"
```

在ES5严格模式下，未声明的变量（如在前面的代码片段中的两个反面教材）工作时会抛出一个错误。

## for循环(for Loops)

```js
for (var i = 0; i < myarray.length; i++) {
   // 使用myarray[i]做点什么
}
```

这种形式的循环的不足在于每次循环的时候数组的长度都要去获取下。这回降低你的代码，尤其当`myarray`不是数组，而是一个`HTMLCollection`对象的时候(DOM操作一般都是比较昂贵的).

所以当你循环获取值时，缓存数组(或集合)的长度是比较好的形式，正如下面代码显示的：

```js
for (var i = 0, max = myarray.length; i < max; i++) {
   // 使用myarray[i]做点什么
}
```

这样，在这个循环过程中，你只检索了一次长度值

## for-in循环(for-in Loops)

`for-in`循环应该用在非数组对象的遍历上，使用`for-in`进行循环也被称为“枚举”

从技术上将，你可以使用`for-in`循环数组（因为JavaScript中数组也是对象），但这是不推荐的。因为如果数组对象已被自定义的功能增强，就可能发生逻辑错误。另外，在`for-in`中，属性列表的顺序（序列）是不能保证的。所以最好数组使用正常的`for`循环，对象使用`for-in`循环

有个很重要的`hasOwnProperty()`方法，当遍历对象属性的时候可以过滤掉从原型链上下来的属性

思考下面一段代码:

```js
// 对象
var man = {
   hands: 2,
   legs: 2,
   heads: 1
};

// 在代码的某个地方
// 一个方法添加给了所有对象
if (typeof Object.prototype.clone === "undefined") {
   Object.prototype.clone = function () {};
}
```

在这个例子中，我们有一个使用对象字面量定义的名叫`man`的对象。在`man`定义完成后的某个地方，在对象原型上增加了一个很有用的名叫 `clone()`的方法。此原型链是实时的，这就意味着所有的对象自动可以访问新的方法。为了避免枚举`man`的时候出现`clone()`方法，你需要应用`hasOwnProperty()`方法过滤原型属性。如果不做过滤，会导致`clone()`函数显示出来，在大多数情况下这是不希望出现的

```js
// 1.
// for-in 循环
for (var i in man) {
   if (man.hasOwnProperty(i)) { // 过滤
      console.log(i, ":", man[i]);
   }
}
/* 控制台显示结果
hands : 2
legs : 2
heads : 1
*/
// 2.
// 反面例子:
// for-in loop without checking hasOwnProperty()
for (var i in man) {
   console.log(i, ":", man[i]);
}
/*
控制台显示结果
hands : 2
legs : 2
heads : 1
clone: function()
*/

```

## 不扩展内置原型((Not) Augmenting Built-in Prototypes)

扩增构造函数的`prototype`属性是个很强大的增加功能的方法，但有时候它太强大了。

增加内置的构造函数原型（如`Object()`, `Array()`, 或`Function()`）挺诱人的，但是这严重降低了可维护性，因为它让你的代码变得难以预测。使用你代码的其他开发人员很可能更期望使用内置的 JavaScript方法来持续不断地工作，而不是你另加的方法

另外，属性添加到原型中，可能会导致不使用`hasOwnProperty`属性时在循环中显示出来，这会造成混乱

因此，不增加内置原型是最好的。你可以指定一个规则，仅当下面的条件均满足时例外：

- 可以预期将来的ECMAScript版本或是JavaScript实现将一直将此功能当作内置方法来实现。例如，你可以添加ECMAScript 5中描述的方法，一直到各个浏览器都迎头赶上。这种情况下，你只是提前定义了有用的方法

- 如果您检查您的自定义属性或方法已不存在——也许已经在代码的其他地方实现或已经是你支持的浏览器JavaScript引擎部分

- 你清楚地文档记录并和团队交流了变化

如果这三个条件得到满足，你可以给原型进行自定义的添加，形式如下：

```js
if (typeof Object.protoype.myMethod !== "function") {
   Object.protoype.myMethod = function () {
      // 实现...
   };
}
```

## switch模式(switch Pattern)

你可以通过类似下面形式的switch语句增强可读性和健壮性:

```js
var inspect_me = 0,
    result = '';
switch (inspect_me) {
case 0:
   result = "zero";
   break;
case 1:
   result = "one";
   break;
default:
   result = "unknown";
}
```

这个简单的例子中所遵循的风格约定如下：

- 每个`case`和`switch`对齐（花括号缩进规则除外）

- 每个`case`中代码缩进

- 每个`case`以`break`清除结束

- 避免贯穿（故意忽略`break`）。如果你非常确信贯穿是最好的方法，务必记录此情况，因为对于有些阅读人而言，它们可能看起来是错误的

- 以`default`结束`switch`：确保总有健全的结果，即使无情况匹配

## 避免隐式类型转换(Avoiding Implied Typecasting )

JavaScript的变量在比较的时候会隐式类型转换。这就是为什么一些诸如：`false == 0` 或 `“” == 0` 返回的结果是`true`。为避免引起混乱的隐含类型转换，在你比较值和表达式类型的时候始终使用`===`和`!==`操作符。

```js
var zero = 0;
if (zero === false) {
   // 不执行，因为zero为0, 而不是false
}

// 反面示例
if (zero == false) {
   // 执行了...
}

```

## 避免(Avoiding) eval()

`eval()`有安全隐患，因为被执行的代码可能已被篡改，比如盗取`Cookie`

给`setInterval()`, `setTimeout()`和`Function()`构造函数传递字符串时，与使用eval()是类似的，因此要避免使用

```js
// 反面示例
setTimeout("myFunc()", 1000);
setTimeout("myFunc(1, 2, 3)", 1000);

// 更好的
setTimeout(myFunc, 1000);
setTimeout(function () {
   myFunc(1, 2, 3);
}, 1000);
```

如果必须使用`eval()`，可以考虑使用`new Function()`代替。因为在`Function()`中的代码是在局部函数作用域中运行，所以代码中任何通过`var`定义的变量都不会自动变成全局变量。另一种方法来阻止自动全局变量是封装`eval()`调用到一个即时函数中。

考虑下面这个例子，这里仅`un`作为全局变量污染了命名空间。

```js
console.log(typeof un);    // "undefined"
console.log(typeof deux); // "undefined"
console.log(typeof trois); // "undefined"

var jsstring = "var un = 1; console.log(un);";
eval(jsstring); // logs "1"

jsstring = "var deux = 2; console.log(deux);";
new Function(jsstring)(); // logs "2"

jsstring = "var trois = 3; console.log(trois);";
(function () {
   eval(jsstring);
}()); // logs "3"

console.log(typeof un); // number
console.log(typeof deux); // "undefined"
console.log(typeof trois); // "undefined"
```

`eval()`和`Function`还有一个不同点是`eval()`可以干扰作用域链，而`Function()`更安分守己些。不管你在哪里执行 `Function()`，它只看到全局作用域。所以其能很好的避免本地变量污染。在下面这个例子中，`eval()`可以访问和修改它外部作用域中的变量

```js
(function () {
   var local = 1;
   eval("local = 3; console.log(local)"); // logs "3"
   console.log(local); // logs "3"
}());

(function () {
   var local = 1;
   Function("console.log(typeof local);")(); // logs undefined
}());
```





## parseInt()下的数值转换(Number Conversions with parseInt())

使用`parseInt()`你可以从字符串中获取数值，该方法接受另一个基数参数，这经常省略，但不应该。当字符串以”0″开头的时候就有可能会出问 题，例如，部分时间进入表单域，在ECMAScript 3中，开头为”0″的字符串被当做8进制处理了，但这已在ECMAScript 5中改变了。为了避免矛盾和意外的结果，总是指定基数参数

```js
var month = "06",
    year = "09";
month = parseInt(month, 10);
year = parseInt(year, 10);

```

此例中，如果你忽略了基数参数，如`parseInt(year)`，返回的值将是`0`，因为`09`被当做`8`进制（好比执行 `parseInt( year, 8 )）`，而`09`在`8`进制中不是个有效数字

替换方法是将字符串转换成数字，包括：

```js
+"08" // 结果是 8
Number("08") // 8
```

这些通常快于`parseInt()`，因为`parseInt()`方法，顾名思意，不是简单地解析与转换。但是，如果你想输入例如`08 hello`，`parseInt()`将返回数字，而其它以`NaN`告终

## 编码规范(Coding Conventions)

## 缩进(Indentation)

## 空格(White Space)

空格的使用同样有助于改善代码的可读性和一致性

适合使用空格的地方包括：

- `for`循环分号分开后的的部分：如`for (var i = 0; i < 10; i += 1) {...}`

- `for`循环中初始化的多变量(`i`和`max`)：`for (var i = 0, max = 10; i < max; i += 1) {...}`

- 分隔数组项的逗号的后面：`var a = [1, 2, 3]`

- 对象属性逗号的后面以及分隔属性名和属性值的冒号的后面：`var o = {a: 1, b: 2}`

- 限定函数参数：`myFunc(a, b, c)`

- 函数声明的花括号的前面：`function myFunc() {}`

- 匿名函数表达式`function`的后面：`var myFunc = function () {}`

使用空格分开所有的操作符和操作对象是另一个不错的使用，这意味着在`+, -, *, =, <, >, <=, >=, ===, !==, &&, ||, +=`等前后都需要空格

最后需要注意的一个空格——花括号间距。最好使用空格：

- 函数、`if-else`语句、循环、对象字面量的左花括号的前面`({)`

- `else`或`while`之间的右花括号`(})`

空格使用的一点不足就是增加了文件的大小，但是压缩无此问题

## 命名规范(Naming Conventions)

**以大写字母写构造函数(Capitalizing Constructors)**

**驼峰(Camel)命名法**

当你的变量或是函数名是由多个单词组成的时候，最好“驼峰(Camel)命名法”，就是单词小写，每个单词的首字母大写

对于构造函数，可以使用大驼峰式命名法(upper camel case)，如`MyConstructor()`;对于函数和方法名称，你可以使用小驼峰式命名法(lower camel case)，像是`myFunction()`, `calculateArea()`和`getFirstName()`

## 其它命名形式(Other Naming Patterns)

JavaScript中没有定义常量的方法，所以开发者都采用全部单词大写的规范来命名这个程序生命周期中都不会改变的变量，如

```js
// 珍贵常数，只可远观
var PI = 3.14,
    MAX_WIDTH = 80
```

## 注释(Writing Comments)

你必须注释你的代码，即使不会有其他人向你一样接触它。通常，当你深入研究一个问题，你会很清楚的知道这个代码是干嘛用的，但是，当你一周之后再回来看的时候，想必也要耗掉不少脑细胞去搞明白到底怎么工作的。

很显然，注释不能走极端：每个单独变量或是单独一行。但是，你通常应该记录所有的函数，它们的参数和返回值，或是任何不寻常的技术和方法。要想到注释可以给你代码未来的阅读者以诸多提示；阅读者需要的是（不要读太多的东西）仅注释和函数属性名来理解你的代码。例如，当你有五六行程序执行特定的任务， 如果你提供了一行代码目的以及为什么在这里的描述的话，阅读者就可以直接跳过这段细节。

