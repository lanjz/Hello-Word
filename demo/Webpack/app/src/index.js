import 'lib-flexible'
import Vue from 'vue'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import routes from './router'
import App from './App.vue'
import Dir from './page/dir.vue'
import storeData from './store'
import './assets/app.css'
import loadingLine from './utils/loadingLing'
Vue.use(Vuex)
Vue.use(VueRouter)
const router = new VueRouter({
    routes,
    mode: 'history'
})
const root = document.createElement('div')
root.id = 'app'
document.body.appendChild(root)

// 注册一个全局自定义指令 `v-focus`
// Vue.directive('loading-line', loadingLine)
const store =  new Vuex.Store(storeData)


new Vue({
    router,
    store,
    render:(h)=> h(App)
}).$mount(root)
