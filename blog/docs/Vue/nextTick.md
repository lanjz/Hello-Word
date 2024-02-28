# $nextTick

`$nextTick` 的作用是在下次 DOM 更新循环结束之后执行延迟回调。在修改数据之后立即使用这个方法，获取更新后的 DOM

用法：`Vue.nextTick( [callback, context] )`

为什么需要 `$nextTick` 才能准确取后更新后的 DOM 呢？因为 Vue 的视图更新是异步，准确来说是 Vue 的依赖更新是异步的

## Vue异步更新队列

> [VUE - 异步更新队列](https://cn.vuejs.org/v2/guide/reactivity.html#%E5%BC%82%E6%AD%A5%E6%9B%B4%E6%96%B0%E9%98%9F%E5%88%97)

Vue 在更新 DOM 时是异步执行的。只要侦听到数据变化，Vue 将开启一个队列，并缓冲在同一事件循环中发生的所有数据变更。如果同一个 `watcher` 被多次触发，只会被推入到队列中一次。

然后，在下一个的事件循环 `“tick”` 中，Vue 刷新队列并执行实际 (已去重的) 工作。Vue 在内部对异步队列尝试使用原生的 `Promise.then`、`MutationObserver` 和 `setImmediate`，如果执行环境不支持，则会采用 `setTimeout(fn, 0)` 代替

例如，当你设置 `vm.someData = 'new value'`，该组件不会立即重新渲染。 组件会在下一个事件循环 `“tick”` 中更新。多数情况我们不需要关心这个过程，但是如果你想基于更新后的 DOM 状态来做点什么，这就可能会有些棘手。虽然 Vue.js 通常鼓励开发人员使用“数据驱动”的方式思考，避免直接接触 DOM，但是有时我们必须要这么做。为了在数据变化之后等待 Vue 完成更新 DOM，可以在数据变化之后立即使用 `Vue.nextTick(callback)`。这样回调函数将在 DOM 更新完成后被调用。例如：

```js
<div id="example">{{message}}</div>
var vm = new Vue({
  el: '#example',
  data: {
    message: '123'
  }
})
vm.message = 'new message' // 更改数据
vm.$el.textContent === 'new message' // false
Vue.nextTick(function () {
  vm.$el.textContent === 'new message' // true
})
```

因为 `$nextTick()` 返回一个 `Promise` 对象，所以你可以使用新的 ES2017 `async/await` 语法完成相同的事情：

```js
methods: {
  updateMessage: async function () {
    this.message = '已更新'
    console.log(this.$el.textContent) // => '未更新'
    await this.$nextTick()
    console.log(this.$el.textContent) // => '已更新'
  }
}
```

## 源码分析

`$nextTick` 的源码中的定义如下：

```js
Vue.prototype.$nextTick = function (fn) {
    return nextTick(fn, this)
};
// nextTick 方法
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

`nextTick` 接收的第一个参数 `cb` ， `cb` 就是要推入事件循环任务队列中的函数。它可以当前更新组件的方法，也可以是一个 `watch` 监听的回调，也可以我们通过 `this.$nexttick` 传的回调函数。这些函数并不是立马执行的， 而是先将这些函数存入 `callbacks` 中，`callbacks` 是一个存放这些任务的数组。等收集完之后根据事件循环机制将在当前宏任务代码执行完这后统一执行。起到延迟执行的作用

通过一个例子来理解一下如何延迟执行代码：

```js
console.log(1)
Promise.resolve()
  .then(()=> {
    console.log(2)
  })
console.log(3)
```

上面例子通过 `Promise.resolve().then` 方法，将 ` console.log(2)` 的执行延迟了

回到 `nextTick` 方法中 `timerFunc()` 的作用就等同时开启一个延迟执行的任务。之后设置 `pending` 变量， `pending` 是一个标志，默认是 `false` 当新的微任务开始收集时，会进入 `if (!pending)` 条件，执行 `timerFunc()`。 `timerFunc()` 定义如下：

```js
  var timerFunc;

  // The nextTick behavior leverages the microtask queue, which can be accessed
  // via either native Promise.then or MutationObserver.
  // MutationObserver has wider support, however it is seriously bugged in
  // UIWebView in iOS >= 9.3.3 when triggered in touch event handlers. It
  // completely stops working after triggering a few times... so, if native
  // Promise is available, we will use it:
  /* istanbul ignore next, $flow-disable-line */
  if (typeof Promise !== 'undefined' && isNative(Promise)) {
    var p = Promise.resolve();
    timerFunc = function () {
      p.then(flushCallbacks);
      // In problematic UIWebViews, Promise.then doesn't completely break, but
      // it can get stuck in a weird state where callbacks are pushed into the
      // microtask queue but the queue isn't being flushed, until the browser
      // needs to do some other work, e.g. handle a timer. Therefore we can
      // "force" the microtask queue to be flushed by adding an empty timer.
      if (isIOS) { setTimeout(noop); }
    };
    isUsingMicroTask = true;
  } else if (!isIE && typeof MutationObserver !== 'undefined' && (
    isNative(MutationObserver) ||
    // PhantomJS and iOS 7.x
    MutationObserver.toString() === '[object MutationObserverConstructor]'
  )) {
    // Use MutationObserver where native Promise is not available,
    // e.g. PhantomJS, iOS7, Android 4.4
    // (#6466 MutationObserver is unreliable in IE11)
    var counter = 1;
    var observer = new MutationObserver(flushCallbacks);
    var textNode = document.createTextNode(String(counter));
    observer.observe(textNode, {
      characterData: true
    });
    timerFunc = function () {
      counter = (counter + 1) % 2;
      textNode.data = String(counter);
    };
    isUsingMicroTask = true;
  } else if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
    // Fallback to setImmediate.
    // Technically it leverages the (macro) task queue,
    // but it is still a better choice than setTimeout.
    timerFunc = function () {
      setImmediate(flushCallbacks);
    };
  } else {
    // Fallback to setTimeout.
    timerFunc = function () {
      setTimeout(flushCallbacks, 0);
    };
  }
```

`timerFunc` 其实就是一个触发异步任务的方法，根据环境可能是以下之一 `Promise.then`、`MutationObserver` 和 `setImmediate`， `setTimeout(fn, 0)` 。总之就是将 `timerFunc()` 回调延迟执行。上面代码中异步的回调是个 `flushCallbacks()` 方法, 下面是它的定义：

```js
  var callbacks = [];
  var pending = false;
  function flushCallbacks () {
    pending = false;
    var copies = callbacks.slice(0);
    callbacks.length = 0;
    for (var i = 0; i < copies.length; i++) {
      copies[i]();
    }
  }
```

`flushCallbacks` 方法就是从上文提到的 `callbacks` 数组中取出之前保存任务，然后并一一执行，同时 `callbacks` 长置为 `0` 好接收下一批要执行任务。

`nextTick` 方法中除了执行 `timerFunc()`, 同时还有一个 `pending 变量`，`pending` 的作用是一个标记，初始值为 `false`,当启动一个延迟任务之后 `pending` 设为 `true`，在同一时间段内如果 `nextTick` 还有被触发那么这些任务将会被收集在一起。被收集到一起的任务都在下一整件循环中一起执行。当这些一次延迟任务开始执行的时候 `pending` 才会重置为 `false`，之后收集的任务将在一下延迟中执行。


上文都是延迟任务的收集部分。之后事件循环进入这些任务的执行阶段时，将会执行延迟的回调 `flushCallbacks` 方法

```js
 // 
  var callbacks = [];
  var pending = false;

  function flushCallbacks () {
    pending = false;
    var copies = callbacks.slice(0);
    callbacks.length = 0;
    for (var i = 0; i < copies.length; i++) {
      copies[i]();
    }
  }
```

上面代码中首先 `pending` 设为初始值 `false`, 之后收集的任务将在一下延迟中执行。然后从 `callbacks` 数组取出保存的任务，一一执行

### 例子

以下面通过例子来看下 `$nextTick` 的执行过程

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
    computed: {
      bind: function(){
        const result = this.message + '__________'
        return result
      }
    },
    watch: {
      message: function(val){
        console.log(val)
      }
    },
    mounted(){
      debugger
      this.$nextTick(() => {
        console.log('nextTick')
      })
      console.log('mounted')
      this.message = "message_B"
      debugger
      this.$nextTick(() => {
        console.log('nextTick2')
      })
    },
  })
</script>
```

当 `mounted` 钩子触发后，执行了两个 `this.$nextTick` 方法和一个 `this.message` 属性值的修改

首先执行第一个 `this.$nextTick`

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

将 `() => console.log('nextTick')` 存入 `callbacks` 数组，并执行 `timerFunc()` 开启一次延迟，同时 `pending = true` 表示当前延迟任务已开启

然后执行 `this.message = "message_B"`

当 `message` 变化时，将会执行 `message` 属性收集的 `Watcher` 事件，上面例子 `message` 属性收集的事件有：`watch Watcher`、 `computed Watcher`、 `render Watcher`

```js
  Dep.prototype.notify = function notify () {
    var subs = this.subs.slice();
    if (!config.async) {
      subs.sort(function (a, b) { return a.id - b.id; });
    }
    for (var i = 0, l = subs.length; i < l; i++) {
      subs[i].update();
    }
  };
  // update
    Watcher.prototype.update = function update () {
    if (this.lazy) {
      this.dirty = true;
    } else if (this.sync) {
      this.run();
    } else {
      queueWatcher(this);
    }
  };
  // queueWatcher
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

数据变化然后发出响应，首先遍历收集器 `subs` 中的任务上然后通过  `queueWatcher()`将当前要执行的 `watcher` 推入到 `queue` 数组中， 然后将 `flushSchedulerQueue` 方法通过 `nextTick()` 方法添加到异步任务回调的 `callbacks` 数组中。

然后执行最后一个 `this.$nextTick`，将回调 `() => {console.log('nextTick2')}` 添加到异步任务回调的 `callbacks` 数组中。

之后就是将当前宏任务的代码块执行完，过了肉眼不可见的时间之后，将会执行异步回调 `flushCallbacks` 方法

```js
  function flushCallbacks () {
    pending = false;
    var copies = callbacks.slice(0);
    callbacks.length = 0;
    for (var i = 0; i < copies.length; i++) {
      copies[i]();
    }
  }
```

上面代码执行就是取出 `callbacks` 里的回调函数，一一执行

1. 首先执行每一个 `$nextTick` 回调，输出 `console.log('nextTick')`

2. 执行 `message` 属性收集的 `Watcher` 事件，包括视图的更新

3. 执行最后一个 `$nextTick` 回调，输出 `console.log('nextTick2')`，因为上一步视图已经更新了，所以如果在这个回调里是可以访问到更新后的 DOM 元素的

**如果 `$nextTick` 又执行一个 `$nextTick` 会怎样呢**

上文说过  `nextTick` 方法中有个 `pedding` 标记。在开启一轮延迟任务的时候会将 `pedding` 设为 `true`，收集同一时间的需要延迟执行的任务。

当这一轮的延迟的任务（A）开始执行时更新 `pedding` 状态 `pedding = false`。所以此时在回调内如果又执行了 `$nextTick`，相当于又开启了新一个延迟任务（B），新一轮的回调将在当前回调（A）执行之后执行

相当以下代码：

```js
Promise.resolve()
  .then(res=> {
    // 执行第一个异步结果
    Promise.resolve() // 又添加了一个异步任务
      .then(res=> {
        // 执行第二个异步结果
      })
  })
```

## 总结

同一时间的任务都会保存到 `callback` 队列中，同时根据环境使用原生的 `Promise.then`、`MutationObserver` 和 `setImmediate`方法，延迟执行 `callback` 中的任务