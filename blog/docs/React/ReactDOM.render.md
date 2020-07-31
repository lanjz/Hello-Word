# ReactDOM.render

`ReactDOM.render` 用于初次渲染将 React 应用挂载在 DOM 元素上

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

实际上执行的 `legacyRenderSubtreeIntoContainer(null, element, container, false, callback)` 方法

```js
function legacyRenderSubtreeIntoContainer(parentComponent, children, container, forceHydrate, callback) {
  {
    topLevelUpdateWarnings(container);
    warnOnInvalidCallback$1(callback === undefined ? null : callback, 'render');
  } // TODO: Without `any` type, Flow says "Property cannot be accessed on any
  // member of intersection type." Whyyyyyy.

  var root = container._reactRootContainer;
  var fiberRoot;
  // 首次执行时 `container` 是要挂载的目标节点，此时它是没有 `_reactRootContainer` 属性的
  if (!root) {
    // 创建一个ReactRooter
    root = container._reactRootContainer = legacyCreateRootFromDOMContainer(container, forceHydrate);
    fiberRoot = root._internalRoot;

    if (typeof callback === 'function') {
      var originalCallback = callback;

      callback = function () {
        //根据fiberRoot获取公共Root实例,就是fiberRoot.current.child.stateNode
        var instance = getPublicRootInstance(fiberRoot);
        originalCallback.call(instance);
      };
    } // Initial mount should not be batched.

    //初始化安装不需要批量更新
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

`legacyRenderSubtreeIntoContainer()` （翻译成啥啥渲染子数到容器），在当前例子中执行这个函数时传进来的参数为：

- `parentComponent`：首次渲染没有父组件所以值为`null`

- `children`: 我们要挂载的元素 `App` 组件（以对象形式表示）

- `container`: 被挂载的容器，即 `root` 根节点

- `forceHydrate`: 表示是否是服务端渲染

- `callback`: `null`

函数体内主要做以下两件事情：

1. 由于首次渲染，所以使用 `legacyCreateRootFromDOMContainer(container,false,)` 创建 `FilberRoot` 并保存到 `container._reactRootContainer` 属性中

   `FilberRoot` 包含了一些可以将虚拟 `dom` 变成 `dom` 树挂载到根节点上的方法

2. 然后执行 `unbatchedUpdates()` 方法，这个方法是执行执行回调即 `updateContainer(children, fiberRoot, parentComponent, callback)`，`updateContainer()` 的作用是更新 `container`

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

接下来具体分析下以上做的两件事情

### ReactDOM.render-创建FilberRoot

执行 `render()` 方法中会使用 `legacyCreateRootFromDOMContainer(container,false)` 创建 `FilberRoot` 对象，看下源码定义：

```js
function legacyCreateRootFromDOMContainer(container, forceHydrate) {
  // 判断是否服务端渲染
  var shouldHydrate = forceHydrate || shouldHydrateDueToLegacyHeuristic(container); // First clear any existing content.

  if (!shouldHydrate) {
    var warned = false;
    var rootSibling;

    while (rootSibling = container.lastChild) {
      {
        if (!warned && rootSibling.nodeType === ELEMENT_NODE && rootSibling.hasAttribute(ROOT_ATTRIBUTE_NAME)) {
          warned = true;

          error('render(): Target node has markup rendered by React, but there ' + 'are unrelated nodes as well. This is most commonly caused by ' + 'white-space inserted around server-rendered markup.');
        }
      }

      container.removeChild(rootSibling);
    }
  }

  {
    if (shouldHydrate && !forceHydrate && !warnedAboutHydrateAPI) {
      warnedAboutHydrateAPI = true;

      warn('render(): Calling ReactDOM.render() to hydrate server-rendered markup ' + 'will stop working in React v17. Replace the ReactDOM.render() call ' + 'with ReactDOM.hydrate() if you want React to attach to the server HTML.');
    }
  }

  return createLegacyRoot(container, shouldHydrate ? {
    hydrate: true
  } : undefined);
}
```

1. 首先通过 `shouldHydrateDueToLegacyHeuristic()` 判断是否是服务端渲染
 
    ```js
   function shouldHydrateDueToLegacyHeuristic(container) {
     // 返回document节点或第一个子节
     var rootElement = getReactRootElementInContainer(container);
     // 看该节点是否有属性 ROOT_ATTRIBUTE_NAME, ROOT_ATTRIBUTE_NAME= 'data-reactroot'
     return !!(rootElement && rootElement.nodeType === ELEMENT_NODE && rootElement.hasAttribute(ROOT_ATTRIBUTE_NAME));
   }
   function getReactRootElementInContainer(container) {
     if (!container) {
       return null;
     }
     // DOCUMENT_NODE = 9 即判断是否是 window.document
     if (container.nodeType === DOCUMENT_NODE) {
       return container.documentElement;
     } else {
       // 返回container节的第一个子节
       return container.firstChild;
     }
   }
   ```

   从上面代码可以知道判断当前是否是服务端渲染的依据是获取 `container` 中的第一个节点，看该节点是否有属性 `data-reactroot`

2. 因为是客户端渲染，所以通过 `while` 循环，依次删除 `container` 的子节点

3. `legacyCreateRootFromDOMContainer` 的作用创建是创建 `ReactRooter` , 最后还得通过 `createLegacyRoot` 方法创建, 查看源代码：

   ```js
   function createLegacyRoot(container, options) {
     // createLegacyRoot 方法返回 ReactDOMBlockingRoot 的实例
     return new ReactDOMBlockingRoot(container, LegacyRoot, options);
   }
   // ReactDOMBlockingRoot
   function ReactDOMBlockingRoot(container, tag, options) {
     this._internalRoot = createRootImpl(container, tag, options);
   }
   // createRootImpl
   function createRootImpl(container, tag, options) {
     // Tag is either LegacyRoot or Concurrent Root
     var hydrate = options != null && options.hydrate === true;
     var hydrationCallbacks = options != null && options.hydrationOptions || null;
     // 创建React容器
     var root = createContainer(container, tag, hydrate);
     // 需求当前
     markContainerAsRoot(root.current, container); 

     if (hydrate && tag !== LegacyRoot) {
       var doc = container.nodeType === DOCUMENT_NODE ? container : container.ownerDocument;
       eagerlyTrapReplayableEvents(container, doc);
     }

     return root;
   }
   // 创建 FiberRoot
   function createContainer(containerInfo, tag, hydrate, hydrationCallbacks) {
     return createFiberRoot(containerInfo, tag, hydrate);
   }
   // createFiberRoot
   function createFiberRoot(containerInfo, tag, hydrate, hydrationCallbacks) {
     var root = new FiberRootNode(containerInfo, tag, hydrate);
     // stateNode is any.

     var uninitializedFiber = createHostRootFiber(tag);
     root.current = uninitializedFiber;
     uninitializedFiber.stateNode = root;
     initializeUpdateQueue(uninitializedFiber);
     return root;
   }
   // 给当前 DOM 节点标记一个 internalContainerInstanceKey 属性，internalContainerInstanceKey=__reactContainere$wyxea1uq6a
   function markContainerAsRoot(hostRoot, node) {
     node[internalContainerInstanceKey] = hostRoot;
   }
   ```

   从上面代码可以看到执行 `legacyCreateRootFromDOMContainer()` 方法依次执行了以下函数： 
   
   ```js
   createLegacyRoot(container, undefined)
   => return new ReactDOMBlockingRoot(container, LegacyRoot, options)
   => createRootImpl(container, tag, options) =>  createContainer(container, tag, hydrate)
   => createFiberRoot(containerInfo, tag, hydrate)
   => new FiberRootNode(containerInfo, tag, hydrate)
   ```
  
    **本质目的是为了创建 `FilberRoot`**，在执行 `createFiberRoot` 方法时除了创建 `FiberRoot` 之外，还通过 `createHostRootFiber(tag)` 创建了一个普通的 `Fiber`

    ```js
    var uninitializedFiber = createHostRootFiber(tag);
    root.current = uninitializedFiber;
    // tag = 0
    function createHostRootFiber(tag) {
      var mode;

      if (tag === ConcurrentRoot) {
        mode = ConcurrentMode | BlockingMode | StrictMode;
      } else if (tag === BlockingRoot) {
        mode = BlockingMode | StrictMode;
      } else {
        // 执行到这里
        mode = NoMode;
      }

      if ( isDevToolsPresent) {
        // Always collect profile timings when DevTools are present.
        // This enables DevTools to start capturing timing at any point–
        // Without some nodes in the tree having empty base times.
        mode |= ProfileMode;
      }
      // 此时 mode=0
      return createFiber(HostRoot, null, null, mode);
    }
    // createFiber 创建 fiber
    var createFiber = function (tag, pendingProps, key, mode) {
      // $FlowFixMe: the shapes are exact here but Flow doesn't like constructors
      return new FiberNode(tag, pendingProps, key, mode);
    };
    ```

### ReactDOM.render-updateContainer

上一步创建 `FilberRoot` 之后会执行 `updateContainer(children, fiberRoot, parentComponent, callback)`，此时参数依次为：

- `children`：App 组件

- `fiberRoot`: 上一步创建的 `FilberRoot`

- `parentComponent`： `null`

- `callback`: `undefined`

```js
function updateContainer(element, container, parentComponent, callback) {
  {
    onScheduleRoot(container, element);
  }
  var current$1 = container.current;
  // 计算新开始的时间
  var currentTime = requestCurrentTimeForUpdate();

  {
    // $FlowExpectedError - jest isn't a global, and isn't recognized outside of tests
    if ('undefined' !== typeof jest) {
      warnIfUnmockedScheduler(current$1);
      warnIfNotScopedWithMatchingAct(current$1);
    }
  }

  var suspenseConfig = requestCurrentSuspenseConfig();
  // 计算过期时间
  var expirationTime = computeExpirationForFiber(currentTime, current$1, suspenseConfig);
  // 由于parentComponent为null,所以返回空对象{}
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
  // 创建更新的时间节点
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
  // 一整个React应用中，会有多次更新，而这多次更新均在更新队列中
  enqueueUpdate(current$1, update);
  //进行任务调度
  //当React进行Update后，就要进行调度
  //即 根据任务的优先级去调度任务
  //先执行优先级高的任务，
  scheduleWork(current$1, expirationTime);
  return expirationTime;
}
```

此时传进来的参数如下：

- `element`：要渲染的组件（App）

- `container`: 当前的 `root Fiber`

- `parentComponent`: `null`

- `callback`: `null`

函数主要做的事情：

1. `var currentTime = requestCurrentTimeForUpdate()` 获取当前的时间，这个时间是以 V8 引擎上最大31位整数 1073741823 为根据的

2. `requestCurrentSuspenseConfig()` 先略，紧接着通过 `var expirationTime = computeExpirationForFiber(currentTime, current$1, suspenseConfig)` 获取过期时间

  `suspenseConfig` 的作用是每到过期时间，就更新 `container`

  `current$1` 是 `container.current` 也是上一步执行 `createFiberRoot()` 方法创建的，它表示一个 `Fiber`

4. `var update = createUpdate(expirationTime, suspenseConfig)`: 创建更新的时间节点

5. `enqueueUpdate(current$1, update); scheduleWork(current$1, expirationTime);` 进行任务调度，先略

6. 最后返回过期时间 `expirationTime`

之后回到 `legacyRenderSubtreeIntoContainer` 执行最的 `getPublicRootInstance(fiberRoot)` 方法

   ```js
   // 获取root实例
   function getPublicRootInstance(container) {
     var containerFiber = container.current;

     if (!containerFiber.child) {
       return null;
     }

     switch (containerFiber.child.tag) {
       case HostComponent:
         return getPublicInstance(containerFiber.child.stateNode);

       default:
         return containerFiber.child.stateNode;
     }
   }
   ```