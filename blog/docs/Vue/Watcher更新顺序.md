# Watcher更新顺序

数据变化的时候如果派发更新的呢？ 如果我们同一时变化了多个 `data` 属性，会触发多次的 `Watcher` 吗？以下面例子为例：

## 例子一

```js
new Vue({
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
      }
    },
    mounted(){
      this.name = "name_A"
      this.name = "name_B"
      this.message = "message_B"
    },
  })
```

Vue 初始化时通过 `defineReactive` 函数完成对 `data` 和 `watch` 属性的监听劫持，`message` 属性的收集器 `dep` 收集了当前组件的 `渲染Watcher` 和 `watch` 里的 `handler Watcher`， `name` 属性的收集器 `dep` 收集了当前组件的 `渲染Watcher`。

```js
  function defineReactive$$1 (
    obj,
    key,
    val,
    customSetter,
    shallow
  ) {
    var dep = new Dep();

    var property = Object.getOwnPropertyDescriptor(obj, key);
    if (property && property.configurable === false) {
      return
    }

    // cater for pre-defined getter/setters
    var getter = property && property.get;
    var setter = property && property.set;
    if ((!getter || setter) && arguments.length === 2) {
      val = obj[key];
    }

    var childOb = !shallow && observe(val);
    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: true,
      get: function reactiveGetter () {
        debugger
        var value = getter ? getter.call(obj) : val;
        if (Dep.target) {
          dep.depend();
          if (childOb) {
            childOb.dep.depend();
            if (Array.isArray(value)) {
              dependArray(value);
            }
          }
        }
        return value
      },
      set: function reactiveSetter (newVal) {
        debugger
        var value = getter ? getter.call(obj) : val;
        /* eslint-disable no-self-compare */
        if (newVal === value || (newVal !== newVal && value !== value)) {
          return
        }
        /* eslint-enable no-self-compare */
        if (customSetter) {
          customSetter();
        }
        // #7981: for accessor properties without setter
        if (getter && !setter) { return }
        if (setter) {
          setter.call(obj, newVal);
        } else {
          val = newVal;
        }
        childOb = !shallow && observe(newVal);
        dep.notify();
      }
    });
  }
```

当运行 `mounted` 钩子后，执行了以下代码：

```js
this.name = "name_A"
this.name = "name_B"
this.message = "message_B"
```

通过源码角度来看看组件是如何更新的

当 `mounted` 内的函数执行时首先执行 `this.name = "name_A"`， 这时就会触发上面的 `set` 方法，然后执行最关键的代码 `dep.notify()`,  `dep.notify()` 的定义如下

```js
Dep.prototype.notify = function notify () {
    // stabilize the subscriber list first
    var subs = this.subs.slice();
    if (!config.async) {
      // subs aren't sorted in scheduler if not running async
      // we need to sort them now to make sure they fire in correct
      // order
      subs.sort(function (a, b) { return a.id - b.id; });
    }
    for (var i = 0, l = subs.length; i < l; i++) {
      subs[i].update();
    }
  }
```

`this.subs` 存放着当前属性 `name` 收集的 `Watcher`， 因为在 `mounted` 钩子中，先执行的 `name` 属性，所以此时 `this.subs` 中只有一个 `渲染 Watcher`, 然后通过 `for` 循环，执行每个 `Watcher` 的 `update` 方法，在 `Watcher.prototype.update` 方法中实际会执行 `queueWatcher(this)` 方法，这个 `this` 是指向当前 `渲染Watcher` 的

```js
Watcher.prototype.update = function update () {
/* istanbul ignore else */
if (this.lazy) {
    this.dirty = true;
    } else if (this.sync) {
        this.run();
    } else {
        queueWatcher(this);
    }
};

/**
 * queueWatcher
 * 将一个观察者推入观察者队列
 * 具有重复id的作业将被跳过，除非它在队列刷新时被推入
*/
  var has = {}
  var waiting = false;
  var flushing = false;
  var queue = []

  function queueWatcher (watcher) {
    var id = watcher.id;
    if (has[id] == null) {
      has[id] = true;
      if (!flushing) {
        queue.push(watcher);
      } else {
        // if already flushing, splice the watcher based on its id
        // if already past its id, it will be run next immediately.
        var i = queue.length - 1;
        while (i > index && queue[i].id > watcher.id) {
          i--;
        }
        queue.splice(i + 1, 0, watcher);
      }
      // queue the flush
      if (!waiting) {
        waiting = true;

        if (!config.async) {
          flushSchedulerQueue();
          return
        }
        nextTick(flushSchedulerQueue);
      }
    }
  }
```

此时进入代码块时的运行流程如下：

-  `flushing` 为 `false` 时，执行 `queue.push(watcher);` 将当前 `watcher` 添加到队列 `queue` 中

- `waiting` 为 `false`, 然后将 `waiting` 设为 `true`, 并执行 `nextTick(flushSchedulerQueue)` 方法

```js
  function nextTick (cb, ctx) {
    var _resolve;
    callbacks.push(function () {
      if (cb) {
        try {
          cb.call(ctx);
        } catch (e) {
          handleError(e, ctx, 'nextTick');
        }
      } else if (_resolve) {
        _resolve(ctx);
      }
    });
    if (!pending) {
      pending = true;
      timerFunc();
    }
    // $flow-disable-line
    if (!cb && typeof Promise !== 'undefined') {
      return new Promise(function (resolve) {
        _resolve = resolve;
      })
    }
  }
```

1. 将 `flushSchedulerQueue` 存入 `callbacks` 数组中

2. `pending` 由 `false` 转为 `true`， 并执行 `timerFunc()` 方法

```js
var p = Promise.resolve();
timerFunc = function () {
    p.then(flushCallbacks);
};
isUsingMicroTask = true;

// 
function flushCallbacks () {
    pending = false;
    var copies = callbacks.slice(0);
    callbacks.length = 0;
    for (var i = 0; i < copies.length; i++) {
        copies[i]();
    }
}
```

`timerFunc` 的作用就是将 `flushCallbacks` 方法放入到微任务队列中，也就意味着此时并不会立马执行重新渲染方法

此时继续执行当前的宏任务执行 `mounted` 中的 `this.name = "name_B"`,此时会继续上面的步骤，区别在于在执行到 `queueWatcher` 时 `has` 已经有当前 `Watcher id`, 所以不会将当前的 `Watcher` 存入到 `queue` 中，也不会继续下面代码

然后会继续执行 `this.message = "message_B"`，这个 `message` 属性收集了两个 `Watcher`，一个 `watch Watcher`，另一个是 `渲染 Watcher`， 所以执行 `watch Watcher` 的 `update` 方法，之后执行到 `queueWatcher` 方法时，就会将当前 `Watcher` 推入到 `queue` 中，然后因为 `waiting` 仍为 `true`, 所以并不会继续执行 `nextTick(flushSchedulerQueue)` 方法，之后执行 `渲染Watcher` 的 `update` 方法，此时 `Watcher id` 已经存在于 `has` 中，所以也不会重复添加

当前宏任务都执行完之后，才开始执行微任务队列 `flushCallbacks` 方法，此时 `callbacks` 存放的任务为上文 `nextTick` 中的回调

```js
  function nextTick (cb, ctx) {
    var _resolve;
    callbacks.push(function () {
      if (cb) {
        try {
          cb.call(ctx);
        } catch (e) {
          handleError(e, ctx, 'nextTick');
        }
      } else if (_resolve) {
        _resolve(ctx);
      }
    });
    if (!pending) {
      pending = true;
      timerFunc();
    }
    // $flow-disable-line
    if (!cb && typeof Promise !== 'undefined') {
      return new Promise(function (resolve) {
        _resolve = resolve;
      })
    }
  }
```

`callbacks` 要执行的就是 `cb` 方法， 这个 `cb` 方法对应的就是 `flushSchedulerQueue` 的方法

```js
  /**
   * Reset the scheduler's state.
   */
  function resetSchedulerState () {
    index = queue.length = activatedChildren.length = 0;
    has = {};
    {
      circular = {};
    }
    waiting = flushing = false;
  }

  // Async edge case #6566 requires saving the timestamp when event listeners are
  // attached. However, calling performance.now() has a perf overhead especially
  // if the page has thousands of event listeners. Instead, we take a timestamp
  // every time the scheduler flushes and use that for all event listeners
  // attached during that flush.
  var currentFlushTimestamp = 0;

  // Async edge case fix requires storing an event listener's attach timestamp.
  var getNow = Date.now;

  // Determine what event timestamp the browser is using. Annoyingly, the
  // timestamp can either be hi-res (relative to page load) or low-res
  // (relative to UNIX epoch), so in order to compare time we have to use the
  // same timestamp type when saving the flush timestamp.
  // All IE versions use low-res event timestamps, and have problematic clock
  // implementations (#9632)
  if (inBrowser && !isIE) {
    var performance = window.performance;
    if (
      performance &&
      typeof performance.now === 'function' &&
      getNow() > document.createEvent('Event').timeStamp
    ) {
      // if the event timestamp, although evaluated AFTER the Date.now(), is
      // smaller than it, it means the event is using a hi-res timestamp,
      // and we need to use the hi-res version for event listener timestamps as
      // well.
      getNow = function () { return performance.now(); };
    }
  }

  /**
   * Flush both queues and run the watchers.
   */
  function flushSchedulerQueue () {
    currentFlushTimestamp = getNow();
    flushing = true;
    var watcher, id;

    // Sort queue before flush.
    // This ensures that:
    // 1. Components are updated from parent to child. (because parent is always
    //    created before the child)
    // 2. A component's user watchers are run before its render watcher (because
    //    user watchers are created before the render watcher)
    // 3. If a component is destroyed during a parent component's watcher run,
    //    its watchers can be skipped.
    queue.sort(function (a, b) { return a.id - b.id; });

    // do not cache length because more watchers might be pushed
    // as we run existing watchers
    for (index = 0; index < queue.length; index++) {
      watcher = queue[index];
      if (watcher.before) {
        watcher.before();
      }
      id = watcher.id;
      has[id] = null;
      watcher.run();
      // in dev build, check and stop circular updates.
      if (has[id] != null) {
        circular[id] = (circular[id] || 0) + 1;
        if (circular[id] > MAX_UPDATE_COUNT) {
          warn(
            'You may have an infinite update loop ' + (
              watcher.user
                ? ("in watcher with expression \"" + (watcher.expression) + "\"")
                : "in a component render function."
            ),
            watcher.vm
          );
          break
        }
      }
    }

    // keep copies of post queues before resetting state
    var activatedQueue = activatedChildren.slice();
    var updatedQueue = queue.slice();

    resetSchedulerState();

    // call component updated and activated hooks
    callActivatedHooks(activatedQueue);
    callUpdatedHooks(updatedQueue);

    // devtool hook
    /* istanbul ignore if */
    if (devtools && config.devtools) {
      devtools.emit('flush');
    }
  }
```
`flushSchedulerQueue` 方法就是会从 `queue`中取出 `Watcher` ，并执行 `Watcher.run` 方法, 对于取出的  `Watcher` 同时也会把 `has` 对应的 `Watcher id` 置为 `null`

## 例子二

再通过一个例子来了解一下 `Watcher` 的执行过程

```js
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
    mounted(){
      console.log('mounted')
      this.message = "message_B"
    },
  })
```

上面例子中一共有四个 `Watcher`:

1. `message` 对应的 `watch Watcher(id = 1)`，`render Watcher(id = 3)`

2. `name` 对应的 `watch Watcher(id = 2)`，`render Watcher(id = 3)`

执行 `this.message = "message_B"` 时, `Watcher` 执行过程如下：

1. `message` 属性收集到的两个 `Watcher` （ `watch Watcher(id = 1)` 和 `render Watcher(id = 3)` ），添加到 `queue` 中

2. 宏任务执行完毕后开始执行 `queue` 中的 `Watcher` 时，先执行的是 `watch Watcher(id = 1)`， 执行修改属性 `this.name = val + '_Watch'`， 并将 `has` 中的 `id:1` 至为 `null`

3. 将 `name` 收集到两个的 `Watcher` （ `watch Watcher(id = 1)` 和 `render Watcher(id = 3)` ），添加到 `queue` 中

4. 添加的时候先处理  `watch Watcher(id = 2)` 的 `Watcher`，并将该 `Watcher` 添加到 `queue` 中, 添加的时候会按照 `id` 排序来进行插入，所以 `queue` 的 `Watcher` 顺序为 `Watcher(1) => Watcher(2) => Watcher(3)`

5. 处理 `name` 对应的第二个 `render Watcher(id = 3)`, 此时 `queue` 中已经有了 `id = 3` 的 `Watcher`， 所以不会重复添加

6. 之后继续遍历 `queue` 的 `Watcher`， 此时执行的是 `watch Watcher(id = 2)`, 执行 `console.log(val)`

7. 最后执行 `queue` 最后的 `render Watcher(id = 3)`


## 总结

当数据发生变化时，并不会立马执行做更新操作，所有需要执行的 `Watcher` 都会先放入到 `queue` 中， 并且具有相同 `id` 的 `Watcher` 不会重复添加，在执行下一次微任务时才开始一一执行 `queue` 的 `Watcher` 方法

并且从例子二可以知道一个组件的所有 `Watcher`， `watch Watcher` 总是会优先于 `render Watcher`  执行