[从vue-router看前端路由的两种实现](https://zhuanlan.zhihu.com/p/27588422)

# Vue-Router

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

在根 Vue 实例中使用 `Vue.util.defineReactive(this, '_route', this._router.history.current)`，给 `_route` 属性添加了监听机制，这样 `_route` 属性准备了收集依赖的功能了。在源码中，触发事件的在 

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

从上面代码可以知道当渲染 `RouterView` 组件时会访问到 `var route = parent.$route`，此时就会触发 `Object.defineProperty的get` 方法，此时 `Dep.target` 就是 `RouterView` 所在的组件，这一步就完成了对事件的收集

之后当我们在组件调用 `this.$router.push` 方法改变路由时就会更新 `$route` 属性，就会触发依赖的更新方法从而更新视图了（`RouteLInk` 组件渲染时也会做同样的收集）


## RouterView/RouterLink

`RouterView/RouterLink` 组件能在所有组件中使用也是因为 `install` 中，对两个组件进行的全局注册

```js
Vue.component('RouterView', View);
Vue.component('RouterLink', Link);
```


## install

使用 `vue-router` 的时候需要调用 `vue.use(vue-router)`,为 Vue 添加全局功能，调用的时候 `vue` 会执行插件的 `install` 方法，`vue-router` 的定义：

```js
    function install (Vue) {
      if (install.installed && _Vue === Vue) { return }
      install.installed = true;
  
      _Vue = Vue;
  
      var isDef = function (v) { return v !== undefined; };
  
      var registerInstance = function (vm, callVal) {
        var i = vm.$options._parentVnode;
        if (isDef(i) && isDef(i = i.data) && isDef(i = i.registerRouteInstance)) {
          i(vm, callVal);
        }
      };
  
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
  
      Object.defineProperty(Vue.prototype, '$router', {
        get: function get () { return this._routerRoot._router }
      });
  
      Object.defineProperty(Vue.prototype, '$route', {
        get: function get () { return this._routerRoot._route }
      });
  
      Vue.component('RouterView', View);
      Vue.component('RouterLink', Link);
  
      var strats = Vue.config.optionMergeStrategies;
      // use the same hook merging strategy for route hooks
      strats.beforeRouteEnter = strats.beforeRouteLeave = strats.beforeRouteUpdate = strats.created;
    }
```

`install` 重要做了这么几件事情：

1. 使用 `vue.mixin` 给每个 `vue` 组件的 `beforeCreate` 钩子添加要执行的方法

## 匹配当前路由

当组件开始渲染时，会执行 `beforeCreate` 钩子，这里重点看下 `this._router.init(this)` 的执行

```js
// VueRouter.prototype.init
VueRouter.prototype.init = function init (app /* Vue component instance */) {
    var this$1 = this;

    assert(
    install.installed,
    "not installed. Make sure to call `Vue.use(VueRouter)` " +
    "before creating root instance."
    );

    this.apps.push(app);

    // set up app destroyed handler
    // https://github.com/vuejs/vue-router/issues/2639
    app.$once('hook:destroyed', function () {
    // clean out app from this.apps array once destroyed
    var index = this$1.apps.indexOf(app);
    if (index > -1) { this$1.apps.splice(index, 1); }
    // ensure we still have a main app or null if no apps
    // we do not release the router so it can be reused
    if (this$1.app === app) { this$1.app = this$1.apps[0] || null; }

    if (!this$1.app) {
        // clean up event listeners
        // https://github.com/vuejs/vue-router/issues/2341
        this$1.history.teardownListeners();
    }
    });

    // main app previously initialized
    // return as we don't need to set up new history listener
    if (this.app) {
    return
    }

    this.app = app;

    var history = this.history;

    if (history instanceof HTML5History || history instanceof HashHistory) {
    var setupListeners = function () {
        history.setupListeners();
    };
    history.transitionTo(history.getCurrentLocation(), setupListeners, setupListeners);
    }

    history.listen(function (route) {
    this$1.apps.forEach(function (app) {
        app._route = route;
    });
    });
};
```

参数 `app` 是当前组件的 `vue` 实例，之后判断是当前浏览器支持 `HTML5History` 或者 `HashHistory` 方法执行 `history.transitionTo(history.getCurrentLocation(), setupListeners, setupListeners)`

因为初化我们路由模式是 `hash` 模式，所以 `history` 对应是 `hash` 模式相关的方法实例

```js
// history.getCurrentLocation()
 HashHistory.prototype.getCurrentLocation = function getCurrentLocation () {
    return getHash()
};

// getHash()
function getHash () {
    // We can't use window.location.hash here because it's not
    // consistent across browsers - Firefox will pre-decode it!
    var href = window.location.href;
    var index = href.indexOf('#');
    // empty path
    if (index < 0) { return '' }

    href = href.slice(index + 1);
    // decode the hash but not the search or hash
    // as search(query) is already decoded
    // https://github.com/vuejs/vue-router/issues/2708
    var searchIndex = href.indexOf('?');
    if (searchIndex < 0) {
    var hashIndex = href.indexOf('#');
    if (hashIndex > -1) {
        href = decodeURI(href.slice(0, hashIndex)) + href.slice(hashIndex);
    } else { href = decodeURI(href); }
    } else {
    href = decodeURI(href.slice(0, searchIndex)) + href.slice(searchIndex);
    }

    return href
}
```

所以上面 `history.getCurrentLocation()` 是获取当前面 URL 的 `hash` 值，当前例子取到的值是 `/bar/a`,然后执行 `    History.prototype.transitionTo` 方法

在 `transitionTo` 方法中，首先执行 `var route = this.router.match(location, this.current);` 方法

```js
// match(location, this.current);
      function match (
        raw,
        currentRoute,
        redirectedFrom
      ) {
        var location = normalizeLocation(raw, currentRoute, false, router);
        var name = location.name;
  
        if (name) {
          var record = nameMap[name];
          {
            warn(record, ("Route with name '" + name + "' does not exist"));
          }
          if (!record) { return _createRoute(null, location) }
          var paramNames = record.regex.keys
            .filter(function (key) { return !key.optional; })
            .map(function (key) { return key.name; });
  
          if (typeof location.params !== 'object') {
            location.params = {};
          }
  
          if (currentRoute && typeof currentRoute.params === 'object') {
            for (var key in currentRoute.params) {
              if (!(key in location.params) && paramNames.indexOf(key) > -1) {
                location.params[key] = currentRoute.params[key];
              }
            }
          }
  
          location.path = fillParams(record.path, location.params, ("named route \"" + name + "\""));
          return _createRoute(record, location, redirectedFrom)
        } else if (location.path) {
          location.params = {};
          for (var i = 0; i < pathList.length; i++) {
            var path = pathList[i];
            var record$1 = pathMap[path];
            if (matchRoute(record$1.regex, location.path, location.params)) {
              return _createRoute(record$1, location, redirectedFrom)
            }
          }
        }
        // no match
        return _createRoute(null, location)
      }
```

## 路由模式

`vue-router` 主要有两种路模式 `hash` 与 `History interface` 两种方式，这两种模式都可以实现 URL 地址更新的同时页面无需重新加载。

`vue-router` 针对两种模式分别封装了两个类：`HTML5History`，`HashHistory`

### HashHistory

**`hash`的使用**

- 监听地址 `hash` 的变化：`window.addEventListener("hashchange", funcRef, false)`

- 主动改变 `hash` ：`window.location.hash='/bar'`,每一次改变 `hash（window.location.hash）`，都会在浏览器的访问历史中增加一个记录

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

