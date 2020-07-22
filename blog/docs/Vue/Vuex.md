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