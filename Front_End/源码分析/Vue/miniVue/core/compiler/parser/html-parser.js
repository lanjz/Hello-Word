import { makeMap, isUnaryTag } from '../../../utils/index.js'
import { no } from './helper/index.js'
import { shouldDecodeNewlines, shouldDecodeNewlinesForHref, decodeAttr } from './helper/compat.js'
export const isPlainTextElement = makeMap('script,style,textarea', true)
export const unicodeRegExp = /a-zA-Z\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD/
// Regular Expressions for parsing tags and attributes
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/ // 匹配属性
const dynamicArgAttribute = /^\s*((?:v-[\w-]+:|@|:|#)\[[^=]+\][^\s"'<>\/=]*)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/ // 匹配动态属性
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z${unicodeRegExp.source}]*`
const qnameCapture = `((?:${ncname}\\:)?${ncname})`
const startTagOpen = new RegExp(`^<${qnameCapture}`) // 匹配开始标签如<div、<p
const startTagClose = /^\s*(\/?)>/ // 匹配标签的结束符尖括号>
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`) // 匹配结束标签
const doctype = /^<!DOCTYPE [^>]+>/i // 匹配DOCTYPE说明
// #7298: escape - to avoid being pased as HTML comment when inlined in page
const comment = /^<!\--/ // 匹配注释
const conditionalComment = /^<!\[/ // 匹配文档类型的节点

// Special Elements (can contain anything)
const reCache = {}


const isIgnoreNewlineTag = makeMap('pre,textarea', true)
const shouldIgnoreFirstNewline = (tag, html) => tag && isIgnoreNewlineTag(tag) && html[0] === '\n'

export function parserHTML(html, options = {}) {
	options.shouldDecodeNewlinesForHref = shouldDecodeNewlinesForHref
	options.shouldDecodeNewlines = shouldDecodeNewlines
	const stack = []
	const expectHTML = options.expectHTML //todo 啥作用
	const canBeLeftOpenTag = options.canBeLeftOpenTag || no
	let index = 0
	let last, lastTag
	while (html) {
		last = html
		if(!lastTag || !isPlainTextElement(lastTag)){
			// 以<开头的可能是开始标签、完全标签、注释、文档类型
			let textEnd = html.indexOf('<')
			if (textEnd === 0) {
				// Comment: 如果是注释
				if (comment.test(html)) {
					const commentEnd = html.indexOf('-->')
					if (commentEnd >= 0) {
						if (options.shouldKeepComment) {
							options.comment(html.substring(4, commentEnd), index, index + commentEnd + 3)
						}
						advance(commentEnd + 3)
						continue
					}
				}
				
				// http://en.wikipedia.org/wiki/Conditional_comment#Downlevel-revealed_conditional_comment
				// 文档类型的节点
				if (conditionalComment.test(html)) {
					const conditionalEnd = html.indexOf(']>')
					
					if (conditionalEnd >= 0) {
						advance(conditionalEnd + 2)
						continue
					}
				}
				
				// Doctype:
				const doctypeMatch = html.match(doctype)
				if (doctypeMatch) {
					advance(doctypeMatch[0].length)
					continue
				}
				
				// End tag:
				const endTagMatch = html.match(endTag)
				if (endTagMatch) {
					const curIndex = index
					advance(endTagMatch[0].length)
					parseEndTag(endTagMatch[1], curIndex, index)
					continue
				}
				
				// Start tag:
				const startTagMatch = parseStartTag()
				if (startTagMatch) {
					handleStartTag(startTagMatch)
					if (shouldIgnoreFirstNewline(startTagMatch.tagName, html)) {
						advance(1)
					}
					continue
				}
			}
			let text, rest, next
			// 查找内容节点
			if(textEnd >=0 ) {
				rest = html.slice(textEnd)
				while (
					!endTag.test(rest) &&
					!startTagOpen.test(rest) &&
					!comment.test(rest) &&
					!conditionalComment.test(rest)
					) {
					// < in plain text, be forgiving and treat it as text
					next = rest.indexOf('<', 1)
					if (next < 0) break
					textEnd += next
					rest = html.slice(textEnd)
				}
				text = html.substring(0, textEnd)
			}
			if(textEnd <0) {
				text = html
			}
			if(text) {
				advance(text.length)
			}
			if (options.chars && text) {
				options.chars(text, index - text.length, index)
			}
		} else {
			let endTagLength = 0
			const stackedTag = lastTag.toLowerCase()
			const reStackedTag = reCache[stackedTag] || (reCache[stackedTag] = new RegExp('([\\s\\S]*?)(</' + stackedTag + '[^>]*>)', 'i'))
			const rest = html.replace(reStackedTag, function (all, text, endTag) {
				endTagLength = endTag.length
				if (!isPlainTextElement(stackedTag) && stackedTag !== 'noscript') {
					text = text
						.replace(/<!\--([\s\S]*?)-->/g, '$1') // #7298
						.replace(/<!\[CDATA\[([\s\S]*?)]]>/g, '$1')
				}
				if (shouldIgnoreFirstNewline(stackedTag, text)) {
					text = text.slice(1)
				}
				if (options.chars) {
					options.chars(text)
				}
				return ''
			})
			index += html.length - rest.length
			html = rest
			parseEndTag(stackedTag, index - endTagLength, index)
		}
		if (html === last) {
			options.chars && options.chars(html)
			break
		}
	}
	parseEndTag()
	function advance (n) {
		index += n
		html = html.substring(n)
	}
	function parseStartTag () {
		const start = html.match(startTagOpen)
		if (start) {
			const match = {
				tagName: start[1],
				attrs: [],
				start: index
			}
			advance(start[0].length)
			let end, attr
			while (!(end = html.match(startTagClose)) && (attr = html.match(dynamicArgAttribute) || html.match(attribute))) {
				attr.start = index
				advance(attr[0].length)
				attr.end = index
				match.attrs.push(attr)
			}
			if (end) {
				match.unarySlash = end[1]
				advance(end[0].length)
				match.end = index
				return match
			}
		}
	}
	function handleStartTag (match) {
		const tagName = match.tagName
		const unarySlash = match.unarySlash
		
		// todo
		if (expectHTML) {
			if (lastTag === 'p' && isNonPhrasingTag(tagName)) {
				parseEndTag(lastTag)
			}
			if (canBeLeftOpenTag(tagName) && lastTag === tagName) {
				parseEndTag(tagName)
			}
		}
		
		const unary = isUnaryTag(tagName) || !!unarySlash
		
		const l = match.attrs.length
		const attrs = new Array(l)
		for (let i = 0; i < l; i++) {
			const args = match.attrs[i]
			const value = args[3] || args[4] || args[5] || ''
			const shouldDecodeNewlines = tagName === 'a' && args[1] === 'href'
				? options.shouldDecodeNewlinesForHref
				: options.shouldDecodeNewlines
			attrs[i] = {
				name: args[1],
				value: decodeAttr(value, shouldDecodeNewlines) // 编码解析 todo
			}
		}
		
		if (!unary) {
			stack.push({ tag: tagName, lowerCasedTag: tagName.toLowerCase(), attrs: attrs, start: match.start, end: match.end })
			lastTag = tagName
		}
		
		if (options.start) {
			options.start(tagName, attrs, unary, match.start, match.end)
		}
	}
	/**
	 * @params <string> tagName 标签名（<>之间的标签名）
	 * @params <number> start 标签名开始位置（标签名前面<的位置）
	 * @params <string> tagName 标签名结束（标签名后面<的位置）
	 * */
	function parseEndTag (tagName, start, end) {
		let pos, lowerCasedTagName
		if (start == null) start = index
		if (end == null) end = index
		
		// Find the closest opened tag of the same type
		if (tagName) {
			lowerCasedTagName = tagName.toLowerCase()
			for (pos = stack.length - 1; pos >= 0; pos--) {
				if (stack[pos].lowerCasedTag === lowerCasedTagName) {
					break
				}
			}
		} else {
			// If no tag name is provided, clean shop
			pos = 0
		}
		
		if (pos >= 0) {
			// Close all the open elements, up the stack
			for (let i = stack.length - 1; i >= pos; i--) {
				if (options.end) {
					options.end(stack[i].tag, start, end)
				}
			}
			
			// Remove the open elements from the stack
			stack.length = pos
			lastTag = pos && stack[pos - 1].tag
		} else if (lowerCasedTagName === 'br') {
			if (options.start) {
				options.start(tagName, [], true, start, end)
			}
		} else if (lowerCasedTagName === 'p') {
			if (options.start) {
				options.start(tagName, [], false, start, end)
			}
			if (options.end) {
				options.end(tagName, start, end)
			}
		}
	}
}
