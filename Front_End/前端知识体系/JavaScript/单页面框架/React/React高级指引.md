# 错误边界（Error Boundaries）

[错误边界](https://zh-hans.reactjs.org/docs/error-boundaries.html)

React项目中如果有个某个组件发生错误将导致两个应用崩溃，为了解决这个问题，React 16 引入了一个新的概念 —— 错误边界

## 概念

错误边界是一个 React组件， 这个组件可以捕获发生在其子组件树上任何位置的JavaScript 错误，并且它会渲染出备用 UI

实现一个`错误边界组件`，如果一个组件包含下面两个任何一个配置（或者两个都实现），那这个组件就是`错误边界组件`

-  实现静态方法`getDerivedStateFromError`：

  ```
  static getDerivedStateFromError(error) {
      // do something
  }
  ```

- `componentDidCatch`生命周期

```
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

```
<ErrorBoundary>
  <MyWidget />
</ErrorBoundary>
```

**错误边界的工作方式类似于 JavaScript 的 catch {}，不同的地方在于错误边界只针对 React 组件, 使用错误边界的注意点：**

- 默认情况下只在生产环境才会有生效

- 事件处理

- 异步代码（例如 `setTimeout` 或 `requestAnimationFrame` 回调函数）

- 服务端渲染

- 它自身抛出来的错误（并非它的子组件）