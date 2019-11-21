let uid = 0
function initMixin(Vue) {
	Mvue.prototype.init = function (options) {
		const vm = this
		vm._uid = uid ++
		vm._self = vm
		vm.$options = options // 合并配置
		if(vm.$options.el) {
			vm.$mount(vm.$options.el)
		}
		initRender(vm) // 添加render方法
		/*	new Observer(this._data);
			new Compile(this);*/
	}
	
}
