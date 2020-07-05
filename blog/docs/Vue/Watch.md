# Watch

Watch 的使用例子：

```js
watch: {
  c: {
    handler: function (val, oldVal) { /* ... */ },
  },
}
```

回顾一下响应式原理：Vue 中的响应式是指数据层的变化能自动触发视图的更新。其原理是每个 `data` 属性都有一个容器 `dep` 去收集一个 `Watcher`， 这个 `Watcher` 是一个包含了渲染组件的方法的实例。每次数据的变化都能触发这些收集到的 `Watcher`， 进而实现视图的更新

这里的 `watch` 也是同理，`watch` 监听的每个属性都有对应的一个 `handler` 方法，这个 `handler` 方法跟上面的响应式原理一样也会被一个  `Watcher` 包装并被监听的属性所收集。接下从源码角度分析一下实现过程

## 源码分析

源码中处理 `watch` 属性的地方：`initState(vn) =>  initWatch(vm, opts.watch)`

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

跟响应式原理一样，在 `vm.$watch` 中也实例化了一个 `Watcher` ，分析下此时的这个  `Watcher` 构造函数做了啥：

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
  var segments = path.split('.'); // 处理监测属性是一个对象属性的情况，比如 `obj.a: { handler: function(){}}`
  return function (obj) {
    for (var i = 0; i < segments.length; i++) {
      if (!obj) { return }
      obj = obj[segments[i]];
    }
    return obj
  }
}
```

> 在响应原理中实例的 `Watcher` 时，`expOrFn` 是一个渲染组件的 `updateComponents()` 函数

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

上面的 `get` 主要做的事情有：

1. 执行 `pushTarget(this)`: 将当前的 `Watcher` 实例保存到 `Dep.target` 全局属性中, 方便被属性的 `dep` 容器收集

2. 执行 `value = this.getter.call(vm, vm)` : 此时的 `this.getter` 是上文中 `parsePath(expOrFn)` 的返回值， 这  里执行完之后就是得到属性对应的值 

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
  
上面的第二点要注意了， `this.getter` 是返回 `message` 对应的值，就是意味着要读取 `data` 上的 `message` 属性， 此时就是会被  `Object.definedProperty()` 的 `get` 方法劫持，然后就是把当前保存在全局属性 `Dep.target` 中的当前的 `Watcher` 实例保存到容器 `dep` 中， 至此就完成当前属性（`message`）对这个 `Watcher` 的收集


上面就完成了对 `watch` 监听属性机制的分析

## deep

使用 `watch` 的时候可以配置一个 `deep` 属性来配置是否深度监听属性，那么 Vue 中是如何处理的呢？ 以下在例子为例：

```js
data(){
  return {
    tree: {
      child: {
        name: 'lan'
      }
    }
  }
},
watch: {
  tree: {
    handler: function(){},
    deep: true
  }
}
```


首先 Vue 也可以劫持到 `object` 类型的数据的， 因为在初始化 `data` 数据时，会遍历对象对子元素使用 `Object.definedProperry()` 处理，也就是意味着每他对象的子元素也会有自己的一个收集容器的 `dep`。

回到 Vue 对 `watch` 的处理中，上文有提到在 `new Watcher` 的构造方法时，结尾会执行 `Watcher.property.get()` 方法：

```js
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

可以看到当前 `this.deep` 为 `true` 时， 会执行 `traverse(value)` ,它的定义如下：

```js
function traverse (val) {
  _traverse(val, seenObjects);
  seenObjects.clear();
}
// _traverse
function _traverse (val, seen) {
  var i, keys;
  var isA = Array.isArray(val);
  if ((!isA && !isObject(val)) || Object.isFrozen(val) || val instanceof VNode) {
    return
  }
  if (val.__ob__) {
    var depId = val.__ob__.dep.id;
    if (seen.has(depId)) {
      return
    }
    seen.add(depId);
  }
  if (isA) {
    i = val.length;
    while (i--) { _traverse(val[i], seen); }
  } else {
    keys = Object.keys(val);
    i = keys.length;
    while (i--) { _traverse(val[keys[i]], seen); }
  }
}
```

可以看到实际执行的是 `_traverse` 方法，传进去的参数为：

- `val`: 以上面的例子为例，此时的值为: `{ child: { name: 'lan' }}`

- `seenObjects`: 一个 `Set` 结构

进入到 `_traverse` 后， 逐条分析一下代码：

1. 只有当前 `val` 的值是对象类型才继续往下处理

2. 通过 `depId` 和 `seen` 配合判断当前的 `val` 是否是已经处理过的， 这个 `val.__ob__` 属性在初化 `data` 数添加的, 具体位置在 `new Observer(value)` 中有一行代码 `def(value, '__ob__', this)`：

  ```js
   function def (obj, key, val, enumerable) {
    Object.defineProperty(obj, key, {
      value: val,
      enumerable: !!enumerable,
      writable: true,
      configurable: true
    });
  }
  ```

  参数为：

  -  `value`: 当前监听属性对应的值

  - `__ob__`

  - `this`: 当前 `Observer` 实例

  > `initData (vm)` => `observe (value, asRootData)` => `new Observer(value)`

3. 无论是数组还是对象都通过遍历， 继续 `_traverse(val[keys[i]], seen)`

然后整个函数就完了～，怎么感觉什么都做？

真正发挥作用  `_traverse(val[keys[i]], seen)` 这行代码，调用 `_traverse` 方法时一方面是遍历子元素递归调用自己，还有一个关键的语句是 `val[keys[i]]`, `val[keys[i]]` 的作用是获取当前子属性的值，上文有提到，对于 `object` 类型的数据， Vue 会通过遍历对子属性也添加 `Object.defindProperty` 劫持，也就意味着当这里访问 `val[keys[i]]` 时，就会触发劫持的 `get` 方法，触发 `get` 方法时，此时的 `Dep.target` 还是这个 `watch` 对应的 `Watcher` ！所以子元素的 `dep` 也收集了这个 `Watcher`，以此完成了对所谓 `deep` 的深度监听 

## immediate

`immediate` 是 `watch` 的另一个属性，表示立即执行一个 `handler` 的意思,在 `Vue.prototype.$watch` 定义

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
```

如果存在 `options.immediate` 则执行 `cb.call(vm, watcher.value)` , 这个 `cb` 就是对应的 `handler` 方法