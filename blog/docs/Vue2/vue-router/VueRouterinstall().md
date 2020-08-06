## `install()`方法

`install`方法定义在文件`src/install.js`中

```
import View from './components/view'
import Link from './components/link'

export let _Vue

export function install (Vue) {
  if (install.installed && _Vue === Vue) return
  install.installed = true

  _Vue = Vue

  const isDef = v => v !== undefined

  const registerInstance = (vm, callVal) => {
    let i = vm.$options._parentVnode
    if (isDef(i) && isDef(i = i.data) && isDef(i = i.registerRouteInstance)) {
      i(vm, callVal)
    }
  }

  Vue.mixin({
    beforeCreate () {
      if (isDef(this.$options.router)) {
        this._routerRoot = this
        this._router = this.$options.router
        this._router.init(this)
        Vue.util.defineReactive(this, '_route', this._router.history.current)
      } else {
        this._routerRoot = (this.$parent && this.$parent._routerRoot) || this
      }
      registerInstance(this, this)
    },
    destroyed () {
      registerInstance(this)
    }
  })

  Object.defineProperty(Vue.prototype, '$router', {
    get () { return this._routerRoot._router }
  })

  Object.defineProperty(Vue.prototype, '$route', {
    get () { return this._routerRoot._route }
  })

  Vue.component('RouterView', View)
  Vue.component('RouterLink', Link)

  const strats = Vue.config.optionMergeStrategies
  // use the same hook merging strategy for route hooks
  strats.beforeRouteEnter = strats.beforeRouteLeave = strats.beforeRouteUpdate = strats.created
}
```

`install`方法接收`Vue`作为参数

通过`install.installed`变量判断该方法是否执行过，如果已经安装过此插件，则不继续执行

将参数中的`Vue`保存到全局变量`_Vue`中，因为作为Vue插件对`Vue`对象是有依赖的，但又不能去单独`import Vue`，因为那样会增加包的体积，所以通过就这种方式拿到`Vue`对象。

通过[`Vue.minxin`](http://www.blackhook.club/5c8f114d1e53222b1b139a1f/5cac26c41fb1814fb4ee1199/5d1c4b480c159a220f335a8b)方法定义`beforeCreate`和`desroyed`钩子函数要执行的方法，这样每个组件在执行对应钩子函数时，都会执行我们定义的这些方法了

在`beforeCreate`钩子函数中定义了`this._routerRoot`等于它自身，即根挂载的Vue实例；`this._router`指向`VueRouter`的实例`router`，就是之前提的在`new Vue`的时候传入的`router`实例：

```
...
const router = new VueRouter({
  routes // （缩写）相当于 routes: routes
})
...
const app = new Vue({
  el: '#app',
  render(h) {
    return h(App)
  },
  router
})
```

然后执行`this._router.init(this)`方法，这是在`src/index`中定义的

`Vue.util.defineReactive(this, '_route', this._router.history.current)`把
`this.route`变成响应的属性，这个之后再分析

但是以上代码执行的前提条件是要满足`if (isDef(this.$options.router))`，即当前`vue`实例具体有`router`实例，如果没则，则从父组件节点中获取

而对于子组件而言，由于组件是树状结构，在遍历组件树的过程中，它们在执行该钩子函数的时候 this._routerRoot 始终指向的离它最近的传入了 router 对象作为配置而实例化的父实例。

接着执行的`registerInstance()`的定义：

```
  const registerInstance = (vm, callVal) => {
    let i = vm.$options._parentVnode
    if (isDef(i) && isDef(i = i.data) && isDef(i = i.registerRouteInstance)) {
      i(vm, callVal)
    }
  }
```

这是一个递归函数，从当前`vue`实例往上遍历，本质是要找到`registerRouteInstance`方法，然后执行这个方法，(这个之后遇到再看)?

在执行`Vue.minxin`函数后给`Vue`中的原型添加了`$router`属性指向` this._routerRoot._router`和`$route`指向` this._routerRoot._route`

接着通过`Vue.component`方法定义了全局的`<router-link>`和`<router-view>`，这样我们就可以在任意组件中使用这两个组件。

最后执行的代码：

```
  const strats = Vue.config.optionMergeStrategies
  // use the same hook merging strategy for route hooks
  strats.beforeRouteEnter = strats.beforeRouteLeave = strats.beforeRouteUpdate = strats.created
```

[自定义合并策略](https://cn.vuejs.org/v2/guide/mixins.html)

(这里的将钩子函数`beforeRouteEnter`、`beforeRouteLeave`、`beforeRouteUpdate`都定义为`created`)?(这是做什么用呢？)
