# Class

JavaScript 语言中，生成实例对象的传统方法是通过构造函数

```js
function Point(x, y) {
  this.x = x;
  this.y = y;
}

Point.prototype.toString = function () {
  return '(' + this.x + ', ' + this.y + ')';
};

var p = new Point(1, 2);
```

上面的代码用 ES6 的class改写，就是下面这样

```js
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  toString() {
    return '(' + this.x + ', ' + this.y + ')';
  }
}
```

ES5 的构造函数 `Point` ，对应 ES6 的 `Point` 类的构造方法

```js
class Point {
  // ...
}

typeof Point // "function"
Point === Point.prototype.constructor // true
```

类属性除了通过 `constructor` 内部定义，也可以写在类的最顶层

```js
class Point {
  constructor() {
    this.x = 1;
    this.y = 2;
  }
}
// 等同于
class Point {
  _x = 1;
  _y = 2
}
```

## constructor 方法

`constructor` 方法是类的默认方法，通过 `new` 命令生成对象实例时，自动调用该方法。一个类必须有 `constructor` 方法，如果没有显式定义，一个空的 `constructor` 方法会被默认添加

```js
class Point {
}

// 等同于
class Point {
  constructor() {}
}
```

`constructor` 方法默认返回实例对象（即 `this` ），完全可以指定返回另外一个对象

```js
class Foo {
  constructor() {
    return Object.create(null);
  }
}

new Foo() instanceof Foo
// false
```

上面代码中，`constructor` 函数返回一个全新的对象，结果导致实例对象不是 `Foo` 类的实例

类必须使用 `new` 调用，否则会报错。这是它跟普通构造函数的一个主要区别，后者不用 `new` 也可以执行

```js
class Foo {
  constructor() {
    return Object.create(null);
  }
}

Foo()
// TypeError: Class constructor Foo cannot be invoked without 'new'

```

## 类方法

```js
class Point {
  constructor() {
    // ...
  }

  toString() {
    // ...
  }

  toValue() {
    // ...
  }
}
```

上面给 `Point` 类定义了 `toString` 和 `toValue` 方法，事实上，类的所有方法都定义在类的 `prototype `属性上面

```js
// 等同于
Point.prototype = {
  constructor() {},
  toString() {},
  toValue() {},
};
```

因此在类的实例上面调用方法，其实就是调用原型上的方法

```js
class B {}
let b = new B();

b.constructor === B.prototype.constructor // true
```

**类的内部所有定义的方法，都是不可枚举的（non-enumerable）,这一点与 ES5 的行为不一致。**

```js
var Point = function (x, y) {
  // ...
};

Point.prototype.toString = function() {
  // ...
};

Object.keys(Point.prototype)
// ["toString"]
Object.getOwnPropertyNames(Point.prototype)
// ["constructor","toString"]

class ClassPoint {
  constructor() {
    // ...
  }

  toString() {
    // ...
  }

  toValue() {
    // ...
  }
}
Object.keys(ClassPoint.prototype)
// []
Object.getOwnPropertyNames(ClassPoint.prototype)
// ["constructor","toString", "toValue"]
```

## 静态属性和静态方法

静态属性和静态方法的特点：

- 只能通过类访问

- 可以被子类继承

### 静态属性

静态属性指的是 Class 本身的属性，即 `Class.propName` ，而不是定义在实例对象（ `this` ）上的属性

```js
class Foo {
}

Foo.prop = 1;
Foo.prop // 1
// 继续
class Fo extends  Foo{
}

Fo.prop // 1
```

要注意的静态方法可以写在 Class 内部， 而静态属性写在 Class 外部。因为 ES6 明确规定，Class 内部只有静态方法，没有静态属性。现在有一个提案提供了类的静态属性，写法是在实例属性的前面，加上 `static` 关键字

```js
class MyClass {
  static myStaticProp = 42;

  constructor() {
    console.log(MyClass.myStaticProp); // 42
  }
}
```

### 静态方法

在类方法前面加上 `static` 关键字，就变成了“静态方法”

```js
class Foo {
  static classMethod() {
    return 'hello';
  }
}

Foo.classMethod() // 'hello'

var foo = new Foo(); 
foo.classMethod() // 静态属性和静态方法都通过实例访问
// TypeError: foo.classMethod is not a function

class Bar extends Foo {
}
Bar.classMethod() // 'hello'
```

:::tip
注意，如果静态方法包含this关键字，这个this指的是类，而不是实例
:::

## 私有方法和私有属性

ES6 没有提供私有方法和属性，只能通过变通方法模拟实现

 ```js
class Widget {
  foo (baz) {
    bar.call(this, baz);
  }

  // ...
}

function bar(baz) {
  return this.snaf = baz;
}
 ```

 上面代码中，`foo` 是公开方法，内部调用了 `bar.call(this, baz)` 。这使得 `bar` 实际上成为了当前模块的私有方法

 还有一种方法是利用 Symbol 值的唯一性，将私有方法的名字命名为一个 Symbol 值

 ```js
const bar = Symbol('bar');
const snaf = Symbol('snaf');

export default class myClass{

  // 公有方法
  foo(baz) {
    this[bar](baz);
  }

  // 私有方法
  [bar](baz) {
    return this[snaf] = baz;
  }

  // ...
};
 ```

 上面代码中，`bar` 和 `snaf` 都是 Symbol 值，一般情况下无法获取到它们，因此达到了私有方法和私有属性的效果。但是也不是绝对不行， `Reflect.ownKeys()` 依然可以拿到它们

 ```js
const inst = new myClass();

Reflect.ownKeys(myClass.prototype)
// [ 'constructor', 'foo', Symbol(bar) ]
 ```

 上面代码中，Symbol 值的属性名依然可以从类的外部拿到

## 类的实例

实例的属性显式定义在其本身（即定义在 `this` 对象上），类方法定义在原型上

```js
//定义类
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  toString() {
    return '(' + this.x + ', ' + this.y + ')';
  }
}

var point = new Point(2, 3);
point.toString() // (2, 3)
point.hasOwnProperty('x') // true
point.hasOwnProperty('y') // true
point.hasOwnProperty('toString') // false
point.__proto__.hasOwnProperty('toString') // true

```

**与 ES5 一样，类的所有实例共享一个原型对象**

```js
var p1 = new Point(2,3);
var p2 = new Point(3,2);

p1.__proto__ === p2.__proto__
//true
```

这也意味着，可以通过实例的 `__proto__` 属性为“类”添加方法

```js
var p1 = new Point(2,3);
var p2 = new Point(3,2);

p1.__proto__.printName = function () { return 'Oops' };

p1.printName() // "Oops"
p2.printName() // "Oops"

var p3 = new Point(4,2);
p3.printName() // "Oops"
```

## getter/setter

与 ES5 一样，在“类”的内部可以使用 `get` 和 `set` 关键字，对某个属性设置存值函数和取值函数，拦截该属性的存取行为

```js
class MyClass {
  constructor() {
    // ...
  }
  get prop() {
    return 'getter';
  }
  set prop(value) {
    console.log('setter: '+value);
  }
}

let inst = new MyClass();

inst.prop = 123;
// setter: 123

inst.prop
// 'getter'
```

存值函数和取值函数是设置在属性的 `Descriptor` 对象上的

```js
class CustomHTMLElement {
  constructor(element) {
    this.element = element;
  }

  get html() {
    return this.element.innerHTML;
  }

  set html(value) {
    this.element.innerHTML = value;
  }
}

var descriptor = Object.getOwnPropertyDescriptor(
  CustomHTMLElement.prototype, "html"
);

"get" in descriptor  // true
"set" in descriptor  // true

```

上面代码中，`Square` 类的方法名 `getArea` ，是从表达式得到的

## Class 表达式

与函数一样，类也可以使用表达式的形式定义

```js
const MyClass = class Me {
  getClassName() {
    return Me.name;
  }
};
```

上面代码使用表达式定义了一个类。需要注意的是，这个类的名字是 `Me` ，但是 `Me` 只在 Class 的内部可用，指代当前类。在 Class 外部，这个类只能用 `MyClass` 引用

```js
let inst = new MyClass();
inst.getClassName() // Me
Me.name // ReferenceError: Me is not defined
```

上面代码表示，`Me` 只在 Class 内部有定义。

如果类的内部没用到的话，可以省略 `Me` ，也就是可以写成下面的形式。

```js
const MyClass = class { /* ... */ };
```

采用 Class 表达式，可以写出立即执行的 Class

```js
let person = new class {
  constructor(name) {
    this.name = name;
  }

  sayName() {
    console.log(this.name);
  }
}('张三');

person.sayName(); // "张三"
```

上面代码中，`person` 是一个立即执行的类的实例

## new.target 

ES6 为 `new` 命令引入了一个 `new.target` 属性，该属性一般用在构造函数之中，返回 `new` 命令作用于的那个构造函数

如果构造函数不是通过 `new` 命令或 `Reflect.construct()` 调用的，`new.target` 会返回 `undefined`，因此这个属性可以用来确定构造函数是怎么调用的

```js
function Person(name) {
  if (new.target !== undefined) {
    this.name = name;
  } else {
    throw new Error('必须使用 new 命令生成实例');
  }
}

// 另一种写法
function Person(name) {
  if (new.target === Person) {
    this.name = name;
  } else {
    throw new Error('必须使用 new 命令生成实例');
  }
}

var person = new Person('张三'); // 正确
var notAPerson = Person.call(person, '张三');  // 报错
```

上面代码确保构造函数只能通过 `new` 命令调用。

Class 内部调用 `new.target` ，返回当前 Class

```js
class Rectangle {
  constructor(length, width) {
    console.log(new.target === Rectangle);
    this.length = length;
    this.width = width;
  }
}

var obj = new Rectangle(3, 4); // 输出 true
```

需要注意的是，子类继承父类时，`new.target` 会返回子类，利用这个特点，可以写出不能独立使用、必须继承后才能使用的类

```js
class Shape {
  constructor() {
    if (new.target === Shape) {
      throw new Error('本类不能实例化');
    }
  }
}

class Rectangle extends Shape {
  constructor(length, width) {
    super();
    // ...
  }
}

var x = new Shape();  // 报错
var y = new Rectangle(3, 4);  // 正确
```

## 总结

- 静态属性和方法只能通过类访问且能被子类继承，但不能通过实例访问

- 目前不能直接实现 `私有属性和私有方法`

- 创建实例后，类的属性定义在实例本身，类的方法定义在实例的原型对象上

### 与普通方法的区别

1. 类的内部所有定义的方法，都是不可枚举的

2. class类必须new调用，不能直接执行

3. class类不存在变量提升

4. class类有static静态方法

## Babel 对类的转换

**类的实现**

粟子：

```js
class Parent {
    constructor(name,age){
        this.name = name;
        this.age = age;
    }
    speakSomething(){
        console.log("I can speek chinese");
    }
    static showName(){
       console.log('showName')
    }
}
Parent.some = 'some'
```

经 babel 转码之后

```js
"use strict";

function _classCallCheck(instance, Constructor) {
    // 判断是不是通过 new 来调用这个方法
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false; // ES6 类方式和静态方法是不可枚举的，所以设置 enumerable 为 false
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor); // 通过 `Object.defineProperty` 代理到新的实例对象中
  }
}


function _createClass(Constructor, protoProps, staticProps) {
  // 通过参数名可以推测调用 defineProperties 方法时，对于类方法
  // 将类方法赋值到 Constructor.prototype 上
  // 对于类的静态方法调用 defineProperties 方法，将静态方法赋值到 Constructor 属性上
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

// 修改了 Parent 的定义，通过自执行函数返回内容的 Parent 函数
let Parent = /*#__PURE__*/ (function () {
  function Parent(name, age) {
    _classCallCheck(this, Parent); // 判断是不是通过 new 调用函数
    this.name = name;
    this.age = age;
  }
  _createClass(  // 给当前类添加类方法和静态方法
    Parent,
    [
      {
        key: "speakSomething",
        value: function speakSomething() {
          console.log("I can speek chinese");
        }
      }
    ],
    [
      {
        key: "showName",
        value: function showName() {
          console.log("showName");
        }
      }
    ]
  );

  return Parent;
})();
Parent.some = "some"; // 直接赋值静态属性
```

从上面的例子可以看到并结合上文对类的解析，可以知道 Babel 对类的转换大体为以下步骤：

1. 通过 `instance instanceof Constructor`，判断是否是通过 `new` 方法调用父类

2. 类属性属性赋值到实例对象上

3. 类方法设置在对象的原型中

4. 静态方法和静态属性直接设置在实例对象中

5. 类方法和静态方法设置为不可枚举属性

**继承实现**

粟子

```js
class Parent {
    constructor(name,age){
        this.name = name;
        this.age = age;
    }
    speakSomething(){
        console.log("I can speek chinese");
    }
    static showName(){
       console.log('showName')
    }
}
Parent.some = 'some'
class Child extends Parent {
    constructor(name,age){
        super(name,age);
    }
    coding(){
       console.log("I can code JS");
    }
}
var c = new Child("job",30);
c.coding()
```

转码之后的代码变成了这样

```js
"use strict";

function _inherits(subClass, superClass) {
  // 父类只能是函数
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  // 继承父类的类方法，添加 constructor 属性 值为自身
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: { value: subClass, writable: true, configurable: true }
  }); 
  // 设置 __proto__
  // 子类也是一函数，它的  __proto__ 指类父类
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf =
    Object.setPrototypeOf ||
    function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };
  return _setPrototypeOf(o, p);
}

function _createSuper(Derived) {
  var hasNativeReflectConstruct = _isNativeReflectConstruct(); // 是否支持 Reflect
  return function _createSuperInternal() {
    var Super = _getPrototypeOf(Derived), // 获取父类
      result;
    if (hasNativeReflectConstruct) {
      var NewTarget = _getPrototypeOf(this).constructor;
      result = Reflect.construct(Super, arguments, NewTarget); //Reflect.construct() 方法的行为有点像 new 操作符构造函数 ， 相当于运行 new target(...args).
    } else {
      result = Super.apply(this, arguments); // 上面分支不好理解的各话，就理解这里，调用父类，设置给当前的子类实例添加类属性
    }
    return _possibleConstructorReturn(this, result);
  };
}

function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  }
  return _assertThisInitialized(self);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError(
      "this hasn't been initialised - super() hasn't been called"
    );
  }
  return self;
}

function _isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;
  try {
    Boolean.prototype.valueOf.call(
      Reflect.construct(Boolean, [], function () {})
    );
    return true;
  } catch (e) {
    return false;
  }
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf
    ? Object.getPrototypeOf
    : function _getPrototypeOf(o) {
        return o.__proto__ || Object.getPrototypeOf(o);
      };
  return _getPrototypeOf(o);
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

// 实现父类
let Parent = /*#__PURE__*/ (function () {
  function Parent(name, age) {
    _classCallCheck(this, Parent);

    this.name = name;
    this.age = age;
  }

  _createClass(
    Parent,
    [
      {
        key: "speakSomething",
        value: function speakSomething() {
          console.log("I can speek chinese");
        }
      }
    ],
    [
      {
        key: "showName",
        value: function showName() {
          console.log("showName");
        }
      }
    ]
  );

  return Parent;
})();

Parent.some = "some";

let Child = /*#__PURE__*/ (function (_Parent) {
  _inherits(Child, _Parent); // 子类继续父类方法，并设置 __proto__

  var _super = _createSuper(Child); // 返回 _createSuperInternal 方法

  function Child(name, age) {  // 创建子类方法
    _classCallCheck(this, Child);

    return _super.call(this, name, age);
  }
 
  // 给子类添加方法
  _createClass(Child, [
    {
      key: "coding",
      value: function coding() {
        console.log("I can code JS");
      }
    }
  ]);

  return Child;
})(Parent);

var c = new Child("job", 30);
c.coding();
```

总结一下流程：

1. 用创建类的步骤创建子类 Child

2. 调用 `_inherits(Child, _Parent)` 方法，继承父类的类方法同时添加 constructor 属性指向为自身（Fn.prototype.constructor = Fn）

这两步完成的子类的创建

当子类被 `new` 时执行 `_super.call(this, name, age)`，相当于执行父类方法，通过 `call` 将 `this` 指向当前实例，给实例添加父类属性
