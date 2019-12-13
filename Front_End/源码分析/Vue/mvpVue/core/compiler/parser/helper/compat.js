const decodingMap = {
	'&lt;': '<',
	'&gt;': '>',
	'&quot;': '"',
	'&amp;': '&',
	'&#10;': '\n',
	'&#9;': '\t',
	'&#39;': "'"
}
const encodedAttr = /&(?:lt|gt|quot|amp|#39);/g
const encodedAttrWithNewLines = /&(?:lt|gt|quot|amp|#39|#10|#9);/g
let div
function getShouldDecode (href) {
	div = div || document.createElement('div')
	div.innerHTML = href ? `<a href="\n"/>` : `<div a="\n"/>`
	return div.innerHTML.indexOf('&#10;') > 0
}
// #3663: IE encodes newlines inside attribute values while other browsers don't
export const shouldDecodeNewlines = getShouldDecode(false)
// #6828: chrome encodes content in a[href]
export const shouldDecodeNewlinesForHref = getShouldDecode(true)

export function decodeAttr (value, shouldDecodeNewlines) {
	const re = shouldDecodeNewlines ? encodedAttrWithNewLines : encodedAttr
	return value.replace(re, match => decodingMap[match])
}
