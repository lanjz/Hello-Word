export function isDef (v) {
	return v !== undefined && v !== null
}

// 判断是否promise
export function isPromise (val){
	return (
		isDef(val) &&
		typeof val.then === 'function' &&
		typeof val.catch === 'function'
	)
}

export function noop() {}
export const emptyObject = Object.freeze({})

export function defineReactive(obj, key, val) {
	const dep = new Dep()
	Object.defineProperty(obj, key, {
		enumerable: true,
		configurable: true,
		get: function () {
			if(Dep.target) {
				dep.depend()
			}
			return val
		},
		set: function (newVal) {
			if(newVal === val) {
				return
			}
			val = newVal;
			dep.notify()
		}
	})
	
}

// 判断是否是基本属性
export function isPrimitive (value) {
	return (
		typeof value === 'string' ||
		typeof value === 'number' ||
		// $flow-disable-line
		typeof value === 'symbol' ||
		typeof value === 'boolean'
	)
}

export function makeMap (str, expectsLowerCase){
	const map = Object.create(null)
	const list = str.split(',')
	for (let i = 0; i < list.length; i++) {
		map[list[i]] = true
	}
	return expectsLowerCase
		? val => map[val.toLowerCase()]
		: val => map[val]
}

export const isPreTag = (tag) => tag === 'pre'

const acceptValue = makeMap('input,textarea,option,select,progress')

export const mustUseProp = (tag, type, attr) => {
	return (
		(attr === 'value' && acceptValue(tag)) && type !== 'button' ||
		(attr === 'value' && acceptValue(tag)) && type !== 'button' ||
		(attr === 'selected' && tag === 'option') ||
		(attr === 'checked' && tag === 'input') ||
		(attr === 'muted' && tag === 'video')
	)
}



export const isHTMLTag = makeMap(
	'html,body,base,head,link,meta,style,title,' +
	'address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,hgroup,nav,section,' +
	'div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,' +
	'a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,rtc,ruby,' +
	's,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,' +
	'embed,object,param,source,canvas,script,noscript,del,ins,' +
	'caption,col,colgroup,table,thead,tbody,td,th,tr,' +
	'button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,' +
	'output,progress,select,textarea,' +
	'details,dialog,menu,menuitem,summary,' +
	'content,element,shadow,template,blockquote,iframe,tfoot'
)

export const isSVG = makeMap(
	'svg,animate,circle,clippath,cursor,defs,desc,ellipse,filter,font-face,' +
	'foreignObject,g,glyph,image,line,marker,mask,missing-glyph,path,pattern,' +
	'polygon,polyline,rect,switch,symbol,text,textpath,tspan,use,view',
	true
)

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

export const isReservedTag = (tag) => {
	return isHTMLTag(tag) || isSVG(tag)
}

export function warn(data) {
	console.log('warn', data)
}
export function isFalse (v) {
	return v === false
}
// explicitness and function inlining.
export function isUndef (v) {
	return v === undefined || v === null
}

export function extend (to, _from) {
	for (const key in _from) {
		to[key] = _from[key]
	}
	return to
}
const _toString = Object.prototype.toString

export function isObject (obj) {
	return obj !== null && typeof obj === 'object'
}

export const hasSymbol =
	typeof Symbol !== 'undefined' && isNative(Symbol) &&
	typeof Reflect !== 'undefined' && isNative(Reflect.ownKeys)

export function isNative (Ctor) {
	return typeof Ctor === 'function' && /native code/.test(Ctor.toString())
}

export function toString (val) {
	return val == null
		? ''
		: Array.isArray(val) || (isPlainObject(val) && val.toString === _toString)
			? JSON.stringify(val, null, 2)
			: String(val)
}

export function isPlainObject (obj) {
	return _toString.call(obj) === '[object Object]'
}

export function isTrue (v) {
	return v === true
}

const hasOwnProperty = Object.prototype.hasOwnProperty
export function hasOwn (obj, key) {
	return hasOwnProperty.call(obj, key)
}
