import Vue from 'vue'
import VueRouter from 'vue-router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import routes from './router'
import App from './App.vue'
import hllView from './hllView'
import '../common/static/less/index.less'
Vue.use(VueRouter)
Vue.use(ElementUI);
Vue.use(hllView)
const router = new VueRouter({
    routes,
    // mode: 'history',
})
const root = document.createElement('div')
root.id = 'app'
document.body.appendChild(root)


new Vue({
    router,
    render:(h)=> h(App)
}).$mount(root)
