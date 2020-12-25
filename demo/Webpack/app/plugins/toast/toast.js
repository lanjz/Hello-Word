// toast.js
import vue from 'vue'

// 这里就是我们刚刚创建的那个静态组件
import toastComponent from './index.vue'

let instance

// 返回一个 扩展实例构造器
const ToastConstructor = vue.extend(toastComponent)

const initInstance = () => {
  instance = new ToastConstructor().$mount(document.createElement('div'))
}


function initToast(options){
  if(!instance) {
    initInstance()
  }
  console.log('instance', instance)
  for(let item in options) {
    instance[item] = options[item]
  }
  if(instance) {
    document.body.appendChild(instance.$el)
  }
  instance.visible = true
  setTimeout(() => {
    instance.visible = false
  }, options.duration)

}

const defaultOptions = {
  title: '',
  type: 'success',
  duration: 1500
}
// 注册为全局组件的函数
function registryToast(options) {
  if( Object.prototype.toString.call(options) !== '[object Object]') {
    options = {}
  }
  return initToast({ ...defaultOptions, ...options })
}
export default registryToast