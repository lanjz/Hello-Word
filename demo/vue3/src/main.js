import { createApp, reactive } from 'vue/dist/vue.esm-bundler.js'
import ElementPlus from 'element-plus';
import locale from 'element-plus/lib/locale/lang/zh-cn'
import App from './App.vue'
import router from './router'
import store from './store'
import hllView from './components/hllView/index'
import './assets/scss/element-variables.scss'
import './assets/scss/app.scss'
import './test/test'

let app = null;
function render(props = {}){
  app = createApp(App)
  app.use(ElementPlus, {locale})
  app.use(router)
  app.use(store)
  app.use(hllView)
  backgroundAction(app, props)
  app.mount('#app2')
}
export async function mount(props){
  render(props);
}
export async function bootstrap(){
  console.log("VueMicroApp bootstraped");
}
export async function unmount(){
  console.log("VueMicroApp unmount");
  app.unmount();
  app._container.innerHTML = '';
  app = null;
  // router = null;
  // history.destroy();
}

// 独立运行时，直接挂载应用
if (!window.__POWERED_BY_QIANKUN__) {
  render();
}
function backgroundAction(app, props){
  console.log('props', props)
  if (window.__POWERED_BY_QIANKUN__) {
    props.onGlobalStateChange((state, prev) => {
      console.log('子应用onGlobalStateChange')
      if(app.config.globalProperties.$baseStore){
        app.config.globalProperties.$baseStore.state = state.baseStore
      } else {
        app.config.globalProperties.$baseStore = reactive({state: state.baseStore })
      }
    }, true)
  }
}