let uid = 0

class Dep {
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
