[React 源码分析](https://juejin.im/user/5c2596cd6fb9a04a016464c3/posts)

# Component

创建组件的方式之就是一创建一个继承 `React.Component` 的类

```js
class Welcome extends React.Component {
  constructor(props){  
    super(props)   
    this.state={ } 
  }  
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```

### 源码定义

```js
  function Component(props, context, updater) {
    this.props = props;
    this.context = context; // If a hllComponent has string refs, we will assign a different object later.

    this.refs = emptyObject; // We initialize the default updater but the real one gets injected by the
    // renderer.

    this.updater = updater || ReactNoopUpdateQueue;
  }

  Component.prototype.isReactComponent = {};
  /**
   * 使用setState来改变Component内部的变量
   * this.state并不是立即更新的，所以在调用this.setState后可能 不能 拿到新值
   * 不能保证this.state是同步的（它也不是异步的），使用回调获取最新值
   * @param {object|function} 可以是Object/Function
   *        produce next partial state to be merged with current state.
   * @param {?function} callback Called after state is updated.
   * @final
   * @protected
   */

  Component.prototype.setState = function (partialState, callback) {
    if (!(typeof partialState === 'object' || typeof partialState === 'function' || partialState == null)) {
      {
        throw Error( "setState(...): takes an object of state variables to update or a function which returns an object of state variables." );
      }
    }

    this.updater.enqueueSetState(this, partialState, callback, 'setState');
  };
  /**
   * 强制Component更新一次，无论props/state是否更新
   * forceUpdate不调用shouldComponentUpdate方法，但会调用componentWillUpdate和componentDidUpdate方法
   *
   * @param {?function} callback Called after update is complete.
   * @final
   * @protected
   */

  Component.prototype.forceUpdate = function (callback) {
    this.updater.enqueueForceUpdate(this, callback, 'forceUpdate');
  };
```

解析：

- `React.Component()` 只涉及了 `props/context/refs/updater/isReactComponent/setState/forceUpdate`，其他均没有自己实现

- `setState()` 是 `Component` 原型上的方法，其本质是调用 `ReactNoopUpdateQueue.js` 中的 `enqueueSetState()` 方法

## PureComponent

`React.PureComponent` 与 `React.Component` 很相似。两者的区别在于 `React.Component` 并未实现 `shouldComponentUpdate()`，而 `React.PureComponent` 中以浅层对比 `prop` 和 `state` 的方式来实现了该函数

对于相同的 `props` 和 `state` 组件不会重新渲染，所以在某些情况下使用 `React.PureComponent` 可提高性能

### 源码定义 

```js
// 虚拟组件
function ComponentDummy() {}

//ComponentDummy的原型 指向 Component的原型
ComponentDummy.prototype = Component.prototype;
function PureComponent(props, context, updater) {
    this.props = props;
    this.context = context; // If a hllComponent has string refs, we will assign a different object later.

    this.refs = emptyObject;
    this.updater = updater || ReactNoopUpdateQueue;
}
//将Component的方法拷贝到pureComponentPrototype上
// 用ComponentDummy的原因是为了不直接实例化一个Component实例，可以减少一些内存使用
var pureComponentPrototype = PureComponent.prototype = new ComponentDummy();
pureComponentPrototype.constructor = PureComponent; // Avoid an extra prototype jump for these methods.

//避免多一次原型链查找,因为上面两句已经让PureComponent继承了Component
//下面多写了一句Object.assign()，是为了避免多一次原型链查找
// 将Component.prototype上的方法都复制到PureComponent.prototype上
_assign(pureComponentPrototype, Component.prototype);

// 添加了isPureReactComponent属性去表示该Component是PureComponent
pureComponentPrototype.isPureReactComponent = true;
```

解析：

1. `const pureComponentPrototype = (PureComponent.prototype = new ComponentDummy())`

  新建了空方法 `ComponentDummy` ，并继承 `Component` 的原型; `PureComponent.prototype` 等于 `ComponentDummy` 的实例

  这样做的目的是：如果让 `PureComponent.prototype` 直接等于 `Component` 的实例对象的话（继承原型），会多继承 `Component` 的 `constructor` ，但是 `PureComponent` 已经有自己的 `constructor` 了，这样就会多消耗一些内存

2. `pureComponentPrototype.constructor = PureComponent` 

  原型的 `constructor` 等于自身，覆盖掉 `Component.prototype` 的 `constructor`

  1、2 就是让 `PureComponent` 继承 `Component`

3. `_assign(pureComponentPrototype, Component.prototype);`

  `Component.prototype` 中的方法在 `PureComponent.prototype` 中都有，无需再从 `__proto__` 上查找了为了减少一次原型链查找

4. `pureComponentPrototype.isPureReactComponent = true`

  在 `ReactFiberClassComponent.js` 中，有对 `isPureReactComponent` 的判断：

  ```js
   if (ctor.prototype && ctor.prototype.isPureReactComponent) {
       return ( !shallowEqual(oldProps, newProps) || !shallowEqual(oldState, newState));  
   }
  ```

**注意点**

- 整个 React 中判断 Component 类 是否需要更新，只有两个地方：

  1. 是看有没有 `shouldComponentUpdate` 方法
  
  2. `ReactFiberClassComponent.js` 中的 `checkShouldComponentUpdate()` 中对 `PureComponent` 的判断

- `PureComponent` 与 `Component` 唯一的区别：`PureComponent` 是自带了一个简单的 `shouldComponentUpdate` 来优化更新机制的

