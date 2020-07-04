# Watch

Watch 的使用例子：

```js
 watch: {
    c: {
      handler: function (val, oldVal) { /* ... */ },
    },
  }
```

之前的响应式原理有说过，Vue 中的响应式是数据层变化后自动触发的更新。其原理是每个 `data` 属性都有一个容器 `dep` 去收集一个 `Watcher`， 这个 `Watcher` 是一个包含的渲染组件的方法的实例。其实这里的 `watch` 也是同理，`watch` 监听的每个属性都有对应的一个 `handler` 方法，比如上面例子的就是监听属性 `c` 的变化，如果 `c` 发生了变化就执行 `handler` 方法。在Vue中其它原理跟响应式是一样的

## 源码分析

先看下源码中是如果处理 `watch` 属性的：`initState(vn) =>  initWatch(vm, opts.watch)`

```js
// initWatch
function initWatch (vm, watch) {
  for (var key in watch) {
    var handler = watch[key];
    if (Array.isArray(handler)) {
      for (var i = 0; i < handler.length; i++) {
        createWatcher(vm, key, handler[i]);
      }
    } else {
      createWatcher(vm, key, handler);
    }
  }
}
 // createWatcher
function createWatcher (
  vm,
  expOrFn,
  handler,
  options
) {
  if (isPlainObject(handler)) {
    options = handler;
    handler = handler.handler;
  }
  if (typeof handler === 'string') {
    handler = vm[handler];
  }
  return vm.$watch(expOrFn, handler, options)
}

```

`initWatch` 会遍历所有的 `watch`, 并执行 `createWatcher(vm, key, handler)`, 然后再执行 `vm.$watch(expOrFn, handler, options)`,这里参数表示如下：

- `expOrFn`: 监测的属性名

- `handler`: 监测的属性名对应的 `handler`

重点看下 `vm.$watch` 的定义：

```js
Vue.prototype.$watch = function (
    expOrFn,
    cb,
    options
  ) {
    var vm = this;
    if (isPlainObject(cb)) {
      return createWatcher(vm, expOrFn, cb, options)
    }
    options = options || {};
    options.user = true;
    var watcher = new Watcher(vm, expOrFn, cb, options);
    if (options.immediate) {
      try {
        cb.call(vm, watcher.value);
      } catch (error) {
        handleError(error, vm, ("callback for immediate watcher \"" + (watcher.expression) + "\""));
      }
    }
    return function unwatchFn () {
      watcher.teardown();
    }
  };
}
```

跟响应式原理一样，在 `vm.$watch` 中也实例化了一个 `Watcher` ，分析下这个  `Watcher` 跟渲染时的  `Watcher` 有什么不同：

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

要注意此时传进来的参数：

- `expOrFn`: `watch` 要监听的属性名

-  `cb`:  `watch` 的属名性名的 `handler`

在执行 `Watcher` 构造方法时重点代码是以下几行

```js
this.expression = expOrFn.toString();
// parse expression for getter
if (typeof expOrFn === 'function') {
  this.getter = expOrFn;
} else {
  this.getter = parsePath(expOrFn);
}
this.value = this.lazy
  ? undefined
  : this.get();
```

`expOrFn` 此时是字符串所以走的代码是 `this.getter = parsePath(expOrFn)`, 这里先简单介绍下 `parsePath` 方法就是获取属性名对应值的方法

```js
function parsePath (path) {
  if (bailRE.test(path)) {
    return
  }
  var segments = path.split('.'); // 处理监测的是一个对象属性名的情况，比如 `obj.a: { handler: function(){}}`
  return function (obj) {
    for (var i = 0; i < segments.length; i++) {
      if (!obj) { return }
      obj = obj[segments[i]];
    }
    return obj
  }
}
```

> 在响应原理中实例的 `Watcher` 时，`expOrFn` 是一个渲组组件的 `updateComponents()` 函数

之后执行 `get()` 方法:

```js
 /**
   * Evaluate the getter, and re-collect dependencies.
   */
  Watcher.prototype.get = function get () {
    pushTarget(this); // 将当前的 Watcher 保存到 `Dep.target` 全局属性中
    var value;
    var vm = this.vm;
    try {
      value = this.getter.call(vm, vm); // 此时
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
      debugger
      popTarget();
      this.cleanupDeps();
    }
    return value
  };
```

上面的 `get` 主要的事情有：

- 执行 `pushTarget(this)`: 将当前的 Watcher 保存到 `Dep.target` 全局属性中, 方便被依赖的属性收集

- 执行`value = this.getter.call(vm, vm)`: 此时的 `this.getter` 是上文中 `parsePath(expOrFn)` 的返回值， 这里执行完之后就是得到属性对应的值 

  ```js
  data(){
    message: 007,
  },
  watch: {
    message: {
      handler: function(){
        console.log('message变了！')
      }
    }
  }
  // value = this.getter.call(vm, vm) 执行之后，value就是 007
  ```
  
- 要注意了 `this.getter` 是返回 `message` 对应的值，就是意味着要读取 `data` 属性， 此时就是会被  `Object.definedProperty()` 的 `get` 劫持，然后就是把当前保存在全局 `Dep.target` 属性中的当前这个 `Watcher` 实例保存到容器 `dep` 中， 完成当前属性（`message`）对这个 `Watcher` 的收集
