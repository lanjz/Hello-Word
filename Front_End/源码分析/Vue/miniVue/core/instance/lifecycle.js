
function invokeWithErrorHandling(handler, context, args, vm, info) {
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
function callHook(vm, hook) {
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
// 在此方法中调用 vm._render 方法先生成虚拟 Node，最终调用 vm._update 更新 DOM
function mountComponent(vm, el) {
	vm.$el = el
	if(!vm.$options.render) {
		// todo
	}
	callHook(vm, 'beforeMount')
	let updateComponent = () => {
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
