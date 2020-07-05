# redux核心概念

**`state`**

一个普通对象，表示一个数据集

```
{
todos: [{
  text: 'Eat food',
  completed: true
}, {
  text: 'Exercise',
  completed: false
}],
visibilityFilter: 'SHOW_COMPLETED'
}
```

**`action`**

`Action` 就是一个普通 JavaScript 对象,用来描述发生了什么

```
{ type: 'ADD_TODO', text: 'Go to swimming pool' }
{ type: 'TOGGLE_TODO', index: 1 }
{ type: 'SET_VISIBILITY_FILTER', filter: 'SHOW_ALL' }
```

**reducer**

连 `action` 和 `state` 的辅助函数，一个`reducer`接收`state`和`action`作为参数，并返回一个新的`state`

```
function visibilityFilter(state = 'SHOW_ALL', action) {
  if (action.type === 'SET_VISIBILITY_FILTER') {
    return action.filter;
  } else {
    return state;
  }
}

function todos(state = [], action) {
  switch (action.type) {
  case 'ADD_TODO':
    return state.concat([{ text: action.text, completed: false }]);
  case 'TOGGLE_TODO':
    return state.map((todo, index) =>
      action.index === index ?
        { text: todo.text, completed: !todo.completed } :
        todo
   )
  default:
    return state;
  }
}
```

**总结三者的关系**

通过`action`来执行更新`store`的行为,但是`action`具体如何更新`stire`需要通过`reducers`



# redux和React-redux的几个重要概念

## action

Action 是把数据从应用传到 `store` 的有效载荷。它是 `store` 数据的唯一来源。一般来说你会通过 `store.dispatch()` 将 `action` 传到 `store`。

## reducer

Reducers 指定了应用状态的变化如何响应 `actions`并发送到 `store` 的，记住 `actions` 只是描述了有事情发生了这一事实，并没有描述应用如何更新 `state`

## store

store就是把action和reducer联系到一起的对象, store本质上是一个状态树，保存了所有对象的状态。任何UI组件都可以直接从store访问特定对象的状态

## Provider

Provider 其实就只是一个外层容器，它的作用就是通过配合 `connect` 来达到跨层级传递数据

使用时只需将Provider定义为整个项目最外层的组件，并设置好`store`。那么整个项目都可以直接获取这个`store`。它的原理其实是通过React中的`[Context]()`
来实现的

## connect

connect 的作用是连接React组件与 Redux store，它包在我们的容器组件的外一层，它接收上面 Provider 提供的 store 里面的 state 和 dispatch，传给一个构造函数，返回一个对象，以属性形式传给我们的容器组件。

它共有四个参数mapStateToProps, mapDispatchToProps, mergeProps以及options

- `mapStateToProps` 的作用是将`store`里的`state`（数据源）绑定到指定组件的`props`中

- `mapDispatchToProps` 的作用是将`store`里的`action`（操作数据的方法）绑定到指定组件的`props`中

