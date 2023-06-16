import './assets/styles/global.scss'
import Vue from 'vue'
import ElementUI from 'element-ui'
import comLib from '@/components/lib';
import comBus from '@/components/bus';
import App from './App.vue'
import router from './router'
import store from './store'
import './directive'
Vue.use(ElementUI, { size: 'small'})

Vue.use(comLib);
Vue.use(comBus);

Vue.config.productionTip = false
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')