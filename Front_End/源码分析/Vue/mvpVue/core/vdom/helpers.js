import { isPrimitive } from '../../utils/index.js'
import { createTextVNode } from './vnode'

export function normalizeChildren(children) {
	return isPrimitive(children)
		? [createTextVNode(children)]
		: Array.isArray(children)
			? normalizeArrayChildren(children)
			: undefined
}

export function simpleNormalizeChildren (children) {
	for (let i = 0; i < children.length; i++) {
		if (Array.isArray(children[i])) {
			return Array.prototype.concat.apply([], children)
		}
	}
	return children
}
