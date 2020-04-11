# Virtual Dom

`Virtual Dom` 是一个可以表示 DOM 节点的JavaScript对象，一个`Virtual Dom`节点包含相应 DOM 节点的`标签`，
`属性`，`子节点`，`事件`等的属性，它是对真实 DOM 节点的抽象表示。在我们需要更新 DOM 的时候，并不是直接
DOM 上进行更新，而是先在 `Virtual Dom` 上进行相应的更新操作，最后再映射到真实 DOM 中

# Virtual DOM 作用是什么

- 提供与真实DOM节点所对应的虚拟节点vnode

- 将虚拟节点vnode和旧虚拟节点oldVnode进行对比，然后更新视图

# 为何需要Virtual DOM

- 跨平台性

  由于 `Virtual DOM` 是以 JavaScript 对象为基础而不依赖真实平台环境，所以使它具有了跨平台的能力，比如说`浏览器平台`、`Weex`、`Node` 等
  
- 对于高频的 DOM 更新，`Virtual DOM`可以提高性能，因为直接操作操作 DOM 慢，JS运行效率更高。

  因为DOM操作的执行速度远不如Javascript的运算速度快，因此，把大量的DOM操作搬运到Javascript中，运用patching算法来计算出真正需要更新的节点，最大限度地减少DOM操作，从而显著提高性能。
  
- 提升渲染性能

  `Virtual DOM`的优势不在于单次的操作，而是在大量、频繁的数据更新下，能够对视图进行合理、高效的更新。
  
# diff 算法

为什么需要 `diff` 算法， 因为如果直接使用虚拟节点覆盖旧节点的话，会有很多不必要的 DOM 操作。例如，一个`ul`标签下很多个`li`标签，其中只有一个`li`有变化，这种情况下如果使用新的ul去替代旧的`ul`,因为这些不必要的DOM操作而造成了性能上的浪费

为了避免不必要的DOM操作，虚拟DOM在虚拟节点映射到视图的过程中，将虚拟节点与上一次渲染视图所使用的旧虚拟节点（oldVnode）做对比，
找出真正需要更新的节点来进行DOM操作，从而避免操作其他无需改动的DOM。

仅在同级的`vnode`间做`diff`，递归地进行同级`vnode`的`diff`，最终实现整个DOM树的更新。因为跨层级的操作是非常少的，忽略不计，这样时间复杂度就从`O(n3)`变成`O(n)`。

## diff 算法过程

**新旧节点不同**

如果新旧 vnode 不同，那么更新的逻辑非常简单，它本质上是要替换已存在的节点，大致分为 3 步
                                        
1. 以旧节点作为参照，创建新的节点

2. 更新父的占位符节点

3. 删除旧的地点

**新旧节点相同**

如果 `vnode` 是个文本节点且新旧文本不相同，则直接替换文本内容。如果不是文本节点，则判断它们的子节点，并分了几种情况处理：

- `oldCh` 与 `ch` 都存在且不相同时，使用 `updateChildren` 函数来更新子节点，这个后面重点讲

- 如果只有 `ch` 存在，表示旧节点不需要了。如果旧的节点是文本节点则先将节点的文本清除，然后通过 `addVnodes` 将 `ch` 批量插入到新节点 `elm` 下

- 如果只有 `oldCh` 存在，表示更新的是空节点，则需要将旧的节点通过 `removeVnodes` 全部清除

- 当只有旧节点是文本节点的时候，则清除其节点文本内容。

## 源码角度分析 diff 算法过程

当 Vue 数据发生变化的时候，会触发渲染 `watcher` 的回调函数，进而执行组件的更新过程

```
updateComponent = () => {
  vm._update(vm._render(), hydrating)
}
new Watcher(vm, updateComponent, noop, {
  before () {
    if (vm._isMounted) {
      callHook(vm, 'beforeUpdate')
    }
  }
}, true /* isRenderWatcher */)

```

组件的更新还是调用了 `vm._update` 方法

```
Vue.prototype._update = function (vnode: VNode, hydrating?: boolean) {
  const vm: Component = this
  // ...
  const prevVnode = vm._vnode
  if (!prevVnode) {
     // initial render
    vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */)
  } else {
    // updates
    vm.$el = vm.__patch__(prevVnode, vnode)
  }
  // ...
}
```
`diff`的过程就是调用`patch`函数，就像打补丁一样修改真实`dom`

```
function patch (oldVnode, vnode) {
	if (sameVnode(oldVnode, vnode)) {
		patchVnode(oldVnode, vnode)
	} else {
		const oEl = oldVnode.el
		let parentEle = api.parentNode(oEl)
		createEle(vnode)
		if (parentEle !== null) {
			api.insertBefore(parentEle, vnode.el, api.nextSibling(oEl))
			api.removeChild(parentEle, oldVnode.el)
			oldVnode = null
		}
	}
	return vnode
}

```

`patch`函数有两个参数，`vnode`和`oldVnode`，也就是新旧两个虚拟节点。在这之前，我们先了解完整的vnode都有什么属性，举个一个简单的例子:

```
// body下的 <div id="v" class="classA"><div> 对应的 oldVnode 就是

{
  el:  div  //对真实的节点的引用，本例中就是document.querySelector('#id.classA')
  tagName: 'DIV',   //节点的标签
  sel: 'div#v.classA'  //节点的选择器
  data: null,       // 一个存储节点属性的对象，对应节点的el[prop]属性，例如onclick , style
  children: [], //存储子节点的数组，每个子节点也是vnode结构
  text: null,    //如果是文本节点，对应文本节点的textContent，否则为null
}

```

需要注意的是，`el`属性引用的是此 `virtual dom`对应的真实`dom`，`patch`的`vnode`参数的`el`最初是`null`，因为`patch`之前它还没有对应的真实`dom`。

```
if (sameVnode(oldVnode, vnode)) {
	patchVnode(oldVnode, vnode)
} 
```

`sameVnode`函数就是看这两个节点是否值得比较，代码相当简单：

```
function sameVnode(oldVnode, vnode){
	return vnode.key === oldVnode.key && vnode.sel === oldVnode.sel
}
```

两个`vnode`的`key`和`sel`相同才去比较它们，比如`p`和`span`，`div.classA`和`div.classB`都被认为是不同结构而不去比较它们。

如果值得比较会执行`patchVnode(oldVnode, vnode)`，稍后会详细讲`patchVnode`函数。

当节点不值得比较，进入`else`中

```
else {
		const oEl = oldVnode.el
		let parentEle = api.parentNode(oEl)
		createEle(vnode)
		if (parentEle !== null) {
			api.insertBefore(parentEle, vnode.el, api.nextSibling(oEl))
			api.removeChild(parentEle, oldVnode.el)
			oldVnode = null
		}
	}

```
过程如下：

- 取得`oldvnode.el`的父节点，`parentEle`是真实`dom`

- `createEle(vnode)会为vnode创建它的真实dom`，令`vnode.el =真实dom`

- `parentEle`将新的`dom`插入，移除旧的`dom`

`patch`最后会返回`vnode`，`vnode`和进入`patch`之前的不同在哪？
没错，就是`vnode.el`，唯一的改变就是之前`vnode.el = null`, 而现在它引用的是对应的真实dom。

**两个节点值得比较时，会调用`patchVnode`函数**

```
patchVnode (oldVnode, vnode) {
    const el = vnode.el = oldVnode.el
    let i, oldCh = oldVnode.children, ch = vnode.children
    if (oldVnode === vnode) return
    if (oldVnode.text !== null && vnode.text !== null && oldVnode.text !== vnode.text) {
        api.setTextContent(el, vnode.text)
    }else {
        updateEle(el, vnode, oldVnode)
    	if (oldCh && ch && oldCh !== ch) {
	    	updateChildren(el, oldCh, ch)
	    }else if (ch){
	    	createEle(vnode) //create el's children dom
	    }else if (oldCh){
	    	api.removeChildren(el)
	    }
    }
}

```
`const el = vnode.el = oldVnode.el` 这是很重要的一步，让`vnode.el`引用到现在的真实`dom`，当`el`修改时，`vnode.el`会同步变化。

节点的比较有5种情况

- `if (oldVnode === vnode)`，他们的引用一致，可以认为没有变化

- `if(oldVnode.text !== null && vnode.text !== null && oldVnode.text !== vnode.text)`，文本节点的比较，需要修改，
则会调用`Node.textContent = vnode.text`

- `if( oldCh && ch && oldCh !== ch )`, 两个节点都有子节点，而且它们不一样，这样我们会调用`updateChildren`函数比较子节点，这是`diff`的核心，后边会讲到

- `else if (ch)`，只有新的节点有子节点，调用`createEle(vnode)`，`vnode.el`已经引用了老的`dom`节点，`createEle`函数会在老dom节点上添加子节点

- `else if (oldCh)`，新节点没有子节点，老节点有子节点，直接删除老节点

**updateChildren**

```

updateChildren (parentElm, oldCh, newCh) {
    let oldStartIdx = 0, newStartIdx = 0
    let oldEndIdx = oldCh.length - 1
    let oldStartVnode = oldCh[0]
    let oldEndVnode = oldCh[oldEndIdx]
    let newEndIdx = newCh.length - 1
    let newStartVnode = newCh[0]
    let newEndVnode = newCh[newEndIdx]
    let oldKeyToIdx
    let idxInOld
    let elmToMove
    let before
    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
            if (oldStartVnode == null) {   //对于vnode.key的比较，会把oldVnode = null
                oldStartVnode = oldCh[++oldStartIdx] 
            }else if (oldEndVnode == null) {
                oldEndVnode = oldCh[--oldEndIdx]
            }else if (newStartVnode == null) {
                newStartVnode = newCh[++newStartIdx]
            }else if (newEndVnode == null) {
                newEndVnode = newCh[--newEndIdx]
            }else if (sameVnode(oldStartVnode, newStartVnode)) { // 如果这两个开始节点相同，直接执行patchVnode，并更新索引
                patchVnode(oldStartVnode, newStartVnode)
                oldStartVnode = oldCh[++oldStartIdx]
                newStartVnode = newCh[++newStartIdx]
            }else if (sameVnode(oldEndVnode, newEndVnode)) { // 如果两个尾节点相同，直接执行patchVnode，并更新索引
                patchVnode(oldEndVnode, newEndVnode)
                oldEndVnode = oldCh[--oldEndIdx]
                newEndVnode = newCh[--newEndIdx]
            }else if (sameVnode(oldStartVnode, newEndVnode)) { // 如果旧的头节点与新的旧节点相同，说明这两个节点发生了位置变化，有个节点跑后面去了
                patchVnode(oldStartVnode, newEndVnode)
                api.insertBefore(parentElm, oldStartVnode.el, api.nextSibling(oldEndVnode.el)) // 那就改变一下位置
                oldStartVnode = oldCh[++oldStartIdx]
                newEndVnode = newCh[--newEndIdx]
            }else if (sameVnode(oldEndVnode, newStartVnode)) { // 如果旧的尾节点与新的头节点相同，说明有个也是两个节点发生了变化，有个节点跑到前面来了
                patchVnode(oldEndVnode, newStartVnode)
                api.insertBefore(parentElm, oldEndVnode.el, oldStartVnode.el) // 那就改变一下位置
                oldEndVnode = oldCh[--oldEndIdx]
                newStartVnode = newCh[++newStartIdx]
            }else { // 使用key时的比较
                // 有key生成index表
                if (oldKeyToIdx === undefined) {
                    oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx) 
                }
                idxInOld = oldKeyToIdx[newStartVnode.key]
                if (!idxInOld) { // 没有Key
                    api.insertBefore(parentElm, createEle(newStartVnode).el, oldStartVnode.el)// 直接将新节占插入到旧节点前面
                    newStartVnode = newCh[++newStartIdx]
                }
                else { // 有key
                    elmToMove = oldCh[idxInOld]
                    if (elmToMove.sel !== newStartVnode.sel) { // 是不同的节点
                        api.insertBefore(parentElm, createEle(newStartVnode).el, oldStartVnode.el) // 直接将新节占插入到旧节点前面
                    }else {
                        patchVnode(elmToMove, newStartVnode) // 直接执行patchVnode(elmToMove, newStartVnode)
                        oldCh[idxInOld] = null
                        api.insertBefore(parentElm, elmToMove.el, oldStartVnode.el)
                    }
                    newStartVnode = newCh[++newStartIdx]
                }
            }
        }
        if (oldStartIdx > oldEndIdx) {
            before = newCh[newEndIdx + 1] == null ? null : newCh[newEndIdx + 1].el
            addVnodes(parentElm, before, newCh, newStartIdx, newEndIdx)
        }else if (newStartIdx > newEndIdx) {
            removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx)
        }
}

```

过程可以概括为：`oldCh`和`newCh`各有两个头尾的变量`StartIdx`和`EndIdx`，在一次遍历中，会使用他们做4种比较方式。

1. 新节点的首部节点与旧节点的首部节点是否相同

2. 新节点的尾部节点与旧节点的尾部节点是否相同

3. 新节点的头部节点与旧节点的尾部节点是否相同： 元素内部发生了位置变化，有个元素跑前面来了

4. 新节点的尾部节点与旧节点的着部节点是否相同： 元素内部发生了位置变化，有个元素跑后面去了

如果4种比较都没匹配，如果设置了`key`，就会用`key`进行比较

在比较的过程中，变量会往中间靠，一旦`StartIdx>EndIdx`表明`oldCh`和`newCh`至少有一个已经遍历完了，就会结束比较。

不设`key`，`newCh`和`oldCh`只会进行头尾两端的相互比较，设`key`后，除了头尾两端的比较外，还会从用`key`生成的对象`oldKeyToIdx`中查找匹配的节点，
所以为节点设置`key`可以更高效的利用`dom`。

对于与`sameVnode(oldStartVnode, newStartVnode)`和`sameVnode(oldEndVnode,newEndVnode)`为`true`的情况，不需要对`dom`进行移动。

在结束时，分为两种情况：

- `oldStartIdx > oldEndIdx`,说明旧的节点都遍历完了，如果还有新节点没遍历完，则都是新加的节点，执行`addVnodes`函数插入这些节点

- `newStartIdx > newEndIdx`, 可以认为`newCh`先遍历完。此时`oldStartIdx`和`oldEndIdx`之间的`vnode`在新的子节点里已经不存在了，
调用`removeVnodes`将它们从dom里删除。


# Virtual DOM 比真实 DOM 快嘛

`Virtual DOM` 并不是比真实 DOM 快，而是不管数据怎么变化，都可以用最小的代码进行更新 DOM

虽然说 `diff` 算法号称算法复杂度 `O(n)` 可以得到最小操作结果，但实际上 DOM 树很大的时候，遍历两棵树进行各种对比还是有性能损耗的，
特别是我在顶层更新一个简单的数据，你就要整棵树 `walk` 一遍，而真实中我可以一句 `jQuery` 就搞定

框架的意义在于为你掩盖底层的 DOM 操作，让你用更声明式的方式来描述你的目的，从而让你的代码更容易维护。没有任何框架可以比纯手动的优化 DOM 操作更快

框架给你的保证是，你在不需要手动优化的情况下，我依然可以给你提供过得去的性能



