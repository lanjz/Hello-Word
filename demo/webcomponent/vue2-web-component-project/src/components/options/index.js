// toast.js
import vue from 'vue'

// 这里就是我们刚刚创建的那个静态组件
import toastComponent from './index.vue'

let instance

// 返回一个 扩展实例构造器
const ToastConstructor = vue.extend(toastComponent)

const initInstance = () => {
    // 生成 toast 组件实例
    instance = new ToastConstructor({
        el: document.createElement('div')
    })
    // 获者 instance = new ToastConstructor().$mount(document.createElement('div'))
}

// 通过 vue 实例就可以设置和获取实例中的属性和方法了
function initToast(options){
    if(!instance) {
        initInstance()
    }
    for(let item in options) {
        instance[item] = options[item]
    }
    if(instance) {
        // 将这个 vue 插入到 DOM 中
        document.body.appendChild(instance.$el)
    }
    // 显示这个 toast
    instance.visible = true
    return instance

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