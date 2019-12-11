
export function initState (vm) {
	vm._watchers = []
	const opts = vm.$options
	if (opts.data) {
		initData(vm)
	} else {
		observe(vm._data = {}, true/)
	}
}


function initData (vm) {
	let data = vm.$options.data
	data = vm._data = data || {}
	// proxy data on instance
	const keys = Object.keys(data)
	let i = keys.length
	while (i--) {
		const key = keys[i]
		proxy(vm, `_data`, key)
	}
	// observe data
	observe(data, true)
}

const sharedPropertyDefinition = {
	enumerable: true,
	configurable: true,
	get: noop,
	set: noop
}

export function proxy (target, sourceKey, key) {
	sharedPropertyDefinition.get = function proxyGetter () {
		return this[sourceKey][key]
	}
	sharedPropertyDefinition.set = function proxySetter (val) {
		this[sourceKey][key] = val
	}
	Object.defineProperty(target, key, sharedPropertyDefinition)
}
