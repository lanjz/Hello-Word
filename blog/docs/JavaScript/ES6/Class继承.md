# Class继承

Class 可以通过 `extends` 关键字实现继承

```js
class Point {
}

class ColorPoint extends Point {
  constructor(x, y, color) {
    super(x, y); // 调用父类的constructor(x, y)
    this.color = color;
  }

  toString() {
    return this.color + ' ' + super.toString(); // 调用父类的toString()
  }
}
```

## super

无论在 `constructor` 方法还是 `toString` 方法中， 有可以使用一个 `super` 的关键字，它表示父类的构造函数，用来新建父类的 `this` 对象

子类必须在 `constructor` 方法中调用 `super` 方法，否则新建实例时会报错。这是因为子类自己的 `this` 对象，必须先通过父类的构造函数完成塑造，得到与父类同样的实例属性和方法，然后再对其进行加工，加上子类自己的实例属性和方法。如果不调用 `super` 方法，子类就得不到 `this` 对象

```js
class Point { /* ... */ }

class ColorPoint extends Point {
  constructor() {
  }
}

let cp = new ColorPoint(); // ReferenceError
```

类继承与ES5 的继承的区别

- ES5 的继承，实质是先创造子类的实例对象 `this`，然后再将父类的方法添加到 `this` 上面

- ES6 的继承机制完全不同，实质是调用 `super` 方法时先新建父类的实例对象 `this`, 然后将父类实例对象的属性和方法，加到 `this` 上面（所以必须先调用 `super` 方法），然后再用子类的构造函数修改 `this`

### super对象

`super` 既可以当作函数使用，也可以当作对象使用，当作为函数调用时，代表父类的构造函数; 作为对象时，在普通方法中，指向父类的原型对象；在静态方法中，指向父类

**super在普通方法中**

在普通方法中，指向父类的原型对象

```js
class A {
  p() {
    return 2;
  }
}

class B extends A {
  constructor() {
    super();
    console.log(super.p()); // 2 super.p === A.prototype.p
  }
}

let b = new B();
```

在子类普通方法中通过 `super` 调用父类的方法时，方法内部的 `this` 指向当前的子类实例

```js
class A {
  constructor() {
    this.x = 1;
  }
  print() {
    console.log(this.x);
  }
}

class B extends A {
  constructor() {
    super();
    this.x = 2;
  }
  m() {
    super.print();
  }
}

let b = new B();
b.m() // 2
```

如果通过 `super` 对某个属性赋值，这时 `super` 就是 `this` ，赋值的属性会变成子类实例的属性

```js
class A {
  constructor() {
    this.x = 1;
  }
}

class B extends A {
  constructor() {
    super();
    this.x = 2;
    super.x = 3;
    console.log(super.x); // undefined
    console.log(this.x); // 3
  }
}

let b = new B();
```

**super在静态方法中**

如果 `super` 作为对象，用在静态方法之中，这时 `super` 将指向父类，而不是父类的原型对象

```js
class Parent {
  static myMethod(msg) {
    console.log('static', msg);
  }

  myMethod(msg) {
    console.log('instance', msg);
  }
}

class Child extends Parent {
  static myMethod(msg) {
    super.myMethod(msg);
  }

  myMethod(msg) {
    super.myMethod(msg);
  }
}

Child.myMethod(1); // static 1

var child = new Child();
child.myMethod(2); // instance 2
```

在子类的静态方法中通过 `super` 调用父类的方法时，方法内部的 `this` 指向当前的子类，而不是子类的实例

```js
class A {
  constructor() {
    this.x = 1;
  }
  static print() {
    console.log(this.x);
  }
}

class B extends A {
  constructor() {
    super();
    this.x = 2;
  }
  static m() {
    super.print();
  }
}

B.x = 3;
B.m() // 3
```

注意，使用 `super` 的时候，必须显式指定是作为函数、还是作为对象使用，否则会报错

```js
class A {}

class B extends A {
  constructor() {
    super();
    console.log(super); // 报错
  }
}
```

由于对象总是继承其他对象的，所以可以在任意一个对象中，使用 `super` 关键字

```js
var obj = {
  toString() {
    return "MyObject: " + super.toString();
  }
};

obj.toString(); // MyObject: [object Object]
```

### super使用总结

- 继承时需要在  `constructor()` 构造方法调用 `super()` 才能创建子类的 `this` 对象

- 在普通方法中使用 `super` 对象时，`super` 指向父类的原型对象，注意调用父类方法时， `this` 指向当前子类实例

- 在普通方法中 `super` 对某个属性赋值，这时 `super` 就是 `this` ，赋值的属性会变成子类实例的属性

- 在子类静态方法中使用 `super` 对象时，`super` 指向父类，注意调用父类方法时， `this` 指向当前子类

## 使用类的注意点

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

## 类的 prototype 属性和__proto__属性

大多数浏览器的 ES5 实现之中，每一个对象都有 `__proto__` 属性，指向对应的构造函数的 `prototype` 属性。Class 作为构造函数的语法糖，同时有 `prototype` 属性和 `__proto__` 属性，因此同时存在两条继承链

- 子类的 `__proto__` 属性，表示构造函数的继承，总是指向父类

- 子类 `prototype` 属性的 `__proto__` 属性，表示方法的继承，总是指向父类的 `prototype` 属性

```js
class A {
}

class B extends A {
}

B.__proto__ === A // true
B.prototype.__proto__ === A.prototype // true
```

这样的结果是因为，类的继承是按照下面的模式实现的

```js
class A {
}

class B {
}

// B 的实例继承 A 的实例
Object.setPrototypeOf(B.prototype, A.prototype);

// B 继承 A 的静态属性
Object.setPrototypeOf(B, A);

const b = new B();
```

这两条继承链，可以这样理解：作为一个对象，子类（B）的原型（ `__proto__` 属性）是父类（A）；作为一个构造函数，子类（B）的原型对象（prototype属性）是父类的原型对象（prototype属性）的实例

```js
B.prototype = Object.create(A.prototype);
// 等同于
B.prototype.__proto__ = A.prototype;
```

**extends关键字后面可以跟多种类型的值**

```js
class B extends A {
}
```

上面代码的A，只要是一个有 `prototype` 属性的函数，就能被B继承。由于函数都有 `prototype` 属性（除了 `Function.prototype` 函数），因此 `A` 可以是任意函数

下面，讨论两种情况。第一种，子类继承Object类

```js
class A extends Object {
}

A.__proto__ === Object // true
A.prototype.__proto__ === Object.prototype // true
```

第二种情况，不存在任何继承

```js
class A {
}

A.__proto__ === Function.prototype // true
A.prototype.__proto__ === Object.prototype // true
```

这种情况下，A 作为一个基类（即不存在任何继承），就是一个普通函数，所以直接继承 `Function.prototype` 。但是，A 调用后返回一个空对象（即 Object 实例），所以 `A.prototype.__proto__` 指向构造函数（Object）的 `prototype` 属性

## 实例的 __proto__ 属性

子类实例的 `__proto__` 属性的 `__proto__` 属性，指向父类实例的 `__proto__` 属性。也就是说，子类的原型的原型，是父类的原型

```js
var p1 = new Point(2, 3);
var p2 = new ColorPoint(2, 3, 'red');

p2.__proto__ === p1.__proto__ // false
p2.__proto__.__proto__ === p1.__proto__ // true
```

上面代码中，`ColorPoint` 继承了 `Point`，导致前者原型的原型是后者的原型。

因此，通过子类实例的 `__proto__.__proto__` 属性，可以修改父类实例的行为

```js
p2.__proto__.__proto__.printName = function () {
  console.log('Ha');
};

p1.printName() // "Ha"
```

## 原生构造函数的继承

以前，原生构造函数是无法继承的，比如，不能自己定义一个Array的子类

```js
function MyArray() {
  Array.apply(this, arguments);
}

MyArray.prototype = Object.create(Array.prototype, {
  constructor: {
    value: MyArray,
    writable: true,
    configurable: true,
    enumerable: true
  }
});
```

上面代码定义了一个继承 `Array` 的 `MyArray` 类。但是，这个类的行为与 `Array` 完全不一致

```js
var colors = new MyArray();
colors[0] = "red";
colors.length  // 0

colors.length = 0;
colors[0]  // "red"
```

之所以会发生这种情况，是因为子类无法获得原生构造函数的内部属性，通过 `Array.apply()` 或者分配给原型对象都不行。原生构造函数会忽略 `apply` 方法传入的 `this` ，也就是说，原生构造函数的 `this` 无法绑定，导致拿不到内部属性。

ES5 是先新建子类的实例对象 `this`，再将父类的属性添加到子类上，由于父类的内部属性无法获取，导致无法继承原生的构造函数。比如，`Array` 构造函数有一个内部属性 `[[DefineOwnProperty]]` ，用来定义新属性时，更新 `length` 属性，这个内部属性无法在子类获取，导致子类的 `length` 属性行为不正常

ES6 允许继承原生构造函数定义子类，因为 ES6 是先新建父类的实例对象 `this` ，然后再用子类的构造函数修饰 `this` ，使得父类的所有行为都可以继承。下面是一个继承 `Array` 的例子

```js
class MyArray extends Array {
  constructor(...args) {
    super(...args);
  }
}

var arr = new MyArray();
arr[0] = 12;
arr.length // 1

arr.length = 0;
arr[0] // undefined
```

下面是一个自定义 `Error` 子类的例子，可以用来定制报错时的行为

## Mixin 模式的实现 

Mixin 指的是多个对象合成一个新的对象，新对象具有各个组成成员的接口。它的最简单实现如下

```js
const a = {
  a: 'a'
};
const b = {
  b: 'b'
};
const c = {...a, ...b}; // {a: 'a', b: 'b'}
```

下面是一个更完备的实现，将多个类的接口“混入”（mix in）另一个类

```js
function mix(...mixins) {
  class Mix {
    constructor() {
      for (let mixin of mixins) {
        copyProperties(this, new mixin()); // 拷贝实例属性
      }
    }
  }

  for (let mixin of mixins) {
    copyProperties(Mix, mixin); // 拷贝静态属性
    copyProperties(Mix.prototype, mixin.prototype); // 拷贝原型属性
  }

  return Mix;
}

function copyProperties(target, source) {
  for (let key of Reflect.ownKeys(source)) {
    if ( key !== 'constructor'
      && key !== 'prototype'
      && key !== 'name'
    ) {
      let desc = Object.getOwnPropertyDescriptor(source, key);
      Object.defineProperty(target, key, desc);
    }
  }
}
```

上面代码的 `mix` 函数，可以将多个对象合成为一个类。使用的时候，只要继承这个类即可

```js
class DistributedEdit extends mix(Loggable, Serializable) {
  // ...
}
```