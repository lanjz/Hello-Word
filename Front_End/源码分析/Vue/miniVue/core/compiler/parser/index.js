import { parserHTML } from './html-parser.js'
import { parseText } from './text-parser.js'
import { parseFilters } from './filter-parser.js'
import { getAndRemoveAttr, extend, getBindingAttr, addDirective, getRawBindingAttr, addHandler, addProp, no, getTagNamespace } from './helper/index.js'
import { pluckModuleFunction } from '../../utils/index.js'
export const onRE = /^@|^v-on:/
import { isIE } from '../../utils/env.js'
const stripParensRE = /^\(|\)$/g
export const forIteratorRE = /,([^,\}\]]*)(?:,([^,\}\]]*))?$/
export const dirRE = /^v-|^@|^:/
export const forAliasRE = /([\s\S]*?)\s+(?:in|of)\s+([\s\S]*)/
const dynamicArgRE = /^\[.*\]$/
const slotRE = /^v-slot(:|$)|^#/
const argRE = /:(.*)$/
export const bindRE = /^:|^\.|^v-bind:/
const propBindRE = /^\./
const modifierRE = /\.[^.\]]+(?=[^\]]*$)/g

const lineBreakRE = /[\r\n]/
const whitespaceRE = /\s+/g

const invalidAttributeRE = /[\s"'<>\/=]/

let warn
let delimiters
let transforms
let preTransforms
let postTransforms
let platformIsPreTag
let platformMustUseProp
let platformGetTagNamespace
let maybeComponent

export function processFor (el) {
	let exp
	if ((exp = getAndRemoveAttr(el, 'v-for'))) {
		const res = parseFor(exp)
		if (res) {
			extend(el, res)
		}
	}
}
function processOnce (el) {
	const once = getAndRemoveAttr(el, 'v-once')
	if (once != null) {
		el.once = true
	}
}

function processIf (el) {
	const exp = getAndRemoveAttr(el, 'v-if')
	if (exp) {
		el.if = exp
		addIfCondition(el, {
			exp: exp,
			block: el
		})
	} else {
		if (getAndRemoveAttr(el, 'v-else') != null) {
			el.else = true
		}
		const elseif = getAndRemoveAttr(el, 'v-else-if')
		if (elseif) {
			el.elseif = elseif
		}
	}
}
export function parseFor (exp) {
	const inMatch = exp.match(forAliasRE)
	if (!inMatch) return
	const res = {}
	res.for = inMatch[2].trim()
	const alias = inMatch[1].trim().replace(stripParensRE, '')
	const iteratorMatch = alias.match(forIteratorRE)
	if (iteratorMatch) {
		res.alias = alias.replace(forIteratorRE, '').trim()
		res.iterator1 = iteratorMatch[1].trim()
		if (iteratorMatch[2]) {
			res.iterator2 = iteratorMatch[2].trim()
		}
	} else {
		res.alias = alias
	}
	return res
}

function makeAttrsMap (attrs) {
	const map = {}
	for (let i = 0, l = attrs.length; i < l; i++) {
		map[attrs[i].name] = attrs[i].value
	}
	return map
}
export function createASTElement (
	tag,
	attrs,
	parent
) {
	return {
		type: 1,
		tag,
		attrsList: attrs,
		attrsMap: makeAttrsMap(attrs),
		rawAttrsMap: {},
		parent,
		children: []
	}
}
function isForbiddenTag (el) {
	return (
		el.tag === 'style' ||
		(el.tag === 'script' && (
			!el.attrsMap.type ||
			el.attrsMap.type === 'text/javascript'
		))
	)
}
function isTextTag (el) {
	return el.tag === 'script' || el.tag === 'style'
}

function guardIESVGBug (attrs) {
	const res = []
	for (let i = 0; i < attrs.length; i++) {
		const attr = attrs[i]
		if (!ieNSBug.test(attr.name)) {
			attr.name = attr.name.replace(ieNSPrefix, '')
			res.push(attr)
		}
	}
	return res
}

function processKey (el) {
	const exp = getBindingAttr(el, 'key')
	if (exp) {
		el.key = exp
	}
}

function processRef (el) {
	const ref = getBindingAttr(el, 'ref')
	if (ref) {
		el.ref = ref
		el.refInFor = checkInFor(el)
	}
}
function getSlotName (binding) {
	let name = binding.name.replace(slotRE, '')
	if (!name) {
		if (binding.name[0] !== '#') {
			name = 'default'
		}
	}
	return dynamicArgRE.test(name)
		// dynamic [name]
		? { name: name.slice(1, -1), dynamic: true }
		// static name
		: { name: `"${name}"`, dynamic: false }
}


export function processElement (
	element,
	options
) {
	processKey(element)
	
	// determine whether this is a plain element after
	// removing structural attributes
	element.plain = (
		!element.key &&
		!element.scopedSlots &&
		!element.attrsList.length
	)
	
	// processRef(element)
	// processSlotContent(element)
	// processSlotOutlet(element)
	// processComponent(element)
	for (let i = 0; i < transforms.length; i++) {
		element = transforms[i](element, options) || element
	}
	processAttrs(element)
	return element
}
function parseModifiers (name){
	const match = name.match(modifierRE)
	if (match) {
		const ret = {}
		match.forEach(m => { ret[m.slice(1)] = true })
		return ret
	}
}

let len, str, chr, index, expressionPos, expressionEndPos
function next () {
	return str.charCodeAt(++index)
}

function isStringStart (chr) {
	return chr === 0x22 || chr === 0x27
}
function eof () {
	return index >= len
}
function parseString (chr) {
	const stringQuote = chr
	while (!eof()) {
		chr = next()
		if (chr === stringQuote) {
			break
		}
	}
}
export function addAttr (el, name, value, range, dynamic) {
	const attrs = dynamic
		? (el.dynamicAttrs || (el.dynamicAttrs = []))
		: (el.attrs || (el.attrs = []))
	attrs.push(rangeSetItem({ name, value, dynamic }, range))
	el.plain = false
}
function parseBracket (chr) {
	let inBracket = 1
	expressionPos = index
	while (!eof()) {
		chr = next()
		if (isStringStart(chr)) {
			parseString(chr)
			continue
		}
		if (chr === 0x5B) inBracket++
		if (chr === 0x5D) inBracket--
		if (inBracket === 0) {
			expressionEndPos = index
			break
		}
	}
}


export function parseModel (val) {
	// Fix https://github.com/vuejs/vue/pull/7730
	// allow v-model="obj.val " (trailing whitespace)
	val = val.trim()
	len = val.length
	
	if (val.indexOf('[') < 0 || val.lastIndexOf(']') < len - 1) {
		index = val.lastIndexOf('.')
		if (index > -1) {
			return {
				exp: val.slice(0, index),
				key: '"' + val.slice(index + 1) + '"'
			}
		} else {
			return {
				exp: val,
				key: null
			}
		}
	}
	
	str = val
	index = expressionPos = expressionEndPos = 0
	
	while (!eof()) {
		chr = next()
		/* istanbul ignore if */
		if (isStringStart(chr)) {
			parseString(chr)
		} else if (chr === 0x5B) {
			parseBracket(chr)
		}
	}
	
	return {
		exp: val.slice(0, expressionPos),
		key: val.slice(expressionPos + 1, expressionEndPos)
	}
}

export function genAssignmentCode (
	value,
	assignment
) {
	const res = parseModel(value)
	if (res.key === null) {
		return `${value}=${assignment}`
	} else {
		return `$set(${res.exp}, ${res.key}, ${assignment})`
	}
}
export function addIfCondition (el, condition) {
	if (!el.ifConditions) {
		el.ifConditions = []
	}
	el.ifConditions.push(condition)
}
function processAttrs (el) {
	const list = el.attrsList
	let i, l, name, rawName, value, modifiers, syncGen, isDynamic
	for (i = 0, l = list.length; i < l; i++) {
		name = rawName = list[i].name
		value = list[i].value
		if (dirRE.test(name)) {
			// mark element as dynamic
			el.hasBindings = true
			// modifiers
			modifiers = parseModifiers(name.replace(dirRE, ''))
			// support .foo shorthand syntax for the .prop modifier
			if (propBindRE.test(name)) {
				(modifiers || (modifiers = {})).prop = true
				name = `.` + name.slice(1).replace(modifierRE, '')
			} else if (modifiers) {
				name = name.replace(modifierRE, '')
			}
			if (bindRE.test(name)) { // v-bind
				name = name.replace(bindRE, '')
				value = parseFilters(value)
				isDynamic = dynamicArgRE.test(name)
				if (isDynamic) {
					name = name.slice(1, -1)
				}
				if (modifiers) {
					if (modifiers.prop && !isDynamic) {
						name = camelize(name)
						if (name === 'innerHtml') name = 'innerHTML'
					}
					if (modifiers.camel && !isDynamic) {
						name = camelize(name)
					}
					if (modifiers.sync) {
						syncGen = genAssignmentCode(value, `$event`)
						if (!isDynamic) {
							addHandler(
								el,
								`update:${camelize(name)}`,
								syncGen,
								null,
								false,
								warn,
								list[i]
							)
							if (hyphenate(name) !== camelize(name)) {
								addHandler(
									el,
									`update:${hyphenate(name)}`,
									syncGen,
									null,
									false,
									warn,
									list[i]
								)
							}
						} else {
							// handler w/ dynamic event name
							addHandler(
								el,
								`"update:"+(${name})`,
								syncGen,
								null,
								false,
								warn,
								list[i],
								true // dynamic
							)
						}
					}
				}
				if ((modifiers && modifiers.prop) || (
						!el.component && platformMustUseProp(el.tag, el.attrsMap.type, name)
					)) {
					addProp(el, name, value, list[i], isDynamic)
				} else {
					addAttr(el, name, value, list[i], isDynamic)
				}
			} else if (onRE.test(name)) { // v-on
				name = name.replace(onRE, '')
				isDynamic = dynamicArgRE.test(name)
				if (isDynamic) {
					name = name.slice(1, -1)
				}
				addHandler(el, name, value, modifiers, false, warn, list[i], isDynamic)
			} else { // normal directives
				name = name.replace(dirRE, '')
				// parse arg
				const argMatch = name.match(argRE)
				let arg = argMatch && argMatch[1]
				isDynamic = false
				if (arg) {
					name = name.slice(0, -(arg.length + 1))
					if (dynamicArgRE.test(arg)) {
						arg = arg.slice(1, -1)
						isDynamic = true
					}
				}
				addDirective(el, name, rawName, value, arg, isDynamic, modifiers, list[i])
			}
		} else {
			addAttr(el, name, JSON.stringify(value), list[i])
			// #6887 firefox doesn't update muted state if set via attribute
			// even immediately after element creation
			if (!el.component &&
				name === 'muted' &&
				platformMustUseProp(el.tag, el.attrsMap.type, name)) {
				addProp(el, name, 'true', list[i])
			}
		}
	}
}
function processSlotOutlet (el) {
	if (el.tag === 'slot') {
		el.slotName = getBindingAttr(el, 'name')
	}
}
function processComponent (el) {
	let binding
	if ((binding = getBindingAttr(el, 'is'))) {
		el.component = binding
	}
	if (getAndRemoveAttr(el, 'inline-template') != null) {
		el.inlineTemplate = true
	}
}

function processSlotContent (el) {
	let slotScope
	if (el.tag === 'template') {
		slotScope = getAndRemoveAttr(el, 'scope')
		el.slotScope = slotScope || getAndRemoveAttr(el, 'slot-scope')
	} else if ((slotScope = getAndRemoveAttr(el, 'slot-scope'))) {
		el.slotScope = slotScope
	}
	
	// slot="xxx"
	const slotTarget = getBindingAttr(el, 'slot')
	if (slotTarget) {
		el.slotTarget = slotTarget === '""' ? '"default"' : slotTarget
		el.slotTargetDynamic = !!(el.attrsMap[':slot'] || el.attrsMap['v-bind:slot'])
		// preserve slot as an attribute for native shadow DOM compat
		// only for non-scoped slots.
		if (el.tag !== 'template' && !el.slotScope) {
			addAttr(el, 'slot', slotTarget, getRawBindingAttr(el, 'slot'))
		}
	}
	
}



function processPre (el) {
	if (getAndRemoveAttr(el, 'v-pre') != null) {
		el.pre = true
	}
}
function processRawAttrs (el) {
	const list = el.attrsList
	const len = list.length
	if (len) {
		const attrs = el.attrs = new Array(len)
		for (let i = 0; i < len; i++) {
			attrs[i] = {
				name: list[i].name,
				value: JSON.stringify(list[i].value)
			}
			if (list[i].start != null) {
				attrs[i].start = list[i].start
				attrs[i].end = list[i].end
			}
		}
	} else if (!el.pre) {
		// non root node in pre blocks with no attributes
		el.plain = true
	}
}

export function parse(template, options) {
	warn = options.warn
	
	platformIsPreTag = options.isPreTag || no
	platformMustUseProp = options.mustUseProp || no
	platformGetTagNamespace = options.getTagNamespace || no
	const isReservedTag = options.isReservedTag || no
	maybeComponent = (el) => !!el.component || !isReservedTag(el.tag)
	
	transforms = pluckModuleFunction(options.modules, 'transformNode')
	preTransforms = pluckModuleFunction(options.modules, 'preTransformNode')
	postTransforms = []
	
	delimiters = options.delimiters
	
	const stack = []
	const preserveWhitespace = options.preserveWhitespace !== false
	const whitespaceOption = options.whitespace
	let root
	let currentParent
	let inVPre = false
	let inPre = false
	let warned = false
	
	
	function warnOnce (msg, range) {
		if (!warned) {
			warned = true
			warn(msg, range)
		}
	}
	
	function closeElement (element) {
		trimEndingWhitespace(element)
		if (!inVPre && !element.processed) {
			element = processElement(element, options)
		}
		// tree management
		if (!stack.length && element !== root) {
			// allow root elements with v-if, v-else-if and v-else
			if (root.if && (element.elseif || element.else)) {
				addIfCondition(root, {
					exp: element.elseif,
					block: element
				})
			}
		}
		if (currentParent && !element.forbidden) {
			if (element.elseif || element.else) {
				processIfConditions(element, currentParent)
			} else {
				if (element.slotScope) {
					// scoped slot
					// keep it in the children list so that v-else(-if) conditions can
					// find it as the prev node.
					const name = element.slotTarget || '"default"'
					;(currentParent.scopedSlots || (currentParent.scopedSlots = {}))[name] = element
				}
				currentParent.children.push(element)
				element.parent = currentParent
			}
		}
		
		// final children cleanup
		// filter out scoped slots
		element.children = element.children.filter(c => !(c).slotScope)
		// remove trailing whitespace node again
		trimEndingWhitespace(element)
		
		// check pre state
		if (element.pre) {
			inVPre = false
		}
		// 标签名是否是pre
		if (platformIsPreTag(element.tag)) {
			inPre = false
		}
		// apply post-transforms
		for (let i = 0; i < postTransforms.length; i++) {
			postTransforms[i](element, options)
		}
	}
	
	function trimEndingWhitespace (el) {
		// remove trailing whitespace node
		if (!inPre) {
			let lastNode
			while (
				(lastNode = el.children[el.children.length - 1]) &&
				lastNode.type === 3 &&
				lastNode.text === ' '
				) {
				el.children.pop()
			}
		}
	}
	
	parserHTML(template, {
		start(tag, attrs, unary, start, end) {
			const ns = (currentParent && currentParent.ns) || platformGetTagNamespace(tag)
			// handle IE svg bug
			/* istanbul ignore if */
			if (isIE && ns === 'svg') {
				attrs = guardIESVGBug(attrs)
			}
			let element = createASTElement(tag, attrs, currentParent)
			if (ns) {
				element.ns = ns
			}
			if (isForbiddenTag(element) && !isServerRendering()) {
				element.forbidden = true
			}
			for (let i = 0; i < preTransforms.length; i++) {
				element = preTransforms[i](element, options) || element
			}
			if (!inVPre) {
				// 处理v-pre指定，如果有v-pre指定那么跳过这个元素和它的子元素的编译过程
				processPre(element)
				if (element.pre) {
					inVPre = true
				}
			}
			if (platformIsPreTag(element.tag)) {
				inPre = true
			}
			if (inVPre) {
				processRawAttrs(element)
			} else if (!element.processed) {
				// structural directives
				processFor(element)
				processIf(element)
				processOnce(element)
				processElement(element, options)
			}
			
			if (!root) {
				root = element
			}
			if (!unary) {
				currentParent = element
				stack.push(element)
			} else {
				closeElement(element)
			}
		},
		end (tag, start, end) {
			const element = stack[stack.length - 1]
			stack.length -= 1
			currentParent = stack[stack.length - 1]
			closeElement(element)
		},
		chars (text, start, end) {
			if (!currentParent) {
				return
			}
			if (isIE &&
				currentParent.tag === 'textarea' &&
				currentParent.attrsMap.placeholder === text
			) {
				return
			}
			const children = currentParent.children
			if (inPre || text.trim()) {
				text = isTextTag(currentParent) ? text : text
			} else if (!children.length) {
				// remove the whitespace-only node right after an opening tag
				text = ''
			} else if (whitespaceOption) {
				if (whitespaceOption === 'condense') {
					// in condense mode, remove the whitespace node if it contains
					// line break, otherwise condense to a single space
					text = lineBreakRE.test(text) ? '' : ' '
				} else {
					text = ' '
				}
			} else {
				text = preserveWhitespace ? ' ' : ''
			}
			if (text) {
				if (!inPre && whitespaceOption === 'condense') {
					// condense consecutive whitespaces into single space
					text = text.replace(whitespaceRE, ' ')
				}
				let res
				let child
				if (!inVPre && text !== ' ' && (res = parseText(text, delimiters))) {
					child = {
						type: 2,
						expression: res.expression,
						tokens: res.tokens,
						text
					}
				} else if (text !== ' ' || !children.length || children[children.length - 1].text !== ' ') {
					child = {
						type: 3,
						text
					}
				}
				if (child) {
					children.push(child)
				}
			}
		},
		comment (text, start, end) {
			// adding anyting as a sibling to the root node is forbidden
			// comments should still be allowed, but ignored
			if (currentParent) {
				const child = {
					type: 3,
					text,
					isComment: true
				}
				currentParent.children.push(child)
			}
		}
	})
	return root
}

function rangeSetItem (
	item,
	range={ start, end }
) {
	if (range) {
		if (range.start != null) {
			item.start = range.start
		}
		if (range.end != null) {
			item.end = range.end
		}
	}
	return item
}
