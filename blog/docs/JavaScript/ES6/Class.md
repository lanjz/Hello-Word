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

上面代码定义了一个“类”，可以看到里面有一个 `constructor` 方法，这就是构造方法，而 `this` 关键字则代表实例对象。也就是说，ES5 的构造函数 `Point` ，对应 ES6 的 `Point` 类的构造方法

ES6 的类，完全可以看作构造函数的另一种写法

```js
class Point {
  // ...
}

typeof Point // "function"
Point === Point.prototype.constructor // true
```

构造函数的 `prototype` 属性，在 ES6 的“类”上面继续存在。事实上，类的所有方法都定义在类的 `prototype `属性上面

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

// 等同于

Point.prototype = {
  constructor() {},
  toString() {},
  toValue() {},
};
```

在类的实例上面调用方法，其实就是调用原型上的方法

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

### 取值函数（getter）和存值函数（setter）

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

### 属性表达式

类的属性名，可以采用表达式

```js
let methodName = 'getArea';

class Square {
  constructor(length) {
    // ...
  }

  [methodName]() {
    // ...
  }
}

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

### 注意点

**严格模式**

类和模块的内部，默认就是严格模式

**不存在提升**

类不存在变量提升（hoist），这一点与 ES5 完全不同

```js
new Foo(); // ReferenceError
class Foo {}
```

**name 属性**

由于本质上，ES6 的类只是 ES5 的构造函数的一层包装，所以函数的许多特性都被Class继承，包括 `name` 属性

```js
class Point {}
Point.name // "Point"
```

`name` 属性总是返回紧跟在 `class` 关键字后面的类名

**Generator 方法**

如果某个方法之前加上星号（*），就表示该方法是一个 Generator 函数

```js
class Foo {
  constructor(...args) {
    this.args = args;
  }
  * [Symbol.iterator]() {
    for (let arg of this.args) {
      yield arg;
    }
  }
}

for (let x of new Foo('hello', 'world')) {
  console.log(x);
}
// hello
// world
```

上面代码中，`Foo` 类的 `Symbol.iterator` 方法前有一个星号，表示该方法是一个 Generator 函数。`Symbol.iterator` 方法返回一个 `Foo` 类的默认遍历器，`for...of` 循环会自动调用这个遍历器

**this 的指向**

类的方法内部如果含有 `this` ，它默认指向类的实例。但是，必须非常小心，一旦单独使用该方法，很可能报错

```js
class Logger {
  printName(name = 'there') {
    this.print(`Hello ${name}`);
  }

  print(text) {
    console.log(text);
  }
}

const logger = new Logger();
const { printName } = logger;
printName(); // TypeError: Cannot read property 'print' of undefined
```

上面代码中，`printName` 方法中的 `this` ，默认指向 `Logger` 类的实例。但是，如果将这个方法提取出来单独使用，`this` 会指向该方法运行时所在的环境（由于 `class` 内部是严格模式，所以 `this` 实际指向的是 `undefined` ），从而导致找不到 `print` 方法而报错。

一个比较简单的解决方法是，在构造方法中绑定 `this` ，这样就不会找不到 `print` 方法了

```js
class Logger {
  constructor() {
    this.printName = this.printName.bind(this);
  }

  // ...
}
```

另一种解决方法是使用箭头函数

```js
class Obj {
  constructor() {
    this.getThis = () => this;
  }
}

const myObj = new Obj();
myObj.getThis() === myObj // true
```

箭头函数内部的 `this` 总是指向定义时所在的对象。上面代码中，箭头函数位于构造函数内部，它的定义生效的时候，是在构造函数执行的时候。这时，箭头函数所在的运行环境，肯定是实例对象，所以 `this` 会总是指向实例对象。

还有一种解决方法是使用 `Proxy` ，获取方法的时候，自动绑定 `this`

```js
function selfish (target) {
  const cache = new WeakMap();
  const handler = {
    get (target, key) {
      const value = Reflect.get(target, key);
      if (typeof value !== 'function') {
        return value;
      }
      if (!cache.has(value)) {
        cache.set(value, value.bind(target));
      }
      return cache.get(value);
    }
  };
  const proxy = new Proxy(target, handler);
  return proxy;
}

const logger = selfish(new Logger());
```