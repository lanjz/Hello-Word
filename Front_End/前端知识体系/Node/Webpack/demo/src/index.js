import 'lib-flexible'
import Vue from 'vue'
import App from './App.vue'
import Dir from './page/dir.vue'
import './assets/app.css'
import loadingLine from './utils/loadingLing'

const root = document.createElement('div')
root.id = 'app'
document.body.appendChild(root)

// 注册一个全局自定义指令 `v-focus`
Vue.directive('loading-line', loadingLine)


new Vue({
    render:(h)=> h(App)
}).$mount(root)
