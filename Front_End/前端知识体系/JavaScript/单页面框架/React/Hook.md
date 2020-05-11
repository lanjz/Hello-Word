# Hook

Hook 是 React16 引入的新特性，Hook是一个特殊的函数可以在函数组件中绑定`state`和生命周期方法，使得我们可以不用 Class 也可以使用 React。

## State Hook

使用官方的例子： 

```
import React, { useState } from 'react';

function Example() {
  // 声明一个叫 "count" 的 state 变量
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```

上面使用Hook `const [count, setCount] = useState(0);`包含以下信息：

- 声明一个叫 `count` 的 `state` 变量

- 这个`count`的初始值是`0`

- 使用`setCount`方法进行修改这个`count`的值


我们单从代码角度去分析这个`useState`方法，我们给这个方法传入一个参数`0`，这个方法返回当前 `state` 以及更新 `state 的函数`,
例子中我们使用了`[count, setCount]`去接收它们

## Effect Hook

Effect Hook 可以让你在函数组件中执行副作用操作

> 数据获取，设置订阅以及手动更改 React 组件中的 DOM 都属于副作用

官方例子：

```
import React, { useState, useEffect } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `You clicked ${count} times`;
  });

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```

`useEffect` 的作用：

- 告诉 React 组件需要在渲染后执行某些操作

- 并且在执行 DOM 更新之后调用它

从这里可以看出，`useEffect`的作用相当同时定义了`componentDidMount`和`conponetDidUpdate`两个生命周期函数，例子中我们点击按钮增加计数
的同时，页面的`title`也会发生变化，说明每次都会执行`useEffect`中的方法

### 清除Effect

即希望有`componentWillUnMount`的功能，在Hook中的实现方式是在`useEffect`方法中添置一个`return fn`

```
useEffect(function () {
        // 组件渲染完成时执行
        // do something
        return () => {
            console.log('unMount') // // 组件将御载时执行
        }
    })
```

### 只在特定条件下执行 effectHook

在某些情况下，每次渲染后都执行清理或者执行 `effect` 可能会导致性能问题, 在 class 组件中，我们可以使用`componentDidMount`方法定义组件在
渲染完成时要做的事情，使用`componentDidUpdate`方法控制组件更新时要做的事情

```
componentDidUpdate(prevProps, prevState) {
  if (prevState.count !== this.state.count) {
    document.title = `You clicked ${this.state.count} times`;
  }
}
```

在`useEffect`中，通过传入第二个参数来实现上面的功能

```
useEffect(() => {
  document.title = `You clicked ${count} times`;
}, [count]) // 仅在 count 更改时更新
```

第二个参数是个数组，数组中元素可以是 `props` 或 `state`,添加这个参数后表示当前这个`effect`只在这个数组中的元素发生变化后才执行，
例子中则是`count`发生变化后才会执行`effect`

第二个参数也可以是`props`中的属性

```
useEffect(() => {
  document.title = `You clicked ${props.count} times`;
}, [props.count]) // 仅在 count 更改时更新
```

那如何实现`componentDidMount`钩子只在组件渲染时执行一次的功能？ 只需要把第二个参数设为一个空数组就可以了：

```
useEffect(() => {
  document.title = `You clicked ${props.count} times`;
}, []) // 只在组件渲染时执行一次
```

## useMemo

`const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);`

返回一个 `memoized` 值

把“创建”函数和依赖项数组作为参数传入 `useMemo`，它仅会在某个依赖项改变时才重新计算 `memoized` 值。
这种优化有助于避免在每次渲染时都进行高开销的计算

例子：

```
function App() {
    // 声明一个叫 "count" 的 state 变量
    const [count, setCount] = useState(0);
    function doSomething() {
        console.log('doSomething')
    }
    const abc = doSomething()
    return (
        <div>
            <p>You clicked {count} times</p>
            <button onClick={() => setCount(count+1)}>
                Click me
            </button>
        </div>
    );
}
```

上面的例子中，每次点击更新`count`的时候，都会触发组件渲染，然后`doSomething`每次都会执行，如果这个函数有非常耗时的计算，那无疑会影响组件
性能，接下来我们使用`useMemo`优化

```
function App() {
    // 声明一个叫 "count" 的 state 变量
    const [count, setCount] = useState(0);
    function doSomething() {
        console.log('doSomething')
        return 'abc'
    }
    const abc = useMemo(() => doSomething(), [])
    return (
        <div>
            <p>You clicked {count} times {abc}</p>
            <button onClick={() => setCount(count+1)}>
                Click me
            </button>
        </div>
    );
}
```

使用`useMemo`包装`doSomething`方法，第二参数是一个数组，存放的是当前`doSomething`方法依赖的属性，上面传入的空数组，意味着`doSomething`
只会在组件首次渲染的时候才会执行。

如果我们改为：`const abc = useMemo(() => doSomething(), [count])`,那么只在`count`改变时，`doSomething`才会执行

## useCallback

```
const memoizedCallback = useCallback(
  () => {
    doSomething(a, b);
  },
  [a, b],
);
```

返回一个 `memoized` 回调函数。

把内联回调函数及依赖项数组作为参数传入 `useCallback`，它将返回该回调函数的 `memoized` 版本，该回调函数仅在某个依赖项改变时才会更新



## 自定义Hook

自定义Hook就是将`useState`和`useEffect`放在一个公共函数中，这个函数就成了一个`Hook`，这样就可以让多个组件使用这个`Hook`

```
import { useState, useEffect } from 'react';

export default function useCount(init) {
    const [count, setCount] = useState(init);
    useEffect(function () {
        // setCount(count+10)
        setTimeout(() => {
            setCount(count+10)
        }, 1000)
    }, )
    return count
}

```

使用：

```
import React, { useState, useEffect } from 'react';
import useCount from './helper/hook/useCount'

function App() {
    const isOnline = useCount(10)
    return (
        <div>
            <p>自定义Hook:{isOnline}</p>
        </div>
    );
}

export default App;
```

**自定义hook的注意点**

- 自定义 Hook 必须以 “use” 开头

- 在两个组件中使用相同的 Hook 不会共享 state

- 组合更新时，自定义 Hook中的`effect`的执行规则也是一样的，我们可以利用这种做 hook 通信

  ```
  // 自定义hook
  import { useState, useEffect } from 'react';
  
  export default function useCount(init) {
      const [count, setCount] = useState(init);
      useEffect(function () {
          console.log(init) // 接收新的init
          return
      })
      return count
  }
  -------------------------------------------------
  //
   import React, { useState, useEffect } from 'react';
   import logo from './logo.svg';
   import useCount from './helper/hook/useCount'
   import './App.css';
   import Inbox from './pages/Inbox'
   
   function App() {
       // 声明一个叫 "count" 的 state 变量
       const [count, setCount] = useState(0);
       const count2 = useCount(count)
       function f() {
           setCount(count + 1)
       }
       return (
           <div>
               <p>You clicked {count} times</p>
               <button onClick={f}>
                   Click me
               </button>
               {
                   count%2 === 0 && <Inbox></Inbox>
               }
           </div>
       );
   }
   
   export default App;


  ```

## Hook使用规则

- 不要在循环，条件或嵌套函数中调用 Hook， 确保总是在你的 React 函数的最顶层调用他们。

- 只在 React 函数中调用 Hook

  - 不要在循环，条件或嵌套函数中调用 Hook， 确保总是在你的 React 函数的最顶层调用他们。

  - 在自定义 Hook 中调用其他 Hook 


[什么时候使用 useMemo 和 useCallback](https://jancat.github.io/post/2019/translation-usememo-and-usecallback/)