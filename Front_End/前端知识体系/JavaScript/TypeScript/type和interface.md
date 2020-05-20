# Typescript 中的 interface 和 type 

`interface`和`type`都可以描述一个对象的类型

```
// interface
interface User {
  name: string
  age: number
}

interface SetUser {
  (name: string, age: number): void;
}

// type
type User = {
  name: string
  age: number
};

type SetUser = (name: string, age: number)=> void;

```

## 都允许拓展（extends）

`interface` 和 `type` 都可以拓展，并且两者并不是相互独立的，也就是说 `interface` 可以 `extends type`, 
`type `也可以 `extends interface `

```
//interface extends interface
interface Name { 
  name: string; 
}
interface User extends Name { 
  age: number; 
}

// type extends type
type Name = { 
  name: string; 
}
type User = Name & { age: number  };

// interface extends type
type Name = { 
  name: string; 
}
interface User extends Name { 
  age: number; 
}

// type extends interface
interface Name { 
  name: string; 
}
type User = Name & { 
  age: number; 
}

```

# 不同点

- type 可以声明基本类型别名
 
  ```
  // 基本类型别名
  type Name = string
  ```
  
- 重复声明`type`     会报错
  
- 重复声明同名`interface` 能够合并

  ```
  interface User {
    name: string
    age: number
  }
  
  interface User {
    sex: string
  }
  
  /*
  User 接口为 {
    name: string
    age: number
    sex: string 
  }
  */
  ```
  
## 重复声明interface
 
- 定义两个同名接口,具有不同属性时，两个`interface`会合并
 
   ```
   interface A {
       x: number
   }
   interface A {
       y: number
   }
   ```
   
- 在A中重复定义成员`y`,但类型相同,不报错:

  ```
  interface A {
      x: number
      y: number	// 在A中重复定义成员y,但类型相同
  }
  interface A {
      y: number
  }
  
  let a: A = {
      x: 1,
      y: 2
  }
  ```
  
- 在A中重复定义成员y,但类型不同,报错:
  
  ```
  interface A {
      x: number
      y: string	// 在A中重复定义成员y,但类型不同
  }
  interface A {
      y: number
  }
  
  let a: A = {
      x: 1,
      y: 2
  }

  ```

- 接口的成员是函数，这个函数可以被重复声明，每一个函数都会被声明为一个函数重载

在A接口中定义函数:

```
interface A {
    x: number
    foo(bar: number):number
}
interface A {
    y: number
    foo(bar: string):string
    foo(bar: number[]):number[]
}

```  

实现时,需要指定更为宽泛的类型

```
let a: A = {
    x: 1,
    y: 2,
    foo(bar: any) {
        return bar
    }
}
```

**函数重载时,我们提到要注意重载函数的声明顺序， 因为函数重载会使用从重载列表中匹配到第一个。**

### 函数重载时,我们提到要注意重载函数的声明顺序， 因为函数重载会使用从重载列表中匹配到第一个。

- 接口之内,从上到下

  ```
  // 1,接口之间,从上到下
  interface A {
      y: number
      foo(bar: string):string         // 1
      foo(bar: number[]):number[]     // 2
  }
  ```
  
- 接口之间,后面的接口在前
  
  ```
  interface A {
      x: number
      foo(bar: number):number         // 3
  }
  interface A {
      y: number
      foo(bar: string):string         // 1
      foo(bar: number[]):number[]     // 2
  }

  ```
  
- 如果函数的参数是字符串字面量,会被提升到函数声明的最顶端

  ```
  // 3,例外,如果函数的参数是字符串字面量,会被提升到函数声明的最顶端
  interface A {
      x: number
      foo(bar: number):number         // 5
      foo(bar: 'a'):number            // 2
  }
  interface A {
      y: number
      foo(bar: string):string         // 3
      foo(bar: number[]):number[]     // 4
      foo(bar: 'b'):number            // 1
  }
  ```
  
# 命名空间的声明合并

在命名空间中,导出的成员是不能重复定义的

```
// 命名空间
namespace Shape {
    export function square(x: number){
        return x * x
    }
}
//
namespace Shape {
    const pi = Math.PI
    // 全局可见
    export function cricle(r: number){
        return pi * r ** 2
    }
    export function square(x: number){	// 重复定义,会报错
        return x * x
    }
}

```

## 命名空间和函数的声明合并

```
// 命名空间和函数的声明合并
function Lib() {}
namespace Lib {
    export let version = '1.0'
}
console.log(Lib.version)	// 1.0
// 这就相当于先声明一个函数,再添加属性 
```

## 命名空间和类的声明合并

```
// 命名空间和类的声明合并
class C {}
namespace C {
    export let state = 1
}
console.log(C.state)    // 1
// 这就相当于给类添加静态属性
```

## 命名空间和枚举的声明合并

```
// 命名空间和枚举的声明合并
enum Color {
    Red,
    Yellow,
    Bule
}
namespace Color {
    export function mix() {}
}
// 相当于为枚举类型添加了方法
```

### 注意点

- 命名空间在与函数,类进行声明合并时,一定要放在函数,类的定义后面

- 枚举和命名空间的位置没有要求