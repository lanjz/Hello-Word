# Vue和React的区别

## Vuex 和 Redux 的区别

**组件获取`state`**

- Vuex是数据是以注入的形式，添到所有组件中，所以所有组件都访问 state

  - 使用 dispatch 和 commit 提交更新
 
  - 通过 mapState 或者直接通过 this.$store 来读取数据

- 在 Redux 中，我们每一个组件都需要显式地用 `connect` 把需要的 `props` 和 `dispatch` 连接起来

**修改`state`**

- Vuex 更加灵活一些，组件中既可以 `dispatch action` 也可以 `commit updates`

- 而 Redux 中只能进行 `dispatch`，并不能直接调用 `reducer` 进行修改

**实现原理**

- Redux 使用的是不可变数据，而 Vuex 的数据是可变的。Redux 每次都是用新的 state 替换旧的 state，而 Vuex 是直接修改

- Redux 在检测数据变化的时候，是通过 diff 的方式比较差异的，而 Vuex 其实和 Vue 的原理一样，是通过 getter/setter 来比较的

## Diff 算法区别

**React 的 diff 策略**

React 的 diff 策略将时间复杂度优化到了 O(n)，这一壮举是通过以下三条策略来实现的：

- Web UI 中 DOM 节点跨层级的移动操作特别少，可以忽略不计，所以 React 的 diff 是同层级比较

- 拥有相同类型的两个组件将会生成相似的树形结构，不同类型的两个组件将会生成不同的树形结构

- 对于同一层级的一组子节点，它们可以通过唯一 id 进行区分

这三个策略分别对于 tree diff、component diff 和 element diff

**tree diff**

既然 DOM 节点跨层级的移动操作少到可以忽略不计，针对这一现象，React 只会对相同层级的 DOM 节点进行比较，即同一个父节点下的所有子节点。当发现节点已经不存在时，则该节点及其子节点会被完全删除掉，不会用于进一步的比较。这样只需要对树进行一次遍历，便能完成整个 DOM 树的比较。

![](https://img.kancloud.cn/10/d4/10d4ca61b2debe4a05ab7202912dac12_918x492.png)

这个策略的前提是操作 DOM 时跨层级操作较少，那么如果发生了跨层级操作应该如何处理呢？

![](https://img.kancloud.cn/dc/14/dc145d9c99650747b5657b28aa37a79e_710x415.png)

这一过程可以用下图来描述：

![](https://img.kancloud.cn/b6/34/b634dc3fd6f1d1ecb7042bd771228b13_1289x270.png)

**component diff**

React 是基于组件构建应用的，对于组件间的比较所采取的策略也是非常简洁、高效的：

- 如果是同一类型的组件，按照原策略继续比较 Virtual DOM 树即可

- 如果不是，则将该组件判断为 dirty component，从而替换整个组件下的所有子节点

- 对于同一类型的组件，有可能其 Virtual DOM 没有任何变化，如果能够确切知道这点，那么就可以节省大量的 diff 运算时间。因此，React 允许用户通过 shouldComponentUpdate() 来判断该组件是否需要进行 diff 算法分析，但是如果调用了 forceUpdate 方法，shouldComponentUpdate 则失效

接下来我们看下面这个例子是如何实现转换的

![](https://img.kancloud.cn/b2/29/b2290d26c07c3f4997be48204b22fb1a_745x232.png)

转换流程如下：

![](https://img.kancloud.cn/1d/fa/1dfa56cb64b6d96c3e01d3fef382a20c_1115x241.png)

当组件 D 变为组件 G 时，即使这两个组件结构相似，一旦 React 判断 D 和 G 是不同类型的组件，就不会比较二者的结构，而是直接删除组件 D，重新创建组件 G 及其子节点。虽然当两个组件是不同类型但结构相似时，diff 会影响性能，但正如 React 官方博客所言:不同类型的组件很少存在相似 DOM 树的情况，因此这种极端因素很难在实际开发过程中造成重大的影响。

**element diff**

当节点处于同一层级时，diff 提供了 3 种节点操作，分别为 INSERT_MARKUP (插入)、MOVE_EXISTING (移动)和 REMOVE_NODE (删除)

- INSERT_MARKUP ：新的组件类型不在旧集合里，即全新的节点，需要对新节点执行插入操作

- MOVE_EXISTING ：旧集合中有新组件类型，且 element 是可更新的类型，generateComponentChildren 已调用 receiveComponent ，这种情况下 prevChild = nextChild ，就需要做移动操作，可以复用以前的 DOM 节点

- REMOVE_NODE ：旧组件类型，在新集合里也有，但对应的 element 不同则不能直接复用和更新，需要执行删除操作，或者旧组件不在新集合里的，也需要执行删除操作

当一个组件包含多个子组件的情况：

```
<ul>
  <TodoItem text="First" completed={false} />
  <TodoItem text="Second" completed={false} />
</ul>

// 更新为
<ul>
  <TodoItem text="Zero" completed={false} />
  <TodoItem text="First" completed={false} />
  <TodoItem text="Second" completed={false} />
</ul>
```

直观上看，只需要创建一个新组件，更新之前的两个组件；但是实际情况并不是这样的，React 并没有找出两个序列的精确差别，而是直接挨个比较每个子组件。
在上面的新的 TodoItem 实例插入在第一位的例子中，React 会首先认为把 text 为 First 的 TodoItem 组件实例的 text 改成了 Zero，text 为 Second 的 TodoItem 组件实例的 text 改成了 First，在最后面多出了一个 TodoItem 组件实例。这样的操作的后果就是，现存的两个实例的 text 属性被改变了，强迫它们完成了一个更新过程，创造出来的新的 TodoItem 实例用来显示 Second。
我们可以看到，理想情况下只需要增加一个 TodoItem 组件，但实际上其还强制引发了其他组件实例的更新。

假设有 100 个组件实例，那么就会引发 100 次更新，这明显是一个浪费；所以就需要开发人员在写代码的时候提供一点小小的帮助，这就是接下来要讲的 key 的作用

```
<ul>
  <TodoItem key={1} text="First" completed={false} />
  <TodoItem key={2} text="Second" completed={false} />
</ul>

// 新增一个 TodoItem 实例
<ul>
  <TodoItem key={0} text="Zero" completed={false} />
  <TodoItem key={1} text="First" completed={false} />
  <TodoItem key={2} text="Second" completed={false} />
</ul>

```

React 根据 key 值，就可以知道现在的第二个和第三个 TodoItem 实例其实就是之前的第一个和第二个实例，所以 React 就会把新创建的 TodoItem 实例插在第一位，对于原有的两个 TodoItem 实例只用原有的 props 来启动更新过程，这样 shouldComponentUpdate 就会发生作用，避免无谓的更新操作；

了解了这些之后，我们就知道 key 值应该是唯一且稳定不变的

比如用数组下标值作为 key 就是一个典型的 “错误”，看起来 key 值是唯一的，但是却不是稳定不变的（但是一般用数组下标就行了）

比如：[a, b, c] 值与下标的对应关系：a: 0 b:1 c:2
删除a -> [b, c] 值与下标的对应关系 b:0 c:1
无法用 key 值来确定比对关系（新的 b 应该与旧的 b 比，如果按 key 值则是与 a 比）

![](https://box.kancloud.cn/843f670bb548fca2492bf347a2d0c3f6_501x135.png)

[react和vue区别](https://www.kancloud.cn/chenmk/web-knowledges/1201810)