# Vuex

使用例子

```js
import Vue from 'vue'
import Vuex from 'vuex'
import App from './App.vue'
Vue.use(Vuex)
const store = new Vuex.Store({
    state: {
        count: 0
    },
    mutations: {
        increment (state) {
            state.count++
        }
    }
})
const root = document.createElement('div')
root.id = 'app'
document.body.appendChild(root)
new Vue({
    store,
    render:(h)=> h(App)
}).$mount(root)

```

## Vue.use(vuex)

`Vue.use(vuex)` 会执行 `vuex` 中的 `install` 方法，它的定义如下：

```js
function install (_Vue) {
  if (Vue && _Vue === Vue) {
    if ((process.env.NODE_ENV !== 'production')) {
      console.error(
        '[vuex] already installed. Vue.use(Vuex) should be called only once.'
      );
    }
    return
  }
  Vue = _Vue;
  applyMixin(Vue);
}
// applyMixin
function applyMixin (Vue) {
  var version = Number(Vue.version.split('.')[0]);
  if (version >= 2) {
    Vue.mixin({ beforeCreate: vuexInit });
  }
}
// vuexInit
  function vuexInit () {
    var options = this.$options;
    // store injection
    if (options.store) {
      this.$store = typeof options.store === 'function'
        ? options.store()
        : options.store;
    } else if (options.parent && options.parent.$store) {
      this.$store = options.parent.$store;
    }
  }
```
Vux 的 `install` 方法执行的就是 `applyMixin` 方法, `applyMixin` 方法的主要功能将初始化 Vue 实例时传入的 `store` 设置到 `this.$store` 属性上, 子组件则从其父组件引用 `$store` 属性, 层层嵌套进行设置. 这样,任何一个组件都能通过 `this.$store` 的方式访问 `store` 对象了

单从这里会有疑问就是只在 `this` 上添加 `$store` 属性是不会有响应功能的，但是实现使用时修改 `state` 是可以触发视图更新，在哪做的了？

## Vuex构造方法

```js
const store = new Vuex.Store({
    state: {
        count: 0
    },
    mutations: {
        increment (state) {
            state.count++
        }
    }
})
```

## Vuex的响应机制

在 `vuex.Store` 的构造方法中有以下代码：

```js
// 初始化 store 的响应机制（包括将 _wrappedGetters 初始为 compute）
resetStoreVM(this, state);
// resetStoreVM(this, state);
function resetStoreVM (store, state, hot) {
  var oldVm = store._vm;

  // bind store public getters
  store.getters = {};
  // reset local getters cache
  store._makeLocalGettersCache = Object.create(null);
  var wrappedGetters = store._wrappedGetters;
  var computed = {};
  forEachValue(wrappedGetters, function (fn, key) {
    // use computed to leverage its lazy-caching mechanism
    // direct inline function use will lead to closure preserving oldVm.
    // using partial to return function with only arguments preserved in closure environment.
    computed[key] = partial(fn, store);
    Object.defineProperty(store.getters, key, {
      get: function () { return store._vm[key]; },
      enumerable: true // for local getters
    });
  });

  // use a Vue instance to store the state tree
  // suppress warnings just in case the user has added
  // some funky global mixins
  var silent = Vue.config.silent;
  Vue.config.silent = true;
  store._vm = new Vue({
    data: {
      $$state: state
    },
    computed: computed
  });
  Vue.config.silent = silent;

  // enable strict mode for new vm
  if (store.strict) {
    enableStrictMode(store);
  }

  if (oldVm) {
    if (hot) {
      // dispatch changes in all subscribed watchers
      // to force getter re-evaluation for hot reloading.
      store._withCommit(function () {
        oldVm._data.$$state = null;
      });
    }
    Vue.nextTick(function () { return oldVm.$destroy(); });
  }
}
```
上面代码通过实例化一个新 `Vue` 实例，给 `$$state` 和 `computed` 添加响应机制，看到这里还是不明白这里 `new Vue` 添加的响应跟启动项目的 `new Vue` 有啥关系？

下面通过一次 `commit` 看下执行过程：

```js
this.commit = function boundCommit (type, payload, options) {
  return commit.call(store, type, payload, options)
};
Store.prototype.commit = function commit (_type, _payload, _options) {
    var this$1 = this;

  // check object-style commit
  var ref = unifyObjectStyle(_type, _payload, _options);
    var type = ref.type;
    var payload = ref.payload;
    var options = ref.options;

  var mutation = { type: type, payload: payload };
  var entry = this._mutations[type];
  if (!entry) {
    if ((process.env.NODE_ENV !== 'production')) {
      console.error(("[vuex] unknown mutation type: " + type));
    }
    return
  }
  this._withCommit(function () {
    entry.forEach(function commitIterator (handler) {
      handler(payload);
    });
  });

  this._subscribers
    .slice() // shallow copy to prevent iterator invalidation if subscriber synchronously calls unsubscribe
    .forEach(function (sub) { return sub(mutation, this$1.state); });

  if (
    (process.env.NODE_ENV !== 'production') &&
    options && options.silent
  ) {
    console.warn(
      "[vuex] mutation type: " + type + ". Silent option has been removed. " +
      'Use the filter functionality in the vue-devtools'
    );
  }
};
```
