参考： [MDN web docs Array.prototype.sort()
](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)

JS中的sort方法就会将元素类型转换成字符串Unicode码点进行排序。不过他是一个高阶函数，可以接受一个函数做为参数。我们可以通过这函数，来调整数组的升序或降序

### 默认排序

```
const arr = [1, 20, 10, 30, 22, 11, 55, 24, 31, 88, 12, 100, 50]
arr.sort(); // [1, 10, 100, 11, 12, 20, 22, 24, 30, 31, 50, 55, 88]
```
因为默认是按字符串排序，所以排出来的结果有问题的


### 带函数参数排序

```
var arr = [1, 20, 10, 30, 22, 11, 55, 24, 31, 88, 12, 100, 50];
arr.sort(function(a, b){
	 return a - b
 })
// [1, 10, 11, 12, 20, 22, 24, 30, 31, 50, 55, 88, 100]
```

当带有函数`compareFunction`做为参数时，sort将根据`compareFunction`的返回结果进行排序

- 如果 compareFunction(a, b) 小于 0 ，那么 a 会被排列到 b 之前

- 如果 compareFunction(a, b) 大于 0 ，那么 a 会被排列到 b 之后

- 如果 compareFunction(a, b) 等于 0 ， a 和 b 的相对位置不变

根据之前的例子，我们就可以快速得实现降序排序

```
var arr = [1, 20, 10, 30, 22, 11, 55, 24, 31, 88, 12, 100, 50];
arr.sort(function(a, b){
	 return -(a - b)
 })
// [1, 10, 11, 12, 20, 22, 24, 30, 31, 50, 55, 88, 100]
```

数字元素可以简单得使用`-`，来快速达到排序的目的，如果元素包含字符串就不行了

```
'a'  - 'b' // NaN
```

字符串是不能相减但是可以比较大小

```
'a'  < 'b' // true
```

所以对于字符串排序，我们可以通过字符串比较后返回的`Boolean`结果进行排序

```
var arr =  ['wanna', 'take', 'it', 'back', 'and', 'start', 'again'];
arr.sort(function(a, b){
     return a < b ? -1 : 1  
 })
// ["again", "and", "back", "it", "start", "take", "wanna"]
```

如果是对象元素，可以使用属性进行排序

```
var items = [
  { name: 'Edward', value: 21 },
  { name: 'Sharpe', value: 37 },
  { name: 'And', value: 45 },
  { name: 'The', value: -12 },
  { name: 'Magnetic' },
  { name: 'Zeros', value: 37 }
];

// sort by value
items.sort(function (a, b) {
  return (a.value - b.value)
});

// sort by name
items.sort(function(a, b) {
  var nameA = a.name.toUpperCase(); // ignore upper and lowercase
  var nameB = b.name.toUpperCase(); // ignore upper and lowercase
  if (nameA < nameB) {
    return -1;
  }
  if (nameA > nameB) {
    return 1;
  }

  
// names must be equal

  return 0;
});
```
