import Dep from './dep.js'

export default class Watcher {
	constructor(vm, expOrFn, cb) {
		this.vm = vm
		this.getter = expOrFn
		this.newDeps = null
		this.oldDep = null
		// this.prop = prop
		this.value = this.get()
	}
	
	get() {
		Dep.target = this; //储存订阅器
		const value = this.getter.call(this.vm); //因为属性被监听，这一步会执行监听器里的 get方法
		Dep.target = null;
		this.cleanupDeps()
		return value
	}
	
	update() {
		this.getter.call(this.vm)
		// this.get()
	}
	
	addDep(dep) {
		this.newDeps = dep
		dep.addSub(this)
	}
	cleanupDeps() {
		if(this.oldDep)  {
			this.oldDep.removeSub(this)
		}
		this.oldDep = this.newDeps
	}
}
