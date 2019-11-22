import { isDef } from '../../utils/index.js'

const SIMPLE_NORMALIZE = 1
const ALWAYS_NORMALIZE = 2
export function createElement(contest, tag, data, children, normalizationType, alwaysNormalize) {
	if(isDef(data) && isDef(data.__ob__)) {
		return createEmptyVNode(
	}
	if (isDef(data) && isDef(data.is)) {
		tag = data.is
	}
	if (!tag) {
		// in case of component :is set to falsy value
		return createEmptyVNode()
	}
	if(Array.isArray(children) && typeof children[0] === 'function') {
		data = data || {}
		data.scopedSlots = { default: children[0] }
		children.length = 0
	}
	if (normalizationType === ALWAYS_NORMALIZE) {
		children = normalizeChildren(children)
	} else if (normalizationType === SIMPLE_NORMALIZE) {
		children = simpleNormalizeChildren(children)
	}
	
	let vnode, ns
	vnode = new VNode(
		tag, data, children,
		undefined, undefined, context
	)
	return vnode
}
