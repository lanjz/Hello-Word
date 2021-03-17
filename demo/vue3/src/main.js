import { createApp } from 'vue/dist/vue.esm-bundler.js'
import ElementPlus from 'element-plus';
import locale from 'element-plus/lib/locale/lang/zh-cn'
import App from './App.vue'
import router from './router'
import store from './store'
import hllView from './components/hllView/index'
import './assets/scss/element-variables.scss'
import './assets/scss/app.scss'


let app = null;
function render(){
  app = createApp(App)
  app.use(ElementPlus, {locale})
  app.use(router)
  app.use(store)
  app.use(hllView)
  app.mount('#app2')
}
// 独立运行时，直接挂载应用
if (!window.__POWERED_BY_QIANKUN__) {
  render();
}
export async function mount(props){
  console.log("VueMicroApp mount", props);
  props.onGlobalStateChange((state, prev) => {
    // state: 变更后的状态; prev 变更前的状态
    console.log('子应用监听到变量', state, prev);
  }, true);

  // props.setGlobalState({list: 'abc'});
  render(props);
}
export async function bootstrap(){
  console.log("VueMicroApp bootstraped");
  
}
export async function unmount(){
  console.log("VueMicroApp unmount");
  app.$destroy();
  app = null;
  // router = null;
}
