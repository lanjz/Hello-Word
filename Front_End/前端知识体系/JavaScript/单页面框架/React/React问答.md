## React 中 key 的作用是什么？

`key`的作用更准确的进行 `diff`算法，React 还需要借助 `Key` 值来判断元素与本地状态的关联关系，因此我们绝不可忽视转换函数中 `Key` 的重要性

没有`key`时，在判断新旧地点变化时容易产场就地复用的情况

## 调用 setState 之后发生了什么？
   
1. 将传入的参数与当前的状态合并，然后触发所谓的调和过程（Reconciliation）

2. 根据当前的状态构建React元素树

3. 在得到元素树，与旧的元素树做节点对比，然后根据差异对界面进行最小化重渲染

4. 在差异计算算法中，React 能够相对精确地知道哪些位置发生了改变以及应该如何改变，这就保证了按需更新，而不是全部重新渲染。

## react 生命周期函数

**挂载**

- `constructor()`

  - 通过给 `this.state` 赋值对象来初始化内部 `state`
  
  - 为事件处理函数绑定实例
  
- `static getDerivedStateFromProps()`

- `render()`

- `componentDidMount`

**更新**

- `static getDerivedStateFromProps()`

- `shouldComponentUpdate(nextProps, nextState)`

  根据 `shouldComponentUpdate()` 的返回值，判断 React 组件的输出是否受当前 `state` 或 `props` 更改的影响

- `render()`

- `getSnapshotBeforeUpdate()`

- `componetDidUpdate(prevProps, prevState, snapshot)`:  会在更新后会被立即调用。首次渲染不会执行此方法。

**卸载**

- `componentWillUnMount()`：会在组件卸载及销毁之前直接调用

## shouldComponentUpdate 是做什么的

当 `props` 或 `state` 发生变化时，`shouldComponentUpdate()` 会在渲染执行之前被调用。返回值默认为 true。
如果返回`false`，则不会执行 `render`方法进行 DOM 更新
首次渲染或使用 `forceUpdate()` 时不会调用该方法。

为什么虚拟 dom 会提高性能

## react 性能优化是哪个周期函数

`shouldComponentUpdate()`

## react diff 优化原理

- 把树形结构按照层级分解，只比较同级元素

- 给列表结构的每个单元添加唯一的 key 属性，方便比较

- React 只会匹配相同 class 的 component（这里面的 class 指的是组件的名字）

- 合并操作，调用 component 的 setState 方法的时候, React 将其标记为 dirty.到每一个事件循环结束, React 检查所有标记 dirty 的 component 重新绘制.

- 选择性子树渲染。开发人员可以重写 shouldComponentUpdate 提高 diff 的性能

## (在构造函数中)调用 super(props) 的目的是什么
   

在 `super() `被调用之前，子类是不能使用 构造函数中使用 `this` 的

传递 `props` 给 `super()` 的原因则是便于(在子类中)能在 `constructor` 访问 `this.props`

## 何为 JSX

JSX是JS的扩展，并拥有 JavaScript 的全部功能

JSX 生产 React "元素"，你可以将任何的 JavaScript 表达式封装在花括号里，然后将其嵌入到 JSX 中。

## 何为纯函数(pure function)

一个纯函数是一个不依赖于且不改变其作用域之外的变量状态的函数，这也意味着一个纯函数对于同样的参数总是返回同样的结果。

##  React中的合成事件是什么？
   
合成事件是围绕浏览器原生事件充当跨浏览器包装器的对象。它们将不同浏览器的行为合并为一个 API。这样做是为了确保事件在不同浏览器中显示一致的属性

## React 中 refs 的作用是什么？

`Refs` 是 React 提供给我们的安全访问 DOM 元素或者某个React元素的句柄

## 类组件(Class component)和函数式组件(Functional component)之间有何不同

**类组件**

- 有自身的状态,直接访问 store 并维持状态

- 有生命周期函数

**函数组件**

- 仅是接收 `props`，并将组件自身渲染到页面时

- 该组件就是一个 `无状态组件`

## (组件的)状态(state)和属性(props)之间有何不同

- `State` 是一种数据结构，用于组件挂载时所需数据的默认值。`State` 由当前组进行管理与维护

- `props` 由父组件传递给子组件，并且就子组件而言，`props` 是不可变的(immutable)。组件不能直接改变 `props`

- `Props` 也不仅仅是数据--回调函数也可以通过 `props` 传递

## 何为高阶组件(higher order component)
   
高阶组件是一个以组件为参数并返回一个新组件的函数

如果你发现你在不同的地方写了大量代码来做同一件事时，就应该考虑将代码重构为可重用的 HOC

## react 组件的划分业务组件技术组件？
   
- 根据组件的职责通常把组件分为 UI 组件和容器组件。

- UI 组件负责 UI 的呈现，容器组件负责管理数据和逻辑。

- 两者通过 React-Redux 提供 connect 方法联系起来。

## 为什么建议传递给 setState 的参数是一个 callback 而不是一个对象
   
因为 this.props 和 this.state 的更新可能是异步的，不能依赖它们的值去计算下一个 state

## 应该在 React 组件的何处发起 Ajax 请求

在 React 组件中，应该在 `componentDidMount` 中发起网络请求

- 在组件的生命周期中仅会执行一次

- 你不能保证在组件挂载之前 Ajax 请求已经完成，如果是这样，也就意味着你将尝试在一个未挂载的组件上调用 setState，这将不起作用

## 简述 flux 思想

Flux 的最大特点，就是数据的"单向流动"

- View 层通过用户交互（比如 onClick）会触发 Action

- Dispatcher 会分发触发的 Action 给所有注册的 Store 的回调函数

- Store 回调函数根据接收的 Action 更新自身数据之后会触发一个 change 事件通知 View 数据更改了

- View 会监听这个 change 事件，拿到对应的新数据并调用 setState 更新组件 UI

## 了解 redux 么，说一下 redux 把
   
- redux 是一个应用数据流框架，主要是解决了组件间状态共享的问题，原理是集中式管理

- 主要有三个核心方法，`action`，`store`，`reducer`

- 工作流程是 `view` 调用 `store` 的 `dispatch` 接收 `action` 传入 `store`，`reducer` 进行 `state` 操作，
`view` 通过 `store` 提供的 `getState` 获取最新的数据

## redux 有什么缺点

- 一个业务变化就要对应编写 `action`，`reducer` 等等

- 当一个组件相关数据更新时，即使父组件不需要用到这个组件，父组件还是会重新 render，可能会有效率影响，或者需要写复杂的 shouldComponentUpdate 进行判断