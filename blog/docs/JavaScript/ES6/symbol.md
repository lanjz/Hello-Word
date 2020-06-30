# symbol

`symbol` 是一种基本数据类型, **每个从 `Symbol()` 返回的 `symbol` 值都是唯一的**

加上 `symbol` JavaScript 语言就一共有6种基本数据类型：`undefined` 、`null` 、布尔值（Boolean）、字符串（String）、数值（Number）、`symbol`

Symbol函数可以接受一个字符串作为参数，表示对 Symbol 实例的描述，主要是为了在控制台显示，或者转为字符串时，比较容易区分

```js
let s1 = Symbol('foo');
let s2 = Symbol('bar');

s1 // Symbol(foo)
s2 // Symbol(bar)

s1.toString() // "Symbol(foo)"
s2.toString() // "Symbol(bar)"
```

如果 Symbol 的参数是一个对象，就会调用该对象的 `toString` 方法，将其转为字符串，然后才生成一个 Symbol 值

```js
const obj = {
  toString() {
    return 'abc';
  }
};
const sym = Symbol(obj);
sym // Symbol(abc)
```

注意，Symbol函数的参数只是表示对当前 Symbol 值的描述，因此相同参数的Symbol函数的返回值是不相等的

```js
// 没有参数的情况
let s1 = Symbol();
let s2 = Symbol();

s1 === s2 // false

// 有参数的情况
let s1 = Symbol('foo');
let s2 = Symbol('foo');

s1 === s2 // false
```

Symbol 值不能与其他类型的值进行运算，会报错

```js
let sym = Symbol('My symbol');

"your symbol is " + sym
// TypeError: can't convert symbol to string
`your symbol is ${sym}`
// TypeError: can't convert symbol to string
```

Symbol 值可以显式转为字符串

```js
let sym = Symbol('My symbol');

String(sym) // 'Symbol(My symbol)'
sym.toString() // 'Symbol(My symbol)'
```

另外，Symbol 值也可以转为布尔值，但是不能转为数值

```js
let sym = Symbol();
Boolean(sym) // true
!sym  // false

if (sym) {
  // ...
}

Number(sym) // TypeError
sym + 2 // TypeError
```

## Symbol.prototype.description

获取 Symbol 描述符的一个方法是显式转为字符串

```js
const sym = Symbol('foo');

String(sym) // "Symbol(foo)"
sym.toString() // "Symbol(foo)"
```

ES2019 提供了一个实例属性 `description` ，直接返回 Symbol 的描述

```js
const sym = Symbol('foo');

sym.description // "foo"
```

## 作为属性名的 Symbol

Symbol 值作为对象属性名时，不能用点运算符

```js
const mySymbol = Symbol();
const a = {};

a.mySymbol = 'Hello!';
a[mySymbol] // undefined
a['mySymbol'] // "Hello!"

// 正确用法
a[mySymbol] = 'Hello!';

// 第二种写法
let a = {
  [mySymbol]: 'Hello!'
};
a[mySymbol] // "Hello!"
```

上面代码中，因为点运算符后面总是字符串，所以不会读取 `mySymbol` 作为标识名所指代的那个值，导致a的属性名实际上是一个字符串，而不是一个 Symbol 值

## 遍历 symbol属性

Symbol 作为属性名，遍历对象的时候，该属性不会出现在 `for...in`、`for...of` 循环中，也不会被 `Object.keys()` 、`Object.getOwnPropertyNames()`、`JSON.stringify()` 返回

只能使用 `Object.getOwnPropertySymbols()`可以获取指定对象的所有 Symbol 属性名

```js
const obj = {};
let a = Symbol('a');
let b = Symbol('b');

obj[a] = 'Hello';
obj[b] = 'World';

const objectSymbols = Object.getOwnPropertySymbols(obj);

objectSymbols
// [Symbol(a), Symbol(b)]
```

除了 `Object.getOwnPropertyNames()`, `Reflect.ownKeys()` 方法也可以返回所有类型的键名，包括常规键名和 Symbol 键名以及不可枚举的属性

```js
let obj = {
  [Symbol('my_key')]: 1,
  enum: 2,
  nonEnum: 3
};

Reflect.ownKeys(obj)
//  ["enum", "nonEnum", Symbol(my_key)]
```

##　Symbol.for()，Symbol.keyFor()

有时，我们希望重新使用同一个 Symbol 值，｀Symbol.for()｀　方法可以做到这一点。它接受一个字符串作为参数，然后搜索有没有以该参数作为名称的 Symbol 值。如果有，就返回这个 Symbol 值，否则就新建一个以该字符串为名称的 Symbol 值，并将其注册到全局

```js
let s1 = Symbol.for('foo');
let s2 = Symbol.for('foo');

s1 === s2 // true
```

`Symbol.for()` 与 `Symbol()` 这两种写法，都会生成新的 Symbol。它们的区别是，前者会被登记在全局环境中供搜索，后者不会。`Symbol.for()` 不会每次调用就返回一个新的 Symbol 类型的值，而是会先检查给定的 `key` 是否已经存在，如果不存在才会新建一个值

```js
Symbol.for("bar") === Symbol.for("bar")
// true

Symbol("bar") === Symbol("bar")
// false
```

注意，`Symbol.for()为` Symbol 值登记的名字，是全局环境的，不管有没有在全局环境运行

```js
function foo() {
  return Symbol.for('bar');
}

const x = foo();
const y = Symbol.for('bar');
console.log(x === y); // true
```

`Symbol.for()` 的这个全局登记特性，可以用在不同的 `ifram`e 或 `service worker` 中取到同一个值

```js
iframe = document.createElement('iframe');
iframe.src = String(window.location);
document.body.appendChild(iframe);

iframe.contentWindow.Symbol.for('foo') === Symbol.for('foo')
```

`Symbol.keyFor()` 方法返回一个已登记的 Symbol 类型值的 `key`

```js
let s1 = Symbol.for("foo");
Symbol.keyFor(s1) // "foo"

// 变量s2属于未登记的 Symbol 值，所以返回undefined
let s2 = Symbol("foo");
Symbol.keyFor(s2) // undefined
```