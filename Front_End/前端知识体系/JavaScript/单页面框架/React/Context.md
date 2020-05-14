# Context

Context 提供了一个无需为每层组件手动添加 `props`，就能在组件树间进行数据传递的方法(跨层级组件传值)

## 设置Context

1. 使用`React.createContext`创建一个对象：`const MyContext = React.createContext(defaultValue);`

2. 使用`MyContext.Provider`包褒我们的组件，并使用`value`属性设置要传给子组的值

  `<MyContext.Provider value={/* 某个值 */}>`

  当 Provider 的 `value` 值发生变化时，它内部的所有消费组件都会重新渲染。
  `Provider` 及其内部 `consumer` 组件都不受制于 `shouldComponentUpdate` 函数，因此当 `consumer 组件`在其祖先组件退出更新的情况下也能更新
  
## 获取Context

1. 使用 `static` 这个类属性来初始化你的 `contextType`

  ```
  class MyClass extends React.Component {
    static contextType = MyContext;
    console.log('this.context', this.context)
    render() {
      let value = this.context;
      /* 基于这个值进行渲染工作 */
    }
  }
  ```

2. 使用`Class.contextType`将Context挂载到 Class的`contextType` 属性上

  ```
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