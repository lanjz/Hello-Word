> https://juejin.im/post/5d1a0f21f265da1bb13f49fd

# 什么是loC

LOC（Inversion of Controller）即控制反转。主要是用于降低模块之间的耦合度。传统应用程序
模块（ModuleC）都是直接引入另一个的模块（ModuleA）使用，这样就导致模块与模块之间发生了耦合。如果将需要引用的模块都放在一个容器中，
由这个容器来管理模块。ModuleC通过容器来引入需要的模块（ModuleA），这样模块的控制就全交给了容器，模块与模块之间就是松散耦合了，方便测试与功能利用，
整个程序的架构体系也会变得非常灵活。这个容器就是LOC

正常方式的引用模块是通过直接引用：

```javascript
import { ModuleA } from './module-A';
import { ModuleB } from './module-B';

class ModuleC {
  constructor() {
    this.a = new ModuleA();
    this.b = new ModuleB();
  }
}

```

上面的代码可以看出模块`ModuleC`依赖模块`ModuleA`和`ModuleB`，产生了模块耦合。为了解决模块间的耦合，LOC概念就产生了

我们通过一个容器来管理我们的模块，这样模块之间的耦合性就降低了（下面这个例子只是模仿 IOC 的过程，Container 需要另外实现）：

```javascript
// container.js
import { ModuleA } from './module-A';
import { ModuleB } from './module-B';

// Container是我们假设的一个模块容器
export const container = new Container();
container.bindModule(ModuleA);
container.bindModule(ModuleB);

```

这时如果ModuleC中的引用方式也变更了：

```javascript
// ModuleC.js
import { container } from './container';
class ModuleC {
  constructor() {
    this.a = container.getModule('ModuleA');
    this.b = container.getModule('ModuleB');
  }
}
```

这个

# 什么是DI

DI(Dependency Injection)，即依赖注入。依赖注入是控制反转最常见的一种应用方式，即通过控制反转，在对象创建的时候，自动注入一些依赖对象。

在具体项目中，我们是一般通过使用装饰器`@Injectable()`来实现依赖注入的。

## 装饰器`@Injectable()`

> [ES6 修饰器](http://caibaojian.com/es6/decorator.html)

TypeScript中的装饰器是基于ECMAScript标准的，而装饰器提案仍处于stage2，存在很多不稳定因素，而且API在未来可能会出现破坏性的更改，
所以该特性在TS中仍是一个实验性特性，默认是不启用的（后面将会介绍如何配置开启）。


## 类的修饰

修饰器（Decorator）是一个函数，用来修改类的行为。这是ES7的一个提案，目前Babel转码器已经支持。

修饰器对类的行为的改变，是代码编译时发生的，而不是在运行时。这意味着，修饰器能在编译阶段运行代码。

```javascript
function testable(target) {
  target.isTestable = true;
}

@testable
class MyTestableClass {}

console.log(MyTestableClass.isTestable) // true
```

上面代码中，@testable就是一个修饰器。它修改了MyTestableClass这个类的行为，为它加上了静态属性isTestable。

基本上，修饰器的行为就是下面这样。

```javascript
@decorator
class A {}

// 等同于

class A {}
A = decorator(A) || A;
```

也就是说，修饰器本质就是编译时执行的函数。

修饰器函数的第一个参数，就是所要修饰的目标类。

## TypeScript中的元数据（Metadata）

因为Decorators是实验性特性，所以如果想要支持装饰器功能，需要在tsconfig.json中添加以下配置。

```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

使用元数据需要安装并引入`reflect-metadata`这个库。这样在编译后的 js 文件中，就可以通过元数据获取类型信息。

`import 'reflect-metadata';`

你们应该会比较好奇，运行时JS是如何获取类型信息的呢？请紧张地继续往下看：
