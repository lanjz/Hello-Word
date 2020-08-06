import { initRender } from './render.js'
import { mountComponent, lifecycleMixin } from './lifecycle.js'
import { renderMixin } from './render.js'
import { initData } from './state.js'
import { getOuterHTML } from '../utils/dom.js'
import { compileToFunctions } from '../compiler'
import { installRenderHelpers } from '../render-helpers'


let uid = 0
export default function vueMixin(Vue) {
	// init
	Vue.prototype.init = function (options) {
		const vm = this
		vm._uid = uid ++
		vm._self = vm
		vm._renderProxy = vm
		vm.$options = options
		// 添加createElement方法，用于将render方法使用，作用VNode渲染成真实DOM时生成节点
		initRender(vm)
		initData(vm)
		if(vm.$options.el) {
			vm.$mount(vm.$options.el)
		}
	}
	
	// 添加中$mount
	Vue.prototype.$mount = function(el) {
		el = document.querySelector(el)
		const options = this.$options
		if(!options.render) {
			let template = options.template
			if(options.template) {
				// 如果是组件
			} else if(el) {
				// 获取el字符串
				template = getOuterHTML(el)
			}
			if(template) {
				// 把template => AST => render方法
				const { render, staticRenderFns } = compileToFunctions(template, {}, this)
				options.render = render
				options.staticRenderFns = staticRenderFns
			}
		}
		return mountComponent(this, el)
	}
	
	renderMixin(Vue) // _render()、
	lifecycleMixin(Vue) // _update()
	installRenderHelpers(Vue.prototype)
}

