# Fiber

源码定义：

```js
function FiberNode(tag, pendingProps, key, mode) {
  // Instance
  this.tag = tag;
  this.key = key;
  this.elementType = null;
  this.type = null;
  this.stateNode = null; // Fiber

  this.return = null;
  this.child = null;
  this.sibling = null;
  this.index = 0;
  this.ref = null;
  this.pendingProps = pendingProps;
  this.memoizedProps = null;
  this.updateQueue = null;
  this.memoizedState = null;
  this.dependencies = null;
  this.mode = mode; // Effects

  this.effectTag = NoEffect;
  this.nextEffect = null;
  this.firstEffect = null;
  this.lastEffect = null;
  this.expirationTime = NoWork;
  this.childExpirationTime = NoWork;
  this.alternate = null;

  {
    // Note: The following is done to avoid a v8 performance cliff.
    //
    // Initializing the fields below to smis and later updating them with
    // double values will cause Fibers to end up having separate shapes.
    // This behavior/bug has something to do with Object.preventExtension().
    // Fortunately this only impacts DEV builds.
    // Unfortunately it makes React unusably slow for some applications.
    // To work around this, initialize the fields below with doubles.
    //
    // Learn more about this here:
    // https://github.com/facebook/react/issues/14365
    // https://bugs.chromium.org/p/v8/issues/detail?id=8538
    this.actualDuration = Number.NaN;
    this.actualStartTime = Number.NaN;
    this.selfBaseDuration = Number.NaN;
    this.treeBaseDuration = Number.NaN; // It's okay to replace the initial doubles with smis after initialization.
    // This won't trigger the performance cliff mentioned above,
    // and it simplifies other profiler code (including DevTools).

    this.actualDuration = 0;
    this.actualStartTime = -1;
    this.selfBaseDuration = 0;
    this.treeBaseDuration = 0;
  } // This is normally DEV-only except www when it adds listeners.
  // TODO: remove the User Timing integration in favor of Root Events.


  {
    this._debugID = debugCounter++;
    this._debugIsCurrentlyTiming = false;
  }

  {
    this._debugSource = null;
    this._debugOwner = null;
    this._debugNeedsRemount = false;
    this._debugHookTypes = null;

    if (!hasBadMapPolyfill && typeof Object.preventExtensions === 'function') {
      Object.preventExtensions(this);
    }
  }
}
```

## Fiber的含义和作用

1. 每一个 `ReactElement` 对应一个 `Fiber` 对象

2. 记录节点的各种状态

   比如 `ClassComponent` 中的 `state` 和 `props` 的状态就是记录在 `Fiber` 对象上的

   只有当 `Fiber` 对象更新后，才会更新到 `ClassComponent` 上的 `this.state` 和 `this.props` 上

   **`this` 上的 `state` 和 `props` 是根据 `Fiber` 对象的 `state` 、`props` 更新的**

3. 串联整个应用形成树结构

   每个 `ReactElement` 通过 `props.children` 与其他 `ReactElement` 连结起来

   ![](./images/fiber.jpg)


**说明：**

1. `ReactElement` 只会把子节点（ `props.children` ）的第一个子节点当做 `child` 节点，其余的子节点（也就是第一个子节点的兄弟节点）都是从第一个子节点开始，依次单向连接至后一个兄弟节点

2. 每个子节点都会指向父节点（红箭头），也就是 `Fiber` 对象的 `return` 属性

以上图为例

- 左下角的 `input` 节点开始，它没有兄弟节点，但有一个 `return` 属性指向父组件 `Input`

- `List` 有三个子节点，但是它的 `child` 只是指向第一个子节点 `Span1`, 然后 `Span1` 的 `sibling` 属性指向兄弟节点




