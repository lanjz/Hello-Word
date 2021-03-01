# 剑指offer二

## 找出数组中重复的数字。

在一个长度为 n 的数组 nums 里的所有数字都在 0～n-1 的范围内。数组中某些数字是重复的，但不知道有几个数字重复了，也不知道每个数字重复了几次。请找出数组中任意一个重复的数字。

示例 1：

输入：
[2, 3, 1, 0, 2, 5, 3]
输出：2 或 3 

```js
/**
 * @param {number[]} nums
 * @return {number}
 */
var findRepeatNumber = function(nums) {
    let obj = {}
    for(let i of nums){
        if(obj[i]){
            return i
        }
        obj[i]=1
    }
};
```

## 二维数组中的查找

在一个 n * m 的二维数组中，每一行都按照从左到右递增的顺序排序，每一列都按照从上到下递增的顺序排序。请完成一个高效的函数，输入这样的一个二维数组和一个整数，判断数组中是否含有该整数。

示例:

现有矩阵 matrix 如下：

```js
[
  [1,   4,  7, 11, 15],
  [2,   5,  8, 12, 19],
  [3,   6,  9, 16, 22],
  [10, 13, 14, 17, 24],
  [18, 21, 23, 26, 30]
]
```
给定 target = 5，返回 true。

给定 target = 20，返回 false。

限制：

0 <= n <= 1000

0 <= m <= 1000

```js
/**
 * @param {number[][]} matrix
 * @param {number} target
 * @return {boolean}
 */
var findNumberIn2DArray = function(matrix, target) {
    if(!matrix.length ||!matrix[0].length) return false
    let j = matrix[0].length-1
    for(let i=0; i<matrix.length;i++){
        for(;j>-1;j--){
            let cur = matrix[i][j]
            if(cur === target) return true
            if(cur > target){
                continue
            } else {
                break
            }
        }
    }
    return false
};
```

思路：

从二维数组的右上角开始查找。如果当前元素等于目标值，则返回 true。如果当前元素大于目标值，则移到左边一列。如果当前元素小于目标值，则移到下边一行

## 青蛙跳台阶问题

一只青蛙一次可以跳上1级台阶，也可以跳上2级台阶。求该青蛙跳上一个 `n` 级的台阶总共有多少种跳法。

答案需要取模 1e9+7（1000000007），如计算初始结果为：1000000008，请返回 1。

示例 1：

```
输入：n = 2
输出：2
```

示例 2：

```
输入：n = 7
输出：21
```

示例 3：

```
输入：n = 0
输出：1
```

解一：

```js
/**
 * @param {number} n
 * @return {number}
 */

let obj = {};
var numWays = function(n) {
    if (n === 0 || n === 1) return 1;
    if (!obj[n]) obj[n] = numWays(n - 1) + numWays(n - 2);
    return obj[n] % 1000000007;
};
```

解二(消除递归)：

```js
/**
 * @param {number} n
 * @return {number}
 */
var numWays = function(n) {
  if (n === 0 || n === 1) return 1;
  let a = 1; 
  let b = 1; 
  for (let i = 2; i <= n; i++) {
    result = (a + b)%1000000007;
    a = b;
    b = result;
  }
  return result;
}
```

## 斐波那契数列

写一个函数，输入 n ，求斐波那契（Fibonacci）数列的第 n 项（即 F(N)）。斐波那契数列的定义如下：

```
F(0) = 0,   F(1) = 1
F(N) = F(N - 1) + F(N - 2), 其中 N > 1.
```

斐波那契数列由 0 和 1 开始，之后的斐波那契数就是由之前的两数相加而得出。

答案需要取模 1e9+7（1000000007），如计算初始结果为：1000000008，请返回 1。

示例 1：

```
输入：n = 2
输出：1
```

```
输入：n = 5
输出：5
```


解题同 青蛙跳台阶问题

## 旋转数组的最小数字

把一个数组最开始的若干个元素搬到数组的末尾，我们称之为数组的旋转。输入一个递增排序的数组的一个旋转，输出旋转数组的最小元素。例如，数组`[3,4,5,1,2]` 为 `[1,2,3,4,5]` 的一个旋转，该数组的最小值为1。

示例 1：

```
输入：[3,4,5,1,2]
输出：1
```

示例 2：

```
输入：[2,2,2,0,1]
输出：0
```

解决思路：

放置后的数据有个特点：最小值的左侧是递增的，最小值的右侧也是递增的，那么可以使用二分法做以下判断

- 如果中间值(mid) > 最后一个值：说明最小值在 `mid` 左侧

- 如果中间值(mid) < 最后一个值：说明最小值在 `mid` 右侧

- 如果中间值(mid) < 最后一个值： 说明最小值在最后一个值左侧

```js
/**
 * @param {number[]} numbers
 * @return {number}
 */
var minArray = function(numbers) {
    let low = 0
    let high = numbers.length-1
    while(low<high){
        let mid = Math.floor(low + (high - low) / 2)
        if(numbers[mid] > numbers[high]){
            low=mid+1
        } else if(numbers[mid]<numbers[high]){
            high=mid
        }else{
             high -= 1;
        }
    }
  return numbers[low]
};
```

## 左旋转字符串

字符串的左旋转操作是把字符串前面的若干个字符转移到字符串的尾部。请定义一个函数实现字符串左旋转操作的功能。比如，输入字符串"abcdefg"和数字2，该函数将返回左旋转两位得到的结果"cdefgab"。

示例 1：

```
输入: s = "abcdefg", k = 2
输出: "cdefgab"
```

示例 2：

```
输入: s = "lrloseumgh", k = 6
输出: "umghlrlose"
```

解：

```js
/**
 * @param {string} s
 * @param {number} n
 * @return {string}
 */
var reverseLeftWords = function(s, n) {
    let temp=s.slice(0,n);
    s=s.slice(n,s.length);
    return s+temp;
};
```

## 打印从1到最大的n位数

输入数字 n，按顺序打印出从 1 到最大的 n 位十进制数。比如输入 3，则打印出 1、2、3 一直到最大的 3 位数 999。

示例 1:

```
输入: n = 1
输出: [1,2,3,4,5,6,7,8,9]
```

说明：

用返回一个整数列表来代替打印
n 为正整数

解：

```js
/**
 * @param {number} n
 * @return {number[]}
 */
var printNumbers = function(n) {
    let arr = []
    let count = Math.pow(10, n)-1
    for(let i = 1; i<=count;i++){
        arr.push(i)
    }
    return arr
};
```

## 翻转单词顺序

输入一个英文句子，翻转句子中单词的顺序，但单词内字符的顺序不变。为简单起见，标点符号和普通字母一样处理。例如输入字符串"I am a student. "，则输出"student. a am I"。

示例 1：

```
输入: "the sky is blue"
输出: "blue is sky the"
```

示例 2：

```
输入: " hello world! "
输出:"world! hello"
解释: 输入字符串可以在前面或者后面包含多余的空格，但是反转后的字符不能包括。
```

示例 3：

```
输入: "a good  example"
输出:"example good a"
解释: 如果两个单词间有多余的空格，将反转后单词间的空格减少到只含一个。
```

说明：

无空格字符构成一个单词。
输入字符串可以在前面或者后面包含多余的空格，但是反转后的字符不能包括。
如果两个单词间有多余的空格，将反转后单词间的空格减少到只含一个。

解一

```js
/**
 * @param {string} s
 * @return {string}
 */
var reverseWords = function(s) {
    let str = ''
    let i = s.length-1
    let j = i
    while (i>=0){
        while(i >= 0 && s.charAt(i) != ' ') i--
        str= str + s.substring(i+1, j+1) + ' '
        while(i >= 0 && s.charAt(i) == ' ') i--
        j = i
    }
    return str.trim()
};
```

##  0～n-1中缺失的数字

一个长度为n-1的递增排序数组中的所有数字都是唯一的，并且每个数字都在范围0～n-1之内。在范围0～n-1内的n个数字中有且只有一个数字不在该数组中，请找出这个数字。

示例 1:

```
输入: [0,1,3]
输出: 2
```

示例2:

```
输入: [0,1,2,3,4,5,6,7,9]
输出: 8
```

```js
/**
 * @param {number[]} nums
 * @return {number}
 */
var missingNumber = function(nums) {
    let i = 0, j = nums.length - 1
    while(i <= j) {
        let d = Math.floor((j+i)/2)
        if(nums[d] === d){
            i = d + 1
        } else {
            j = d - 1
        }
    }
    return i
};
```

## [整数反转](https://leetcode-cn.com/problems/reverse-integer/)

给你一个 32 位的有符号整数 x ，返回 x 中每位上的数字反转后的结果。

如果反转后整数超过 32 位的有符号整数的范围 [−231,  231 − 1] ，就返回 0

假设环境不允许存储 64 位整数（有符号或无符号）。
 

示例 1：

```
输入：x = 123
输出：321
```

示例 2：

```
输入：x = -123
输出：-321
```

示例 3：

```
输入：x = 120
输出：21
```

示例 4：

```
输入：x = 0
输出：0
```

```js
/**
 * @param {number} x
 * @return {number}
 */
var reverse = function(x) {
    let result = 0;
    while(x !== 0) {
        result = result * 10 + x % 10;
        x = (x / 10) | 0;
    }
    return (result | 0) === result ? result : 0;
};
```

思路：

1. `result * 10 + x % 10` 取出末位 `x % 10`（负数结果还是负数，无需关心正负），拼接到 `result` 中。

2. `x / 10` 去除末位，`| 0` 强制转换为32位有符号整数。

3. 通过 `| 0` 取整，无论正负，只移除小数点部分（正数向下取整，负数向上取整）。

4. `result | 0` 超过32位的整数转换结果不等于自身，可用作溢出判断。

## 回文数

判断一个整数是否是回文数。回文数是指正序（从左向右）和倒序（从右向左）读都是一样的整数。

示例 1:

```
输入: 121
输出: true
```

示例 2:

```
输入: -121
输出: false
解释: 从左向右读, 为 -121 。 从右向左读, 为 121- 。因此它不是一个回文数。
```

示例 3:

```
输入: 10
输出: false
解释: 从右向左读, 为 01 。因此它不是一个回文数。
```

解

```js
/**
 * @param {number} x
 * @return {boolean}
 */
var isPalindrome = function(x) {
    if(x < 0) return false
    let _x = x
    let result = 0
    while(_x){
        result = result*10+_x%10
        _x = (_x/10)|0
    }
    return result === x? true: false
};
```

给定一个只包括 '('，')'，'{'，'}'，'['，']' 的字符串，判断字符串是否有效。

## 有效的括号

有效字符串需满足：

左括号必须用相同类型的右括号闭合。
左括号必须以正确的顺序闭合。
注意空字符串可被认为是有效字符串。

示例 1:

```
输入: "()"
输出: true
```

示例 2:

```
输入: "()[]{}"
输出: true
```

示例 3:

```
输入: "(]"
输出: false
```

示例 4:

```
输入: "([)]"
输出: false
```

示例 5:

```
输入: "{[]}"
输出: true
```

解

```js
/**
 * @param {string} s
 * @return {boolean}
 */
var isValid = function(s) {
    if(s.length < 2) return false
    let stack = []
    for(let i of s){
        if((i == '{' || i == '[' || i == '(')){
            stack.push(i)
        } else if(i === ']'&&stack.pop() !== '['){
            return false
        } else if(i === '}'&&stack.pop() !== '{'){
            return false
        } else if(i === ')'&&stack.pop() !== '('){
            return false
        }
    }
    return stack.length ? false : true
};
```

## 最大子序和

给定一个整数数组 nums ，找到一个具有最大和的连续子数组（子数组最少包含一个元素），返回其最大和。

示例:

```
输入: [-2,1,-3,4,-1,2,1,-5,4]
输出: 6
解释: 连续子数组 [4,-1,2,1] 的和最大，为 6。
```

进阶:

如果你已经实现复杂度为 O(n) 的解法，尝试使用更为精妙的分治法求解

解一：动态规划

```js
/**
 * @param {number[]} nums
 * @return {number}
 */
var maxSubArray = function(nums) {
    let pre = 0, max = nums[0]
    for(let i of nums){
        pre = Math.max(pre+i, i)
        max = Math.max(pre, max)
    }
    return max
};
```

https://leetcode-cn.com/problems/zui-xiao-de-kge-shu-lcof/solution/zui-xiao-de-kge-shu-by-leetcode-solution/

https://github.com/yugef3h/leetcode-cn-js