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
    // 在当有实例上定义一个_computedWatchers属性,保存 conputed Watcher
    var watchers = vm._computedWatchers = Object.create(null);
    // computed properties are just getters during SSR
    var isSSR = isServerRendering();
    // 遍历computed
    for (var key in computed) {
      // 获取computed计算方法
      var userDef = computed[key];
      var getter = typeof userDef === 'function' ? userDef : userDef.get;
      if (getter == null) {
        warn(
          ("Getter is missing for computed property \"" + key + "\"."),
          vm
        );
      }

      if (!isSSR) {
        // 实例化 Watcher
        watchers[key] = new Watcher(
          vm,
          getter || noop,
          noop,
          computedWatcherOptions // { lazy: true }
        );
      }

      // hllComponent-defined computed properties are already defined on the
      // hllComponent prototype. We only need to define computed properties defined
      // at instantiation here.
      if (!(key in vm)) {
        // 如果当前没有计算属性在 data 属性上，执行 defineComputed 方法
        // 配置访问这个属性时要执行就是这个计算方法
        defineComputed(vm, key, userDef);
      } else {
        // 如果当前有计算属性在 data 属性上，就提示错误
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
    expOrFn, // 这个参数是 conputed 对应的计算方法
    cb,     // 空函数
    options // { lazy: true }
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

与 `渲染 Watcher` 和 `watcher Watcher` 不同的是， 此时实例  `Watcher` 时传的第四个参数 `{ lazy: true }` 所以 `options.lazy = true；this.dirty = true` (后面访问 `computed` 时有用) ， 所以`computed Watcher` 并没有执行最后的 `this.get()` 方法。 

执行完之后回到 `initComputed` 中，把当前的 `Watcher` 实例保存到了 `vm._computedWatchers` 中。 之后执行 `defineComputed(vm, key, userDef)` 方法

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
          // 执行计算方法
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

看到这个原来当我们访问 `computed` 上的属性时，是通过 `computedGetter` 方法返回真正的值的; 

并且如果尝试去修改 `computed` 上的属性，将会触发上面的 `set` 中的 `warn` 提示

到此 `compuntd` 的初始化就完成了，接下就是看看当访问 `computed` 时做了什么

## 访问compuntd属性

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

上面代码中根据 `computed key` 从 `this._computedWatchers` 取出对应的 `Watcher`，上文初始化 `computed` 时 `dirty = true` 所以会执行 `watcher.evaluate()` 方法

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

 **注意在执行`pushTarget()`前，`targetStack` 队列中已经存在一个 `render Watcher` 且 `Dep.target` 为 `render Watcher`**

 `pushTarget` 执行两步：

1. 将当前 `Watcher` 添加到 `targetStack` 中，此时 `targetStack` 就存在两个 `Watcher`, 一个是 `render Watcher`， 另一个是 `computed Watcher`。

2. 将当前 `computed Watcher` 添加到全局 `Dep.targer` 中

 然后执行 `this.getter` 方法时就会去执行对应的计算方法，此时就会访问到我们计算方法依赖的 `data` 属性（上文中的  `this.message` 和 `this.name` 属性），然后就会把当前这个 `conputed Watcher` 添加到属性的收集器 `dep` 中。执行完 `value = this.getter.call(vm, vm)` 后，得到计算结果。然后继续往下执行：

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

我们知道每个属性的收集器 `Dep` 收集着  `Watcher`，但其实每个 `Watcher.deps` 属性也保存收集了该 `Watcher` 的 `Dep`, 也就是相互收集了。在当前例子中 `Watcher.deps` 有两个 `Dep`，一个是 `name` 属性的 `Dep`，一个是 `message` 属性的 `Dep`

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

上文分析到此时的 `Dep.target` 为当前组件的 `render Watcher`，因此上面代码就是将当前 `render Watcher` 添加到 `Dep` 中，当然如果当前 `Dep` 已经包含了这个 `Watcher`，将不会重复添加。

以上面例子为例， 因为组件渲染时有用到 `name` 属性（且在 `bind` 访问之前），所以 `name` 属性对应的 `Dep` 已经有了 `render Watcher`，此时就会不重复添加了，而 `message` 属性的 `Dep` 中并没有 `render Watcher` ，所以会添加当前的 `render Watcher`, 那么问题来了既然渲染没有用到这个属性，为什么要添加 `render Watcher` 呢？

## 更新compuntd依赖

按之前 `render Watcher` 和 `watch Watcher` 的更新机制，当依赖的属性更新时，这些 `Watcher` 将被收集到到一个微任务队列中，并且会按 `watcher id` 作为升序排序来触发这些  `Watcher run` 方法

但是 `computed Watcher` 依赖的计算属性更新时并不会将当前的 `conputed Watcher` 添加到微任务队列中，以上面例子为例，当 `this.message = "message_B"` 执行后，将更新 `render Watcher` ，然后在更新组件的时候会访问到 `computed` 属性，此时会重新执行计算函数得到新值。这也就可以理解为什么即使计算依赖的属性没有在渲染中用到也会将 `render Watcher` 添加到 `Dep` 的原因。

**如果 `watch` 中有监听 `computed` 属性时，更新机制又是怎样的呢？**

通过下面这个例子分析一下：

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
      // message:{
        // handler:  function (val) {
          // console.log(val)
          // this.name = val + '_Watch'
        // }
      // },
      name: {
        handler:  function (val) {
          console.log(val)
        }
      },
      bind: {
        handler:  function (val) {
          console.log(val)
          this.name = 'this.name' + val
        }
      }
    },
    computed: {
      bind: function(){
        debugger
        const result = this.message + '__________'
        return result
      }
    },
    mounted(){
      debugger
      console.log('mounted')
      this.message = "message_B"
    },
  })
</script>
```

首先看下初始化 `watch bind` 的时候做了什么事情：

1. 实现一个 `Watcher` 实例

2. 访问 `this.bind` 属性之前将当前 `watch Watcher` 保存到 `targetStack` 栈中，然后全局属性 `Dep.targe` 指向当前 `watch Watcher` 

3. 因为 `this.bind` 是 `computed` 属性，所以会触发下面代码：

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

    得到当前的 `compunted Watcher`, 然后通过 `watcher.evaluate()` 得到计算结果，注意 `evaluate` 的代码内容：
  
    ```js
    Watcher.prototype.evaluate = function evaluate () {
      this.value = this.get();
      this.dirty = false;
    };
    ```
  
    通过执行 `compunted Watcher` 的 `get` 方法得到 `computed` 结果的同时将当前 `compunted Watcher` 保存到 `targetStack` 栈中，然后全局属性 `Dep.targe` 指向当前 `compunted Watcher`
  
    之后还会将 `dirty` 设为 `false`（防止后面重复计算）
  
4. 注意计算的时候会访问 `this.message` 属性，并且此时的全局  `Dep.target` 为当前 `compunted Watcher`，所以 `compunted Watcher` 会被 `message` 属性收集

5. `compunted Watcher` 收集完之后，当前 `compunted Watcher` 会被 `targetStack` 推出，将 `Dep.target` 指向 `targetStack` 最后一个 `Watcher`，也就是 `watch Watcher` 

6. 执行完 `watcher.evaluate()`，执行 `watcher.depend();`,上文分析过这个方法的作用就是遍历当前 `Watcher` 的 `deps` 属性，收集当前的 `Dep.target` 保存的 `Watcher`。 也就意味着这里的 `watch Watcher` 也会被 `meaaage` 属性收集

上面例子中当执行 `this.message = "message_B"` 时，执行的步骤如下：

- 遍历 `message` 收集的 `Watcher` ，并执行对应的 `update` 方法，首先执行的是 `watch bind Watcher`, 执行对应的 `run` 方法

```js
  Watcher.prototype.run = function run () {
    if (this.active) {
      var value = this.get();
      if (
        value !== this.value ||
        // Deep watchers and watchers on Object/Arrays should fire even
        // when the value is the same, because the value may
        // have mutated.
        isObject(value) ||
        this.deep
      ) {
        // set new value
        var oldValue = this.value;
        this.value = value;
        if (this.user) {
          try {
            this.cb.call(this.vm, value, oldValue);
          } catch (e) {
            handleError(e, this.vm, ("callback for watcher \"" + (this.expression) + "\""));
          }
        } else {
          this.cb.call(this.vm, value, oldValue);
        }
      }
    }
  };
```

- 先执行 `var value = this.get();` 访问属性 `bind`， 此时会执行对应在的 `computed bind Watcher`，得到 `computed` 结果的同时也会当前的 `computed Watcher` 的 `dirty` 设为 `false`

- 上一步执行完之后运行 `this.cb.call(this.vm, value, oldValue)` 执行对应的  `watch Handler`

- 修改 `this.name = 'this.name' + val`，触发对应的 `watch name handle`

- 最后触发 `render Watche` , 此时访问 `this.bind` ，将执行以下语句：

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

 注意此时 `watcher.dirty` 为 `false`，所以不会重复执行 `computed` 请问，而是直接返回 `watcher.value` ，也就是之前得到的值 

 # 总结

 通过 `Object.defineProperty(target, key, sharedPropertyDefinition);` 方法，当前访问 `compunted` 上的属性时，将被代理到这个 `compunted` 属性对应的 `Watcher` 上，然后通过 ` watcher.evaluate()` 执行对应原 `compunted` 计算方法求值
 
 `conputed` 依赖的属性会收集 `render Watcher`，所以这些依赖的属性更新时会重新渲染组件，在渲染组件的过程中会访问到 `computed` 属性，再计算对应的方法返回得到值