# Vue-Router

Vue Router 是基于 Vue.js 实现的前端路由管理器，它允许开发者构建单页面应用中的页面路由功能。Vue Router 的实现原理主要依赖于两大核心概念：路由模式和组件渲染。

## 路由模式

Hash 模式：使用 URL 的 hash 来实现路由。这种模式下，当 URL 的 hash 部分改变时，页面不会重新加载，但可以触发 Vue Router 更新视图的逻辑。这是通过监听 `hashchange` 事件来实现的。

History 模式：利用 HTML5 History API（主要是 pushState 和 replaceState 方法）来实现路由。这种模式允许你操作浏览器历史记录栈，实现无刷新的页面跳转。Vue Router 在这种模式下通过监听 popstate 事件来响应 URL 的变化。

Abstract 模式：主要用于不支持 Hash 模式和 History 模式的环境（如 Node.js 服务器端渲染），或者在某些旧的浏览器中。这种模式下，Vue Router 会在内存中模拟一个路由栈来管理路由的跳转。

## 组件渲染

Vue Router 的组件渲染依赖于 Vue.js 的动态组件和 `<router-view>` 容器。每当路由变化时，Vue Router 将解析对应的路由配置，并将相应的组件渲染到 `<router-view>` 中

```js
// router-view 组件的关键源码
export default {
  name: 'RouterView',
  functional: true, // 指明这是一个功能性组件
  render(h, { parent, data }) {
    let depth = 0;
    data.routerView = true; // 标记当前组件为 router-view

    // 通过 parent 查找当前 router-view 的深度
    while (parent && parent._routerRoot !== parent) {
      const vnodeData = parent.$vnode ? parent.$vnode.data : {};
      if (vnodeData.routerView) {
        depth++;
      }
      parent = parent.$parent;
    }

    // 根据深度获取对应的路由匹配对象
    // 同时访问 parent.$route 时会被 Object.defineProperty 定义的 get 方法劫持，将当前 RouterView 渲染事件进行收集
    const matched = parent.$route.matched[depth];
    if (!matched) {
      return h(); // 如果没有匹配的路由，渲染空节点
    }

    // 获取要渲染的组件
    const component = matched.components.default;

    // 在 data 上设置组件的 key，用于优化重渲染性能
    if (data.key === null && component) {
      data.key = component.name || 'anonymous';
    }

    // 使用 createElement 函数渲染组件
    return h(component, data);
  },
};
```

从源码可以看到 `<router-view>` 是一个动态渲染的组件，他们根据当前路径找到对应的路由组件，再利用 `render` 方法进行渲染

## $route/$router属性

每个组件都有一个 `$route/$router` 属性，这个 `$route/$router` 是从哪来的咧？

Vue 在安装 `vue-router` 插件的时候，会调用 `vue-router` 中的 `install` 方法，`install` 中有个 `Vue.mixin` 方法

```js
Vue.mixin({
  beforeCreate: function beforeCreate () {
    if (isDef(this.$options.router)) {
      this._routerRoot = this;
      this._router = this.$options.router;
      this._router.init(this);
      Vue.util.defineReactive(this, '_route', this._router.history.current);
    } else {
      this._routerRoot = (this.$parent && this.$parent._routerRoot) || this;
    }
    registerInstance(this, this);
  },
  destroyed: function destroyed () {
    registerInstance(this);
  }
});
```

`_routerRoot` 是利用 `Vue.mixin` 方法在每个组件注入的一个属性，注入方式分两种情况：

1. 判断是否存在 `this.$options.router`，一般来说只有根组件才会这个属性，因为这个属性初始化 Vue 实例时传入的，这个 `router` 就是 `vue-router` 的实例

   ```js
    new Vue({
        router,
        render:(h)=> h(App)
    }).$mount(root)
   ``` 

2. 否则取 `$parent` 父组件上的 `_routerRoot`

所以每个组件都会有一个 `_routerRoot` 属性并且指向同一个 router 实例对象

然后在 `mixin` 下方有这么两行语句

```js
 Object.defineProperty(Vue.prototype, '$router', {
    get: function get () { return this._routerRoot._router }
  });
  
Object.defineProperty(Vue.prototype, '$route', {
  get: function get () { return this._routerRoot._route }
});
```

可以看到 `$route/$router` 定义在 Vue 原型中，实际上指向的是当前组件的 `this._routerRoot` 对中的 `_router` 与 `_route` 属性

## $router实现响应机制

`$router` 属性的响应机制的添加也是在 `install` 中添加

```js
if (isDef(this.$options.router)) {
  this._routerRoot = this;
  this._router = this.$options.router;
  this._router.init(this);
  Vue.util.defineReactive(this, '_route', this._router.history.current);
}
```

在根 Vue 实例中使用 `Vue.util.defineReactive(this, '_route', this._router.history.current)`，给 `_route` 属性添加了监听机制，之后当我们访问 `_route` 属性时就会去收集相关的 `render Watcher ` 

### 依赖收集

上文通过 `Vue.util.defineReactive` 对 `_route` 属性进行的监听，以响应式机制的原理可以知道依赖的收集是在访问 `_route` 属性的时候添加的

之前提到 `RouterView` 组件的实现源码中，在渲染 `RouterView` 组件时会访问 `parent.$route` 属性，此时会被 `Object.defineProperty` 定义的 `get` 方法劫持，此时 `Dep.target` 就是 `RouterView` 所在的组件，会把这个组件 `render Watcher` 收集到父组件的 `_router` 的收集器 `Dep` 中,这一步就完成了对事件的收集

之后当我们在组件调用 `this.$router.push` 方法改变路由时就会更新 `$route` 属性，就会触发依赖的更新方法从而更新视图了

## Push方法做哪些事？

调用  `this.$router.push(location, onComplete, onAbort)` 时实际上执行的 ` this.history.push(location, onComplete, onAbort)` 方法

```js
// Vue Router 源码中的简化版本，具体实现可能会有所不同
class VueRouter {
  // ...

  push(location, onComplete, onAbort) {
    // this.history 指向当前使用的 History 实现（HTML5History, HashHistory, 或 AbstractHistory）
    this.history.push(location, onComplete, onAbort);
  }

  // ...
}

class History {
  // ...

  push(location, onComplete, onAbort) {
    // 确认导航，执行守卫和钩子
    this.transitionTo(route, (route) => {
      // 实际改变 URL
      pushState(cleanPath(this.base + route.fullPath));
      // 调用 onComplete
      onComplete && onComplete(route);
    }, onAbort);
  }
  transitionTo(location, onComplete, onAbort) {
    // 根据 location 解析出新的路由对象
    const route = this.router.match(location, this.current);

    // 确认导航：检查要导航到的路由与当前路由是否相同，执行路由守卫等
    this.confirmTransition(route, () => {
      // 更新路由状态
      this.updateRoute(route);
      // 调用 HTML5 History API 或修改 hash 更新 URL
      pushState(cleanPath(this.base + route.fullPath));
      // 执行 onComplete 回调
      onComplete && onComplete(route);
      // 触发 afterEach 钩子
      this.router.afterHooks.forEach(hook => {
        hook && hook(route, this.current);
      });
    }, onAbort);
  }

  updateRoute(route) {
    // 更新当前路由对象
    this.current = route;
    // 通知依赖此状态的 Vue 组件重新渲染
    this.cb && this.cb(route);
  }
  // ...
}

function pushState(url) {
  // 使用 history.pushState API 更新浏览器地址栏
  history.pushState({ key: Date.now().toFixed(3) }, '', url);
}

// cb 的作用 更新 组件中的 ._route 属性
history.listen(function (route) {
    this$1.apps.forEach(function (app) {
        app._route = route;
    });
});
```

关键步骤详解

1. `push` 方法调用：当你调用 `$router.push` 时，实际上是在调用 History 类的实例方法 `push`。   
2. 路由解析：方法内部首先解析传入的 `location` 参数，将其转换为一个标准的路由位置对象。   
3. 执行 `transitionTo`：这个方法负责执行路由的过渡操作。它会检查目标路由与当前路由的差异，执行相应的导航守卫和钩子函数，最后确认是否进行导航。   
4. 更新 URL：确认导航后，使用 HTML5 的 `history.pushState` 方法（或在 Hash 模式下修改 hash），更新浏览器的地址栏，而不会触发页面重载。   
5. 更新路由状态：更新 Vue Router 的内部状态，包括当前路由对象 $route，触发 Vue 的响应式系统更新对应的视图
6. 调用回调：导航完成后，如果提供了 `onComplete` 回调函数，则调用之。

## RouterView/RouterLink

`RouterView/RouterLink` 组件能在所有组件中使用也是因为 `install` 中，对两个组件进行的全局注册

```js
Vue.component('RouterView', View);
Vue.component('RouterLink', Link);
```

## 路由导航

### 全局前置守卫

```js
const router = new VueRouter({ ... })

router.beforeEach((to, from, next) => {
  // ...
})
```

当一个导航触发时，全局前置守卫按照创建顺序调用。守卫是异步解析执行，此时导航在所有守卫 `resolve` 完之前一直处于 等待中

每个守卫方法接收三个参数：

- `to: Route`: 即将要进入的目标 路由对象

- `from: Route`: 当前导航正要离开的路由

- `next: Function`: 一定要调用该方法来 `resolve` 这个钩子.执行效果依赖 `next` 方法的调用参数

  - `next()`: 进行管道中的下一个钩子。如果全部钩子执行完了，则导航的状态就是 `confirmed` (确认的)。

  - `next(false)`: 中断当前的导航。如果浏览器的 URL 改变了 (可能是用户手动或者浏览器后退按钮)，那么 URL 地址会重置到 `from` 路由对应的地址

  - `next('/')` 或者 `next({ path: '/' })`: 跳转到一个不同的地址。当前的导航被中断，然后进行一个新的导航。你可以向 `next` 传递任意位置对象，且允许设置诸如 `replace: true`、`name: 'home'` 之类的选项以及任何用在 `router-link` 的 `to prop` 或 `router.push` 中的选项

  - `next(error): (2.4.0+)` 如果传入 `next` 的参数是一个 `Error` 实例，则导航会被终止且该错误会被传递给 `router.onError()` 注册过的回调

### 全局解析守卫

在 `2.5.0+` 你可以用 `router.beforeResolve` 注册一个全局守卫。这和 `router.beforeEach` 类似，区别是在导航被确认之前，同时在所有组件内守卫和异步路由组件被解析之后，解析守卫就被调用。

### 全局后置钩子

你也可以注册全局后置钩子，然而和守卫不同的是，这些钩子不会接受 next 函数也不会改变导航本身：

```js
router.afterEach((to, from) => {
  // ...
})

```

### 路由独享的守卫

你可以在路由配置上直接定义 `beforeEnter` 守卫：

```js
const router = new VueRouter({
  routes: [
    {
      path: '/foo',
      component: Foo,
      beforeEnter: (to, from, next) => {
        // ...
      }
    }
  ]
})
```

这些守卫与全局前置守卫的方法参数是一样的

### 组件内的守卫

最后，你可以在路由组件内直接定义以下路由导航守卫：

- `beforeRouteEnter`

- `beforeRouteUpdate`

- `beforeRouteLeave`

```js
const Foo = {
  template: `...`,
  beforeRouteEnter (to, from, next) {
    // 在渲染该组件的对应路由被 confirm 前调用
    // 不！能！获取组件实例 `this`
    // 因为当守卫执行前，组件实例还没被创建
  },
  beforeRouteUpdate (to, from, next) {
    // 在当前路由改变，但是该组件被复用时调用
    // 举例来说，对于一个带有动态参数的路径 /foo/:id，在 /foo/1 和 /foo/2 之间跳转的时候，
    // 由于会渲染同样的 Foo 组件，因此组件实例会被复用。而这个钩子就会在这个情况下被调用。
    // 可以访问组件实例 `this`
  },
  beforeRouteLeave (to, from, next) {
    // 导航离开该组件的对应路由时调用
    // 可以访问组件实例 `this`
  }
}

```

`beforeRouteEnter` 守卫 不能 访问 `this`，因为守卫在导航确认前被调用，因此即将登场的新组件还没被创建

不过，你可以通过传一个回调给 `next` 来访问组件实例。在导航被确认的时候执行回调，并且把组件实例作为回调方法的参数

```js
beforeRouteEnter (to, from, next) {
  next(vm => {
    // 通过 `vm` 访问组件实例
  })
}
```

注意 `beforeRouteEnter` 是支持给 `next` 传递回调的唯一守卫。对于 `beforeRouteUpdate` 和 `beforeRouteLeave` 来说，`this` 已经可用了，所以不支持传递回调，因为没有必要了

```js
beforeRouteUpdate (to, from, next) {
  // just use `this`
  this.name = to.params.name
  next()
}
```

这个离开守卫通常用来禁止用户在还未保存修改前突然离开。该导航可以通过 `next(false)` 来取消

```js
beforeRouteLeave (to, from, next) {
  const answer = window.confirm('Do you really want to leave? you have unsaved changes!')
  if (answer) {
    next()
  } else {
    next(false)
  }
}

```

### 完整的导航守卫执行顺序

1. 导航被触发。

2. 在失活的组件里调用 `beforeRouteLeave` 守卫。

3. 调用全局的 `beforeEach` 守卫。

4. 在重用的组件里调用 `beforeRouteUpdate` 守卫 (2.2+)。

5. 在路由配置里调用 `beforeEnter`。

6. 解析异步路由组件。

7. 在被激活的组件里调用 `beforeRouteEnter`。

8. 调用全局的 `beforeResolve` 守卫 (2.5+)。

9. 导航被确认。

10. 调用全局的 `afterEach` 钩子。

11. 触发 DOM 更新。

12. 用创建好的实例调用 `beforeRouteEnter` 守卫中传给 `next` 的回调函数。

## 总结

- 利用浏览器的 History API 或 hash 变化来监听 URL 的变化。

- 通过匹配 URL 到预定义的路由配置，动态渲染相应的组件到 `<router-view>`。

- 结合 Vue.js 的响应式系统，使路由状态变化能够驱动视图自动更新。