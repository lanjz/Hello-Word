## 在没有`key`的情况下，`diff`的速度会更快，前提是使用简单模板。

没有绑定`key`且在模板简单的情况下，会导致虚拟新旧节点对比更快，节点也会利用。而这种利用是**就地复用**，一种**鸭子辩型**的利用。
以下为简单的例子：

```
<div id="app">
    <div v-for="i in dataList">{{ i }}</div>
</div>
```

```
var vm = new Vue({
  el: '#app',
  data: {
    dataList: [1, 2, 3, 4, 5]
  }
})
```

以上的例子，v-for的内容会生成以下的dom节点数组，我们给每一个节点标记一个身份id：

```
 [
    '<div>1</div>', // id： A
    '<div>2</div>', // id:  B
    '<div>3</div>', // id:  C
    '<div>4</div>', // id:  D
    '<div>5</div>'  // id:  E
  ]
```

1. 改变dataList数据，进行数据位置替换，对比改变后的数据

  ```
  vm.dataList = [4, 1, 3, 5, 2] // 数据位置替换

 // 没有key的情况， 节点位置不变，但是节点innerText内容更新了
  [
    '<div>4</div>', // id： A
    '<div>1</div>', // id:  B
    '<div>3</div>', // id:  C
    '<div>5</div>', // id:  D
    '<div>2</div>'  // id:  E
  ]

  // 有key的情况，dom节点位置进行了交换，但是内容没有更新
  // <div v-for="i in dataList" :key='i'>{{ i }}</div>
  [
    '<div>4</div>', // id： D
    '<div>1</div>', // id:  A
    '<div>3</div>', // id:  C
    '<div>5</div>', // id:  E
    '<div>2</div>'  // id:  B
  ]
  ```

2. 增删dataList列表项

  ```

  // 1. 没有key的情况， 节点位置不变，内容也更新了
  [
    '<div>3</div>', // id： A
    '<div>4</div>', // id:  B
    '<div>5</div>', // id:  C
    '<div>6</div>', // id:  D
    '<div>7</div>'  // id:  E
  ]

  // 2. 有key的情况， 节点删除了 A, B 节点，新增了 F, G 节点
  // <div v-for="i in dataList" :key='i'>{{ i }}</div>
  [
    '<div>3</div>', // id： C
    '<div>4</div>', // id:  D
    '<div>5</div>', // id:  E
    '<div>6</div>', // id:  F
    '<div>7</div>'  // id:  G
  ]
  ```

从以上来看，不带有`key`，并且使用简单模板的情况下，可以更有效的利用节点，diff速度来看也是不带`key`更来的快速，因为带`key`在增删节点上有耗时。就这是vue文档所说的默认模式。但是这个并不是`key`的作用，而是没有`key`的情况下可以对节点**就地复用，提高性能**。

这处模式会带来一些隐藏的副作用，比如可能不会产生过渡动画，或者在某些节点有绑定数据（表单）状态，会
出现状态错位。VUE文件说了[ 这个默认的模式是高效的，但是只适用于不依赖子组件状态或临时 DOM 状态 (例如：表单输入值) 的列表渲染输出](https://cn.vuejs.org/v2/guide/list.html#%E7%BB%B4%E6%8A%A4%E7%8A%B6%E6%80%81)

## 但是key的作用是什么？

**`key`是给每一个vnode的唯一id,可以依靠key,更准确, 更快的拿到oldVnode中对应的vnode节点。**

在交叉对比中，当新节点跟旧节点头尾交叉对比没有结果时，会根据新节点的key去对比旧节点数组中的key，从而找到相应旧节点（这里对应的是一个key => index 的map映射）。如果没找到就认为是一个新增节点。而如果有key，那么就会采用遍历查找的方式去找到对应的旧节点。一种一个map映射，另一种是遍历查找。相比而言。map映射的速度更快。

vue部分源码如下：

```
// vue项目  src/core/vdom/patch.js  -488行
// 以下是为了阅读性进行格式化后的代码

// oldCh 是一个旧虚拟节点数组
if (isUndef(oldKeyToIdx)) {
  oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx)
}
if(isDef(newStartVnode.key)) {
  // map 方式获取
  idxInOld = oldKeyToIdx[newStartVnode.key]
} else {
  // 遍历方式获取
  idxInOld = findIdxInOld(newStartVnode, oldCh, oldStartIdx, oldEndIdx)
}
```

创建map函数

```
function createKeyToOldIdx (children, beginIdx, endIdx) {
  let i, key
  const map = {}
  for (i = beginIdx; i <= endIdx; ++i) {
    key = children[i].key
    if (isDef(key)) map[key] = i
  }
  return map
}

```

遍历寻找

```
// sameVnode 是对比新旧节点是否相同的函数
 function findIdxInOld (node, oldCh, start, end) {
    for (let i = start; i < end; i++) {
      const c = oldCh[i]
      
      if (isDef(c) && sameVnode(node, c)) return i
    }
  }
```



