# Vue-Router

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