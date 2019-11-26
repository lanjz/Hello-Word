import { initRender } from './render'
let uid = 0
export function initMixin(Vue) {
	Vue.prototype.init = function (options) {
		const vm = this
		vm._uid = uid ++
		vm._self = vm
		vm.$options = options // 合并配置
		vm._renderProxy = vm
		initRender(vm) // _render()
		if(vm.$options.el) {
			// vm.$mount()在主文件中定义
			vm.$mount(vm.$options.el)
		}
	}
	
}
