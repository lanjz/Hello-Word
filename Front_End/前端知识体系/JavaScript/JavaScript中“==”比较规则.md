# JavaScript中“==”比较规则

- `undefined` 和 `null` 互相比较返回`true`, 和自身比较也返回`true`, 其他情况返回`false`

- `Infinity`只和自身比较返回`true`

- 如果一个值是数字，另一个是字符串，先将字符串转换为数值，然后使用转换后的值进行比较

- 如果两个操作数都是对象，则比较它们是不是同一个对象。如果两个操作数都指向同一个对象，则相等操作符返回`true`，否则返回`false`

- `a`与`b`进行比较，如果`a`与`b`都是`Number`,`String`,`Boolean`这三种类型中的一种，并且`a`与`b`的类型不同，那么就将`a`与`b`都转换成数字再进行比较

  ```
  var a = 'true'
  var b = true
  var c = 3
  var d = 1
  console.log(a == b) // false, Number('true') = NaN
  console.log(a == c) // false 
  console.log(a == d) // false
  console.log(b == d) // true
  ```

- 如果`a`是`Number`,`String`,`Boolean`这三种类型中的一种，而`b`是一个复合对象时（`Object`,`Array`等） 
则对`b`执行`ToPrimitive`操作（这步是JS解释器执行的，ToPrimitive方法的实现，正是依次去调用对象的`valueOf`,`toString`方法，
直到其中一个方法返回一个基本值，如果这两个方法没有返回基本值 ，那就认定不相等 ）
 