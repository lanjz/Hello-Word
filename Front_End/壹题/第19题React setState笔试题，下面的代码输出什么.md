```
class Example extends React.Component {
  constructor() {
    super();
    this.state = {
      val: 0
    };
  }
  
  componentDidMount() {
    this.setState({val: this.state.val + 1});
    console.log(this.state.val);    // 第 1 次 log

    this.setState({val: this.state.val + 1});
    console.log(this.state.val);    // 第 2 次 log

    setTimeout(() => {
      this.setState({val: this.state.val + 1});
      console.log(this.state.val);  // 第 3 次 log

      this.setState({val: this.state.val + 1});
      console.log(this.state.val);  // 第 4 次 log
    }, 0);
  }

  render() {
    return null;
  }
};
```

1. 第一次和第二次的log都是在React生命周期`componentDidMount`中执行的，此时`isBatchingUpdate`为`true`，所以state不会立即更新，而是加入`dirtyComponents`，所以打印获取的更新前的状态`0`

2. 两个执行前`setState`前`val`的值是都是0，都两次执行都是将`0`变成`1`，React会合并，只执行一次。所以这两个执行后的`val`的值是1

3. `setTimeout`中的代码执行时，`isBatchingUpdate`为`false`，所以能够直接更新，所以接着输出2和3

## isBatchingUpdate

React在处理自身生命周期和事件触发的函数时，`isBatchingUpdate`为`true`
