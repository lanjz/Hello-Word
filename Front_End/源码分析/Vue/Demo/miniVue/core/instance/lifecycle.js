import Watcher from '../observer/watch.js'
import { noop } from '../utils/index.js'
// mountComponent 核心就是先实例化一个渲染Watcher，在它的回调函数中会调用 updateComponent 方法，
// 在此方法中调用 vm._render 方法先生成虚拟 VNode，最终调用 vm._update 更新 DOM
export function mountComponent(vm, el) {
	vm.$el = el
	let updateComponent = () => {
		vm._update(vm._render())
	}
	new Watcher(vm, updateComponent, noop, {
		before () {}
	}, true )
	return vm
}


export function lifecycleMixin(Vue) {
	Vue.prototype._update = function (vnode) {
		const vm = this
		const prevEl = vm.$el
		const prevVnode = vm._vnode
		vm._vnode = vnode
		// const restoreActiveInstance = setActiveInstance(vm)
		if (!prevVnode) {
			// initial render
			vm.$el = vm.__patch__(vm.$el, vnode, false, false)
		} else {
			// updates
			vm.$el = vm.__patch__(prevVnode, vnode)
		}
	}
	Vue.prototype.$forceUpdate = function () {
		const vm = this
		if (vm._watcher) {
			vm._watcher.update()
		}
	}
}
