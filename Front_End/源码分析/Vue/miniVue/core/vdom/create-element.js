import { isDef, isPrimitive } from '../../utils/index.js'

const SIMPLE_NORMALIZE = 1
const ALWAYS_NORMALIZE = 2
/**
 * @param <object> context : 表示 VNode 的上下文环境
 * @param <object> tag : 是一个字符串，也可以是一个 Component
 * @param <object> data : 表示 VNode 的数据，它是一个 VNodeData 类型
 * @param <object> children : 表示当前 VNode 的子节点
 * @param <object> normalizationType : 表示子节点规范的类型，类型不同规范的方法也就不一样
 * */
export function createElement(contest, tag, data, children, normalizationType, alwaysNormalize) {
	if (Array.isArray(data) || isPrimitive(data)) {
		normalizationType = children
		children = data
		data = undefined
	}
	if (isTrue(alwaysNormalize)) {
		normalizationType = ALWAYS_NORMALIZE
	}
	if(isDef(data) && isDef(data.__ob__)) {
		return createEmptyVNode()
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
