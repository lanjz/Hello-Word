import 'lib-flexible'
import Vue from 'vue'
import VueRouter  from 'vue-router'
import App from './App.vue'
import routes from './router'

const root = document.createElement('div')
root.id = 'app'
Vue.use(VueRouter)
document.body.appendChild(root)
const router = new VueRouter({
    routes // (缩写) 相当于 routes: routes
})

// 注册一个全局自定义指令 `v-focus`

new Vue({
    router,
    render:(h)=> h(App)
}).$mount(root)
