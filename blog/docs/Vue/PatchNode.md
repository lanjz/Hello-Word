# 组件更新机制(diff)

## Virtual DOM

Vue 中使用 `Virtual Dom` 的概念，它表示 DOM 节点的 JavaScript 对象，一个 `Virtual Dom` 节点包含相应 DOM 节点的 `标签`，`属性`，`子节点`，`事件` 等的属性，它是对真实 DOM 节点的抽象表示。

Vue 在更新视图的时候在，并不是直接 DOM 上进行更新，而是先在 `Virtual Dom` 上进行相应从上面代码可以看到判断新旧相同的规则为的更新操作，最后再映射到真实 DOM 中

### Virtual DOM的优点

**跨平台性**

由于 `Virtual DOM` 是以 JavaScript 对象为基础而不依赖真实平台环境，所以使它具有了跨平台的能力，比如说 `浏览器平台`、`Weex`、`Node` 等
  
**提升渲染性能**

对于高频的 DOM 更新，`Virtual DOM` 可以提高性能，因为直接操作操作 DOM 慢，JS运行效率更高。

因为 DOM 操作的执行速度远不如 Javascript 的运算速度快，因此，把大量的 DOM 操作搬运到 Javascript 中，运用 `patching` 算法来计算出真正需要更新的节点，最大限度地减少 DOM 操作，从而显著提高性能。

**`Virtual DOM` 的优势不在于单次的操作，而是在大量、频繁的数据更新下，能够对视图进行合理、高效的更新。**
  
## diff 算法

为什么需要 `diff` 算法， 因为如果直接使用虚拟节点覆盖旧节点的话，会有很多不必要的 DOM 操作。例如，一个 `ul` 标签下很多个 `li` 标签，其中只有一个 `li` 有变化，这种情况下如果使用新的 `ul` 去替代旧的 `ul` ,因为这些不必要的 DOM 操作而造成了性能上的浪费

为了避免不必要的 DOM 操作，虚拟DOM 在虚拟节点映射到视图的过程中，将虚拟节点与上一次渲染视图所使用的旧虚拟节点（oldVnode）做对比，找出真正需要更新的节点来进行 DOM 操作，从而避免操作其他无需改动的 DOM。

仅在同级的 `vnode` 间做 `diff` ，递归地进行同级 `vnode` 的 `diff` ，最终实现整个 DOM 树的更新。因为跨层级的操作是非常少的，忽略不计，这样时间复杂度就从 `O(n3)` 变成 `O(n)` 。

**总之一句话：使用 `diff` 算法就是为了避免不必要的 DOM 操作**

### diff 算法特点

`diff` 算法有两个比较显著的特点

- 比较只会在同层级进行, 不会跨层级比较

- 在 `diff` 比较的过程中，循环从两边向中间收拢

### diff 算法过程

`diff` 的实现主要通过两个方法，`patchVnode` 与 `updateChildren`

`patchVnode` 主要有两个参数:旧节点 `oldVnode` 和新节点 `vnode`，并进行以下情况的处理：

- `if (oldVnode === vnode)`，他们的引用一致，可以认为没有变化

- 如果 `vnode` 不是文本节点

  - 如果新旧节点都存在子节点，且两者不相同时，调用 `updateChildren` 更新子节点

  - 两者不同且 `vnode` 是否有子节点，则直接使用这些子节点

  - 两者不同且 `vnode` 不存在子节点且 `oldVnode` 存在子节点，则删除这些子节点

  - 都不存在子节点，且 `oldVnode` 是文本节点，则直接清空这些文本节点

- 如果 `vnode` 是文本节点，则直接更新成这个文本节点

**`updateChildren` 是关键，这个过程可以概括如下:**

`oldCh` 和 `newCh` 各有两个头尾的变量 `StartIdx` 和 `EndIdx` ，它们的2个变量相互比较，一共有4种比较方式

- `oldCh`的头部与`newCh`的头部比较

- `oldCh`的尾部与`newCh`的尾部比较

- `oldCh`的头部与`newCh`的尾部比较

- `oldCh`的尾部与`newCh`的头部比较

如果 4 种比较都没匹配，如果设置了`key`，就会用`key`进行比较，在比较的过程中，变量会往中间靠，一旦 `StartIdx > EndIdx` 表明 `oldCh` 和 `newCh` 至少有一个已经遍历完了，就会结束比较。

## 源码分析

当 Vue 数据发生变化的时候，会触发渲染 `watcher` 的回调函数，然后执行组件的更新方法

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
`vm._update` 方法中会调用 `__patch__` 方法

```js
function patch (oldVnode, vnode, hydrating, removeOnly) {
    // 如果新节点为空
  if (isUndef(vnode)) {
    // 如果存在旧 oldVnode 调用旧节点的 invokeDestroyHook 生命周期
    if (isDef(oldVnode)) { invokeDestroyHook(oldVnode); }
    return
  }

  var isInitialPatch = false;
  var insertedVnodeQueue = [];

  // 如果没有旧节点，走的逻辑
  if (isUndef(oldVnode)) {
    // 创建新的根元素
    isInitialPatch = true;
    createElm(vnode, insertedVnodeQueue);
  } else {
    // 判断 oldVnode 是否是真实节点，比如挂载DOM的时候，旧节点是 设置的根节点，那么此时 isRealElement=true
    var isRealElement = isDef(oldVnode.nodeType);
    // 不是真实节点且新旧节点相同，相同的时候才执行 patchVnode 去 diff 两者的区别
    if (!isRealElement && sameVnode(oldVnode, vnode)) {
      // 进入 diff
      patchVnode(oldVnode, vnode, insertedVnodeQueue, null, null, removeOnly);
    } else {
      // vnode 是真实节点
      if (isRealElement) {
        // 服务端渲染走的逻辑
        if (oldVnode.nodeType === 1 && oldVnode.hasAttribute(SSR_ATTR)) {
          oldVnode.removeAttribute(SSR_ATTR);
          hydrating = true;
        }
        if (isTrue(hydrating)) {
          if (hydrate(oldVnode, vnode, insertedVnodeQueue)) {
            invokeInsertHook(vnode, insertedVnodeQueue, true);
            return oldVnode
          } else {
            warn( );
          }
        }
        // either not server-rendered, or hydration failed.
        // 创建一个空节点并替换它
        oldVnode = emptyNodeAt(oldVnode);
      }

      // 获取oldVnode的dom
      var oldElm = oldVnode.elm;
      var parentElm = nodeOps.parentNode(oldElm);

      // create new node
      createElm(
        vnode,
        insertedVnodeQueue,
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
            var insert = ancestor.data.hook.insert;
            if (insert.merged) {
              // start at index 1 to avoid re-invoking hllComponent mounted hook
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

上面代码先不细品了，大至过程如下：

- 如果新节点为空，此时旧节点存在（组件销毁时），调用旧节点 `destroy` 生命周期函数

- 如果旧节点为空，根据新节点创建 DOM

- 如果新旧节点都存在

  - 旧节点不是 DOM (组件节点)，且新旧节点相同, 执行 `patchVnode`（`diff` 的核心）

  - 旧节点是 DOM 元素或者两个节点不相同, 创建新节点 DOM，销毁旧节点以及 DOM。


`patch` 最后会返回 `vnode`，`vnode` 和进入 `patch` 之前的不同在哪？

没错，就是`vnode.elm`，唯一的改变就是之前 `vnode.el = null` , 而现在它引用的是对应的真实dom。


### sameVnode

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

2. 判断 `tag`、`isComment`、`data`(是否都存在)是否相同，如果是 `input` 元素则还对通过 `sameInputType`, 判断是否是相同的表单

### patchVnode

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
    // 如果新旧节点相同
  if (oldVnode === vnode) {
    return
  }
  // 如果elm存在，且存在子节点
  if (isDef(vnode.elm) && isDef(ownerArray)) {
    // 克隆一个vnode节点。
    vnode = ownerArray[index] = cloneVNode(vnode);
  }
  // elm 属性指向 vnode 对应的 dom 节点，这里的新vnode的elm也指向这旧vnode的dem 节点
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

  // 获取旧节点的子节点
  var oldCh = oldVnode.children;
   // 获取新节点的子节点
  var ch = vnode.children;
  // 紧接着就是调用各种更新函数。
  if (isDef(data) && isPatchable(vnode)) {
    for (i = 0; i < cbs.update.length; ++i) { cbs.update[i](oldVnode, vnode); }
    if (isDef(i = data.hook) && isDef(i = i.update)) { i(oldVnode, vnode); }
  }
  // 如果没有文本节点
  if (isUndef(vnode.text)) {
     // 如果新旧节点都存在子节点，且两者不相同时，调用 updateChildren 更新子节点
    if (isDef(oldCh) && isDef(ch)) {
      if (oldCh !== ch) { updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly); }
    } else if (isDef(ch)) {
      {
       // 检查是否有重复的key，如果存在重复会提示’warn‘
        checkDuplicateKeys(ch);
      }
      // 新的vnode存在子集的情况下如果旧节点存在文本节点，那就把’Text‘清空。
      if (isDef(oldVnode.text)) { nodeOps.setTextContent(elm, ''); }
      // 添加新的节点
      addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue);
    } else if (isDef(oldCh)) { // 如果新节点不存在子节点的情况下，旧节点之前是有子节点的
     // 移除子节点
      removeVnodes(oldCh, 0, oldCh.length - 1);
    } else if (isDef(oldVnode.text)) { // 如果新节点不存在子节点的情况下，如果旧节点存在文本节点，清除文本节点
      nodeOps.setTextContent(elm, '');
    }
  } else if (oldVnode.text !== vnode.text) { // 如果新节占是文本节点，更新文本节点
    nodeOps.setTextContent(elm, vnode.text);
  }
  if (isDef(data)) {
    if (isDef(i = data.hook) && isDef(i = i.postpatch)) { i(oldVnode, vnode); }
  }
}
```

大致过程：

`const el = vnode.el = oldVnode.el` 这是很重要的一步，让`vnode.el`引用到现在的真实`dom`，当`el`修改时，`vnode.el`会同步变化。

节点的比较有5种情况

- `if (oldVnode === vnode)`，他们的引用一致，可以认为没有变化

- `if(oldVnode.text !== null && vnode.text !== null && oldVnode.text !== vnode.text)`，文本节点的比较，需要修改，
则会调用`Node.textContent = vnode.text`

- `if( oldCh && ch && oldCh !== ch )`, 两个节点都有子节点，而且它们不一样，这样我们会调用`updateChildren`函数比较子节点，这是`diff`的核心，后边会讲到

- `else if (ch)`，只有新的节点有子节点，调用`createEle(vnode)`，`vnode.el`已经引用了老的`dom`节点，`createEle`函数会在老dom节点上添加子节点

- `else if (oldCh)`，新节点没有子节点，老节点有子节点，直接删除老节点


### updateChildren

都新旧 vnode 都有子节点且不相同时，则会执行 `updateChildren` 对子元素进行 `diff`

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
      // oldKeyToIdx 表示当前列表的 [key] map [元素] 的映射，如果没有则执行 createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx) 遍历一次列表生成 oldKeyToIdx
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
          // 同样的key但不同的元素。作为新元素处理
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

### 栗子

假设现有旧节点 A、B、C、D、E、F，新节点 A、E、C、D、B、F

新旧节点的变化就是将 B 与 E 更换了位置

(→): 表示 `startIdx` 所在位置
(←): 表示 `endIdx` 所在位置

VNode 旧: (→)A、B、C、D、E、(←)F     新: (→)A、E、C、D、B、(←)F    
                                               
对应DOM : A、B、C、D、E、F 

第一轮判断

- `if(sameVnode(oldStartVnode, newStartVnode))` 为 `true`,所以移动 `oldStartIdx` 和 `newStartIdx` 的指针: `++oldStartIdx`、`++newStartIdx`

VNode 旧: A、(→)B、C、D、E、(←)F     新: A、(→)E、C、D、B、(←)F  

对应DOM : A、B、C、D、E、F 

第二轮判断 

- `if(sameVnode(oldStartVnode, newStartVnode))` : `false`

- `if (sameVnode(oldEndVnode, newEndVnode))` : `true`，所以移动 `oldEndVnode` 和 `newEndVnode` 的指针: `--oldEndIdx`、 `--oldEndIdx`

VNode 旧: A、(→)B、C、D、(←)E、F     新: A、(→)E、C、D、(←)B、F  

对应DOM : A、B、C、D、E、F  

第三轮判断

- `if(sameVnode(oldStartVnode, newStartVnode))` : `false`

- `if(sameVnode(oldEndVnode, newEndVnode))` : `false`

- `if(sameVnode(oldStartVnode, newEndVnode))`：`true`, 说明 `oldStartVnode` 移到后面去

  具体移动节点的方法是 `nodeOps.insertBefore(parentElm, oldStartVnode.elm, nodeOps.nextSibling(oldEndVnode.elm))`,  `oldStartVnode.elm`  表示DOM 元素 `B`; `nodeOps.nextSibling(oldEndVnode.elm))` 表示 `oldEndVnode.elm` 的下一个节点（E后面的F），所以这个方法表示将 `B` 插入到 `F` 之前

  然后移动 `oldStartIdx` 和 `newEndIdx` 的指针：`++oldStartIdx`, `--newEndIdx`  

VNode 旧: A、B、(→)C、D、(←)E、F     新: A、(→)E、C、(←)D、B、F  

对应DOM : A、C、D、E、B、F  

第四轮判断

- `if(sameVnode(oldStartVnode, newStartVnode))` : `false`

- `if(sameVnode(oldEndVnode, newEndVnode))` : `false`

- `if(sameVnode(oldStartVnode, newEndVnode))`：`false`

- `if(sameVnode(oldEndVnode, newStartVnode))`：`true`, 说明 `oldEndVnode` 移到后面去

具体移动节点的方法是 `nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm)`,  `oldEndVnode.elm`  表示DOM 元素 `E`; `oldStartVnode.elm` 表示 DOM 元素 `C`，所以这个方法表示将 `E` 插入到 `C` 之前

然后移动 `oldStartIdx` 和 `newEndIdx` 的指针：`--oldEndIdx`, `++newStartIdx`

VNode 旧: A、B、(→)C、(←)D、E、F     新: A、E、(→)C、(←)D、B、F  

对应DOM : A、E、C、D、B、F  

第五轮判断

- `if(sameVnode(oldStartVnode, newStartVnode))` 为 `true`,所以移动 `oldStartIdx` 和 `newStartIdx` 的指针: `++oldStartIdx`、`++newStartIdx`

VNode 旧: A、B、C、(→ ←)D、E、F     新: A、E、C、(→ ←)D、B、F  

对应DOM : A、E、C、D、B、F  

第六轮判断

- `if(sameVnode(oldStartVnode, newStartVnode))` 为 `true`,所以移动 `oldStartIdx` 和 `newStartIdx` 的指针: `++oldStartIdx`、`++newStartIdx`

VNode 旧: A、B、C、(←)D、(→)E、F     新: A、E、C、(←)D、(→)B、F  

对应DOM : A、E、C、D、B、F  

之会跳出 `while` 循环

### 总结

过程可以概括为：`oldCh` 和 `newCh` 各有两个头尾的变量 `StartIdx` 和 `EndIdx` ，在一次遍历中，会使用他们做4种比较方式。

1. 新节点的首部节点与旧节点的首部节点是否相同

2. 新节点的尾部节点与旧节点的尾部节点是否相同

3. 新节点的头部节点与旧节点的尾部节点是否相同： 元素内部发生了位置变化，有个元素跑前面来了

4. 新节点的尾部节点与旧节点的着部节点是否相同： 元素内部发生了位置变化，有个元素跑后面去了

5. 如果4种比较都没匹配，则尝试通过 `key` 查找，这里分两种情况

  - 如果新节点有 `key`, 且能匹配到旧节点，则当做添加新节点处理

  - 如果新节点有 `key`, 且能匹配到旧节点，则先通过 `sameVnode` 方法判断这两个新旧节点是否相同，情况也分两种

    - 如果相同，则 `patchVnode` 继续对新旧节点做 `diff` 处理，并且交换位置

    - 如果不相同，则当做新节点做处理

**所以为节点设置`key`可以更高效的利用`dom`**

在比较的过程中，变量会往中间靠，一旦 `StartIdx>EndIdx` 表明 `oldCh` 和 `newCh` 至少有一个已经遍历完了，就会结束比较。

在结束时，分为两种情况：

- `oldStartIdx > oldEndIdx`,说明旧的节点都遍历完了，如果还有新节点没遍历完，则都是新加的节点，执行`addVnodes`函数插入这些节点

- `newStartIdx > newEndIdx`, 可以认为`newCh`先遍历完。此时`oldStartIdx`和`oldEndIdx`之间的`vnode`在新的子节点里已经不存在了，
调用`removeVnodes`将它们从dom里删除。

## Q&A

**为什么不推荐使用index作为key？**

因为使用 `index` 作为 `key`，会导致 diff 时不能找到**正确**的节点做复用。注意这里的**正确**一词

假设有以下列表 `[1, 2, 3, 4]`，并用 `index` 做为 `key`，此时列表对应原 `key` 为 `[0, 1, 2, 3]` 之后我们将列表改成 `[2, 3, 4, 1]`,此时对应的 `key` 还是 `[0, 1, 2， 3]`

回顾下进行 `diff` 时执行的 `updateChildren` 方法：

```js
 while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
        if (sameVnode(oldStartVnode, newStartVnode)) {
          patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue, newCh, newStartIdx);
          oldStartVnode = oldCh[++oldStartIdx];
          newStartVnode = newCh[++newStartIdx];
        } else if (sameVnode(oldEndVnode, newEndVnode)) {
          // todo
        } else if (sameVnode(oldStartVnode, newEndVnode)) { // Vnode moved right
          patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue, newCh, newEndIdx);
          canMove && nodeOps.insertBefore(parentElm, oldStartVnode.elm, nodeOps.nextSibling(oldEndVnode.elm));
          oldStartVnode = oldCh[++oldStartIdx];
          newEndVnode = newCh[--newEndIdx];
        } else if (sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left
          // todo
        } else {
          // todo
        }
      }
```

假设当前进行对比都是第一个元素，在执行到第一个判断语句 `sameVnode(oldStartVnode, newStartVnode)` 时，此时新旧节点的`tag`, `key` 都是相同的此时就对这两个节点做进一步的 `diff` 判断，之后判断到文本内容是不一样的，就会将新的文本替换旧的文本，这样就导致子节点没办法得到复用了。以此类推，其它的所节点都会有这个问题

但是如果当前使用的是唯一 `id` 作为 `key`，在上面的例子中，在对比第一个元素，将执行第三个判断主句  `sameVnode(oldStartVnode, newEndVnode)` ，实际上他们的子节点也是相同，因此再进一步 `diff` 时也是认为是相同的，之后将执行 `canMove && nodeOps.insertBefore(parentElm, oldStartVnode.elm, nodeOps.nextSibling(oldEndVnode.elm));`语句， 直接以相换位置的方式复用旧节点，以此拿到提高性能的目的

所以如果使用 `index` 作为 `key`将不利于节点的复用

**Virtual DOM 比真实 DOM 快嘛**

`Virtual DOM` 并不是比真实 DOM 快，而是不管数据怎么变化，都可以用最小的代码进行更新 DOM

虽然说 `diff` 算法号称算法复杂度 `O(n)` 可以得到最小操作结果，但实际上 DOM 树很大的时候，遍历两棵树进行各种对比还是有性能损耗的，
特别是我在顶层更新一个简单的数据，你就要整棵树 `walk` 一遍，而真实中我可以一句 `jQuery` 就搞定

框架的意义在于为你掩盖底层的 DOM 操作，让你用更声明式的方式来描述你的目的，从而让你的代码更容易维护。没有任何框架可以比纯手动的优化 DOM 操作更快

框架给你的保证是，你在不需要手动优化的情况下，我依然可以给你提供过得去的性能


**vue和react更新机制的区别**
  
vue会跟踪每一个组件的依赖关系,不需要重新渲染整个组件树。

而对于React而言，每当应用的状态被改变时，全部组件都会重新渲染，所以 react 中会需要 `shouldComponentUpdate` 这个生命周期函数方法来进行控制
