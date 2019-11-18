## new做了什么

1. 创建一个新对象

2. 将`this`指向这个新对象

3. 将创建的对象的原型指向构造函数的原型

4. 返回一个对象

- 新对象具有构造函数的所有属性和方法

```javascript
function _New(fn, ...args){
	const obj = Object.create(fn.prototype)  // 完成了步骤1、2
	const ret = fn.apply(obj, args)
    return ret instanceof Object ? ret : obj // 感觉可有可无
}
```

## 补充

### Object.create()

`Object.create()`方法创建一个新对象，使用现有的对象来提供新创建的对象的__proto__

```javascript
const person = {
  isHuman: false,
  printIntroduction: function () {
    console.log(`My name is ${this.name}. Am I human? ${this.isHuman}`);
  }
};

const me = Object.create(person);

me.name = "Matthew"; // "name" is a property set on "me", but not on "person"
me.isHuman = true; // inherited properties can be overwritten

me.printIntroduction(); // My name is Matthew. Am I human? tru
```
### instanceof 

`instanceof`运算符用于检测构造函数的 prototype 属性是否出现在某个实例对象的原型链上。
