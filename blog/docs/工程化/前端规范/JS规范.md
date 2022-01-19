# JS 规范

## 变量声明

- `var` 存在变量提升的情况，所以使用 `const` 和 `let` 来声明变量

  - 如果变量是不可变的，使用 `const`

  - 如果变量是可以变的，使用 `let`

- 变量不要进行链式赋值，变量链式赋值会创建隐藏的全局变量

  ```js
  // bad
  (function example() {
    // 等同于 let a = ( b = ( c = 1 ) );
    let a = b = c = 1
  }())
  
  console.log(a) // throws ReferenceError
  console.log(b) // 1
  console.log(c) // 1
  ```

- 未使用的变量要删除。因为既浪费空间并会给读者造成困扰

## 字符串

- 符串统一使用单引号的形式 `''`

  ```js
  // bad
  const name = "FE"
  
  // good
  const name = 'FE'
  ```

- 程序化生成字符串时，请使用模板字符串

  ```js
  const test = 'test'
  
  // bad
  const str = 'a' + 'b' + test
  
  // good
  const str = `ab${test}`
  ```

## 对象

- 使用字面量值创建对象

  ```js
  // bad
  const a = new Object
  
  // good
  const a = {}
  ```

- 使用 `.` 符号来访问对象属性，只有变量属性使用中括号的形式访问属性

  ```js
  const obj = { name: 'SF', age: 10 }
  const key = 'age'
  
  // bad
  console.log(obj['name'])
  // good
  console.log(obj.name)
  console.log(obj[key])
  ```

- 对象中的属性函数使用简写方式

  ```js
  // bad
  const item = {
    value: 1,
  
    addValue: function (val) {
      return item.value + val
    }
  }
  
  // good
  const item = {
    value: 1,
  
    addValue (val) {
      return item.value + val
    }
  }
  ```

- 用对象属性值的简写方式，让对象更简短且描述更清楚

  ```js
  const name = 'FrontEnd'
  
  // bad
  const item = {
    name: name
  }
  
  // good
  const item = {
    name
  }
  ```

- 同一业务类别的属性应放置在一起，在此基础上简写和非简单对象属性都应分别放在一起, 这样可使代码更加直观

  ```js
  const job = 'FrontEnd'
  const name = 'SF'
  
  // bad
  const item = {
    pageSize: 2,
    sex: 'male',
    name,
    pageNum: 10,
  }
  
  // good
  const item = {
    sex: 'male',
    name,
    // 分页相关的放在一起
    pageSize: 2,
    pageNum: 10,
  }
  
  // bad
  const item = {
    sex: 'male',
    job,
    age: 25,
    name
  }
  
  // good
  const item = {
    job,
    name,
    sex: 'male',
    age: 25
  }
  ```

- 只对非法标识符的属性使用引号，因为通常来说我们认为这样主观上会更容易阅读，这样会带来代码高亮上的提升，同时也更容易被主流 JS 引擎优化

  ```js
  // bad
  const bad = {
    'name': 'SF',
    'other-name': 'Express'
  }
  
  // good
  const good = {
    name: 'SF',
    'other-name': 'Express'
  }
  ```

- 不要直接使用 `Object.prototype` 的方法, 例如 `hasOwnProperty`, `isPrototypeOf` 等方法，因为这些方法可能会被对象自身的同名属性覆盖

  ```js
  // bad
  console.log(object.hasOwnProperty(key))
  
  // good
  console.log(Object.prototype.hasOwnProperty.call(object, key))
  
  // best 如果有多次调用的话
  const has = Object.prototype.hasOwnProperty // 缓存
  console.log(has.call(object, key))
  ```

- 优先使用对象展开运算符 `...` 来做对象浅拷贝而不是使用 `Object.assign`，使用 `对象剩余操作符` 来获取对象剩余属性

  ```js
  // bad
  const original = { a: 1, b: 2 }
  const copy = Object.assign({}, original, { c: 3 })
  
  // good
  const original = { a: 1, b: 2 }
  const copy = { ...original, c: 3 }
  
  const { a, ...other } = copy // other => { b: 2, c: 3 }
  ```

## 数组

- 使用字面量值创建数组

  ```js
  // bad
  const items = new Array()
  
  // good
  const items = []
  ```

- 如果一个数组有多行则要在数组的开括号后和闭括号前使用新行，简洁工整即可

  ```js
  // bad
  const arr = [
    [0, 1], [2, 3], [4, 5]
  ]
  // good
  const arr = [[0, 1], [2, 3], [4, 5]]
  
  // bad
  const objectInArray = [{
    id: 1
  }, {
    id: 2
  }]
  // good
  const objectInArray = [
    { id: 1 },
    { id: 2 }
  ]
  // good 如果对象属性较多
  const objectInArray = [
    {
      id: 1,
      id2: 1,
      id3: 1,
      id4: 1,
    },
    {
      id: 2,
      id2: 2,
      id3: 2,
      id4: 2,
    }
  ]
  ```

- 使用展开运算符 `...` 操作数组的复制  
  使用展开运算符 `...` 将可迭代对象转换为数组

  ```js
  itemsCopy = [...items]
  
  const foo = document.querySelectorAll('.foo')
  const nodes = [...foo]
  ```

- 使用 `Array.from` 来将一个不可迭代类数组对象转换为数组

  ```js
  const arrLike = { 0: 'foo', 1: 'bar', 2: 'baz', length: 3 }
  
  // bad
  const arr = Array.prototype.slice.call(arrLike)
  
  // good
  const arr = Array.from(arrLike)
  ```

- 使用数组的 `map` 等方法时，如果语句单一，使用单行写法省略 `return`

  ```js
  // bad
  [1, 2, 3].map(x => {
    const y = x + 1
    return y
  })
  
  // good
  [1, 2, 3].map(x => x + 1)
  ```

## 解构赋值

- 当需要使用对象的多个属性时，使用解构赋值

  ```js
  // bad
  function getFullName (user) {
    const firstName = user.firstName
    const lastName = user.lastName
  
    return `${firstName} ${lastName}`
  }
  
  // good
  function getFullName (user) {
    const { firstName, lastName } = user
  
    return `${firstName} ${lastName}`
  }
  
  // better
  function getFullName ({ firstName, lastName }) {
    return `${firstName} ${lastName}`
  }
  ```

- 当需要使用数组的多个值时，同样使用解构赋值

  ```js
  const arr = [1, 2, 3, 4]
  
  // bad
  const first = arr[0]
  const second = arr[1]
  
  // good
  const [first, second] = arr
  ```

## 函数

- 不要使用 `Function` 构造函数创建函数, 此方式创建函数和对字符串使用 `eval()` 一样会产生漏洞

  ```js
  // bad
  const add = new Function('a', 'b', 'return a + b')
  
  // bad
  const subtract = Function('a', 'b', 'return a - b')
  ```

- 用圆括号包裹自执行匿名函数

  ```js
  (function () {
    console.log('Hello World')
  }())
  ```

- 不要在条件语句里使用声明函数：

  ```js
  // bad
  if (isUse) {
    function test () {
      // do something
    }
  }
  
  // good
  let test
  if (isUse) {
    test = () => {
      // do something
    }
  }
  ```

- 使用剩余运算符 `...` 代替 `arguments`，因为 `arguments` 只是一个类数组，而 `...` 是一个真正的数组

  ```js
  // bad
  function test () {
    const args = Array.prototype.slice.call(arguments)
    return args.join('')
  }
  
  // good
  function test (...args) {
    return args.join('')
  }
  ```

- 使用参数默认值的注意点：

  ```js
  function handleThings (opts = { }) {
    console.log(opts)
  }
  handleThings(undefined) // {}
  handleThings(null) // null
  ```

  注意函数的默认值处理不了 `null`，所以根据情况使用以下方式会更保险

  ```js
  function handleThings (opts) {
    opts = opts || {}
    // ...
  }
  ```

- 不要更改函数参数

  ```js
  // bad
  function f1 (obj) {
    obj.key = 1
  }
  ```

- 如果语句单一，可以省略花括号

  ```js
  // bad
  [1, 2, 3].map(number => {
    return `A string containing the ${number}.`
  })
  
  // good
  [1, 2, 3].map(number => `A string containing the ${number}.`)
  
  // good 如果返回对象，则在外层加上括号
  [1, 2, 3].map((number, index) => ({
    index: number
  }))
  ```

## 比较运算符

- 使用 `===` 和 `!==` 而非 `==` 和 `!=`

- 条件声明例如 `if` 会用 `ToBoolean` 这个抽象方法将表达式转成布尔值并遵循如下规则

  - 任何对象都等于 `true`

  - Undefined 等于 `false`

  - Null 等于 `false`

  - Booleans 等于 布尔值

  - Numbers 在 `+0`, `-0`, 或者 `NaN` 的情况下等于 `false`, 其他情况是 `true `

  - Strings 为 `''` 时等于 `false`, 否则是 `true`

## 分号

正常情况下为了代码的简洁性及遵循 Standard 的规范，不建议使用分号

但实际工作中还是要注意根据上下行代码来决定要不要使用分号，比如下面的代码

```js
function unSort(arr) {
  const copyList = arr.concat()
  const len = copyList.length
  for (let i = 0; i < len; i++) {
    const changeIndex = Math.floor(Math.random() * len); // 此处不加分号，代码将会运行报错
    [copyList[i], copyList[changeIndex]] = [copyList[changeIndex], copyList[i]]
  }
  return copyList
}
unSort([1,2,3,4,5])
```

:::warning
对于上面代码的情况，应该给上注释，给予提醒
:::

## 不修改内置对象的原型

除了十分特殊情况不修改内置对象的原型. 如果修改，请在项目工程的醒目位置给予说明

## 模块

- 引用同一文件中多个时模块时， 多个 `import` 应书写在一起

```js
// bad
import foo from 'foo'
import { named1, named2 } from 'foo'

// good
import foo, { named1, named2 } from 'foo'
```

- 将所有 `import` 语句放在文件最前方

```js
// bad
import foo from 'foo'
foo.init()

import bar from 'bar'

// good
import foo from 'foo'
import bar from 'bar'

foo.init()
```

- 多行导入应该像多行数组和对象文字一样缩进

```js
// bad
import { moduleA, moduleB, moduleC, moduleD, moduleE } from 'modules'

// good
import {
  moduleA,
  moduleB,
  moduleC,
  moduleD,
  moduleE
} from 'modules'
```

## 其它编码规范

- 大括号

```js
// 不推荐
if (foo) {
  bar()
}
else {
  baz()
}

// 不推荐
if (foo)
{
  bar()
}
else
{
  baz()
}

// 
// 推荐
if (foo) {
  bar()
} else {
  baz()
}
```

- 变量命名

  当命名变通 JS 变量时，使用驼峰式命名（camelCase）

- 逗号风格

  标准风格，逗号放置在当前行的末尾

```js
// bad
const foo = 1
        ,
        bar = 2

const foo = 1
        , bar = 2

const foo = ['name'
  , 'age']

// good
const foo = 1,
        bar = 2

const foo = ['name',
  'age']
```

- 构造函数首字母大写

```
// bad
const fooItem = new foo()

// good

const fooItem = new Foo()
```

- 链式调用

  如果单行代码量不多那么链式调用可以放在同一行，增加可读性，如果单代码数量多，则通过换行来进行链式调用

```js
const tar = day().a().b().c()
// 或
const tar = day()
        .a()
        .b()
        .c()
```

- 空行

  空白行对于分离代码逻辑有帮助，但过多的空行会占据屏幕的空间。规定最大连续空行数为 2

- 空格

  - 操作符两边需要添加空格

    ```js
    // bad
    const sum = 1+2
    
    // good
    const sum = 1 + 2
    ```

  - 对象的 `{ }` 和数组 `[ ]` 两边添加空格  
    对象属性 `:` 后添加添加空格  
    数组属性 `,` 后添加添加空格

    ```js
    // bad
    const obj = {name:'sf'}
    const arr = [1,2]
    // good
    const obj = { name: 'sf' }
    const arr = [ 1, 2 ]
    ```

  - 函数声明的空格

    暂定

  - 条件语句的空格

    暂定