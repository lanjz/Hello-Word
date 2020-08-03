# Virtual Dom

`Virtual Dom` 是一个可以表示 DOM 节点的 JavaScript 对象，一个 `Virtual Dom` 节点包含相应 DOM 节点的 `标签`，`属性`，`子节点`，`事件` 等的属性，它是对真实 DOM 节点的抽象表示。在我们需要更新 DOM 的时候，并不是直接 DOM 上进行更新，而是先在 `Virtual Dom` 上进行相应的更新操作，最后再映射到真实 DOM 中

### Virtual DOM的优点

- 跨平台性

  由于 `Virtual DOM` 是以 JavaScript 对象为基础而不依赖真实平台环境，所以使它具有了跨平台的能力，比如说 `浏览器平台`、`Weex`、`Node` 等
  
- 提升渲染性能

  对于高频的 DOM 更新，`Virtual DOM` 可以提高性能，因为直接操作操作 DOM 慢，JS运行效率更高。

  因为 DOM 操作的执行速度远不如 Javascript 的运算速度快，因此，把大量的 DOM 操作搬运到 Javascript 中，运用 `patching` 算法来计算出真正需要更新的节点，最大限度地减少 DOM 操作，从而显著提高性能。

  **`Virtual DOM` 的优势不在于单次的操作，而是在大量、频繁的数据更新下，能够对视图进行合理、高效的更新。**
  
## diff 算法

为什么需要 `diff` 算法， 因为如果直接使用虚拟节点覆盖旧节点的话，会有很多不必要的 DOM 操作。例如，一个 `ul` 标签下很多个 `li` 标签，其中只有一个 `li` 有变化，这种情况下如果使用新的 `ul` 去替代旧的 `ul` ,因为这些不必要的 DOM 操作而造成了性能上的浪费

为了避免不必要的 DOM 操作，虚拟DOM 在虚拟节点映射到视图的过程中，将虚拟节点与上一次渲染视图所使用的旧虚拟节点（oldVnode）做对比，找出真正需要更新的节点来进行 DOM 操作，从而避免操作其他无需改动的 DOM。

仅在同级的 `vnode` 间做 `diff` ，递归地进行同级 `vnode` 的 `diff` ，最终实现整个 DOM 树的更新。因为跨层级的操作是非常少的，忽略不计，这样时间复杂度就从 `O(n3)` 变成 `O(n)` 。

**总之一句话：使用 `diff` 算法就是为了避免不必要的 DOM 操作**

### diff 算法的特点

`diff` 算法有两个比较显著的特点

- 比较只会在同层级进行, 不会跨层级比较

- 在 `diff` 比较的过程中，循环从两边向中间收拢

### diff 算法过程

`diff` 的实现主要通过两个方法，`patchVnode` 与 `updateChildren`

`patchVnode`主要有两个参数:旧节点`oldVnode`和新节点`vnode`，主要分五种情况

- `if (oldVnode === vnode)`，他们的引用一致，可以认为没有变化

- `if(oldVnode.text !== null && vnode.text !== null && oldVnode.text !== vnode.text)`，文本节点的比较，需要修改，则会调用`el.textContent = vnode.text`

- `if( oldCh && ch && oldCh !== ch ),` 两个节点都有子节点，而且它们不一样，这样我们会调用 updateChildren 函数比较子节点，这是diff的核心，后边会讲到

- `if (ch)`，只有新的节点有子节点，调用`createEle(vnode)`，`vnode.el`已经引用了老的dom节点，`createEle`函数会在老dom节点上添加子节点

- `if (oldCh)`，新节点没有子节点，老节点有子节点，直接删除老节点

`updateChildren` 是关键，这个过程可以概括如下:

`oldCh` 和 `newCh` 各有两个头尾的变量 `StartIdx` 和 `EndIdx` ，它们的2个变量相互比较，一共有4种比较方式

- `oldCh`的头部与`newCh`的头部比较

- `oldCh`的尾部与`newCh`的尾部比较

- `oldCh`的头部与`newCh`的尾部比较

- `oldCh`的尾部与`newCh`的头部比较

如果 4 种比较都没匹配，如果设置了`key`，就会用`key`进行比较，在比较的过程中，变量会往中间靠，
一旦 `StartIdx > EndIdx` 表明 `oldCh` 和 `newCh` 至少有一个已经遍历完了，就会结束比较。

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

```js
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

```js
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
`diff` 的过程就是调用 `patch` 函数

```js
function patch (oldVnode, vnode, hydrating, removeOnly) {
  if (isUndef(vnode)) {
    if (isDef(oldVnode)) { invokeDestroyHook(oldVnode); }
    return
  }

  var isInitialPatch = false;
  var insertedVnodeQueue = [];

  // 如果没有旧节点，走的逻辑
  if (isUndef(oldVnode)) {
    // empty mount (likely as component), create new root element
    isInitialPatch = true;
    createElm(vnode, insertedVnodeQueue);
  } else {
    // 判断 oldVnode 是否是真实节点，比如挂载DOM的时候，旧节点是 设置的根节点，那么此时 isRealElement=true
    var isRealElement = isDef(oldVnode.nodeType);
    // 判断新旧节点是否相同，相同的时候才去 diff
    if (!isRealElement && sameVnode(oldVnode, vnode)) {
      // patch existing root node
      // 进入 diff
      patchVnode(oldVnode, vnode, insertedVnodeQueue, null, null, removeOnly);
    } else {
      // 
      if (isRealElement) {
        // mounting to a real element
        // check if this is server-rendered content and if we can perform
        // a successful hydration.
        if (oldVnode.nodeType === 1 && oldVnode.hasAttribute(SSR_ATTR)) {
          oldVnode.removeAttribute(SSR_ATTR);
          hydrating = true;
        }
        if (isTrue(hydrating)) {
          if (hydrate(oldVnode, vnode, insertedVnodeQueue)) {
            invokeInsertHook(vnode, insertedVnodeQueue, true);
            return oldVnode
          } else {
            warn(
              'The client-side rendered virtual DOM tree is not matching ' +
              'server-rendered content. This is likely caused by incorrect ' +
              'HTML markup, for example nesting block-level elements inside ' +
              '<p>, or missing <tbody>. Bailing hydration and performing ' +
              'full client-side render.'
            );
          }
        }
        // either not server-rendered, or hydration failed.
        // create an empty node and replace it
        oldVnode = emptyNodeAt(oldVnode);
      }

      // replacing existing element
      var oldElm = oldVnode.elm;
      var parentElm = nodeOps.parentNode(oldElm);

      // create new node
      createElm(
        vnode,
        insertedVnodeQueue,
        // extremely rare edge case: do not insert if old element is in a
        // leaving transition. Only happens when combining transition +
        // keep-alive + HOCs. (#4590)
        oldElm._leaveCb ? null : parentElm,
        nodeOps.nextSibling(oldElm)
      );

      // update parent placeholder node element, recursively
      if (isDef(vnode.parent)) {
        var ancestor = vnode.parent;
        var patchable = isPatchable(vnode);
        while (ancestor) {
          for (var i = 0; i < cbs.destroy.length; ++i) {
            cbs.destroy[i](ancestor);
          }
          ancestor.elm = vnode.elm;
          if (patchable) {
            for (var i$1 = 0; i$1 < cbs.create.length; ++i$1) {
              cbs.create[i$1](emptyNode, ancestor);
            }
            // #6513
            // invoke insert hooks that may have been merged by create hooks.
            // e.g. for directives that uses the "inserted" hook.
            var insert = ancestor.data.hook.insert;
            if (insert.merged) {
              // start at index 1 to avoid re-invoking component mounted hook
              for (var i$2 = 1; i$2 < insert.fns.length; i$2++) {
                insert.fns[i$2]();
              }
            }
          } else {
            registerRef(ancestor);
          }
          ancestor = ancestor.parent;
        }
      }

      // destroy old node
      if (isDef(parentElm)) {
        removeVnodes([oldVnode], 0, 0);
      } else if (isDef(oldVnode.tag)) {
        invokeDestroyHook(oldVnode);
      }
    }
  }

  invokeInsertHook(vnode, insertedVnodeQueue, isInitialPatch);
  return vnode.elm
}

```

### 判断新旧 VNode 是否相同

判断新旧 VNode 是否相同是通过 `sameVnode` 方法进行判断的，源码定义:

```js 
 function sameVnode (a, b) {
    return (
      a.key === b.key && (
        (
          a.tag === b.tag &&
          a.isComment === b.isComment &&
          isDef(a.data) === isDef(b.data) &&
          sameInputType(a, b)
        ) || (
          isTrue(a.isAsyncPlaceholder) &&
          a.asyncFactory === b.asyncFactory &&
          isUndef(b.asyncFactory.error)
        )
      )
    )
  }
  // 如果是 input 判断是否是相同的 input 先不细品这个
  function sameInputType (a, b) {
    if (a.tag !== 'input') { return true }
    var i;
    var typeA = isDef(i = a.data) && isDef(i = i.attrs) && i.type;
    var typeB = isDef(i = b.data) && isDef(i = i.attrs) && i.type;
    return typeA === typeB || isTextInputType(typeA) && isTextInputType(typeB)
  }
```

从上面代码可以看到判断新旧相同的规则为：

1. 首先判断 `key` 是否相同，如果都没有 `key` （都是 `undefined`），获取有相同的 `key`，则继续往下判断

2. 判断 `tag`、`isComment`、`data`属性是否相同，如果是 `input` 元素则还对通过 `sameInputType`, 判断是否是相同的表单

### 进入 PATCH

如果通过 `sameVnode()` 方法判断到新旧 `vnode` 是相同的则进入 `patchVnode(oldVnode, vnode, insertedVnodeQueue, null, null, removeOnly);`

```js
function patchVnode (
  oldVnode,
  vnode,
  insertedVnodeQueue,
  ownerArray,
  index,
  removeOnly
) {
  if (oldVnode === vnode) {
    return
  }

  if (isDef(vnode.elm) && isDef(ownerArray)) {
    // clone reused vnode
    vnode = ownerArray[index] = cloneVNode(vnode);
  }

  var elm = vnode.elm = oldVnode.elm;

  if (isTrue(oldVnode.isAsyncPlaceholder)) {
    if (isDef(vnode.asyncFactory.resolved)) {
      hydrate(oldVnode.elm, vnode, insertedVnodeQueue);
    } else {
      vnode.isAsyncPlaceholder = true;
    }
    return
  }

  // reuse element for static trees.
  // note we only do this if the vnode is cloned -
  // if the new node is not cloned it means the render functions have been
  // reset by the hot-reload-api and we need to do a proper re-render.
  if (isTrue(vnode.isStatic) &&
    isTrue(oldVnode.isStatic) &&
    vnode.key === oldVnode.key &&
    (isTrue(vnode.isCloned) || isTrue(vnode.isOnce))
  ) {
    vnode.componentInstance = oldVnode.componentInstance;
    return
  }

  var i;
  var data = vnode.data;
  if (isDef(data) && isDef(i = data.hook) && isDef(i = i.prepatch)) {
    i(oldVnode, vnode);
  }

  var oldCh = oldVnode.children;
  var ch = vnode.children;
  if (isDef(data) && isPatchable(vnode)) {
    for (i = 0; i < cbs.update.length; ++i) { cbs.update[i](oldVnode, vnode); }
    if (isDef(i = data.hook) && isDef(i = i.update)) { i(oldVnode, vnode); }
  }
  if (isUndef(vnode.text)) {
    if (isDef(oldCh) && isDef(ch)) {
      if (oldCh !== ch) { updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly); }
    } else if (isDef(ch)) {
      {
        checkDuplicateKeys(ch);
      }
      if (isDef(oldVnode.text)) { nodeOps.setTextContent(elm, ''); }
      addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue);
    } else if (isDef(oldCh)) {
      removeVnodes(oldCh, 0, oldCh.length - 1);
    } else if (isDef(oldVnode.text)) {
      nodeOps.setTextContent(elm, '');
    }
  } else if (oldVnode.text !== vnode.text) {
    nodeOps.setTextContent(elm, vnode.text);
  }
  if (isDef(data)) {
    if (isDef(i = data.hook) && isDef(i = i.postpatch)) { i(oldVnode, vnode); }
  }
}
```

`patch` 函数重点接受有两个参数，`vnode`和`oldVnode`，也就是新旧两个虚拟节点。在这之前，我们先了解完整的 `vnode` 都有什么属性，举个一个简单的例子:

```js
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

需要注意的是，`el` 属性引用的是此 `virtual dom` 对应的真实 `dom`，`patch` 的 `vnode`参数的`el`最初是`null`，因为`patch`之前它还没有对应的真实`dom`。

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

```js

function updateChildren (parentElm, oldCh, newCh, insertedVnodeQueue, removeOnly) {
  var oldStartIdx = 0; // 记录旧节点的开始标记位
  var newStartIdx = 0; // 记录新节点的开始标记位
  var oldEndIdx = oldCh.length - 1; // 记录旧节点的末尾标记位
  var oldStartVnode = oldCh[0]; // 记录旧节点开始子节点
  var oldEndVnode = oldCh[oldEndIdx];  // 记录旧节点的末尾子节点
  var newEndIdx = newCh.length - 1;  // 记录新节点的末尾标记位
  var newStartVnode = newCh[0]; // 记录新节点开始子节点
  var newEndVnode = newCh[newEndIdx]; // 记录新节点的末尾子节点
  var oldKeyToIdx, idxInOld, vnodeToMove, refElm;

  // removeOnly is a special flag used only by <transition-group>
  // to ensure removed elements stay in correct relative positions
  // during leaving transitions
  var canMove = !removeOnly;

  {
    checkDuplicateKeys(newCh);
  }
  // 新旧节点的标记从两侧往中间靠拢，直到有一方到达中间结束
  while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
    
    if (isUndef(oldStartVnode)) {  // 如果没 oldStartVnode 则取下一个 vnode
      oldStartVnode = oldCh[++oldStartIdx]; // Vnode has been moved left
    } else if (isUndef(oldEndVnode)) {  // 如果没 oldEndVnode 则倒着取前一个 vnode
      oldEndVnode = oldCh[--oldEndIdx];
    } else if (sameVnode(oldStartVnode, newStartVnode)) {  // 如果当前两个新旧子节点的首部节点都相同
    // 继续调用 patchVnode 进行 diff 判断
      patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue, newCh, newStartIdx);
    // oldStartIdx newStartIdx 往右移一位
      oldStartVnode = oldCh[++oldStartIdx];
      newStartVnode = newCh[++newStartIdx];
    } else if (sameVnode(oldEndVnode, newEndVnode)) { // 如果当前两个新旧子节点的尾部节点都相同
    // 是继续调用 patchVnode 进行 diff 判断
      patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue, newCh, newEndIdx);
    // oldEndVnode newEndVnode 往左移一位
      oldEndVnode = oldCh[--oldEndIdx];
      newEndVnode = newCh[--newEndIdx];
    } else if (sameVnode(oldStartVnode, newEndVnode)) { // 如果当前旧节点的首部与新节点的尾部相同
    // 是继续调用 patchVnode 进行 diff 判断
      patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue, newCh, newEndIdx);
      // 说明只是oldStartVnode节点的位置发生了变化，将oldStartVnode节点插入到oldEndVnode后一个节点之前
      canMove && nodeOps.insertBefore(parentElm, oldStartVnode.elm, nodeOps.nextSibling(oldEndVnode.elm));
      // oldStartIdx 向右移一位   newEndIdx 向左移一位
      oldStartVnode = oldCh[++oldStartIdx];
      newEndVnode = newCh[--newEndIdx];
    } else if (sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left
     // 如果当前旧节点的尾部与新节点的首部都相同，是继续调用 patchVnode 进行 diff 判断
      patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue, newCh, newStartIdx);
     // 说明只是oldEndVnode节点的位置发生了变化，将oldEndVnode插入到oldStartVnode前
      canMove && nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
      // newStartVnode 向右移一位   oldEndVnode 向左移一位
      oldEndVnode = oldCh[--oldEndIdx];
      newStartVnode = newCh[++newStartIdx];
    } else {
      // oldKeyToIdx 表示当前列表的 [key] map [元素] 的映射，如果没有则执行 createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx) 遍布一次列表生成 oldKeyToIdx
      if (isUndef(oldKeyToIdx)) { oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx); }
      // 如果当前存在 key 则从oldKeyToIdx 找出旧节点对应的key的元素的索引值
      idxInOld = isDef(newStartVnode.key)
        ? oldKeyToIdx[newStartVnode.key]
        : findIdxInOld(newStartVnode, oldCh, oldStartIdx, oldEndIdx);
      if (isUndef(idxInOld)) { // 使用key 匹配不到对应的元素时
        // 如果有新增的节点，则会执行这里进行dom元素添加
        // 如果删除节点，则会执行这里在要开始删除的元素前面添加注释节点
        createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx);
      } else {
        vnodeToMove = oldCh[idxInOld]; // 找出对应key的旧元素
        if (sameVnode(vnodeToMove, newStartVnode)) { // 如果两个元素相等
        // diff 子节点
          patchVnode(vnodeToMove, newStartVnode, insertedVnodeQueue, newCh, newStartIdx);
          oldCh[idxInOld] = undefined;
          // 更新位置 
          canMove && nodeOps.insertBefore(parentElm, vnodeToMove.elm, oldStartVnode.elm);
        } else {
          // 同样的关键但不同的元素。作为新元素处理
          createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx);
        }
      }
      newStartVnode = newCh[++newStartIdx];
    }
  }
  if (oldStartIdx > oldEndIdx) {
    refElm = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm;
    addVnodes(parentElm, refElm, newCh, newStartIdx, newEndIdx, insertedVnodeQueue);
  } else if (newStartIdx > newEndIdx) {
    // 如果是删除节点则在这里进行真正的节点删除
    removeVnodes(oldCh, oldStartIdx, oldEndIdx);
  }
}

```

栗子：

假设现有旧节点 A、B、C、D、E、F，新节点 A、E、C、D、B、F

新旧节点的变化就是将 B 与 E 更换了位置

          ↓                       ↓
VNode 旧: A、B、C、D、E、F     新: A、E、C、D、B、F    
                        ↑                       ↑
对应DOM : A、B、C、D、E、F 

第一轮判断

- `if(sameVnode(oldStartVnode, newStartVnode))` 为 `true`,所以移动 `oldStartIdx` 和 `newStartIdx` 的指针: `++oldStartIdx`、`++newStartIdx`
             ↓                       ↓
VNode 旧: A、B、C、D、E、F     新: A、E、C、D、B、F  
                        ↑                       ↑
对应DOM : A、B、C、D、E、F 

第二轮判断 

- `if(sameVnode(oldStartVnode, newStartVnode))` : `false`

- `if (sameVnode(oldEndVnode, newEndVnode))` : `true`，所以移动 `oldEndVnode` 和 `newEndVnode` 的指针: `--oldEndIdx`、 `--oldEndIdx`

             ↓                       ↓
VNode 旧: A、B、C、D、E、F     新: A、E、C、D、B、F  
                     ↑                       ↑
对应DOM : A、B、C、D、E、F  

第三轮判断

- `if(sameVnode(oldStartVnode, newStartVnode))` : `false`

- `if(sameVnode(oldEndVnode, newEndVnode))` : `false`

- `if(sameVnode(oldStartVnode, newEndVnode))`：`true`, 说明 `oldStartVnode` 移到后面去

  具体移动节点的方法是 `nodeOps.insertBefore(parentElm, oldStartVnode.elm, nodeOps.nextSibling(oldEndVnode.elm))`,  `oldStartVnode.elm`  表示DOM 元素 `B`; `nodeOps.nextSibling(oldEndVnode.elm))` 表示 `oldEndVnode.elm` 的下一个节点（E后面的F），所以这个方法表示将 `B` 插入到 `F` 之前

  然后移动 `oldStartIdx` 和 `newEndIdx` 的指针：`++oldStartIdx`, `--newEndIdx`
  
                ↓                    ↓
VNode 旧: A、B、C、D、E、F     新: A、E、C、D、B、F  
                     ↑                    ↑
对应DOM : A、C、D、E、B、F  

第四轮判断

- `if(sameVnode(oldStartVnode, newStartVnode))` : `false`

- `if(sameVnode(oldEndVnode, newEndVnode))` : `false`

- `if(sameVnode(oldStartVnode, newEndVnode))`：`false`

- `if(sameVnode(oldEndVnode, newStartVnode))`：`true`, 说明 `oldEndVnode` 移到后面去

具体移动节点的方法是 `nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm)`,  `oldEndVnode.elm`  表示DOM 元素 `E`; `oldStartVnode.elm` 表示 DOM 元素 `C`，所以这个方法表示将 `E` 插入到 `C` 之前

然后移动 `oldStartIdx` 和 `newEndIdx` 的指针：`--oldEndIdx`, `++newStartIdx`

                ↓                      ↓
VNode 旧: A、B、C、D、E、F     新: A、E、C、D、B、F  
                  ↑                       ↑
对应DOM : A、E、C、D、B、F  

第五轮判断

- `if(sameVnode(oldStartVnode, newStartVnode))` 为 `true`,所以移动 `oldStartIdx` 和 `newStartIdx` 的指针: `++oldStartIdx`、`++newStartIdx`
                  ↓                       ↓
VNode 旧: A、B、C、D、E、F     新: A、E、C、D、B、F  
                  ↑                       ↑
对应DOM : A、E、C、D、B、F  

第六轮判断

- `if(sameVnode(oldStartVnode, newStartVnode))` 为 `true`,所以移动 `oldStartIdx` 和 `newStartIdx` 的指针: `++oldStartIdx`、`++newStartIdx`
                     ↓                       ↓
VNode 旧: A、B、C、D、E、F     新: A、E、C、D、B、F  
                  ↑                       ↑
对应DOM : A、E、C、D、B、F  

之会跳出 `while` 循环


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


# vue和react中虚拟dom的区别
  
vue会跟踪每一个组件的依赖关系,不需要重新渲染整个组件树。

而对于React而言，每当应用的状态被改变时，全部组件都会重新渲染，所以react中会需要shouldComponentUpdate这个生命周期函数方法来进行控制
