import './wc/index'
import { createApp, getCurrentInstance } from 'vue'
import './assets/style/app.scss'
import "highlight.js/styles/github-dark.css"
import App from './App.vue'
import router from './router'
import MdDoc from './components/Doc.vue'
import CForm from './components/CForm.vue'
import DemoWrap from './components/DemoWrap.vue'
const app = createApp(App)
  .use(router)
  .component('MdDoc', MdDoc)
  .component('CForm', CForm)
  .component('DemoWrap', DemoWrap)

// app.config.compilerOptions.isCustomElement = (tag) => tag.indexOf('fin-') === 0
// 下面是测试代码代码
app.directive('fin', {
  mounted(el, binding, vnode) {
    el.value = binding.value;
    el.addEventListener('input', (event) => {
      console.log('update:modelValue', event, el)
      console.log('binding', binding)
      console.log('vnode', vnode  )
      const comp = getComponentInstanceFromElement(el)
      // console.log('el', el);
      // console.log('comp', comp)
      const value = event.target.value;
      binding.value = value;
      const component = binding.instance;
      // console.log('binding', binding.instance, getCurrentInstance())
      binding.instance.$emit('update:modelValue', value);
      if(value.toString() !== binding.value.toString()){
        el.dispatchEvent(new CustomEvent('update:modelValue', { detail: value }));
      }
      if (component) {
        // 自增name值
        // console.log('component', component)
        // component.name = value;
      }
    });
  },
  updated(el, binding) {
    el.value = binding.value;
  }
});
function getComponentInstanceFromElement(element) {
  let currentNode = element;
  while (currentNode && !currentNode.__v_component) {
    currentNode = currentNode.parentNode;
  }
  return currentNode ? currentNode.__v_component : null;
}
app.mount('#app')
