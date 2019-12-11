let uid = 0
function defineReactive(obj, key, val) {
	const dep = new Dep()
	console.log('dep', dep)
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

class Observer {
	constructor(value) {
		this.walk(value)
	}
	walk(obj) {
		const keys = Object.keys(obj)
		for (let i = 0; i < keys.length; i++) {
			defineReactive(obj, keys[i], obj[keys])
		}
	}
}

/*
function observer(data) {
	if (!data || typeof data !== "object") {
		return;
	}
	Object.keys(data).forEach(key => {
		defineReactive(data, key, data[key]);
	});
}
*/


export default class Dep {
	constructor() {
		this.id = uid ++
		this.subs = []
	}
	addSub(sub) {
		this.subs.push(sub)
	}
	removeSub(sub) {
		if(this.subs.length) {
			const index = this.subs.indexOf(sub)
			if(index > -1) {
				this.subs.splice(index, 1)
			}
		}
	}
	depend() {
		if(Dep.target) {
			Dep.target.addDep(this)
		}
	}
	notify() {
		console.log('属性变化通知 Watcher 执行更新视图函数');
		const subs = this.subs.slice()
		for (let i = 0, l = subs.length; i < l; i++) {
			subs[i].update()
		}
	}
}

Dep.target = null
const targetStack = []
function pushTarget(target) {
	targetStack.push(target)
	Dep.target = target
}
function popTarget () {
	targetStack.pop()
	Dep.target = targetStack[targetStack.length - 1]
}
