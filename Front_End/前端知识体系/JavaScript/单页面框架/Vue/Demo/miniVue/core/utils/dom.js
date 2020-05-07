// 返回元素字符串
export function getOuterHTML (el) {
	if (el.outerHTML) {
		return el.outerHTML
	} else {
		const container = document.createElement('div')
		container.appendChild(el.cloneNode(true))
		return container.innerHTML
	}
}
