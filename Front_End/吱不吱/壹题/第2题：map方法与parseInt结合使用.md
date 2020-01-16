# 题目：['1', '2', '3'].map(parseInt) what & why ?

## map的用法

```
var new_array = arr.map(function callback(currentValue[, index[, array]]) { 
// Return element for new_array 
}[, thisArg])
```

这个callback一共可以接收三个参数，其中第一个参数代表当前被处理的元素，而第二个参数代表该元素的索引

## parseInt的用法

`parseInt()`函数解析一个字符串参数，并返回一个指定基数的整数 (数学系统的基础)。

```
const intValue = parseInt(string[, radix]);
```

- string：要被解析的值。如果参数不是一个字符串，则将其转换为字符串(使用 ToString 抽象操作)。字符串开头的空白符将会被忽略。

- radix ：一个介于2和36之间的整数(数学系统的基础)，表示上述字符串的基数。默认为10。
返回值 返回一个整数或NaN

```
parseInt(100); // 100
parseInt(100, 10); // 100
parseInt(100, 2); // 4 -> converts 100 in base 2 to base 10

```

### 注意：

在`radix`为`undefined`，或者`radix`为 0 或者没有指定的情况下，JavaScript 作如下处理：

- 如果字符串 string 以"0x"或者"0X"开头, 则基数是16 (16进制).

- 如果字符串 string 以"0"开头, 基数是8（八进制）或者10（十进制），那么具体是哪个基数由实现环境决定。ECMAScript 5 规定使用10，但是并不是所有的浏览器都遵循这个规定。因此，永远都要明确给出radix参数的值。

- 如果字符串 string 以其它任何值开头，则基数是10 (十进制)。

## 回到真实的例子上

```
['1', '2', '3'].map(parseInt)
```

等价于：

```
['1', '2', '3'].map((item, index) => {
	return parseInt(item, index)
})
```

即返回的值分别为：

- parseInt('1', 0) ，`radix`为0，默认为10，所以返回1

- parseInt('2', 1)，`radix`为1, 不在2到36之间，所以返回`NaN`

- parseInt('3', 2) ，`radix`为2，将'3'作为二进制处理，逢2进1，可'3'不是二进制表示（已经超过最大值1了），所以返回`NaN`

## 变种`['10','10','10','10','10'].map(parseInt)`

分析如一：

- parseInt('10', 0) ，`radix`为0，默认为10，所以返回10

- parseInt('10', 1) ，`radix`为1, 不在2到36之间，所以返回`NaN`

- parseInt('10', 2) ，`radix`为2，将'10'作为二进制处理，逢2进1，返回2

- parseInt('10', 3) ，`radix`为3，逢3进1，所以返回3

- parseInt('10', 4) ，`radix`为4，逢4进1，所以返回4

## 如果想要正常得循环字符串数组，怎么办？

```
['10','10','10','10','10'].map(Number);
// [10, 10, 10, 10, 10]
```
