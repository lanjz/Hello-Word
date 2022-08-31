import Vue from 'vue'
import Exposure from './Exposure'
// 入口JS文件 main.js
// 引入Exposure类
// exp就是那个全局唯一的实例
const exp = new Exposure();
// vue封装一个指令，每个使用了该指令的商品都会自动add自身进观察者中
Vue.directive('exp-dot', {
    bind(el, binding, vnode) {
        exp.add({el: el, val: binding.value})
    }
})