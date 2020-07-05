# 高级指引

## Context

Context 提供了一个无需为每层组件手动添加 `props` ，就能在组件树间进行数据传递的方法(跨层级组件传值)

### 设置Context

1. 使用 `React.createContext` 创建一个对象：`const MyContext = React.createContext(defaultValue);`

2. 使用 `MyContext.Provider` 包褒我们的组件，并使用 `value` 属性设置要传给子组的值

  `<MyContext.Provider value={/* 某个值 */}>`

  当 Provider 的 `value` 值发生变化时，它内部的所有消费组件都会重新渲染。
  `Provider` 及其内部 `consumer` 组件都不受制于 `shouldComponentUpdate` 函数，因此当 `consumer 组件`在其祖先组件退出更新的情况下也能更新
  
### 获取Context

1. 使用 `static` 这个类属性来初始化你的 `contextType`

  ```js
  class MyClass extends React.Component {
    static contextType = MyContext;
    console.log('this.context', this.context)
    render() {
      let value = this.context;
      /* 基于这个值进行渲染工作 */
    }
  }
  ```

2. 使用 `Class.contextType` 将 Context 挂载到 Class的 `contextType` 属性上

  ```js
  class MyClass extends React.Component {
    componentDidMount() {
      let value = this.context;
      /* 在组件挂载完成后，使用 MyContext 组件的值来执行一些有副作用的操作 */
    }
    componentDidUpdate() {
      let value = this.context;
      /* ... */
    }
    componentWillUnmount() {
      let value = this.context;
      /* ... */
    }
    render() {
      let value = this.context;
      /* 基于 MyContext 组件的值进行渲染 */
    }
  }
  MyClass.contextType = MyContext;
  ```

[React-Context](https://react.docschina.org/docs/context.html#contextprovider)

## 错误边界（Error Boundaries）

[错误边界](https://zh-hans.reactjs.org/docs/error-boundaries.html)

React项目中如果有个某个组件发生错误将导致两个应用崩溃，为了解决这个问题，React 16 引入了一个新的概念 —— 错误边界

错误边界是一个 React组件， 这个组件可以捕获发生在其子组件树上任何位置的JavaScript 错误，并且它会渲染出备用 UI

实现一个`错误边界组件`，如果一个组件包含下面两个任何一个配置（或者两个都实现），那这个组件就是`错误边界组件`

-  实现静态方法`getDerivedStateFromError`：

  ```js
  static getDerivedStateFromError(error) {
      // do something
  }
  ```

- `componentDidCatch`生命周期

```js
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // 更新 state 使下一次渲染能够显示降级后的 UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // 你同样可以将错误日志上报给服务器
    logErrorToMyService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // 你可以自定义降级后的 UI 并渲染
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children; 
  }
}
```

然后你可以将它作为一个常规组件去使用：

```js
<ErrorBoundary>
  <MyWidget />
</ErrorBoundary>
```

**错误边界的工作方式类似于 JavaScript 的 `catch {}`，不同的地方在于错误边界只针对 React 组件, 使用错误边界的注意点：**

- 默认情况下只在生产环境才会有生效

- 事件处理

- 异步代码（例如 `setTimeout` 或 `requestAnimationFrame` 回调函数）

- 服务端渲染

- 它自身抛出来的错误（并非它的子组件）

## Refs

[Refs 转发](https://react.docschina.org/docs/forwarding-refs.html)

通过Ref 可以获取DOM节点，使用方式：

1. 我们通过调用 `React.createRef` 创建了一个 `React ref` 

2. 我们通过给DOM指定 `ref` 属性

3. 当 `ref` 挂载完成，`ref.current` 将指向 DOM 节点

```js
// 作用于DOM
class App extends React.Component {
    constructor(props) {
        super(props)
        this.ref = React.createRef()
    }
    componentDidMount() {
        console.log('ref', this.ref.current.focus())
    }
    render() {
        return (
            <input ref={this.ref} />
        );
    }
}
```

获取子组件中的元素的方式：

- 使用`React.forwardRef`方法包装子组件，被`React.forwardRef`包装的组件，除了有`prpos`作为第一个属性外，还有第二个参数`ref`，

- 这个`ref`是挂载组件的时候，通过属性传下来的

```js
const FancyButton = React.forwardRef((props, ref) => (
    <button ref={ref} className="FancyButton"></button>
));
class App extends React.Component {
    constructor(props) {
        super(props)
        this.ref = React.createRef()
    }
    componentDidMount() {
        console.log('ref', this.ref.current)
    }
    render() {
        return (
            <FancyButton ref={this.ref}/>
        );
    }
}
```

> 第二个参数 ref 只在使用 React.forwardRef 定义组件时存在。常规函数和 class 组件不接收 ref 参数，且 props 中也不存在 ref。
> Ref 转发不仅限于 DOM 组件，你也可以转发 refs 到 **class 组件**实例中

## Fragment

[Fragments](https://react.docschina.org/docs/fragments.html)

创建组件的时候，组件只能有一个唯一的根元素，使用`Fragmwnt`可以创建一个空的元素

```js
render() {
  return (
    <React.Fragment>
      <ChildA />
      <ChildB />
      <ChildC />
    </React.Fragment>
  );
}
```

# 深入JSX

[深入 JSX](https://react.docschina.org/docs/jsx-in-depth.html)

JSX 仅仅只是 `React.createElement(component, props, ...children)` 函数的语法糖。如下 JSX 代码：

```
<MyButton color="blue" shadowSize={2}>
  Click Me
</MyButton>
```

会编译为：

```
React.createElement(
  MyButton,
  {color: 'blue', shadowSize: 2},
  'Click Me'
)
```

**用户定义的组件必须以大写字母开头**

