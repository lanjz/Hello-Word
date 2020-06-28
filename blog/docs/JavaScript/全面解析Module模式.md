# 全面解析Module模式

Module模式的基本特征:

1. 模块化，可重用

2. 封装了变量和`function`，和全局的`namaspace`不接触，松耦合

3. 只暴露可用`public`的方法他属性，其它私有方法和属性全部隐藏

一个简单的`Module`实现

```js
var Calculator = function (eq) {
    //这里可以声明私有成员

    var eqCtl = document.getElementById(eq);

    return {
        // 暴露公开的成员
        add: function (x, y) {
            var val = x + y;
            eqCtl.innerHTML = val;
        }
    };
};
```

我们可以通过如下的方式来调用

```js
var calculator = new Calculator('eq');
calculator.add(2, 2);
```

可能看到了，每次用的时候都要`new`一下，也就是说每个实例在内存里都是一份`copy`，如果你不需要传参数或者没有一些特殊苛刻的要求的话，我们可以在最后一个`}`后面加上一个括号，来达到自执行的目的，这样该实例在内存中只会存在一份`copy`

## 匿名闭包

通过匿名闭包函数内部的代码一直存在于闭包内，在整个运行周期内，该闭包都保证了内部的代码处于私有状态

```js
(function () {
    // ... 所有的变量和function都在这里声明，并且作用域也只能在这个匿名闭包里
    // ...但是这里的代码依然可以访问外部全局的对象
}());
```

匿名函数后面的括号，这是JavaScript语言所要求的，因为如果你不声明的话，JavaScript解释器默认是声明一个`function`函数，有括号，就是创建一个函数表达式，也就是自执行，用的时候不用和上面那样在`new`了，当然你也可以这样来声明：

```js
(function () {/* 内部代码 */})();
```

**引用全局变量**

如果模块依赖外部的全局变量，我们可以将全局变量当成一个参数传入到匿名函数然后使用

```js
(function ($) {
    // 这里，我们的代码就可以使用全局的jQuery对象了，YAHOO也是一样
} (jQuery));
```

不过，有时候可能不仅仅要使用全局变量，而是也想声明全局变量，如何做呢？我们可以通过匿名函数的返回值来返回这个全局变量，这也就是一个基本的Module模式，来看一个完整的代码：

```js
var blogModule = (function () {
    var my = {}, privateName = "博客园";

    function privateAddTopic(data) {
        // 这里是内部处理代码
    }

    my.Name = privateName;
    my.AddTopic = function (data) {
        privateAddTopic(data);
    };

    return my;
} ());
```

上面的代码声明了一个全局变量`blogModule`，并且带有2个可访问的属性：`blogModule.AddTopic`和`blogModule.Name`，除此之外，其它代码都在匿名函数的闭包里保持着私有状态

## 高级用法

**拆分模块**

Module模式的一个限制就是所有的代码都要写在一个文件，但是在一些大型项目里，将一个功能分离成多个文件是非常重要的，因为可以多人合作易于开发

实现思路就是在模块内引入自身模块

```js
var blogModule = (function (my) {
    my.AddPhoto = function () {
        //添加内部代码  
    };
    return my;
} (blogModule))
```

**松耦合扩展**

上面的代码尽管可以执行，但是必须先声明`blogModule`，然后再执行上面的扩展代码，也就是说步骤不能乱，怎么解决这个问题呢？那就是在引入使用参数的加添默认值

```js
var blogModule = (function (my) {

    // 添加一些功能   
    
    return my;
} (blogModule || {}));  
```

**重载方法**

```js
var blogModule = (function (my) {
    var oldAddPhotoMethod = my.AddPhoto;

    my.AddPhoto = function () {
        // 重载方法，依然可通过oldAddPhotoMethod调用旧的方法
    };

    return my;
} (blogModule))
```

通过这种方式，我们达到了重载的目的，当然如果你想在继续在内部使用原有的属性，你可以调用`oldAddPhotoMethod`来用

**克隆与继承**

```js
var blogModule = (function (old) {
    var my = {},
        key;

    for (key in old) {
        if (old.hasOwnProperty(key)) {
            my[key] = old[key];
        }
    }

    var oldAddPhotoMethod = old.AddPhoto;
    my.AddPhoto = function () {
        // 克隆以后，进行了重写，当然也可以继续调用oldAddPhotoMethod
    };

    return my;
} (blogModule))
```

注意上面只是使用了浅铐钡，如果要深铐钡我们得用递归，但递归对`function`函数的赋值也不好用，所以我们在递归的时候`eval`相应的`function`

**跨文件共享私有对象**

如果一个 `module` 分割到多个文件的话,如何让多个文件共离一些静态属性

```js
var blogModule = (function (my) {
    var _private = my._private = my._private || {},
        
        _seal = my._seal = my._seal || function () {
            delete my._private;
            delete my._seal;
            delete my._unseal;
            
        },
        
        _unseal = my._unseal = my._unseal || function () {
            my._private = _private;
            my._seal = _seal;
            my._unseal = _unseal;
        };
        
    return my;
} (blogModule || {}));
```

上面设置了一个`_private`共享属性，一旦这个模块加载结束，应调用 `blogModule._seal()`"上锁"，这就会阻止外部读取内部的`_private`。如果这个模块需要再次扩展，调用`_unseal()` ”开锁”，然后再加载新文件。加载后再次调用` _seal()`”上锁”

## 子模块

最后一个也是最简单的使用方式，那就是创建子模块

```JS
blogModule.CommentSubModule = (function () {
    var my = {};
    // ...

    return my;
} ())
```

子模块也具有一般模块所有的高级使用方式，也就是说你可以对任意子模块再次使用上面的一些应用方法

## 总结

Module模式优点：效率高，代码少，加载速度快

上面的大部分方式都可以互相组合使用的，一般来说如果要设计系统，可能会用到松耦合扩展，私有状态和子模块这样的方式。

使用松耦合扩展允许并行加载，这更可以提升下载速度。不过初始化时间可能要慢一些，但是为了使用好的模式，这是值得的