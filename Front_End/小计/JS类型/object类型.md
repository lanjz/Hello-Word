> 对象可以通过执行`new`操作符后跟要创建的对象类型的名称来创建

```
var o = new Object()
// 也可以省略后面的括号
var o = new Object
```

`Object`的每个实例都具有下列属性和方法

- `constructor`： 保存着创建该实例的函数。对于前面的例子，构建函数（constructor）就是Object

- `hasOwnProperty`: 检查某个属性是否存在于当前实例中（不是检查是否在该实例的原型中）

```
var o = new Object()
o.a = 123
o.hasOweProperty('a') // true
o.hasOweProperty('b') // false
```

- `propertyIsEnumerable`: 检查属性是否可以通过`for - in`枚举出来 

- `toLocalString()`：返回对象的字符串表示

```
o.toLocalString() // "[object Object]"
```

- `toString()`： 返回对象的字符串表示

- `valueOf()`： 返回对象的字符串、数值或布尔表示，通常与`toString()`方法返回的值相同
