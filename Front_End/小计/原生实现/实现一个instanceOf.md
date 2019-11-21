`instanseOf`的作用：

instanceof运算符用于测试构造函数的prototype属性是否出现在对象的原型链中的任何位置

```
   function myIntanceOf(left, right) {
        let proto = left.__proto__
        const prototype = right.prototype
        while (true) {
        	if(proto === null) return false
        	if(proto === prototype) return true
            proto = proto.__proto__
        }
	}
	var a = 134
    console.log(myIntanceOf(a, Number)) // true
    console.log(myIntanceOf(a, Object)) // true
```
