function isDef (v) {
	return v !== undefined && v !== null
}
function isPromise (val){
	return (
		isDef(val) &&
		typeof val.then === 'function' &&
		typeof val.catch === 'function'
	)
}

function noop() {}
const emptyObject = Object.freeze({})
