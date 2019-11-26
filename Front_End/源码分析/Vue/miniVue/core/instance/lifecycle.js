import Watcher from '../observer/watcher'


export function invokeWithErrorHandling(handler, context, args, vm, info) {
	let res
	try {
		res = args ? handler.apply(context, args) : handler.call(context)
		if (res && !res._isVue && isPromise(res) && !res._handled) {
			res.catch(e => {
				console.log('')
			})
			// issue #9511
			// avoid catch triggering multiple times when nested calls
			res._handled = true
		}
	} catch(e) {
		// handleError(e, vm, info)
	}
	return res
	
}
export function callHook(vm, hook) {
	pushTarget()
	const handlers = vm.$options[hook]
	const info = `${hook} hook`
	if(handlers) {
		for (let i = 0, j = handlers.length; i < j; i++) {
			invokeWithErrorHandling(handlers[i], vm, null, vm, info)
		}
	}
	// todo
	if (vm._hasHookEvent) {
		vm.$emit('hook:' + hook)
	}
	popTarget()
}


// mountComponent 核心就是先实例化一个渲染Watcher，在它的回调函数中会调用 updateComponent 方法，
// 在此方法中调用 vm._render 方法先生成虚拟 VNode，最终调用 vm._update 更新 DOM
export function mountComponent(vm, el) {
	vm.$el = el
	if(!vm.$options.render) {
		console.log('$mount方法中应该生成了render方法，到这一步不应该有这提示了')
		// todo
	}
	callHook(vm, 'beforeMount')
	let updateComponent = () => {
		// vm._render() 在主函数中添加
		vm._update(vm._render())
	}
	new Watcher(vm, updateComponent, noop, {
		before () {
			if (vm._isMounted) {
				callHook(vm, 'beforeUpdate')
			}
		}
	}, true /* isRenderWatcher */)
	// 这里注意 vm.$vnode 表示 Vue 实例的父虚拟 Node，所以它为 Null 则表示当前是根 Vue 的实例
	if (vm.$vnode == null) {
		vm._isMounted = true
		callHook(vm, 'mounted')
	}
	return vm
}


export function lifecycleMixin(Vue) {
	Vue.prototype._update = function (vnode) {
		const vm = this
		const prevEl = vm.$el
		const prevNnod = vm._vnode
		vm._vnode = vnode
		// const restoreActiveInstance = setActiveInstance(vm)
		if (!prevVnode) {
			// initial render
			vm.$el = vm.__patch__(vm.$el, vnode, false, false /* removeOnly */)
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
	Vue.prototype.$destroy = function () {
		const vm = this
		if (vm._isBeingDestroyed) {
			return
		}
		callHook(vm, 'beforeDestroy')
		vm._isBeingDestroyed = true
		// remove self from parent
		const parent = vm.$parent
		if (parent && !parent._isBeingDestroyed && !vm.$options.abstract) {
			remove(parent.$children, vm)
		}
		// teardown watchers
		if (vm._watcher) {
			vm._watcher.teardown()
		}
		let i = vm._watchers.length
		while (i--) {
			vm._watchers[i].teardown()
		}
		// remove reference from data ob
		// frozen object may not have observer.
		if (vm._data.__ob__) {
			vm._data.__ob__.vmCount--
		}
		// call the last hook...
		vm._isDestroyed = true
		// invoke destroy hooks on current rendered tree
		vm.__patch__(vm._vnode, null)
		// fire destroyed hook
		callHook(vm, 'destroyed')
		// turn off all instance listeners.
		vm.$off()
		// remove __vue__ reference
		if (vm.$el) {
			vm.$el.__vue__ = null
		}
		// release circular reference (#6759)
		if (vm.$vnode) {
			vm.$vnode.parent = null
		}
	}
}
