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

### Vue2.x Diff

过程可以概括为：`oldCh` 和 `newCh` 各有两个头尾的变量 `StartIdx` 和 `EndIdx` ，在一次遍历中，会使用他们做4种比较方式。

1. 新节点的首部节点与旧节点的首部节点是否相同

2. 新节点的尾部节点与旧节点的尾部节点是否相同

3. 新节点的头部节点与旧节点的尾部节点是否相同： 元素内部发生了位置变化，有个元素跑前面来了

4. 新节点的尾部节点与旧节点的着部节点是否相同： 元素内部发生了位置变化，有个元素跑后面去了

5. 如果4种比较都没匹配，则尝试通过 `key` 查找，这里分两种情况

  - 如果新节点有 `key`, 且能匹配到旧节点，则当做添加新节点处理

  - 如果新节点有 `key`, 且能匹配到旧节点，则先通过 `sameVnode` 方法判断这两个新旧节点是否相同，情况也分两种

    - 如果相同，则 `patchVnode` 继续对新旧节点做 `diff` 处理，并且交换位置

    - 如果不相同，则当做新节点做处理
    
### Vue3.x Diff

1. 从前往后遍历新旧子序列找到有相同的节点进行 `patch` 操作 ，如果发现不同的立即跳出循环

2. 从后往前遍历新旧子序列找到有相同的节点进行 `patch` 操作 ，如果发现不同的立即跳出循环

3. 如果旧的节点遍历完，新的节点没有遍历完 ，对于剩下的新节点全部以新增vnode处理

4. 如果新的节点遍历完，旧的节点没有遍历完，对于剩下的旧节点进行卸载处理

5. 如果 3、4 都不成立继续做进一步处理

  1. 遍历剩余的新节点，寻找 `key` 通过 `map 结构`保存起来

  2. 遍历剩余旧节点，查找是否存在相同的节点，有的话跟新节点做下映射，用于利用节点使用
  
  3. 如果不存在如果卸载旧节点
  
  4. 最后对剩余新节点做下遍历，通过前面映射关系，如果可复用的旧节点则进行节点的移动操作否则进行新增节点的操作
  
### Rect16 Diff

**TextNode**

判断老的 `children` 中的第一个节点是否也是文字节点，如果是就复用，如果不是就删除全部老的节点，创建新的文字节点

**React.Element**

优先在旧节点链中查找可以复用的节点，。如果没有找到可复用的节点则重新创建节点

**children diff**

- 首先遍历新数组，对相同 `index` 的新老节点进行对比，通过 `updateSlot` 方法找到可以复用的节点，直到找到不可以复用的节点就退出循环。

- 首次遍历完之后，就是删除老数组中剩余的老节点，追加剩余的新节点的过程。如果是新节点已遍历完成，就将剩余的老节点批量删除；如果是老节点遍历完成仍有新节点剩余，则将新节点直接插入。

- 上述遍历过程结束后，为了处理元素移动，最后会把所有老数组元素按 `key` 或 `index` 放 `Map` 里，然后再遍历新数组，从中找到复用的老数组元素插入到新数组中，达到移动元素目的。

### 对比

**相同点**

- 都是两组虚拟 dom 的对比(react16.8之后是 fiber 与虚拟dom的对比)

- 只对同级节点进行对比，简化了算法复杂度

- 都用 `key` 做为唯一标识，进行查找，只有key和标签类型相同时才会复用老节点

- 遍历前都会根据老的节点构建一个map，方便根据key快速查找

**不同点**

- react 在 Diff 遍历的时候，只对需要修改的节点进行了记录，形成 `effect list`，最后才会根据 `effect list` 进行真实 dom的修改，修改时先删除，然后更新与移动，最后插入

- vue 在遍历的时候就用真实 `dominsertBefore` 方法，修改了真实 dom，最后做的删除操作

- react 采用单指针从左向右进行遍历

- vue 采用双指针，从两头向中间进行遍历

- react 的 Diff 比较简单，Vue 中做了一些优化处理，相对复杂，但效率更高


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