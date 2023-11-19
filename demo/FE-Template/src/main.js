import './styles/global.scss'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
// import 'element-plus/dist/index.css'
import { saveApp } from './utils/help'
import comGlobal from './components/global';
import libGlobal from './components/lib';
import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(createPinia())
app.use(ElementPlus)
app.use(router)
app.use(comGlobal);
app.use(libGlobal);

app.mount('#app')
app.config.globalProperties.$thisApp = app
saveApp(app)