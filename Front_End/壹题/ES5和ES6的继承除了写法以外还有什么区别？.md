ES5使用函数来实现继承，ES6使用类来实现继承

## 声明提升

函数声明存在变量提升，可以先使用后定义

类声明必须先声明才能使用

```
const bar = new Bar(); // it's ok
function Bar() {
  this.bar = 42;
}

const foo = new Foo(); // ReferenceError: Foo is not defined
class Foo {
  constructor() {
    this.foo = 42;
  }
}
```