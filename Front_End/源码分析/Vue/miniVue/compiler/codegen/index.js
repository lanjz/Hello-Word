import { isReservedTag } from '../utils/index.js'
import { genHandlers } from './events.js'

function dataGenFns (el) {
	let data = ''
	if (el.staticClass) {
		data += `staticClass:${el.staticClass},`
	}
	if (el.classBinding) {
		data += `class:${el.classBinding},`
	}
	return data
}

export class CodegenState {
	constructor (options) {
		this.options = options
		// this.warn = options.warn || baseWarn
		this.transforms = []
		// this.transforms = pluckModuleFunction(options.modules, 'transformCode')
		this.dataGenFns = [dataGenFns]
		this.directives = {}
		// const isReservedTag = isReservedTag
		this.maybeComponent = (el) => !!el.component || !isReservedTag(el.tag)
		this.onceId = 0
		this.staticRenderFns = []
		this.pre = false
	}
}


export function generate(ast, options = {}) {
	const state = new CodegenState()
	const code = ast ? genElement(ast, state) : '_c("div")'
	return {
		render: `with(this){return ${code}}`,
		staticRenderFns: state.staticRenderFns
	}
}

function genStatic (el, state){
	el.staticProcessed = true
	const originalPreState = state.pre
	if (el.pre) {
		state.pre = el.pre
	}
	state.staticRenderFns.push(`with(this){return ${genElement(el, state)}}`)
	state.pre = originalPreState
	return `_m(${
	state.staticRenderFns.length - 1
		}${
		el.staticInFor ? ',true' : ''
		})`
}


export function genElement (el, state) {
	if (el.parent) {
		el.pre = el.pre || el.parent.pre
	}
	
	if (el.staticRoot && !el.staticProcessed) {
		return genStatic(el, state)
	} else if (el.for && !el.forProcessed) {
		return genFor(el, state)
	} else if (el.if && !el.ifProcessed) {
		return genIf(el, state)
	} else {
		// component or element
		let code
		if (el.component) {
			code = genComponent(el.component, el, state)
		} else {
			let data
			if (!el.plain || (el.pre && state.maybeComponent(el))) {
				data = genData(el, state)
			}
			
			const children = el.inlineTemplate ? null : genChildren(el, state, true)
			code = `_c('${el.tag}'${
				data ? `,${data}` : '' // data
				}${
				children ? `,${children}` : '' // children
				})`
		}
		// module transforms
		for (let i = 0; i < state.transforms.length; i++) {
			code = state.transforms[i](el, code)
		}
		return code
	}
}

export function genChildren (
	el,
	state,
	checkSkip,
	altGenElement,
	altGenNode
){
	const children = el.children
	if (children.length) {
	const el = children[0]
	// optimize single v-for
	if (children.length === 1 &&
		el.for &&
		el.tag !== 'template' &&
		el.tag !== 'slot'
	) {
		const normalizationType = checkSkip
			? state.maybeComponent(el) ? `,1` : `,0`
			: ``
		return `${(altGenElement || genElement)(el, state)}${normalizationType}`
	}
	const normalizationType = checkSkip
		? getNormalizationType(children, state.maybeComponent)
		: 0
	const gen = altGenNode || genNode
	return `[${children.map(c => gen(c, state)).join(',')}]${
		normalizationType ? `,${normalizationType}` : ''
		}`
}
}
export function genData (el, state) {
	let data = '{'
	// key
	if (el.key) {
		data += `key:${el.key},`
	}
	// ref
	if (el.ref) {
		data += `ref:${el.ref},`
	}
	if (el.refInFor) {
		data += `refInFor:true,`
	}
	// pre
	if (el.pre) {
		data += `pre:true,`
	}
	// record original tag name for components using "is" attribute
	if (el.component) {
		data += `tag:"${el.tag}",`
	}
	// module data generation functions
	for (let i = 0; i < state.dataGenFns.length; i++) {
		data += state.dataGenFns[i](el)
	}
	// attributes
	if (el.attrs) {
		data += `attrs:${genProps(el.attrs)},`
	}
	// DOM props
	if (el.props) {
		data += `domProps:${genProps(el.props)},`
	}
	// event handlers
	if (el.events) {
		data += `${genHandlers(el.events, false)},`
	}
	if (el.nativeEvents) {
		data += `${genHandlers(el.nativeEvents, true)},`
	}
	// slot target
	// only for non-scoped slots
	if (el.slotTarget && !el.slotScope) {
		data += `slot:${el.slotTarget},`
	}
	// scoped slots
	if (el.scopedSlots) {
		data += `${genScopedSlots(el, el.scopedSlots, state)},`
	}
	// component v-model
	if (el.model) {
		data += `model:{value:${
			el.model.value
			},callback:${
			el.model.callback
			},expression:${
			el.model.expression
			}},`
	}
	// inline-template
	if (el.inlineTemplate) {
		const inlineTemplate = genInlineTemplate(el, state)
		if (inlineTemplate) {
			data += `${inlineTemplate},`
		}
	}
	data = data.replace(/,$/, '') + '}'
	// v-bind dynamic argument wrap
	// v-bind with dynamic arguments must be applied using the same v-bind object
	// merge helper so that class/style/mustUseProp attrs are handled correctly.
	if (el.dynamicAttrs) {
		data = `_b(${data},"${el.tag}",${genProps(el.dynamicAttrs)})`
	}
	// v-bind data wrap
	if (el.wrapData) {
		data = el.wrapData(data)
	}
	// v-on data wrap
	if (el.wrapListeners) {
		data = el.wrapListeners(data)
	}
	return data
}

export function genFor (
	el,
	state,
	altGen,
	altHelper
) {
	const exp = el.for
	const alias = el.alias
	const iterator1 = el.iterator1 ? `,${el.iterator1}` : ''
	const iterator2 = el.iterator2 ? `,${el.iterator2}` : ''
	el.forProcessed = true // avoid recursion
	return `${altHelper || '_l'}((${exp}),` +
		`function(${alias}${iterator1}${iterator2}){` +
		`return ${(altGen || genElement)(el, state)}` +
		'})'
}

export function genIf (
	el,
	state,
	altGen,
	altEmpty
) {
	el.ifProcessed = true // avoid recursion
	return genIfConditions(el.ifConditions.slice(), state, altGen, altEmpty)
}

function genIfConditions (
	conditions,
	state,
	altGen,
	altEmpty
) {
	if (!conditions.length) {
		return altEmpty || '_e()'
	}
	
	const condition = conditions.shift()
	if (condition.exp) {
		return `(${condition.exp})?${
			genTernaryExp(condition.block)
			}:${
			genIfConditions(conditions, state, altGen, altEmpty)
			}`
	} else {
		return `${genTernaryExp(condition.block)}`
	}
	
	// v-if with v-once should generate code like (a)?_m(0):_m(1)
	function genTernaryExp (el) {
		return altGen
			? altGen(el, state)
			: el.once
				? genOnce(el, state)
				: genElement(el, state)
	}
}

function getNormalizationType (
	children,
	maybeComponent
) {
	let res = 0
	for (let i = 0; i < children.length; i++) {
		const el = children[i]
		if (el.type !== 1) {
			continue
		}
		if (needsNormalization(el) ||
			(el.ifConditions && el.ifConditions.some(c => needsNormalization(c.block)))) {
			res = 2
			break
		}
		if (maybeComponent(el) ||
			(el.ifConditions && el.ifConditions.some(c => maybeComponent(c.block)))) {
			res = 1
		}
	}
	return res
}
function needsNormalization (el) {
	return el.for !== undefined || el.tag === 'template' || el.tag === 'slot'
}

function genNode (node, state) {
	if (node.type === 1) {
		return genElement(node, state)
	} else if (node.type === 3 && node.isComment) {
		return genComment(node)
	} else {
		return genText(node)
	}
}

export function genText (text) {
	return `_v(${text.type === 2
		? text.expression // no need for () because already wrapped in _s()
		: transformSpecialNewlines(JSON.stringify(text.text))
		})`
}


function genProps (props) {
	let staticProps = ``
	let dynamicProps = ``
	for (let i = 0; i < props.length; i++) {
		const prop = props[i]
		const value = transformSpecialNewlines(prop.value)
		if (prop.dynamic) {
			dynamicProps += `${prop.name},${value},`
		} else {
			staticProps += `"${prop.name}":${value},`
		}
	}
	staticProps = `{${staticProps.slice(0, -1)}}`
	if (dynamicProps) {
		return `_d(${staticProps},[${dynamicProps.slice(0, -1)}])`
	} else {
		return staticProps
	}
}

function transformSpecialNewlines (text) {
	return text
		.replace(/\u2028/g, '\\u2028')
		.replace(/\u2029/g, '\\u2029')
}
