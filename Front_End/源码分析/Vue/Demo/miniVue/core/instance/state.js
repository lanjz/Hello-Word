import { noop, isObject, hasOwn, isPlainObject } from '../utils/index.js'
import VNode from '../vdom/vnode.js'
import { Observer } from '../observer/dep.js'
export function initState (vm) {
	vm._watchers = []
	const opts = vm.$options
	initData(vm)
}


export function initData (vm) {
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
	observe(data, true, vm)
}

const sharedPropertyDefinition = {
	enumerable: true,
	configurable: true,
	get: noop,
	set: noop
}

// 把 target[sourceKey][key] 的读写变成了对 target[key] 的读写
export function proxy (target, sourceKey, key) {
	sharedPropertyDefinition.get = function proxyGetter () {
		return this[sourceKey][key]
	}
	sharedPropertyDefinition.set = function proxySetter (val) {
		this[sourceKey][key] = val
	}
	Object.defineProperty(target, key, sharedPropertyDefinition)
}


export function observe (value, asRootData, vm) {
	if (!isObject(value) || value instanceof VNode) {
		return
	}
	let ob
	ob = new Observer(value)
	return ob
}
