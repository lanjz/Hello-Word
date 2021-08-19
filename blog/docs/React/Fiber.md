# Fiber

Fiber 是 React 的最小工作单元，在 React 的世界中，一切都可以是组件

```js
// 源码定义：
function FiberNode(
  tag: WorkTag,
  pendingProps: mixed,
  key: null | string,
  mode: TypeOfMode,
) {

  // Fiber元素的静态属性相关
  this.tag = tag;
  this.key = key; // fiber的key
  this.elementType = null;
  this.type = null; // fiber对应的DOM元素的标签类型，div、p...
  this.stateNode = null; // fiber的实例，类组件场景下，是组件的类，HostComponent场景，是dom元素

  // Fiber 链表相关
  this.return = null; // 指向父级fiber
  this.child = null; // 指向子fiber
  this.sibling = null; // 同级兄弟fiber
  this.index = 0;

  this.ref = null; // ref相关

  // Fiber更新相关
  this.pendingProps = pendingProps;
  this.memoizedProps = null;
  this.updateQueue = null; // 存储update的链表
  this.memoizedState = null; // 类组件存储fiber的状态，函数组件存储hooks链表
  this.dependencies = null;

  this.mode = mode;

  // Effects
  // flags原为effectTag，表示当前这个fiber节点变化的类型：增、删、改
  this.flags = NoFlags;
  this.nextEffect = null;

  // effect链相关，也就是那些需要更新的fiber节点
  this.firstEffect = null;
  this.lastEffect = null;

  this.lanes = NoLanes; // 该fiber中的优先级，它可以判断当前节点是否需要更新
  this.childLanes = NoLanes;// 子树中的优先级，它可以判断当前节点的子树是否需要更新

  /*
  * 可以看成是workInProgress（或current）树中的和它一样的节点，
  * 可以通过这个字段是否为null判断当前这个fiber处在更新还是创建过程
  * */
  this.alternate = null;

}
```

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

## Fiber 更新


React要完成一次更新分为两个阶段： `render` 阶段和 `commit` 阶段，两个阶段的工作可分别概括为新 fiber 树的构建和更新最终效果的应用


