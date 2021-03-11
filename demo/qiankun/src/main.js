import { createApp } from 'vue/dist/vue.esm-bundler.js'
import ElementPlus from 'element-plus';
import locale from 'element-plus/lib/locale/lang/zh-cn'
import App from './App.vue'
import router from './router'
import store from './store'
import hllView from './components/hllView/index'
import './assets/scss/element-variables.scss'
import './assets/scss/app.scss'
import startQiankun from "./micro/index";

startQiankun()

const app = createApp(App)
app.use(ElementPlus, {locale})
app.use(router)
app.use(store)
app.use(hllView)
app.mount('#app')

