import { createElement } from '../vdom/create-element.js'
import { patch } from '../patch'
export function initRender(vm) {
	const options = vm.$options
	vm._c = (a, b, c, d) => createElement(vm, a, b, c, d, false)
	vm.$createElement = (a, b, c, d) => createElement(vm, a, b, c, d, true)
}


export function renderMixin(Vue) {
	Vue.prototype._render = function () {
		const vm = this
		// render方法在$mount中添加的
		const { render, _parentVnode } = vm.$options
		vm.$vnode = _parentVnode
		let vnode
		try {
			vnode = render.call(vm._renderProxy, vm.$createElement)
		} catch (e) {
			console.error(e)
		}
		if(!vnode) {
		
		}
		vnode.parent = _parentVnode
		return vnode
	}
	Vue.prototype.__patch__ = patch
}
