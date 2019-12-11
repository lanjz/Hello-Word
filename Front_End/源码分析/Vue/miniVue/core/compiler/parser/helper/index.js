import { parseFilters } from '../filter-parser.js'
export const emptyObject = Object.freeze({})
export function getBindingAttr (
	el,
	name,
	getStatic
) {
	const dynamicValue =
		getAndRemoveAttr(el, ':' + name) ||
		getAndRemoveAttr(el, 'v-bind:' + name)
	if (dynamicValue != null) {
		return parseFilters(dynamicValue)
	} else if (getStatic !== false) {
		const staticValue = getAndRemoveAttr(el, name)
		if (staticValue != null) {
			return JSON.stringify(staticValue)
		}
	}
}

export function getRawBindingAttr (
	el,
	name
) {
	return el.rawAttrsMap[':' + name] ||
		el.rawAttrsMap['v-bind:' + name] ||
		el.rawAttrsMap[name]
}
export function getAndRemoveAttrByRegex (
	el,
	name
) {
	const list = el.attrsList
	for (let i = 0, l = list.length; i < l; i++) {
		const attr = list[i]
		if (name.test(attr.name)) {
			list.splice(i, 1)
			return attr
		}
	}
}


export function getAndRemoveAttr (
	el,
	name,
	removeFromMap
) {
	let val
	if ((val = el.attrsMap[name]) != null) {
		const list = el.attrsList
		for (let i = 0, l = list.length; i < l; i++) {
			if (list[i].name === name) {
				list.splice(i, 1)
				break
			}
		}
	}
	if (removeFromMap) {
		delete el.attrsMap[name]
	}
	return val
}

export function extend (to, _from) {
	for (const key in _from) {
		to[key] = _from[key]
	}
	return to
}


function prependModifierMarker (symbol, name, dynamic) {
	return dynamic
		? `_p(${name},"${symbol}")`
		: symbol + name // mark the event as captured
}

export function addProp (el, name, value, range, dynamic) {
	(el.props || (el.props = [])).push(rangeSetItem({ name, value, dynamic }, range))
	el.plain = false
}
export const no = (a, b, c) => false
export function addDirective (
	el,
	name,
	rawName,
	value,
	arg,
	isDynamicArg,
	modifiers,
	range
) {
	(el.directives || (el.directives = [])).push(rangeSetItem({
		name,
		rawName,
		value,
		arg,
		isDynamicArg,
		modifiers
	}, range))
	el.plain = false
}

export function addHandler (
	el,
	name,
	value,
	modifiers,
	important,
	warn,
	range,
	dynamic
) {
	modifiers = modifiers || emptyObject
	
	// normalize click.right and click.middle since they don't actually fire
	// this is technically browser-specific, but at least for now browsers are
	// the only target envs that have right/middle clicks.
	if (modifiers.right) {
		if (dynamic) {
			name = `(${name})==='click'?'contextmenu':(${name})`
		} else if (name === 'click') {
			name = 'contextmenu'
			delete modifiers.right
		}
	} else if (modifiers.middle) {
		if (dynamic) {
			name = `(${name})==='click'?'mouseup':(${name})`
		} else if (name === 'click') {
			name = 'mouseup'
		}
	}
	
	// check capture modifier
	if (modifiers.capture) {
		delete modifiers.capture
		name = prependModifierMarker('!', name, dynamic)
	}
	if (modifiers.once) {
		delete modifiers.once
		name = prependModifierMarker('~', name, dynamic)
	}
	/* istanbul ignore if */
	if (modifiers.passive) {
		delete modifiers.passive
		name = prependModifierMarker('&', name, dynamic)
	}
	
	let events
	if (modifiers.native) {
		delete modifiers.native
		events = el.nativeEvents || (el.nativeEvents = {})
	} else {
		events = el.events || (el.events = {})
	}
	
	const newHandler = rangeSetItem({ value: value.trim(), dynamic }, range)
	if (modifiers !== emptyObject) {
		newHandler.modifiers = modifiers
	}
	
	const handlers = events[name]
	/* istanbul ignore if */
	if (Array.isArray(handlers)) {
		important ? handlers.unshift(newHandler) : handlers.push(newHandler)
	} else if (handlers) {
		events[name] = important ? [newHandler, handlers] : [handlers, newHandler]
	} else {
		events[name] = newHandler
	}
	
	el.plain = false
}

function rangeSetItem (
	item,
	range
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

export function cached(fn) {
	const cache = Object.create(null)
	return (function cachedFn (str) {
		const hit = cache[str]
		return hit || (cache[str] = fn(str))
	})
}

export function baseWarn (msg, range) {
	console.error(`[Vue compiler]: ${msg}`)
}
export function getTagNamespace (tag) {
	if (isSVG(tag)) {
		return 'svg'
	}
	// basic support for MathML
	// note it doesn't support other MathML elements being component roots
	if (tag === 'math') {
		return 'math'
	}
}
