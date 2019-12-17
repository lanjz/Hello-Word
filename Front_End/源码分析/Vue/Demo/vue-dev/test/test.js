const Observer = function () {
	this.obs = {}
	this.listen = function (key, fn) {
		if(!this.obs[key]) {
			this.obs[key] = []
		}
		this.obs[key].push(fn)
		console.log(`${key}成功添加订阅消息${fn}`)
	}
	this.public = function () {
		// 取第一个参数
		const key = Array.prototype.shift.call(arguments)
		const listObs = this.obs[key]
		if(listObs) {
			listObs.forEach((fn) => {
				fn(...arguments)
			})
		}
	}
}
function initDefineProperty(data) {
	Object.keys(data).forEach(item => {
		let value = data[item]
		Object.defineProperty(data, item, {
			configurable: false,
			enumerable: true,
			set: function (val) {
				console.log('值改为了')
				value = val
				return val
			},
			get: function () {
				console.log('获取值')
				return value
			}
		})
	})
}
initDefineProperty(data)
console.log('data', data)
