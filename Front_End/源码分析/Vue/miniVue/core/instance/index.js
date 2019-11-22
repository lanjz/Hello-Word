import { initMixin } from './init.js'
import { mountComponent, lifecycleMixin } from './lifecycle.js'
import { renderMixin } from './render.js'
import { createPatchFunction } from '../vdom/patch.js'
import * as nodeOps from '../vdom/node-ops.js'

function Vue(options) {
	this._init()
}

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

Mvue.prototype.__path__ = createPatchFunction({nodeOps})

initMixin(Vue) // init()、
renderMixin(Vue) // _render()、
lifecycleMixin(Vue) // _update()
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


export default
