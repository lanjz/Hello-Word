import Vue from 'vue'
import App from './App.vue'
import router from '@/router'
import '@/styles/index.scss'
import '@/icons'
import axios from 'axios'
import Tinymce from '@/components/tinymce/index.vue'
import nestedDraggable from '../test/infra/nested'
import appGlobal from '@/components/Global'

Vue.component('tinymce', Tinymce)
Vue.component('nestedDraggable', nestedDraggable)

Vue.config.productionTip = false
Vue.prototype.$axios = axios
// 注册全局组件
Vue.use(appGlobal)
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
