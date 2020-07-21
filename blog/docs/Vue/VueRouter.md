# Vue-Router

使用 `vue-router` 可以实现单页面模式切换 URL 地址。实质是通过 `hash` 与 `History interface` 两种 API 实现的，这两种模式都可以实现 URL 地址更新的同时页面无需重新加载。

`vue-router` 针对两种模式分别封装了两个类：`HTML5History`，`HashHistory`

### HashHistory

**`hash`的使用**

- 监听地址 `hash` 的变化：`window.addEventListener("hashchange", funcRef, false)`

- 主动改变 `hash` ：`window.location.hash='/bar'`,每一次改变 `hash（window.location.hash）`，都会在浏览器的访问历史中增加一个记录

- `replace` `hash`: `window.location.replace(window.location.href#[hash])`, `url` 地址没变，只改变使用 `hash`, 此时不会重新加载页面，只会替换浏览器的访问历史中的最近一个记录

**HashHistory.push()**

源码定义：

```js
push (location: RawLocation, onComplete?: Function, onAbort?: Function) {
  this.transitionTo(location, route => {
    pushHash(route.fullPath)
    onComplete && onComplete(route)
  }, onAbort)
}

function pushHash (path) {
  window.location.hash = path
}
```

## $route/$router属性

每个组件都有一个 `$route/$router` 属性，这个 `$route/$router` 是从哪来的咧？

Vue 在安装 `vue-router` 插件的时候，会调用 `vue-router` 中的 `install` 方法，`install` 中这么两行语句

```js
 Object.defineProperty(Vue.prototype, '$router', {
    get: function get () { return this._routerRoot._router }
  });
  
Object.defineProperty(Vue.prototype, '$route', {
  get: function get () { return this._routerRoot._route }
});
```

原来 `$route/$router` 是 `this._routerRoot` 上面的两个属性， `this._routerRoot` 属性也在 `install` 中定义的：

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

`_routerRoot` 是在利用 `Vue.mixin` 方法在每个组件注入的一个属性，如果有 `this.$options.router` 则指向当前 Vue 实例，否则则取 `$parent` 父组件上的 `_routerRoot`。这里可以得到两个讯息

1. 整个 Vue 项目中所有组件只有一个 `_routerRoot` 

2. 所有  `_routerRoot` 属性来源于根 `Vue` 实例，因为只有根 `Vue` 实例才有 `this.$options.router` 属性。 这个 `router` 属性在入口文件启动项目的时候添加的 

```js
new Vue({
    router,
    render:(h)=> h(App)
}).$mount(root)
```

这个 `router` 就是 `vue-router` 的实例

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

```js
var View = {
      name: 'RouterView',
      functional: true,
      props: {
        name: {
          type: String,
          default: 'default'
        }
      },
      render: function render (_, ref) {
        // ....
        var route = parent.$route;
      }
}
```

上代码是 `RouterView` 组件实现的函数式写法，当我们在页面中使用这个组件，并且渲染到 `RouterView` 组件时会触发对应的 `render` 方法，接着执行 `var route = parent.$route` 的时候就会被 `Object.defineProperty` 定义的 `get` 方法劫持，此时 `Dep.target` 就是 `RouterView` 所在的组件，会把这个组件 `render Watcher` 收集到 `_router` 的收集器 `Dep` 中,这一步就完成了对事件的收集

之后当我们在组件调用 `this.$router.push` 方法改变路由时就会更新 `$route` 属性，就会触发依赖的更新方法从而更新视图了（`RouteLInk` 组件渲染时也会做同样的收集）

## 路由更新（hash模式）

以 `push` 方法为例

调用  `this.$router.push(location, onComplete, onAbort)` 时实际上执行的 ` this.history.push(location, onComplete, onAbort)` 方法

```js
// HashHistory.prototype.push
HashHistory.prototype.push = function push (location, onComplete, onAbort) {
  var this$1 = this;

  var ref = this;
  var fromRoute = ref.current;
  this.transitionTo(
    location,
    function (route) {
      pushHash(route.fullPath);
      handleScroll(this$1.router, route, fromRoute, false);
      onComplete && onComplete(route);
    },
    onAbort
  );
};

// pushHash
function pushHash (path) {
  if (supportsPushState) {
    pushState(getUrl(path));
  } else {
    window.location.hash = path;
  }
}
//  History.prototype.transitionTo
transitionTo (location: RawLocation, onComplete?: Function, onAbort?: Function) {
  // 获取匹配的路由信息
  const route = this.router.match(location, this.current)
  // 确认切换路由
  this.confirmTransition(route, () => {
    // 以下为切换路由成功或失败的回调
    // 更新路由信息，对组件的 _route 属性进行赋值，触发组件渲染
    // 调用 afterHooks 中的钩子函数
    this.updateRoute(route)
    // 添加 hashchange 监听
    onComplete && onComplete(route)
    // 更新 URL
    this.ensureURL()
    // 只执行一次 ready 回调
    if (!this.ready) {
      this.ready = true
      this.readyCbs.forEach(cb => { cb(route) })
    }
  }, err => {
  // 错误处理
    if (onAbort) {
      onAbort(err)
    }
    if (err && !this.ready) {
      this.ready = true
      this.readyErrorCbs.forEach(cb => { cb(err) })
    }
  })
}

// 确认切换路由
confirmTransition(route: Route, onComplete: Function, onAbort?: Function) {
  const current = this.current
  // 中断跳转路由函数
  const abort = err => {
    if (isError(err)) {
      if (this.errorCbs.length) {
        this.errorCbs.forEach(cb => {
          cb(err)
        })
      } else {
        warn(false, 'uncaught error during route navigation:')
        console.error(err)
      }
    }
    onAbort && onAbort(err)
  }
  // 如果是相同的路由就不跳转
  if (
    isSameRoute(route, current) &&
    route.matched.length === current.matched.length
  ) {
    this.ensureURL()
    return abort()
  }
  // 通过对比路由解析出可复用的组件，需要渲染的组件，失活的组件
  const { updated, deactivated, activated } = resolveQueue(
    this.current.matched,
    route.matched
  )
  
  function resolveQueue(
      current: Array<RouteRecord>,
      next: Array<RouteRecord>
    ): {
      updated: Array<RouteRecord>,
      activated: Array<RouteRecord>,
      deactivated: Array<RouteRecord>
    } {
      let i
      const max = Math.max(current.length, next.length)
      for (i = 0; i < max; i++) {
        // 当前路由路径和跳转路由路径不同时跳出遍历
        if (current[i] !== next[i]) {
          break
        }
      }
      return {
        // 可复用的组件对应路由
        updated: next.slice(0, i),
        // 需要渲染的组件对应路由
        activated: next.slice(i),
        // 失活的组件对应路由
        deactivated: current.slice(i)
      }
  }
  // 导航守卫数组
  const queue: Array<?NavigationGuard> = [].concat(
    // 失活的组件钩子
    extractLeaveGuards(deactivated),
    // 全局 beforeEach 钩子
    this.router.beforeHooks,
    // 在当前路由改变，但是该组件被复用时调用
    extractUpdateHooks(updated),
    // 需要渲染组件 enter 守卫钩子
    activated.map(m => m.beforeEnter),
    // 解析异步路由组件
    resolveAsyncComponents(activated)
  )
  // 保存路由
  this.pending = route
  // 迭代器，用于执行 queue 中的导航守卫钩子
  const iterator = (hook: NavigationGuard, next) => {
  // 路由不相等就不跳转路由
    if (this.pending !== route) {
      return abort()
    }
    try {
    // 执行钩子
      hook(route, current, (to: any) => {
        // 只有执行了钩子函数中的 next，才会继续执行下一个钩子函数
        // 否则会暂停跳转
        // 以下逻辑是在判断 next() 中的传参
        if (to === false || isError(to)) {
          // next(false) 
          this.ensureURL(true)
          abort(to)
        } else if (
          typeof to === 'string' ||
          (typeof to === 'object' &&
            (typeof to.path === 'string' || typeof to.name === 'string'))
        ) {
        // next('/') 或者 next({ path: '/' }) -> 重定向
          abort()
          if (typeof to === 'object' && to.replace) {
            this.replace(to)
          } else {
            this.push(to)
          }
        } else {
        // 这里执行 next
        // 也就是执行下面函数 runQueue 中的 step(index + 1)
          next(to)
        }
      })
    } catch (e) {
      abort(e)
    }
  }
  // 经典的同步执行异步函数
  runQueue(queue, iterator, () => {
    const postEnterCbs = []
    const isValid = () => this.current === route
    // 当所有异步组件加载完成后，会执行这里的回调，也就是 runQueue 中的 cb()
    // 接下来执行 需要渲染组件的导航守卫钩子
    const enterGuards = extractEnterGuards(activated, postEnterCbs, isValid)
    const queue = enterGuards.concat(this.router.resolveHooks)
    runQueue(queue, iterator, () => {
    // 跳转完成
      if (this.pending !== route) {
        return abort()
      }
      this.pending = null
      onComplete(route)
      if (this.router.app) {
        this.router.app.$nextTick(() => {
          postEnterCbs.forEach(cb => {
            cb()
          })
        })
      }
    })
  })
}
export function runQueue (queue: Array<?NavigationGuard>, fn: Function, cb: Function) {
  const step = index => {
  // 队列中的函数都执行完毕，就执行回调函数
    if (index >= queue.length) {
      cb()
    } else {
      if (queue[index]) {
      // 执行迭代器，用户在钩子函数中执行 next() 回调
      // 回调中判断传参，没有问题就执行 next()，也就是 fn 函数中的第二个参数
        fn(queue[index], () => {
          step(index + 1)
        })
      } else {
        step(index + 1)
      }
    }
  }
  // 取出队列中第一个钩子函数
  step(0)
}

```

这里先关注 `this.confirmTransition` 方法第二个回调函数参数，里面会执行以下三个步骤：

```js
this.updateRoute(route)
// 添加 hashchange 监听
onComplete && onComplete(route)
// 确定URL显示是否正确
this.ensureURL()
```

```js
History.prototype.updateRoute = function updateRoute (route) {
  this.current = route;
  this.cb && this.cb(route);
};
//  this.cb在是 `init()` 方法中设置的回调
this.apps.forEach(function (app) {
  app._route = route;
});
```

在 `this.updateRoute(route)` 方法将更新 `_route` 属性，然后就会触发视图的更新

**总结一下，从设置路由改变到视图更新的流程如下**

`$router.push() --> HashHistory.push() --> History.transitionTo() --> History.updateRoute() --> {app._route = route} --> vm.render()`

## HashHistory.replace()

`replace()` 方法与 `push()` 方法不同之处在于，它并不是将新路由添加到浏览器访问历史的栈顶，而是替换掉当前的路由：

```js
replace (location: RawLocation, onComplete?: Function, onAbort?: Function) {
  this.transitionTo(location, route => {
    replaceHash(route.fullPath)
    onComplete && onComplete(route)
  }, onAbort)
}
  
function replaceHash (path) {
  const i = window.location.href.indexOf('#')
  window.location.replace(
    window.location.href.slice(0, i >= 0 ? i : 0) + '#' + path
  )
}
```

## 路由更新（history模式）

`history` 提供的方法：

- `History.back()`: 前往上一页, 用户可点击浏览器左上角的返回按钮模拟此方法. 等价于 `history.go(-1)`

- `History.forward()`: 前往上一页, 用户可点击浏览器左上角的返回按钮模拟此方法. 等价于 `history.go(1)`

- `History.go()`: 通过当前页面的相对位置从浏览器历史记录( 会话记录 )加载页面。比如：参数为 `-1` 的时候为上一页，参数为 `1` 的时候为下一页. 当整数参数超出界限时例如: 如果当前页为第一页，前面/后面 已经没有页面了，传参的值为 `-1` 或者 `1` 都没有任何效果也不会报错。调用没有参数的 `go()` 方法或者不是整数的参数时也没有效果

- `History.pushState(state, title[, url])`：按指定的名称和 URL（如果提供该参数）将数据 `push` 进会话历史栈

  ```js
  const state = { 'page_id': 1, 'user_id': 5 }
  const title = ''
  const url = 'hello-world.html'

  history.pushState(state, title, url)
  ```

- `History.replaceState()`: 按指定的数据，名称和 URL (如果提供该参数)，更新历史栈上最新的入口，用法同 `History.pushState`

**`History.pushState` 和 `History.replaceState()`都不会刷新页面**

`history` 属性：

`History.state`: 返回一个表示历史堆栈顶部的状态的值，获取 `History.pushState` 和 `History.replaceState()` 添加的 `state` 值 

`vue-router` 相关的处理逻辑跟 `hash` 模式差不多，只是更新地址的具体实现方法换成 `history` 的相关方法罢了

- `window.location.hash` => `history.pushState()`

- `window.location.replace()` => `history.replaceState()`

```js
push (location: RawLocation, onComplete?: Function, onAbort?: Function) {
  const { current: fromRoute } = this
  this.transitionTo(location, route => {
    pushState(cleanPath(this.base + route.fullPath))
    handleScroll(this.router, route, fromRoute, false)
    onComplete && onComplete(route)
  }, onAbort)
}

replace (location: RawLocation, onComplete?: Function, onAbort?: Function) {
  const { current: fromRoute } = this
  this.transitionTo(location, route => {
    replaceState(cleanPath(this.base + route.fullPath))
    handleScroll(this.router, route, fromRoute, false)
    onComplete && onComplete(route)
  }, onAbort)
}

// src/util/push-state.js
export function pushState (url?: string, replace?: boolean) {
  saveScrollPosition()
  // try...catch the pushState call to get around Safari
  // DOM Exception 18 where it limits to 100 pushState calls
  const history = window.history
  try {
    if (replace) {
      history.replaceState({ key: _key }, '', url)
    } else {
      _key = genKey()
      history.pushState({ key: _key }, '', url)
    }
  } catch (e) {
    window.location[replace ? 'replace' : 'assign'](url)
  }
}

export function replaceState (url?: string) {
  pushState(url, true)
}
```

`history` 模式下的监听 `url` 的变化

```js
constructor (router: Router, base: ?string) {

  window.addEventListener('popstate', e => {
    const current = this.current
    this.transitionTo(getLocation(this.base), route => {
      if (expectScroll) {
        handleScroll(router, route, current, true)
      }
    })
  })
}
```

需要注意的是调用`history.pushState()`或`history.replaceState()`不会触发`popstate`事件。只有在做出浏览器动作时，才会触发该事件，如用户点击浏览器的回退按钮（或者在Javascript代码中调用 `history.back()` , `history.forward()` 或者 `history.go()` 方法

## RouterView/RouterLink

`RouterView/RouterLink` 组件能在所有组件中使用也是因为 `install` 中，对两个组件进行的全局注册

```js
Vue.component('RouterView', View);
Vue.component('RouterLink', Link);
```



[从vue-router看前端路由的两种实现](https://zhuanlan.zhihu.com/p/27588422)
[VueRouter 源码深度解析](https://juejin.im/post/5b5697675188251b11097464#heading-0)