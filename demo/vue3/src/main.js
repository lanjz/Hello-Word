import { createApp } from 'vue/dist/vue.esm-bundler.js'
import ElementPlus from 'element-plus';
import App from './App.vue'
import router from './router'
import './assets/scss/element-variables.scss'
import './assets/scss/app.scss'
const app = createApp(App)
app.use(ElementPlus)
app.use(router)
app.mount('#app')

