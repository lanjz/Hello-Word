export function isDef (v) {
	return v !== undefined && v !== null
}
export function isPromise (val){
	return (
		isDef(val) &&
		typeof val.then === 'function' &&
		typeof val.catch === 'function'
	)
}

export function noop() {}
export const emptyObject = Object.freeze({})

export function defineReactive(obj, key, val) {
	const dep = new Dep()
	Object.defineProperty(obj, key, {
		enumerable: true,
		configurable: true,
		get: function () {
			if(Dep.target) {
				dep.depend()
			}
			return val
		},
		set: function (newVal) {
			if(newVal === val) {
				return
			}
			val = newVal;
			dep.notify()
		}
	})
	
}
