// todo

function initRender(vm) {
	const options = vm.$options
	const parentVnode = vm.$vnode = options._parentVnode // the placeholder node in parent tree
	vm._c = (a, b, c, d) => createElement(vm, a, b, c, d, false)
	vm.$createElement = (a, b, c, d) => createElement(vm, a, b, c, d, true)
	defineReactive(vm, '$attrs', parentData && parentData.attrs || emptyObject, null, true)
	defineReactive(vm, '$listeners', options._parentListeners || emptyObject, null, true)
	
}


function renderMixin(Vue) {
	Vue.prototype._render = function () {
		const vm = this
		const { render, _parentVnode } = vm.$options
		vm.$vnode = _parentVnode
		let vnode
		try {
			vnode = render.call(vm._renderProxy, vm.$createElement)
		} catch (e) {
		
		}
		if(!vnode) {
		
		}
		vnode.parent = _parentVnode
		return vnode
	}
}
