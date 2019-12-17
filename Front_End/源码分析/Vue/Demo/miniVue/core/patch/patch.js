// src\core\vdom\patch.js
// 将Vnode转换为渲染成真实DOM
import { isDef, isTrue, makeMap, isUndef, isPrimitive } from '../utils/index.js'
import VNode from '../vdom/vnode.js'
export const emptyNode = new VNode('', {}, [])

const hooks = ['create', 'activate', 'update', 'remove', 'destroy']
export const isTextInputType = makeMap('text,number,password,search,email,tel,url')
function sameVnode (a, b) {
	return (
		a.key === b.key && (
			a.tag === b.tag &&
			a.isComment === b.isComment &&
			isDef(a.data) === isDef(b.data) &&
			sameInputType(a, b)
		)
	)
}
function sameInputType (a, b) {
	if (a.tag !== 'input') return true
	let i
	const typeA = isDef(i = a.data) && isDef(i = i.attrs) && i.type
	const typeB = isDef(i = b.data) && isDef(i = i.attrs) && i.type
	return typeA === typeB || isTextInputType(typeA) && isTextInputType(typeB)
}
export function createPatchFunction (backend) {
	let i, j
	const cbs = {}
	
	const { modules, nodeOps } = backend
	
	for (i = 0; i < hooks.length; ++i) {
		cbs[hooks[i]] = []
		for (j = 0; j < modules.length; ++j) {
			if (isDef(modules[j][hooks[i]])) {
				cbs[hooks[i]].push(modules[j][hooks[i]])
			}
		}
	}
	
	function emptyNodeAt (elm) {
		return new VNode(nodeOps.tagName(elm).toLowerCase(), {}, [], undefined, elm)
	}
	
	function createRmCb (childElm, listeners) {
		function remove () {
			if (--remove.listeners === 0) {
				removeNode(childElm)
			}
		}
		remove.listeners = listeners
		return remove
	}
	
	function removeNode (el) {
		const parent = nodeOps.parentNode(el)
		// element may have already been removed due to v-html / v-text
		if (isDef(parent)) {
			nodeOps.removeChild(parent, el)
		}
	}
	
	function isUnknownElement (vnode, inVPre) {
		return (
			!inVPre &&
			!vnode.ns &&
			!(
				config.ignoredElements.length &&
				config.ignoredElements.some(ignore => {
					return isRegExp(ignore)
						? ignore.test(vnode.tag)
						: ignore === vnode.tag
				})
			) &&
			config.isUnknownElement(vnode.tag)
		)
	}
	
	let creatingElmInVPre = 0
	
	function createElm (
		vnode,
		insertedVnodeQueue,
		parentElm,
		refElm,
		nested,
		ownerArray,
		index
	) {
		if (isDef(vnode.elm) && isDef(ownerArray)) {
			// This vnode was used in a previous render!
			// now it's used as a new node, overwriting its elm would cause
			// potential patch errors down the road when it's used as an insertion
			// reference node. Instead, we clone the node on-demand before creating
			// associated DOM element for it.
			vnode = ownerArray[index] = cloneVNode(vnode)
		}
		
		vnode.isRootInsert = !nested // for transition enter check
		const data = vnode.data
		const children = vnode.children
		const tag = vnode.tag
		if (isDef(tag)) {
			vnode.elm = nodeOps.createElement(tag, vnode)
			
			createChildren(vnode, children, insertedVnodeQueue)
			if (isDef(data)) {
				invokeCreateHooks(vnode, insertedVnodeQueue)
			}
			insert(parentElm, vnode.elm, refElm)
			if (data && data.pre) {
				creatingElmInVPre--
			}
		}else {
			vnode.elm = nodeOps.createTextNode(vnode.text)
			insert(parentElm, vnode.elm, refElm)
		}
	}
	
	function initComponent (vnode, insertedVnodeQueue) {
		if (isDef(vnode.data.pendingInsert)) {
			insertedVnodeQueue.push.apply(insertedVnodeQueue, vnode.data.pendingInsert)
			vnode.data.pendingInsert = null
		}
		vnode.elm = vnode.componentInstance.$el
		if (isPatchable(vnode)) {
			invokeCreateHooks(vnode, insertedVnodeQueue)
			setScope(vnode)
		} else {
			// empty component root.
			// skip all element-related modules except for ref (#3455)
			registerRef(vnode)
			// make sure to invoke the insert hook
			insertedVnodeQueue.push(vnode)
		}
	}
	
	function insert (parent, elm, ref) {
		if (isDef(parent)) {
			if (isDef(ref)) {
				if (nodeOps.parentNode(ref) === parent) {
					nodeOps.insertBefore(parent, elm, ref)
				}
			} else {
				nodeOps.appendChild(parent, elm)
			}
		}
	}
	
	function createChildren (vnode, children, insertedVnodeQueue) {
		if (Array.isArray(children)) {
			for (let i = 0; i < children.length; ++i) {
				createElm(children[i], insertedVnodeQueue, vnode.elm, null, true, children, i)
			}
		} else if (isPrimitive(vnode.text)) {
			nodeOps.appendChild(vnode.elm, nodeOps.createTextNode(String(vnode.text)))
		}
	}
	
	function isPatchable (vnode) {
		while (vnode.componentInstance) {
			vnode = vnode.componentInstance._vnode
		}
		return isDef(vnode.tag)
	}
	
	// 给元素添加属性
	function invokeCreateHooks (vnode, insertedVnodeQueue) {
		for (let i = 0; i < cbs.create.length; ++i) {
			cbs.create[i](emptyNode, vnode)
		}
		i = vnode.data.hook // Reuse variable
		if (isDef(i)) {
			if (isDef(i.create)) i.create(emptyNode, vnode)
			if (isDef(i.insert)) insertedVnodeQueue.push(vnode)
		}
	}
	
	// set scope id attribute for scoped CSS.
	// this is implemented as a special case to avoid the overhead
	// of going through the normal attribute patching process.
	function setScope (vnode) {
		let i
		if (isDef(i = vnode.fnScopeId)) {
			nodeOps.setStyleScope(vnode.elm, i)
		} else {
			let ancestor = vnode
			while (ancestor) {
				if (isDef(i = ancestor.context) && isDef(i = i.$options._scopeId)) {
					nodeOps.setStyleScope(vnode.elm, i)
				}
				ancestor = ancestor.parent
			}
		}
		// for slot content they should also get the scopeId from the host instance.
		if (isDef(i = activeInstance) &&
			i !== vnode.context &&
			i !== vnode.fnContext &&
			isDef(i = i.$options._scopeId)
		) {
			nodeOps.setStyleScope(vnode.elm, i)
		}
	}
	
	function addVnodes (parentElm, refElm, vnodes, startIdx, endIdx, insertedVnodeQueue) {
		for (; startIdx <= endIdx; ++startIdx) {
			createElm(vnodes[startIdx], insertedVnodeQueue, parentElm, refElm, false, vnodes, startIdx)
		}
	}
	
	function invokeDestroyHook (vnode) {
		let i, j
		const data = vnode.data
		if (isDef(data)) {
			if (isDef(i = data.hook) && isDef(i = i.destroy)) i(vnode)
			for (i = 0; i < cbs.destroy.length; ++i) cbs.destroy[i](vnode)
		}
		if (isDef(i = vnode.children)) {
			for (j = 0; j < vnode.children.length; ++j) {
				invokeDestroyHook(vnode.children[j])
			}
		}
	}
	
	function removeVnodes (parentElm, vnodes, startIdx, endIdx) {
		for (; startIdx <= endIdx; ++startIdx) {
			const ch = vnodes[startIdx]
			if (isDef(ch)) {
				if (isDef(ch.tag)) {
					removeAndInvokeRemoveHook(ch)
					invokeDestroyHook(ch)
				} else { // Text node
					removeNode(ch.elm)
				}
			}
		}
	}
	
	function removeAndInvokeRemoveHook (vnode, rm) {
		if (isDef(rm) || isDef(vnode.data)) {
			let i
			const listeners = cbs.remove.length + 1
			if (isDef(rm)) {
				// we have a recursively passed down rm callback
				// increase the listeners count
				rm.listeners += listeners
			} else {
				// directly removing
				rm = createRmCb(vnode.elm, listeners)
			}
			// recursively invoke hooks on child component root node
			if (isDef(i = vnode.componentInstance) && isDef(i = i._vnode) && isDef(i.data)) {
				removeAndInvokeRemoveHook(i, rm)
			}
			for (i = 0; i < cbs.remove.length; ++i) {
				cbs.remove[i](vnode, rm)
			}
			if (isDef(i = vnode.data.hook) && isDef(i = i.remove)) {
				i(vnode, rm)
			} else {
				rm()
			}
		} else {
			removeNode(vnode.elm)
		}
	}
	
	function updateChildren (parentElm, oldCh, newCh, insertedVnodeQueue, removeOnly) {
		let oldStartIdx = 0
		let newStartIdx = 0
		let oldEndIdx = oldCh.length - 1
		let oldStartVnode = oldCh[0]
		let oldEndVnode = oldCh[oldEndIdx]
		let newEndIdx = newCh.length - 1
		let newStartVnode = newCh[0]
		let newEndVnode = newCh[newEndIdx]
		let oldKeyToIdx, idxInOld, vnodeToMove, refElm
		
		// removeOnly is a special flag used only by <transition-group>
		// to ensure removed elements stay in correct relative positions
		// during leaving transitions
		const canMove = !removeOnly
		
		while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
			if (isUndef(oldStartVnode)) {
				oldStartVnode = oldCh[++oldStartIdx] // Vnode has been moved left
			} else if (isUndef(oldEndVnode)) {
				oldEndVnode = oldCh[--oldEndIdx]
			} else if (sameVnode(oldStartVnode, newStartVnode)) {
				patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue, newCh, newStartIdx)
				oldStartVnode = oldCh[++oldStartIdx]
				newStartVnode = newCh[++newStartIdx]
			} else if (sameVnode(oldEndVnode, newEndVnode)) {
				patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue, newCh, newEndIdx)
				oldEndVnode = oldCh[--oldEndIdx]
				newEndVnode = newCh[--newEndIdx]
			} else if (sameVnode(oldStartVnode, newEndVnode)) { // Vnode moved right
				patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue, newCh, newEndIdx)
				canMove && nodeOps.insertBefore(parentElm, oldStartVnode.elm, nodeOps.nextSibling(oldEndVnode.elm))
				oldStartVnode = oldCh[++oldStartIdx]
				newEndVnode = newCh[--newEndIdx]
			} else if (sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left
				patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue, newCh, newStartIdx)
				canMove && nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm)
				oldEndVnode = oldCh[--oldEndIdx]
				newStartVnode = newCh[++newStartIdx]
			} else {
				if (isUndef(oldKeyToIdx)) oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx)
				idxInOld = isDef(newStartVnode.key)
					? oldKeyToIdx[newStartVnode.key]
					: findIdxInOld(newStartVnode, oldCh, oldStartIdx, oldEndIdx)
				if (isUndef(idxInOld)) { // New element
					createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx)
				} else {
					vnodeToMove = oldCh[idxInOld]
					if (sameVnode(vnodeToMove, newStartVnode)) {
						patchVnode(vnodeToMove, newStartVnode, insertedVnodeQueue, newCh, newStartIdx)
						oldCh[idxInOld] = undefined
						canMove && nodeOps.insertBefore(parentElm, vnodeToMove.elm, oldStartVnode.elm)
					} else {
						// same key but different element. treat as new element
						createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx)
					}
				}
				newStartVnode = newCh[++newStartIdx]
			}
		}
		if (oldStartIdx > oldEndIdx) {
			refElm = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm
			addVnodes(parentElm, refElm, newCh, newStartIdx, newEndIdx, insertedVnodeQueue)
		} else if (newStartIdx > newEndIdx) {
			removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx)
		}
	}
	
	function checkDuplicateKeys (children) {
		const seenKeys = {}
		for (let i = 0; i < children.length; i++) {
			const vnode = children[i]
			const key = vnode.key
			if (isDef(key)) {
				if (seenKeys[key]) {
					warn(
						`Duplicate keys detected: '${key}'. This may cause an update error.`,
						vnode.context
					)
				} else {
					seenKeys[key] = true
				}
			}
		}
	}
	
	function findIdxInOld (node, oldCh, start, end) {
		for (let i = start; i < end; i++) {
			const c = oldCh[i]
			if (isDef(c) && sameVnode(node, c)) return i
		}
	}
	
	function patchVnode (
		oldVnode,
		vnode,
		insertedVnodeQueue,
		ownerArray,
		index
		
	) {
		if (oldVnode === vnode) {
			return
		}
		
		if (isDef(vnode.elm) && isDef(ownerArray)) {
			// clone reused vnode
			vnode = ownerArray[index] = cloneVNode(vnode)
		}
		
		const elm = vnode.elm = oldVnode.elm
		
		// no use
		let i
		const data = vnode.data
		if (isDef(data) && isDef(i = data.hook) && isDef(i = i.prepatch)) {
			i(oldVnode, vnode)
		}
		
		const oldCh = oldVnode.children
		const ch = vnode.children
		// 开始更新属性等，hook还没看，可能是执行钩子
		if (isDef(data) && isPatchable(vnode)) {
			for (i = 0; i < cbs.update.length; ++i) cbs.update[i](oldVnode, vnode)
			if (isDef(i = data.hook) && isDef(i = i.update)) i(oldVnode, vnode)
		}
		if (isUndef(vnode.text)) {
			if (isDef(oldCh) && isDef(ch)) {
				if (oldCh !== ch) updateChildren(elm, oldCh, ch, insertedVnodeQueue)
			} else if (isDef(ch)) {
				if (isDef(oldVnode.text)) nodeOps.setTextContent(elm, '')
				addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue)
			} else if (isDef(oldCh)) {
				removeVnodes(elm, oldCh, 0, oldCh.length - 1)
			} else if (isDef(oldVnode.text)) {
				nodeOps.setTextContent(elm, '')
			}
		} else if (oldVnode.text !== vnode.text) {
			nodeOps.setTextContent(elm, vnode.text)
		}
		if (isDef(data)) {
			if (isDef(i = data.hook) && isDef(i = i.postpatch)) i(oldVnode, vnode)
		}
	}
	
	
	let hydrationBailed = false
	// list of modules that can skip create hook during hydration because they
	// are already rendered on the client or has no need for initialization
	// Note: style is excluded because it relies on initial clone for future
	// deep updates (#7063).
	const isRenderedModule = makeMap('attrs,class,staticClass,staticStyle,key')
	
	// Note: this is a browser-only function so we can assume elms are DOM nodes.
	function hydrate (elm, vnode, insertedVnodeQueue, inVPre) {
		let i
		const { tag, data, children } = vnode
		inVPre = inVPre || (data && data.pre)
		vnode.elm = elm
		
		if (isTrue(vnode.isComment) && isDef(vnode.asyncFactory)) {
			vnode.isAsyncPlaceholder = true
			return true
		}
	
		if (isDef(data)) {
			if (isDef(i = data.hook) && isDef(i = i.init)) i(vnode, true /* hydrating */)
			if (isDef(i = vnode.componentInstance)) {
				// child component. it should have hydrated its own tree.
				initComponent(vnode, insertedVnodeQueue)
				return true
			}
		}
		if (isDef(tag)) {
			if (isDef(children)) {
				// empty element, allow client to pick up and populate children
				if (!elm.hasChildNodes()) {
					createChildren(vnode, children, insertedVnodeQueue)
				} else {
					// v-html and domProps: innerHTML
					if (isDef(i = data) && isDef(i = i.domProps) && isDef(i = i.innerHTML)) {
						if (i !== elm.innerHTML) {
							/* istanbul ignore if */
							if (
								typeof console !== 'undefined' &&
								!hydrationBailed
							) {
								hydrationBailed = true
								console.warn('Parent: ', elm)
								console.warn('server innerHTML: ', i)
								console.warn('client innerHTML: ', elm.innerHTML)
							}
							return false
						}
					} else {
						// iterate and compare children lists
						let childrenMatch = true
						let childNode = elm.firstChild
						for (let i = 0; i < children.length; i++) {
							if (!childNode || !hydrate(childNode, children[i], insertedVnodeQueue, inVPre)) {
								childrenMatch = false
								break
							}
							childNode = childNode.nextSibling
						}
						// if childNode is not null, it means the actual childNodes list is
						// longer than the virtual children list.
						if (!childrenMatch || childNode) {
							/* istanbul ignore if */
							if (
								typeof console !== 'undefined' &&
								!hydrationBailed
							) {
								hydrationBailed = true
								console.warn('Parent: ', elm)
								console.warn('Mismatching childNodes vs. VNodes: ', elm.childNodes, children)
							}
							return false
						}
					}
				}
			}
			if (isDef(data)) {
				let fullInvoke = false
				for (const key in data) {
					if (!isRenderedModule(key)) {
						fullInvoke = true
						invokeCreateHooks(vnode, insertedVnodeQueue)
						break
					}
				}
				if (!fullInvoke && data['class']) {
					// ensure collecting deps for deep class bindings for future updates
					traverse(data['class'])
				}
			}
		} else if (elm.data !== vnode.text) {
			elm.data = vnode.text
		}
		return true
	}
	
	return function patch (oldVnode, vnode, hydrating) {
		let isInitialPatch = false
		const insertedVnodeQueue = []
		
		if (isUndef(oldVnode)) {
			isInitialPatch = true
			createElm(vnode, insertedVnodeQueue)
		} else {
			// 判断是否是真实节点，首页渲染的时候是真实节点
			const isRealElement = isDef(oldVnode.nodeType)
			if (!isRealElement && sameVnode(oldVnode, vnode)) {
				patchVnode(oldVnode, vnode, insertedVnodeQueue, null, null)
			} else {
				if (isRealElement) {
					oldVnode = emptyNodeAt(oldVnode)
				}
				
				const oldElm = oldVnode.elm
				const parentElm = nodeOps.parentNode(oldElm)
				
				// create new node
				createElm(
					vnode,
					insertedVnodeQueue,
					parentElm,
					nodeOps.nextSibling(oldElm)
				)
				
				// destroy old node
				if (isDef(parentElm)) {
					removeVnodes(parentElm, [oldVnode], 0, 0)
				} else if (isDef(oldVnode.tag)) {
					invokeDestroyHook(oldVnode)
				}
			}
		}
		return vnode.elm
	}
}
