# Vuex

Vuex 是一个专为 Vue.js 应用程序开发的状态管理模式。它采用集中式存储管理应用的所有组件的状态，并以相应的规则保证状态以一种可预测的方式发生变化。

Vuex 应用的核心就是 `store`（仓库）。“store”基本上就是一个容器，它包含着你的应用中大部分的状态 (`state`)。有些同学可能会问，那我定义一个全局对象，再去上层封装了一些数据存取的接口不也可以么？

Vuex 和单纯的全局对象有以下两点不同：

- Vuex 的状态存储是响应式的。当 Vue 组件从 store 中读取状态的时候，若 store 中的状态发生变化，那么相应的组件也会相应地得到高效更新。

- 你不能直接改变 store 中的状态。改变 store 中的状态的唯一途径就是显式地提交 (commit) mutation。这样使得我们可以方便地跟踪每一个状态的变化，从而让我们能够实现一些工具帮助我们更好地了解我们的应用。

# 原理

Vuex同样存在一个`install`方法，`install`的逻辑是使用`Vue.minxin`方法全局混入了一个`beforeCreate`钩子函数，把`store`保存在所有组件的`this.$sotre`中，这个`options.store`就是实例化`Store`对象的实例，这也是为什么我们在组件中可以通过 `this.$store` 访问到这个实例。一个`options.store`的结构如下：

```
export default new Vuex.Store({
  actions,
  getters,
  state,
  mutations,
  modules
  // ...
})
```

## state是如何响应式的

在store实例化时会实例化一个Vue实例

```
store._vm = new Vue({
  data: {
    $$state: state
  },
  computed
})

```

我们发现 `data` 选项里定义了 `$$state` 属性，所以`satate`是借助了Vue 的`data`是向应式的，
而我们访问 `store.state` 的时候，实际上会访问 Store 类上定义的 `state` 的 `get` 方法：

```
get state () {
  return this._vm._data.$$state
}
```

## getter实现

`getters`则是借助vue的计算属性`computed`实现数据实时监听

## 那么 `getters` 和 `state` 是如何建立依赖逻辑的呢，我们再看这段代码逻辑：

```
forEachValue(wrappedGetters, (fn, key) => {
    // use computed to leverage its lazy-caching mechanism
    computed[key] = () => fn(store)
    Object.defineProperty(store.getters, key, {
      get: () => store._vm[key],
      enumerable: true // for local getters
    })
  })
```

当我根据 key 访问 `store.getters` 的某一个 `getter` 的时候，实际上就是访问了 `store._vm[key]`，也就是 `computed[key]`，在执行 `computed[key]` 对应的函数的时候，会执行 `rawGetter(local.state,...)` 方法，那么就会访问到 `store.state`，进而访问到 `store._vm._data.$$state`，这样就建立了一个依赖关系。当 `store.state` 发生变化的时候，下一次再访问 `store.getters` 的时候会重新计算

