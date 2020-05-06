import vueMixin from './vueMixin.js'
export default function Vue(options) {
	this.init(options)
}

vueMixin(Vue)
