# Proxy

Proxy 用于修改某些操作的默认行为, Proxy 可以理解成，在目标对象之前架设一层“拦截”，外界对该对象的访问，都必须先通过这层拦截，因此提供了一种机制，可以对外界的访问进行过滤和改写

语法： `new Proxy(target, handler)`

- `new Proxy()` 表示生成一个 Proxy 实例

- `target` 参数表示所要拦截的目标对象

- `handler` 参数也是一个对象，用来定制拦截行为,对于每一个被代理的操作，需要提供一个对应的处理函数，该函数将拦截对应的操作

```js
var proxy = new Proxy({}, {
  get: function(target, propKey) {
    return 35;
  }
});

proxy.time // 35
proxy.name // 35
proxy.title // 35
```

上面代码中，配置对象有一个 `get` 方法，用来拦截对目标对象属性的访问请求。`get` 方法的两个参数分别是目标对象和所要访问的属性。可以看到，由于拦截函数总是返回 `35`，所以访问任何属性都得到 `35` 

**注意，要使得 Proxy 起作用，必须针对 Proxy 实例（上例是 `proxy` 对象）进行操作，而不是针对目标对象（上例是空对象）进行操作**

Proxy 实例也可以作为其他对象的原型对象

```js
var proxy = new Proxy({}, {
  get: function(target, propKey) {
    return 35;
  }
});

let obj = Object.create(proxy);
obj.time // 35
// obj对象本身并没有time属性，所以根据原型链，会在proxy对象上读取该属性，导致被拦截
```

使用 Proxy 拦截函数

```js
var handler = {
  get: function(target, name) {
    if (name === 'prototype') {
      return Object.prototype;
    }
    return 'Hello, ' + name;
  },

  apply: function(target, thisBinding, args) {
    return args[0];
  },

  construct: function(target, args) {
    return {value: args[1]};
  }
};

var fproxy = new Proxy(function(x, y) {
  return x + y;
}, handler);

fproxy(1, 2) // 1
new fproxy(1, 2) // {value: 2}
fproxy.prototype === Object.prototype // true
fproxy.foo === "Hello, foo" // true

```

Proxy 支持的拦截操作：

- `get(target, propKey, receiver)`：拦截对象属性的读取，比如 `proxy.foo` 和 `proxy['foo']`

- `set(target, propKey, value, receiver)`: 拦截对象属性的设置, 返回一个布尔值

- `has(target, propKey)`：拦截 `propKey in proxy` 的操作，返回一个布尔值

- `deleteProperty(target, propKey)`：拦截 `delete proxy[propKey]` 的操作，返回一个布尔值

- `ownKeys(target)`：拦截 `Object.getOwnPropertyNames(proxy)` 、 `Object.getOwnPropertySymbols(proxy)` 、`Object.keys(proxy)` 、`for...in`循环，返回一个数组。该方法返回目标对象所有自身的属性的属性名，而 `Object.keys()` 的返回结果仅包括目标对象自身的可遍历属性

- `getOwnPropertyDescriptor(target, propKey)`：拦截 `Object.getOwnPropertyDescriptor(proxy, propKey)` ，返回属性的描述对象

- `defineProperty(target, propKey, propDesc)`：拦截 `Object.defineProperty(proxy, propKey, propDesc）` 、`Object.defineProperties(proxy, propDescs)`，返回一个布尔值

- `preventExtensions(target)`：拦截 `Object.preventExtensions(proxy)`，返回一个布尔值

- `getPrototypeOf(target)`：拦截`Object.getPrototypeOf(proxy)`，返回一个对象

- `isExtensible(target)`：拦截 `Object.isExtensible(proxy)`，返回一个布尔值。

- `setPrototypeOf(target, proto)`：拦截 `Object.setPrototypeOf(proxy, proto)` ，返回一个布尔值。如果目标对象是函数，那么还有两种额外操作可以拦截

- `apply(target, object, args)`：拦截 Proxy 实例作为函数调用的操作，比如 `proxy(...args)`、 `proxy.call(object, ...args)` 、`proxy.apply(...)`

- `construct(target, args)`：拦截 Proxy 实例作为构造函数调用的操作，比如 `new proxy(...args)`

## Proxy 实例的方法 

## get()

`get` 方法用于拦截某个属性的读取操作，可以接受三个参数，依次为目标对象、属性名和 `proxy` 实例本身（严格地说，是操作行为所针对的对象），其中最后一个参数可选

```js
var person = {
  name: "张三"
};

var proxy = new Proxy(person, {
  get: function(target, propKey) {
    if (propKey in target) {
      return target[propKey];
    } else {
      throw new ReferenceError("Prop name \"" + propKey + "\" does not exist.");
    }
  }
});

proxy.name // "张三"
proxy.age // 抛出一个错误
```

Proxy 对象作为其它对象的 `prototype` 时，当访问这个对象的 `prototype` 时也被会被拦截

```js
let proto = new Proxy({}, {
  get(target, propertyKey, receiver) {
    console.log('GET ' + propertyKey);
    return target[propertyKey];
  }
});

let obj = Object.create(proto);
obj.foo // "GET foo"

```

利用 Proxy，可以将读取属性的操作（`get`），转变为执行某个函数，从而实现属性的链式操作

```js
var pipe = function (value) {
  var funcStack = [];
  var oproxy = new Proxy({} , {
    get : function (pipeObject, fnName) {
      if (fnName === 'get') {
        return funcStack.reduce(function (val, fn) {
          return fn(val);
        },value);
      }
      funcStack.push(window[fnName]);
      return oproxy;
    }
  });

  return oproxy;
}

var double = n => n * 2;
var pow    = n => n * n;
var reverseInt = n => n.toString().split("").reverse().join("") | 0;

pipe(3).double.pow.reverseInt.get; // 63

```

如果一个属性不可配置（configurable）且不可写（writable），则 Proxy 不能修改该属性，否则通过 Proxy 对象访问该属性会报错

```js
const target = Object.defineProperties({}, {
  foo: {
    value: 123,
    writable: false,
    configurable: false
  },
});

const handler = {
  get(target, propKey) {
    return 'abc';
  }
};

const proxy = new Proxy(target, handler);

proxy.foo
// TypeError: Invariant check failed
```

### set()

`set` 方法用来拦截某个属性的赋值操作，可以接受四个参数，依次为目标对象、属性名、属性值和 Proxy 实例本身，其中最后一个参数可选

假定 `Person` 对象有一个 `age` 属性，该属性应该是一个不大于 `200` 的整数，那么可以使用 `Proxy` 保证 `age` 的属性值符合要求

```js
let validator = {
  set: function(obj, prop, value) {
    if (prop === 'age') {
      if (!Number.isInteger(value)) {
        throw new TypeError('The age is not an integer');
      }
      if (value > 200) {
        throw new RangeError('The age seems invalid');
      }
    }

    // 对于满足条件的 age 属性以及其他属性，直接保存
    obj[prop] = value;
  }
};

let person = new Proxy({}, validator);

person.age = 100;

person.age // 100
person.age = 'young' // 报错
person.age = 300 // 报错
```

注意，如果目标对象自身的某个属性，不可写且不可配置，那么 `set` 方法将不起作用。

```js
const obj = {};
Object.defineProperty(obj, 'foo', {
  value: 'bar',
  writable: false,
});

const handler = {
  set: function(obj, prop, value, receiver) {
    obj[prop] = 'baz';
  }
};

const proxy = new Proxy(obj, handler);
proxy.foo = 'baz';
proxy.foo // "bar"
```

### apply()

`apply` 方法拦截函数的调用、`call` 和 `apply` 操作

`apply` 方法可以接受三个参数，分别是目标对象、目标对象的上下文对象（ `this` ）和目标对象的参数数组

```js
var handler = {
  apply (target, ctx, args) {
    return Reflect.apply(...arguments);
  }
};
```

使用例子：

```js
var target = function () { return 'I am the target'; };
var handler = {
  apply: function () {
    return 'I am the proxy';
  }
};

var p = new Proxy(target, handler);

p()
// "I am the proxy"
```

例子2：

```js
var twice = {
  apply (target, ctx, args) {
    return Reflect.apply(...arguments) * 2;
  }
};
function sum (left, right) {
  return left + right;
};
var proxy = new Proxy(sum, twice);
proxy(1, 2) // 6
proxy.call(null, 5, 6) // 22
proxy.apply(null, [7, 8]) // 30
```

上面代码中，每当执行 `proxy` 函数（直接调用或 `call` 和 `apply` 调用），就会被 `apply` 方法拦截

另外，直接调用 `Reflect.apply` 方法，也会被拦截

```js
Reflect.apply(proxy, null, [9, 10]) // 38
```

### has()

`has` 方法用来拦截 `HasProperty` 操作，即判断对象是否具有某个属性时，这个方法会生效。典型的操作就是 `in` 运算符

`has` 方法可以接受两个参数，分别是目标对象、需查询的属性名

下面的例子使用 `has` 方法隐藏某些属性，不被 `in` 运算符发现

```js
var handler = {
  has (target, key) {
    if (key[0] === '_') {
      return false;
    }
    return key in target;
  }
};
var target = { _prop: 'foo', prop: 'foo' };
var proxy = new Proxy(target, handler);
'_prop' in proxy // false

```

> [more](https://es6.ruanyifeng.com/#docs/proxy)