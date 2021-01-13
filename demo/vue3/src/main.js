import { createApp } from 'vue/dist/vue.esm-bundler.js'
import ElementPlus from 'element-plus';
import locale from 'element-plus/lib/locale/lang/zh-cn'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/scss/element-variables.scss'
import './assets/scss/app.scss'
const app = createApp(App)
app.use(ElementPlus, {locale})
app.use(router)
app.use(store)
app.mount('#app')

