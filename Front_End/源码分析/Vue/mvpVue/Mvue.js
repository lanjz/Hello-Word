uid = 0
function Mvue(options) {
	this._data = options.data;
	this.$el = document.querySelector(options.el);
	this.init(options);
}
initMixin(Mvue)
renderMixin(Mvue) // 添加_render方法


Mvue.prototype.$mount = function(el) {
	el = document.querySelector(el)
	const options = this.$options
	if(!options.render) {
		let template = options.template
		if(options.template) {
		
		} else if(el) {
			template = getOuterHTML(el)
		}
		if(template) {
			const { render, staticRenderFns } = compileToFunctions(template, {
				outputSourceRange: process.env.NODE_ENV !== 'production',
				shouldDecodeNewlines,
				shouldDecodeNewlinesForHref,
				delimiters: options.delimiters,
				comments: options.comments
			}, this)
			options.render = render
			options.staticRenderFns = staticRenderFns
		}
	}
	return mountComponent.call(this, el)
}

// todo
function compileToFunctions() {

}

// 返回元素字符串
function getOuterHTML (el) {
	if (el.outerHTML) {
		return el.outerHTML
	} else {
		const container = document.createElement('div')
		container.appendChild(el.cloneNode(true))
		return container.innerHTML
	}
}
