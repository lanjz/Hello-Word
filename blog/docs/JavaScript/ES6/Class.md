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

```

## 静态属性和静态方法

### 静态属性

静态属性指的是 Class 本身的属性，即 `Class.propName` ，而不是定义在实例对象（ `this` ）上的属性

```js
class Foo {
}

Foo.prop = 1;
Foo.prop // 1
```

父类的静态属性，也会被子类继承

```js
class Fo extends  Foo{
}

Fo.prop // 1
```

要注意的静态方法可以写在 Class 内部， 而静态方法写在写在 Class 外部。因为 ES6 明确规定，Class 内部只有静态方法，没有静态属性。现在有一个提案提供了类的静态属性，写法是在实例属性的前面，加上 `static` 关键字

```js
class MyClass {
  static myStaticProp = 42;

  constructor() {
    console.log(MyClass.myStaticProp); // 42
  }
}
```

### 静态方法

加上 `static` 关键字，就表示该方法不会被实例继承，而是直接通过类来调用，这就称为“静态方法”

```js
class Foo {
  static classMethod() {
    return 'hello';
  }
}

Foo.classMethod() // 'hello'

var foo = new Foo();
foo.classMethod()
// TypeError: foo.classMethod is not a function
```

**注意，如果静态方法包含this关键字，这个this指的是类，而不是实例**

```js
class Foo {
  static bar() {
    this.baz();
  }
  static baz() {
    console.log('hello');
  }
  baz() {
    console.log('world');
  }
}

Foo.bar() // hello
```

父类的静态方法不能被实例继续，但是可以被子类继承

```js
class Foo {
  static classMethod() {
    return 'hello';
  }
}

class Bar extends Foo {
}

Bar.classMethod() // 'hello'
```

## 私有方法和私有属性

 ES6 没有提供私有，只能通过变通方法模拟实现

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

实例的属性除非显式定义在其本身（即定义在 `this` 对象上），否则都是定义在原型上

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

需要注意的是，子类继承父类时，`new.target` 会返回子类

```js
class Rectangle {
  constructor(length, width) {
    console.log(new.target === Rectangle);
    // ...
  }
}

class Square extends Rectangle {
  constructor(length, width) {
    super(length, width);
  }
}

var obj = new Square(3); // 输出 false
```

利用这个特点，可以写出不能独立使用、必须继承后才能使用的类

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
