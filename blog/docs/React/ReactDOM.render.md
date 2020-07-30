# ReactDOM.render

`ReactDOM.render` 为初次渲染将 React 组件挂载在 DOM 元素上

```js
const root = document.createElement('div')
root.id = 'app'
document.body.appendChild(root)

const App = (<h2>Hello World!</h2>)

render(App, root)
```

`ReactDom.render` 的源码定义：

```js
function render(element, container, callback) {
  if (!isValidContainer(container)) {
    {
      throw Error( "Target container is not a DOM element." );
    }
  }

  {
    var isModernRoot = isContainerMarkedAsRoot(container) && container._reactRootContainer === undefined;

    if (isModernRoot) {
      error('You are calling ReactDOM.render() on a container that was previously ' + 'passed to ReactDOM.createRoot(). This is not supported. ' + 'Did you mean to call root.render(element)?');
    }
  }

  return legacyRenderSubtreeIntoContainer(null, element, container, false, callback);
}
```

实际上执行的 `legacyRenderSubtreeIntoContainer` 方法

```js
function legacyRenderSubtreeIntoContainer(parentComponent, children, container, forceHydrate, callback) {
  {
    topLevelUpdateWarnings(container);
    warnOnInvalidCallback$1(callback === undefined ? null : callback, 'render');
  } // TODO: Without `any` type, Flow says "Property cannot be accessed on any
  // member of intersection type." Whyyyyyy.


  var root = container._reactRootContainer;
  var fiberRoot;

  if (!root) {
    // Initial mount
    root = container._reactRootContainer = legacyCreateRootFromDOMContainer(container, forceHydrate);
    fiberRoot = root._internalRoot;

    if (typeof callback === 'function') {
      var originalCallback = callback;

      callback = function () {
        var instance = getPublicRootInstance(fiberRoot);
        originalCallback.call(instance);
      };
    } // Initial mount should not be batched.


    unbatchedUpdates(function () {
      updateContainer(children, fiberRoot, parentComponent, callback);
    });
  } else {
    fiberRoot = root._internalRoot;

    if (typeof callback === 'function') {
      var _originalCallback = callback;

      callback = function () {
        var instance = getPublicRootInstance(fiberRoot);

        _originalCallback.call(instance);
      };
    } // Update


    updateContainer(children, fiberRoot, parentComponent, callback);
  }

  return getPublicRootInstance(fiberRoot);
}
```

`legacyRenderSubtreeIntoContainer()` （啥啥渲染子数到容器），在当前例子中执行这个方法时传进来的参数为：

- `parentComponent`：`null`

- `children`: 我们要挂载的元素 `App` 组件（以对象形式表示）

- `container`: 要挂载的目标元素，即 `root` 根节点

- `forceHydrate`: `false`

- `callback`: `null`

首次执行时 `container` 是要挂载的目标节点，此时它是没有 `_reactRootContainer` 属性的，所以 `legacyCreateRootFromDOMContainer(container, forceHydrate)` 为其添加 `_reactRootContainer` 属性，`_reactRootContainer` 表示一个 `FiberRoot` 对象, 有了这个对象，执行该对象上的一些方法可以将虚拟dom变成dom树挂载到根节点上

然后执行 `unbatchedUpdates()` 方法

```js
function unbatchedUpdates(fn, a) {
  var prevExecutionContext = executionContext;
  executionContext &= ~BatchedContext;
  executionContext |= LegacyUnbatchedContext;

  try {
    return fn(a);
  } finally {
    executionContext = prevExecutionContext;

    if (executionContext === NoContext) {
      // Flush the immediate callbacks that were scheduled during this batch
      flushSyncCallbackQueue();
    }
  }
}
```

`unbatchedUpdates()` 方法会执行传入的函数回调，即 `updateContainer(children, fiberRoot, parentComponent, callback)`

```js
function updateContainer(element, container, parentComponent, callback) {
  {
    onScheduleRoot(container, element);
  }

  var current$1 = container.current;
  var currentTime = requestCurrentTimeForUpdate();

  {
    // $FlowExpectedError - jest isn't a global, and isn't recognized outside of tests
    if ('undefined' !== typeof jest) {
      warnIfUnmockedScheduler(current$1);
      warnIfNotScopedWithMatchingAct(current$1);
    }
  }

  var suspenseConfig = requestCurrentSuspenseConfig();
  var expirationTime = computeExpirationForFiber(currentTime, current$1, suspenseConfig);
  var context = getContextForSubtree(parentComponent);

  if (container.context === null) {
    container.context = context;
  } else {
    container.pendingContext = context;
  }

  {
    if (isRendering && current !== null && !didWarnAboutNestedUpdates) {
      didWarnAboutNestedUpdates = true;

      error('Render methods should be a pure function of props and state; ' + 'triggering nested component updates from render is not allowed. ' + 'If necessary, trigger nested updates in componentDidUpdate.\n\n' + 'Check the render method of %s.', getComponentName(current.type) || 'Unknown');
    }
  }

  var update = createUpdate(expirationTime, suspenseConfig); // Caution: React DevTools currently depends on this property
  // being called "element".

  update.payload = {
    element: element
  };
  callback = callback === undefined ? null : callback;

  if (callback !== null) {
    {
      if (typeof callback !== 'function') {
        error('render(...): Expected the last optional `callback` argument to be a ' + 'function. Instead received: %s.', callback);
      }
    }

    update.callback = callback;
  }

  enqueueUpdate(current$1, update);
  scheduleWork(current$1, expirationTime);
  return expirationTime;
}
```

此时传进来的参数如下：

- `element`：要渲染的组件（App）

- `container`: 当前的 `root Fiber`

- `parentComponent`: `null`

- `callback`: `null`