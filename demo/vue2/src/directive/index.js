import Vue from 'vue'
import Exposure from './Exposure'
// 入口JS文件 main.js
// 引入Exposure类
// exp就是那个全局唯一的实例
const exp = new Exposure();
Vue.directive('exp-dot', {
    bind(el, binding, vnode) {
        exp.add({el: el, val: binding.value})
    }
})