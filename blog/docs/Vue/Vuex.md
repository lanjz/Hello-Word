# Vuex

使用例子

```js
import Vue from 'vue'
import Vuex from 'vuex'
import App from './app.js'
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

}
```
上面代码通过实例化一个新 `Vue` 实例，给 `$$state` 和 `computed` 添加响应机制，看到这里还是不明白这里 `new Vue` 添加的响应跟启动项目的 `new Vue` 有啥关系？

下面通过一个例子理解一下：

```html
<div id="app">
    <h1>{{arr}}</h1>
    <h1>{{$$obj}}</h1>
</div>
```
```js
  const obj = {a: 'l'}
  new Vue({
    data: {
      $obj: obj
    }
  })
  var app = new Vue({
    el: '#app',
    data: {
      arr: [0]
    },
    obj,
    beforeCreate(){
      this.$$obj = this.$options.obj
    },
    mounted(){
      console.log(this)
    },
  })
```

上面例子中启动项目的 `Vue` 没有直接在 `data` 中定义 `$$obj` 属性，`$$obj` 属性是在 `beforeCreate` 钩子函数赋值的，取至 `$options` 上属性 `obj`，`$options.obj` 是在 `new Vue` 中传入的，且这个 `obj` 属性也在另一个 `new Vue` 中使用且是使用在 `data.$obj` 属性上，也在就说这个 `$obj` 属性在这个 `Vue` 中是响应式的。也因此在应用中访问`$$obj` 时，全局的 `Watcher` 将会被另一个 Vue 中的 `$obj` 属性收集

不得不说这波操作有点骚～


## getter实现

`getters`则是借助vue的计算属性`computed`实现数据实时监听

我们先看这段代码逻辑：

```js
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
/**
* forEach for object
*/
function forEachValue (obj, fn) {
  Object.keys(obj).forEach(function (key) { return fn(obj[key], key); });
}
// partial
function partial (fn, arg) {
  return function () {
    return fn(arg)
  }
}
```

首先 `wrappedGetters` 是通过下面代码定义的

```js
  function registerGetter (store, type, rawGetter, local) {
    if (store._wrappedGetters[type]) {
      {
        console.error(("[vuex] duplicate getter key: " + type));
      }
      return
    }
    store._wrappedGetters[type] = function wrappedGetter (store) {
      return rawGetter(
        local.state, // local state
        local.getters, // local getters
        store.state, // root state
        store.getters // root getters
      )
    };
  }
```

上面的第三个参数 `rawGetter` 就是我们 Vuex 定义的 `getter`

从上面的代理可以看到定义了一个 `computed` 对象，然后使用 `forEachValue` 遍历 `wrappedGetters` 给 `computed` 赋值
 
 `forEachValue`第二个参数函数的每第一个参数 `fn` 就是每个 `getter` 的计算函数，第二个参数就是 `getter` 的 `key`

内部 `partial(fn, store)`，也就是执行`getter` 的计算函数，并把 `store` 参数传入，这样 `getter` 方法就访问到 `state`, `getters` 等属性

然后在实例 Vue 时，将上面的 `computed` 传入使用

```js
  store._vm = new Vue({
    data: {
      $$state: state
    },
    computed: computed
  });
```

所以当根据 `key` 访问 `store.getters` 的某一个 `getter` 的时候，实际上就是访问了 `store._vm[key]`，`store._vm` 就是 Vue 实例，然后就会从 `computed[key]` 计算函数，也就是上文说的 `partial(fn, store)`

