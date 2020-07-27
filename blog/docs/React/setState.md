# setState

`setState()` 会对一个组件的 `state` 对象安排一次更新。当 `state` 改变了，该组件就会重新渲染

## 使用

要是要注意的是 `setState` 其实是异步的 —— 不要指望在调用 `setState` 之后，`this.state` 会立即映射为新的值。如果你需要基于当前的 `state` 来计算出新的值，那你应该传递一个函数，而不是一个对象

```js
incrementCount() {
  // 注意：这样 *不会* 像预期的那样工作。
  this.setState({count: this.state.count + 1});
}

handleSomething() {
  // 假设 `this.state.count` 从 0 开始。
  this.incrementCount();
  this.incrementCount();
  this.incrementCount();
  // 当 React 重新渲染该组件时，`this.state.count` 会变为 1，而不是你期望的 3。

  // 这是因为上面的 `incrementCount()` 函数是从 `this.state.count` 中读取数据的，
  // 但是 React 不会更新 `this.state.count`，直到该组件被重新渲染。
  // 所以最终 `incrementCount()` 每次读取 `this.state.count` 的值都是 0，并将它设为 1。

  // 问题的修复参见下面的说明。
}
```

**如何更新那些依赖于当前的 state 的 state 呢？**

给 `setState` 传递一个函数，而不是一个对象，就可以确保每次的调用都是使用最新版的 `state`

传递一个函数可以让你在函数内访问到当前的 `state` 的值。因为 `setState` 的调用是分批的，所以你可以链式地进行更新

```js
incrementCount() {
  this.setState((state) => {
    // 重要：在更新的时候读取 `state`，而不是 `this.state`。
    return {count: state.count + 1}
  });
}

handleSomething() {
  // 假设 `this.state.count` 从 0 开始。
  this.incrementCount();
  this.incrementCount();
  this.incrementCount();

  // 如果你现在在这里读取 `this.state.count`，它还是会为 0。
  // 但是，当 React 重新渲染该组件时，它会变为 3。
}
```

### setState 什么时候是异步的？

目前，在事件处理函数内部的 `setState` 是异步的。

例如，如果 `Parent` 和 `Child` 在同一个 `click` 事件中都调用了 `setState` ，这样就可以确保 `Child` 不会被重新渲染两次。取而代之的是，React 会将该 `state` “冲洗” 到浏览器事件结束的时候，再统一地进行更新。这种机制可以在大型应用中得到很好的性能提升

## 源码分析

`setState` 源码中的定义

```js
Component.prototype.setState = function (partialState, callback) {
    this.updater.enqueueSetState(this, partialState, callback, 'setState');
};
```

以 `this.setState({count: this.state.count + 1})` 为例，参数 `partialState` 此时值为 `{count: 1}`; `callback` 为 `null`

`this.updater.enqueueSetState` 的定义：

```js
  var classComponentUpdater = {
    isMounted: isMounted,
    enqueueSetState: function (inst, payload, callback) {
      var fiber = get(inst);
      var currentTime = requestCurrentTimeForUpdate();
      var suspenseConfig = requestCurrentSuspenseConfig();
      var expirationTime = computeExpirationForFiber(currentTime, fiber, suspenseConfig);
      var update = createUpdate(expirationTime, suspenseConfig);
      update.payload = payload;

      if (callback !== undefined && callback !== null) {
        {
          warnOnInvalidCallback(callback, 'setState');
        }

        update.callback = callback;
      }

      enqueueUpdate(fiber, update);
      scheduleWork(fiber, expirationTime);
    },
    enqueueReplaceState: function (inst, payload, callback) {
      var fiber = get(inst);
      var currentTime = requestCurrentTimeForUpdate();
      var suspenseConfig = requestCurrentSuspenseConfig();
      var expirationTime = computeExpirationForFiber(currentTime, fiber, suspenseConfig);
      var update = createUpdate(expirationTime, suspenseConfig);
      update.tag = ReplaceState;
      update.payload = payload;

      if (callback !== undefined && callback !== null) {
        {
          warnOnInvalidCallback(callback, 'replaceState');
        }

        update.callback = callback;
      }

      enqueueUpdate(fiber, update);
      scheduleWork(fiber, expirationTime);
    },
    enqueueForceUpdate: function (inst, callback) {
      var fiber = get(inst);
      var currentTime = requestCurrentTimeForUpdate();
      var suspenseConfig = requestCurrentSuspenseConfig();
      var expirationTime = computeExpirationForFiber(currentTime, fiber, suspenseConfig);
      var update = createUpdate(expirationTime, suspenseConfig);
      update.tag = ForceUpdate;

      if (callback !== undefined && callback !== null) {
        {
          warnOnInvalidCallback(callback, 'forceUpdate');
        }

        update.callback = callback;
      }

      enqueueUpdate(fiber, update);
      scheduleWork(fiber, expirationTime);
    }
  };
```