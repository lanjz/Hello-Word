# React16 Diff算法

React diff算法策略：

- 针对树结构(tree diff)：对UI层的DOM节点跨层级的操作进行忽略。（数量少）

- 针对组件结构(component diff)：拥有相同类的两个组件生成相似的树形结构，拥有不同类的两个组件会生成不同的属性结构

- 针对元素结构(element-diff): 对于同一层级的一组节点，使用具有唯一性的id区分 (key属性)

**tree diff 的特点**

- React 通过使用 updateDepth 对 虚拟DOM树进行层次遍历

- 两棵树只对同一层级节点进行比较，只要该节点不存在了，那么该节点与其所有子节点会被完全删除,不在进行进一步比较

- 只需要遍历一次，便完成对整个DOM树的比较

## component diff

- 一类型的组件，按照原策略(tree diff)比较 virtual DOM tree

- 同类型组件，组件A转化为了组件B，如果virtual DOM 无变化，可以通过shouldComponentUpdate()方法来判断是否

- 不同类型的组件，那么diff算法会把要改变的组件判断为dirty component,从而替换整个组件的所有节点

   就算结构再相似的组件，只要 React 判断是不同的组件，就不会判断是否为不同类型的组件，就不会比较其结构，而是删除组件以及其子组件，并创建新的组件以及其子节点
   
## element diff

对于处于同一层级的节点，React diff 提供了三种节点操作: 插入，移动，删除

- 插入： 新的组件不在原来的集合中，而是全新的节点，则对集合进行插入操作

- 删除：组件已经在集合中，但集合已经更新，此时节点就需要删除

- 移动：组件已经存在于集合中，并且集合更新时，组件并没有发生更新，只是位置发生改变

### 例子

节点相同，位置不同

![](./images/diff_1.png)

按新集合中顺序开始遍历

1. B在新集合中 `lastIndex(类似浮标) = 0`, 在旧集合中 `index = 1，index > lastIndex` 就认为 B 对于集合中其他元素位置无影响，不进行移动，之后 `lastIndex = max(index, lastIndex) = 1`

2. A在旧集合中 `index = 0`， 此时 `lastIndex = 1`, 满足 `index < lastIndex`, 则对A进行移动操作，此时 `lastIndex = max(Index, lastIndex) = 1`

3. D和B操作相同，同(1)，不进行移动，此时 `lastIndex=max(index, lastIndex) = 3`

4. C和A操作相同，同(2)，进行移动，此时 `lastIndex = max(index, lastIndex) = 3`

节点位置均有变化

![](./images/diff_2.png)

1. 同上面那种情形，B不进行移动，`lastIndex=1`

2. 新集合中取得E,发现旧中不存在E，在 `lastIndex` 处创建E，`lastIndex++`

3. 在旧集合中取到C，C不移动，`lastIndex=2`

4. 在旧集合中取到A，A移动到新集合中的位置，`lastIndex=2`

5. 完成新集合中所有节点diff后，对旧集合进行循环遍历，寻找新集合中不存在但就集合中的节点(此例中为D)，删除D节点。

# React16 Diff算法

React 以前的 Diff 算法就是基于树的，现在则整体的数据结构从树改为了链表结构，链表的每一个节点是 Fiber

React16 的 diff 策略采用从链表头部开始比较的算法，是层次遍历，算法是建立在一个节点的插入、删除、移动等操作都是在节点树的同一层级中进行的

对于 Diff， 新老节点的对比，我们以新节点为标准，然后来构建整个 currentInWorkProgress，对于新的 children 会有四种情况

- TextNode(包含字符串和数字)

- 单个 React Element(通过该节点是否有 $$typeof 区分)

- 数组

- 可迭代的 children，跟数组的处理方式差不多

## children diff

子节点的 diff 逻辑主要在 `reconcileChildrenArray(returnFiber, currentFirstChild, newChildren, expirationTime)` 方法，参数表示：

- returnFiber：当前子节点对象的父节点

- currentFirstChild：旧节点

- newChildren：新节点

- expirationTime：过期时间（这里不讨论这个）

`reconcileChildrenArray` 对子节点的 diff 主要是通过四步进行处理

**一、颜色对新旧相同位置(index)进行比较**

```js
  for (; oldFiber !== null && newIdx < newChildren.length; newIdx++) {
   // 一次遍历是对新旧节点相关位置的比较
   // // nextOldFiber 保存下一次遍历要对比的旧节点
    if (oldFiber.index > newIdx) {  
      nextOldFiber = oldFiber;
      oldFiber = null;
    } else {
      nextOldFiber = oldFiber.sibling;
    }
    // 返回复用的节点，如果没有可以复用的就返回新创建的节点
    var newFiber = updateSlot(returnFiber, oldFiber, newChildren[newIdx], expirationTime);
    if (newFiber === null) { // 如果 newFiber 返回为null 跳出循环
      if (oldFiber === null) {
        oldFiber = nextOldFiber;
      }
      break;
    }

    if (shouldTrackSideEffects) {
      if (oldFiber && newFiber.alternate === null) { // 没有fiber
        deleteChild(returnFiber, oldFiber); // 移除旧节点
      }
    }
    lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx); // 更新 lastPlacedIndex
   // 组成当前链
    if (previousNewFiber === null) {
      resultingFirstChild = newFiber;
    } else {
      previousNewFiber.sibling = newFiber;
    }
    previousNewFiber = newFiber;
    oldFiber = nextOldFiber; // 指向下一个 旧节点
  }
```

**新节点已经遍历完毕**

```js
if (newIdx === newChildren.length) {
  // 新的 children 长度已经够了，所以把剩下的删除掉
  deleteRemainingChildren(returnFiber, oldFiber);
  return resultingFirstChild;
}
// deleteRemainingChildren
function deleteRemainingChildren(returnFiber, currentFirstChild) {
  if (!shouldTrackSideEffects) {
    // Noop.
    return null;
  } 
  var childToDelete = currentFirstChild;

  while (childToDelete !== null) {
    deleteChild(returnFiber, childToDelete);
    childToDelete = childToDelete.sibling;
  }

  return null;
}
```

`returnFiber` 表示当前节点的父节点，`oldFiber` 表示要删除的节点，可以看到 `deleteRemainingChildren` 内部使用 `while` 循环删除所有的 `oldFiber` 节点

**老节点已经遍历完毕后还存在新节点**

```js
  if (oldFiber === null) {
    for (; newIdx < newChildren.length; newIdx++) {
      var _newFiber = createChild(returnFiber, newChildren[newIdx], expirationTime);
      if (_newFiber === null) {
        continue;
      }
      lastPlacedIndex = placeChild(_newFiber, lastPlacedIndex, newIdx);
      if (previousNewFiber === null) { // 创建一个链
        resultingFirstChild = _newFiber;
      } else {
        previousNewFiber.sibling = _newFiber; // 往这个链添加一个子节点
      }
      previousNewFiber = _newFiber; // 更改当前链的位置
    }
    return resultingFirstChild;
  }
```

如果旧节点遍历完，还存在新节点，则遍历剩余新节点通过 `createChild` 创建新节点，并添加到当前链当中

**移动可复用的节点**

```js
  var existingChildren = mapRemainingChildren(returnFiber, oldFiber); // 创建 Map{key: fiber}，通过 key与 fiber映射在一起

  for (; newIdx < newChildren.length; newIdx++) {
    var _newFiber2 = updateFromMap(existingChildren, returnFiber, newIdx, newChildren[newIdx], expirationTime);

    if (_newFiber2 !== null) {
      if (shouldTrackSideEffects) {
        if (_newFiber2.alternate !== null) {
          // 移除已经复用的 map 值 
          existingChildren.delete(_newFiber2.key === null ? newIdx : _newFiber2.key);
        }
      }
      lastPlacedIndex = placeChild(_newFiber2, lastPlacedIndex, newIdx);
      if (previousNewFiber === null) {
        resultingFirstChild = _newFiber2;
      } else {
        previousNewFiber.sibling = _newFiber2;
      }
      previousNewFiber = _newFiber2;
    }
  }
  if (shouldTrackSideEffects) {
    // 还有剩余的旧节点，则遍历他们进行移除
    existingChildren.forEach(function (child) {
      return deleteChild(returnFiber, child);
    });
  }
  return resultingFirstChild;
```

1. 这一步首先是通过 `mapRemainingChildren` 遍历旧节点，觉得 `{key: fiber}` 的 `map` 结果

2. 遍历剩余新节点执行 `updateFromMap`， `updateFromMap` 的有以下几种情况 

   1. 如果当前新节点只是数字或者字符串，则通过 `updateTextNode` 创建新的文本节点
   
   2. 如果当新节点是对象且 `$$typeof===REACT_ELEMENT_TYPE` (表示是 `ReactElement` 创建的类型)，则尝试通过 `key` 在 `mapRemainingChildren` 找出复用的节点，没有重新创建
   
   3. 不有其它特殊情况暂时先忽略
   
3. 如果在 `mapRemainingChildren` 中得到了可得用的节点，则移除当前 `key` 的映射

4. 如果遍历完之后 `mapRemainingChildren` 还有剩余的旧节点，则遍历他们进行移除

https://cloud.tencent.com/developer/article/1477707