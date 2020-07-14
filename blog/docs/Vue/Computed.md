# Computed

此下面例子为例：

```js
<div id="app">
  {{ name }}<br/>
  {{bind}}
</div>
<script>
  var app = new Vue({
    el: '#app',
    data: {
      message: 'AA',
      name: '哈哈'
    },
     watch: {
      message:{
        handler:  function (val) {
          console.log(val)
          this.name = val + '_Watch'
        }
      },
      name: {
        handler:  function (val) {
          console.log(val)
        }
      }
    },
    computed: {
      bind: function(){
        const result = this.message + '__________' + this.name
        return result
      }
    },
    mounted(){
      console.log('mounted')
      this.message = "message_B"
    },
  })
</script>
```

## 源码分析

源码中处理 `computed` 属性的地方：`initState(vn) =>  initComputed(vm, opts.computed)`

```js
  function initComputed (vm, computed) {
    // $flow-disable-line
    var watchers = vm._computedWatchers = Object.create(null);
    // computed properties are just getters during SSR
    var isSSR = isServerRendering();

    for (var key in computed) {
      var userDef = computed[key];
      var getter = typeof userDef === 'function' ? userDef : userDef.get;
      if (getter == null) {
        warn(
          ("Getter is missing for computed property \"" + key + "\"."),
          vm
        );
      }

      if (!isSSR) {
        // create internal watcher for the computed property.
        watchers[key] = new Watcher(
          vm,
          getter || noop,
          noop,
          computedWatcherOptions
        );
      }

      // component-defined computed properties are already defined on the
      // component prototype. We only need to define computed properties defined
      // at instantiation here.
      if (!(key in vm)) {
        defineComputed(vm, key, userDef);
      } else {
        if (key in vm.$data) {
          warn(("The computed property \"" + key + "\" is already defined in data."), vm);
        } else if (vm.$options.props && key in vm.$options.props) {
          warn(("The computed property \"" + key + "\" is already defined as a prop."), vm);
        }
      }
    }
  }
```

在 `initComputed` 也实例化了一个 `Watcher` , 此时传进去参数如下：

- `vm`：当前 `vue` 实例 

- `getter || noop`: 当前 `compunted` 的 `get` 方法，也就是应的计算函数

- `noop`：空函数

- `computedWatcherOptions`: ` { lazy: true }`

回顾一个 `Watcher` 方法

```js
  var Watcher = function Watcher (
    vm,
    expOrFn, // 这个参数是 watch 要监听的属性名
    cb,     // 对应 watch 的 handler
  ) {
    this.vm = vm;
    if (isRenderWatcher) {
      vm._watcher = this;
    }
    vm._watchers.push(this);
    // options
    if (options) {
      this.deep = !!options.deep;
      this.user = !!options.user;
      this.lazy = !!options.lazy;
      this.sync = !!options.sync;
      this.before = options.before;
    } else {
      this.deep = this.user = this.lazy = this.sync = false;
    }
    this.cb = cb;
    this.id = ++uid$2; // uid for batching
    this.active = true;
    this.dirty = this.lazy; // for lazy watchers
    this.deps = [];
    this.newDeps = [];
    this.depIds = new _Set();
    this.newDepIds = new _Set();
    this.expression = expOrFn.toString();
    // parse expression for getter
    if (typeof expOrFn === 'function') {
      this.getter = expOrFn;
    } else {
      this.getter = parsePath(expOrFn);
      if (!this.getter) {
        this.getter = noop;
        warn(
          "Failed watching path: \"" + expOrFn + "\" " +
          'Watcher only accepts simple dot-delimited paths. ' +
          'For full control, use a function instead.',
          vm
        );
      }
    }
    this.value = this.lazy
      ? undefined
      : this.get();
  };
```

在 `Watcher` 构建函数内生成当前的 `Watcher` 实例， 与 `渲染 Watcher` 和 `watcher Watcher` 不同的是， `computed Watcher` 并没有执行最后的 `this.get()` 方法。 所以回到 `initComputed` 中，把当前的 `Watcher` 实例保存到了 `vm._computedWatchers` 中。 之后执行 `defineComputed(vm, key, userDef)` 方法

```js

  function defineComputed (
    target,
    key,
    userDef
  ) {
    var shouldCache = !isServerRendering();
    if (typeof userDef === 'function') {
      sharedPropertyDefinition.get = shouldCache
        ? createComputedGetter(key)
        : createGetterInvoker(userDef);
      sharedPropertyDefinition.set = noop;
    } else {
      sharedPropertyDefinition.get = userDef.get
        ? shouldCache && userDef.cache !== false
          ? createComputedGetter(key)
          : createGetterInvoker(userDef.get)
        : noop;
      sharedPropertyDefinition.set = userDef.set || noop;
    }
    if (sharedPropertyDefinition.set === noop) {
      sharedPropertyDefinition.set = function () {
        warn(
          ("Computed property \"" + key + "\" was assigned to but it has no setter."),
          this
        );
      };
    }
    Object.defineProperty(target, key, sharedPropertyDefinition);
  }
```

如果不是服务端渲染则执行 `sharedPropertyDefinition.get = shouldCache; createComputedGetter(key)`，`createComputedGetter` 的定义如下：

```js
  function createComputedGetter (key) {
    return function computedGetter () {
      var watcher = this._computedWatchers && this._computedWatchers[key];
      if (watcher) {
        if (watcher.dirty) {
          watcher.evaluate();
        }
        if (Dep.target) {
          watcher.depend();
        }
        return watcher.value
      }
    }
  }
```

此时只是将 `computedGetter` 方法保存到 `sharedPropertyDefinition.set` 中，之后再设置 `sharedPropertyDefinition.set` 方法

```js
   sharedPropertyDefinition.set = function () {
        warn(
          ("Computed property \"" + key + "\" was assigned to but it has no setter."),
          this
        );
      };
```

最后通过 `Object.defineProperty` 方法设置属性的访问规则

看到这个原来当我们访问 `computed` 上的属性时，是通过 `computedGetter` 方法返回真正的值的;同时当前尝试去修改 `computed` 上的属性，将会触发上面的 `set` 中的 `warn`

到此 `compuntd` 的初始化就完成了，接下就是看看当访问 `computed` 时做了什么

### 访问compuntd属性

假设当前组件进入渲染阶段（注意：进入渲染阶段时，执行的是`redner Watcher`，并且在渲染完成前，这个 `redner Watcher` 一直存在于全局属性 `Dep.target` 中），此时如果有用到 `computed` 属性并且在访问当前 `compuntd` 属性时，将会执行下面代码块：

```js
  function createComputedGetter (key) {
    return function computedGetter () {
      var watcher = this._computedWatchers && this._computedWatchers[key];
      if (watcher) {
        if (watcher.dirty) {
          watcher.evaluate();
        }
        if (Dep.target) {
          watcher.depend();
        }
        return watcher.value
      }
    }
  }
```

从 `this._computedWatchers` 取应保存的 `Watcher`，并执行 `watcher.evaluate()` 方法

```js
  Watcher.prototype.evaluate = function evaluate () {
    this.value = this.get();
    this.dirty = false;
  };
// Watcher.prototype.get
Watcher.prototype.get = function get () {
    pushTarget(this);
    var value;
    var vm = this.vm;
    try {
      value = this.getter.call(vm, vm);
    } catch (e) {
      if (this.user) {
        handleError(e, vm, ("getter for watcher \"" + (this.expression) + "\""));
      } else {
        throw e
      }
    } finally {
      // "touch" every property so they are all tracked as
      // dependencies for deep watching
      if (this.deep) {
        traverse(value);
      }
      popTarget();
      this.cleanupDeps();
    }
    return value
  };
```

 `watcher.evaluate()` 方法就会执行 `this.get()` 方法，首先是 `pushTarget(this)`

 ```js
 function pushTarget (target) {
    targetStack.push(target);
    Dep.target = target;
  }
 ```

 **注意在执行`pushTarget()`前，`targetStack` 变量中已经存在一个 `render Watcher`且 `Dep.target` 为 `render Watcher`**

 `pushTarget` 执行两步：

1. 将当前 `Watcher` 添加到 `targetStack` 中，此时 `targetStack` 就存在两个 `Watcher`, 一个是 `render Watcher`， 另一个是 `computed Watcher`。

2. 将当前 `computed Watcher` 添加到全局 `Dep.targer` 中

 然后执行 `this.getter` 方法时就会去执行对应的计算方法，此时就会访问到我们计算方法依赖的 `data` 属性（上文中的  `this.message` 和 `this.name` 属性），然后就会把当前这个 `conputed Watcher` 添加到属性的收集器 `dep` 中。执行完 `value = this.getter.call(vm, vm);` 后，得到计算结果。然后继续往下执行：

 ```js
popTarget();
this.cleanupDeps();

// popTarget();
  function popTarget () {
    targetStack.pop();
    Dep.target = targetStack[targetStack.length - 1];
  }
 ```

 上面的代码也是做两个事：
 
 1. 首先移出 `targetStack` 的最后一个元素，也就是当前这个 `computed Watcher`，移出后 `targetStack` 中还剩下 `render Watcher`
 
 2. 并将 `targetStack` 最后一个 `Watcher` 保存全局属性 `Dep.target` 中，也就是 `render Watcher`

 可以看到 `targetStack` 是一个栈式的存储结构
 
 执行完 `watcher.evaluate();` 方法后回到 `createComputedGetter` 方法中，继续往下执行

```js
 if (Dep.target) {
    watcher.depend();
}
// Watcher.prototype.depend
  Watcher.prototype.depend = function depend () {
    var i = this.deps.length;
    while (i--) {
      this.deps[i].depend();
    }
  };
```

我们知道每个属性的 收集器 `Dep` 收集着  `Watcher`，但其实每个 `Watcher.deps` 属性也保存收集了该 `Watcher` 的 `Dep`, 也就是相互收集了。在当前例子中 `Watcher.deps` 有两个 `Dep`，一个是 `name` 属性的 `Dep`，一个是 `message` 属性的 `Dep`

上面遍历 `deps`， 执行每个 `Dep` 的 `depend()` 方法

```js
 Dep.prototype.depend = function depend () {
    if (Dep.target) {
      Dep.target.addDep(this);
    }
  };
//  Watcher.prototype.addDep
  Watcher.prototype.addDep = function addDep (dep) {
    var id = dep.id;
    if (!this.newDepIds.has(id)) {
      this.newDepIds.add(id);
      this.newDeps.push(dep);
      if (!this.depIds.has(id)) {
        dep.addSub(this);
      }
    }
  }
```

此时的 `Dep.target` 为当前组件的 `render Watcher`，上面代码就是将当前  `render Watcher` 添加到 `Dep` 中,i 当然如果当前 `Dep` 已经包含了这个 `Watcher`，将不会重复添加。

以上面例子为例， 因为组件渲染时有用到 `name` 属性（且在 `bind` 访问之前），所以  `name` 属性对应的 `Dep` 已经有了 `render Watcher`，此时就会不重得添了，而 `message` 属性的 `Dep` 中并没有 `render Watcher` ，所以会添加当前的 `render Watcher`, 那么问题来了既然渲染没有用到这个属性，为什么要添加 `render Watcher` 呢？

## 更新compuntd依赖

