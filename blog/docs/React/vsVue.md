# vsVue

## 模板渲染方式的不同

- Vue 模板的编写类似原生的 HTML 语法，一个 Vue组件通过模板+JavaScript+CSS的组合模式呈现（Vue更加注重web开发者的习惯），然后通过使用 Vue 内置很多 API 进行开发，如一些`v-model`，`v-if`,`v-for`,`watch`,`computed` 等等

- React 的特色在于函数式编程的理念，是通过JSX渲染模板，使用JS来创建页面模板，比如插值，条件，循环等，都是通过JS语法实现的，更加纯粹更加原生

   react 中我们 `import` 的组件在 `render` 中可以直接调用。但是在Vue中，由于模板中使用的数据都必须挂在 `this` 上进行一次中转，所以我们 `import` 一个组件完了之后，还需要在 `components` 中再声明下，这样显然是很奇怪但又不得不这样的做法

## 更新机制的区别

**获取数据更新的手段和更新的粒度不一样**

- Vue 通过依赖收集，当数据更新时， Vue 明确地知道是哪些数据更新了，每个组件都有自己的渲染 `watcher` ，掌管当前组件的视图更新，所以可以精确地更新对应的组件，所以更新的粒度是组件级别的，所以为了避免不必要的渲染需要通过 `shouldComponentUpdate` 这个生命周期方法可以进行控制

- React 会递归地把所有的子组件 `re-render` 一下，不管是不是更新的数据，此时，都是新的。然后通过 `diff` 算法 来决定更新哪部分的视图。所以，React 的更新粒度是一个整体

**对更新数据是否需要渲染页面的处理不一样**

- 只有依赖收集的数据发生更新，Vue 才会去重新渲染页面

- 只要数据有更新（ `setState`，`useState` 等手段触发更新），都会去重新渲染页面（可以使用 `shouldComponentUpdate/ PureComponent` 改善）

## HoC和mixins

- Vue组合不同功能的方式是通过mixin

- React组合不同功能的方式是通过HoC(高阶组件）

## diff算法区别

**相同点**

- 都是两组虚拟dom的对比(react16.8之后是fiber与虚拟dom的对比)

- 只对同级节点进行对比，简化了算法复杂度

- 都用key做为唯一标识，进行查找，只有key和标签类型相同时才会复用老节点

- 遍历前都会根据老的节点构建一个map，方便根据key快速查找

**不同点**

- react在diff遍历的时候，只对需要修改的节点进行了记录，形成effect list，最后才会根据effect list 进行真实dom的修改，修改时先删除，然后更新与移动，最后插入

- vue 在遍历的时候就用真实dominsertBefore方法，修改了真实dom，最后做的删除操作

- react 采用单指针从左向右进行遍历

- vue采用双指针，从两头向中间进行遍历

- react的虚拟diff比较简单，vue中做了一些优化处理，相对复杂，但效率更高


## Vuex和Redux的区别

**Redux 的核心概念**

- action： action默认是同步的 ，或借助中间件实现异步操作，`action` 不会改变 `store`，只是描述了怎么改变 `store`

- reducer: 纯函数，根据 `action` 更新出新的 store

- store：单一数据源

### Vuex 的核心概念

- mutation：用于同步操作直接修改 state

- action：可用于异步操作，再通过提交 `mutation` 进行 `store` 的更新

- store：单一数据源

**使用区别**

- 在 Vuex 中，`$store` 被直接注入到了组件实例中，因此可以比较灵活的使用：使用 `dispatch`、`commit` 提交更新，通过 `mapState` 或者直接通过 `this.$store` 来读取数据

- 在 Redux 中，通常需要借助 `connect` 来获取 Action 生成 `Action Creators` ， 同时将 `Action Creators` 传递给子组件，所以子组件不需要直接使用 `dispatch` 方法，而是直接调用该方法即可触发 `Action`

另外Vuex更加灵活一些，组件中既可以 `dispatch action`，也可以 `commit updates`，而Redux中只能进行 `dispatch`，不能直接调用 `reducer`进行修改。

**实现原理**

Redux使用的是不可变数据，而Vuex的数据是可变的

- Redux每次都是用 `新state` 替换 `旧state` ，Redux在检测数据变化的时候，是通过diff的方式比较差异的

- Vuex是对需要修改的属性进行直接修改，而Vuex其实和Vue的原理一样，是通过 `getter/setter` 来比较的

### 处理异步操作

Redux 得益于 中间件机制，利用 `redux-thunk`， `redux-thunk` 可以 `dispatch` 函数，这个函数用于生成 `action`，所以在这个函数里面我们可以进行异步操作，等异步的结果出来后再放在 `action` 里面将这个 `action` 用 `dispatch` 分发出去, 而这个函数被叫做 “action creator” 

而 Vuex 是用 `mutation` 来对应 Redux 的 `action`，另外 Vuex 又创造了一个 `action` 来提交 `mutation` 并通过异步提交 `mutation` 来实现异步操作结果能够到达 `state`

## 总结

React更偏向于构建稳定大型的应用，非常的科班化。相比之下，Vue 更偏向于简单迅速的解决问题，更灵活，不那么严格遵循条条框框。因此也会给人一种大型项目用 React，小型项目用 Vue 的感觉