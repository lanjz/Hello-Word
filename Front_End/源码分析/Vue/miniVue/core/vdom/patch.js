import { isDef } from '../../utils/index.js'

const hooks = ['create', 'activate', 'update', 'remove', 'destroy']

export function createPatchFunction(backend) {
	let i, j
	const cbs = {}
	const { nodeOps } = backend
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
	
	
	function createChildren (vnode, children, insertedVnodeQueue) {
		if (Array.isArray(children)) {
			for (let i = 0; i < children.length; ++i) {
				createElm(children[i], insertedVnodeQueue, vnode.elm, null, true, children, i)
			}
		} else if (isPrimitive(vnode.text)) {
			nodeOps.appendChild(vnode.elm, nodeOps.createTextNode(String(vnode.text)))
		}
	}
	
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
	
	
	function createElm(
		vnode,
		insertedVnodeQueue,
		parentElm,
		refElm,
		nested,
		ownerArray,
		index
	) {
		if(isDef(vnode.elm) && isDef(ownerArray){
			vnode = ownerArray[index] = cloneVnode(vnode)
		}
		vnode.isRootInsert = !nested
		if (createComponent(vnode, insertedVnodeQueue, parentElm, refElm)) {
			return
		}
		const data = vnode.data
		const children = vnode.children
		const tag = vnode.tag
		if(isDef(tag)) {
			vnode.elm = vnode.ns
				? nodeOps.createElementNS(vnode.ns, tag)
				: nodeOps.createElement(tag, vnode)
			setScope(vnode)
			createChildren(vnode, children, insertedVnodeQueue)
			if (isDef(data)) {
				invokeCreateHooks(vnode, insertedVnodeQueue)
			}
			insert(parentElm, vnode.elm, refElm)
		} else if (isTrue(vnode.isComment)) {
			vnode.elm = nodeOps.createComment(vnode.text)
			insert(parentElm, vnode.elm, refElm)
		} else {
			vnode.elm = nodeOps.createTextNode(vnode.text)
			insert(parentElm, vnode.elm, refElm)
		}
		createComponent(){
			return false
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
			if (process.env.NODE_ENV !== 'production') {
				checkDuplicateKeys(children)
			}
			for (let i = 0; i < children.length; ++i) {
				createElm(children[i], insertedVnodeQueue, vnode.elm, null, true, children, i)
			}
		} else if (isPrimitive(vnode.text)) {
			nodeOps.appendChild(vnode.elm, nodeOps.createTextNode(String(vnode.text)))
		}
	}
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
	function emptyNodeAt (elm) {
		return new VNode(nodeOps.tagName(elm).toLowerCase(), {}, [], undefined, elm)
	}
	return function patch(oldVnode, vnode, hydrating, removeOnly){
		let isInitialPatch = false
		const insertedVnodeQueue = []
		const isRealElement = isDef(oldVnode.nodeType)
		if (false) {
			// patch existing root node
			// patchVnode(oldVnode, vnode, insertedVnodeQueue, null, null, removeOnly)
		} else {
			// 如果是真实节点转换为VNode节点
			if(isRealElement) {
				oldVnode = emptyNodeAt(oldVnode)
			}
			
			// replacing existing element
			const oldElm = oldVnode.elm
			const parentElm = nodeOps.parentNode(oldElm)
			
			// create new node
			createElm(
				vnode,
				insertedVnodeQueue,
				oldElm._leaveCb ? null : parentElm,
				nodeOps.nextSibling(oldElm)
			)
			// update parent placeholder node element, recursively
			if(isDef(vnode.parent)) {
				let ancestor = vnode.parent
				const patchable = isPatchable(vnode)
				while (ancestor) {
					for(let i = 0; i < cbs.destroy.length; ++i) {
						cbs.destroy[i](ancestor)
					}
					ancestor.elm = vnode.elm
					if(patchable) {
						for(let i = 0; i < cbs.create.length; ++i) {
							cbs.create[i](emptyNode, ancestor)
						}
						// #6513
						// invoke insert hooks that may have been merged by create hooks.
						// e.g. for directives that uses the "inserted" hook.
						const insert = ancestor.data.hook.insert
						if(insert.merged) {
							// start at index 1 to avoid re-invoking component mounted hook
							for(let i = 1; i < insert.fns.length; i++) {
								insert.fns[i]()
							}
						}
					} else {
						registerRef(ancestor)
					}
					ancestor = ancestor.parent
				}
			}
			
			// destroy old node
			if(isDef(parentElm)) {
				removeVnodes(parentElm, [oldVnode], 0, 0)
			} else if(isDef(oldVnode.tag)) {
				invokeDestroyHook(oldVnode)
			}
			invokeInsertHook(vnode, insertedVnodeQueue, isInitialPatch)
			return vnode.elm
		}
	}
}
