import 'lib-flexible'
import Vue from 'vue'
import Vuex from 'vuex'
import App from './App.vue'
import Dir from './page/dir.vue'
import storeData from './store'
import './assets/app.css'
import loadingLine from './utils/loadingLing'
debugger
Vue.use(Vuex)
const root = document.createElement('div')
root.id = 'app'
document.body.appendChild(root)

// 注册一个全局自定义指令 `v-focus`
// Vue.directive('loading-line', loadingLine)
const store =  new Vuex.Store(storeData)


new Vue({
    store,
    render:(h)=> h(App)
}).$mount(root)
