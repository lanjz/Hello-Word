# Diff 优化

之前了解了下 Vue3 升级目的，发现有介绍到 Vue3 在 Diff 方面做了优化，所以整理一下 Vue3 Diff 方面做的改进

Diff 从 `patch` 开始：

```js
const patch = (n1, n2, container, anchor = null, parentComponent = null, parentSuspense = null, isSVG = false, optimized = false) => {
  // patching & not same type, unmount old tree
  if (n1 && !isSameVNodeType(n1, n2)) {
    anchor = getNextHostNode(n1);
    unmount(n1, parentComponent, parentSuspense, true);
    n1 = null;
  }
  if (n2.patchFlag === -2 /* BAIL */) {
    optimized = false;
    n2.dynamicChildren = null;
  }
  const { type, ref, shapeFlag } = n2;
  switch (type) {
    case Text:
      processText(n1, n2, container, anchor);
      break;
    case Comment:
      processCommentNode(n1, n2, container, anchor);
      break;
    case Static:
      if (n1 == null) {
        mountStaticNode(n2, container, anchor, isSVG);
      }
      else {
        patchStaticNode(n1, n2, container, isSVG);
      }
      break;
    case Fragment:
      processFragment(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, optimized);
      break;
    default:
      if (shapeFlag & 1 /* ELEMENT */) {
        processElement(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, optimized);
      }
      else if (shapeFlag & 6 /* COMPONENT */) {
        processComponent(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, optimized);
      }
      else if (shapeFlag & 64 /* TELEPORT */) {
        type.process(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, optimized, internals);
      }
      else if ( shapeFlag & 128 /* SUSPENSE */) {
        type.process(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, optimized, internals);
      }
      else {
        warn('Invalid VNode type:', type, `(${typeof type})`);
      }
  }
  // set ref
  if (ref != null && parentComponent) {
    setRef(ref, n1 && n1.ref, parentSuspense, n2);
  }
};
```

根据上面代码可以看到根据 `type` 值的不同，执行不同的更新方法，一共内置了四个 `type`

```js
  const Fragment = Symbol( 'Fragment' ); // 具有动态节点的节点
  const Text = Symbol( 'Text' ); // 纯文本节点
  const Comment = Symbol( 'Comment' ); // 评论
  const Static = Symbol( 'Static' ); // 静态节点
```

对于给个节点 Vue3 通过 `shapeFlag` 做了更加详细的分类，这里大致了解一下：

```js
  const PatchFlagNames = {
    [1 /* TEXT */]: `TEXT`,  // 动态文本节点
    [2 /* CLASS */]: `CLASS`,  // 动态 class
    [4 /* STYLE */]: `STYLE`, // 动态 style
    [8 /* PROPS */]: `PROPS`,  // 动态属性，但不包含类名和样式，如果是组件，则可以包含类名和样式
    [16 /* FULL_PROPS */]: `FULL_PROPS`,  // 具有动态 key 属性，当 key 改变时，需要进行完整的 diff 比较
    [32 /* HYDRATE_EVENTS */]: `HYDRATE_EVENTS`,  // 带有监听事件的节点
    [64 /* STABLE_FRAGMENT */]: `STABLE_FRAGMENT`, // 一个不会改变子节点顺序的 fragment
    [128 /* KEYED_FRAGMENT */]: `KEYED_FRAGMENT`,  // 带有 key 属性的 fragment 或部分子字节有 key
    [256 /* UNKEYED_FRAGMENT */]: `UNKEYED_FRAGMENT`,  // 子节点没有 key 的 fragment
    [512 /* NEED_PATCH */]: `NEED_PATCH`, // 一个节点只会进行非 props 比较
    [1024 /* DYNAMIC_SLOTS */]: `DYNAMIC_SLOTS`, // 动态 slot
    [2048 /* DEV_ROOT_FRAGMENT */]: `DEV_ROOT_FRAGMENT`, 
    [-1 /* HOISTED */]: `HOISTED`, // 静态节点
    [-2 /* BAIL */]: `BAIL`   // 指示在 diff 过程应该要退出优化模式
  };
``` 



### 动态与静态节点

```js
const processFragment = (n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, optimized) => {
    if (patchFlag > 0 &&
      patchFlag & 64 /* STABLE_FRAGMENT */ &&
      dynamicChildren &&
      n1.dynamicChildren) {
       patchBlockChildren(n1.dynamicChildren, dynamicChildren, container, parentComponent, parentSuspense, isSVG);
      if ( parentComponent && parentComponent.type.__hmrId) {
        traverseStaticChildren(n1, n2);
      }
      else if (
        n2.key != null ||
        (parentComponent && n2 === parentComponent.subTree)) {
        traverseStaticChildren(n1, n2, true /* shallow */);
      }
}
```

从 `processFragment` 方法可以看到，符合判断语句后先执行 `traverseStaticChildren(n1, n2)` 处理动态节点，然后再执行 `traverseStaticChildren(n1, n2, true /* shallow */)` 

```html
<div id="counter">
    <h1>静态节点一：</h1> 
    Counter:
    <span v-for="item in counter" :key="item">{{item}}</span> <!--动态节点-->
    <h2>静态节点一：</h2>
    {{info}} <!--动态节点-->
</div>
```

当前例子动态节点是 `<span v-for="item in counter" :key="item">{item}</span>` 和 `{info} `，对于动态节点仍然会调用 `patch` 做进一步的比较

动态节点处理完之后，调用 `traverseStaticChildren` 处理静态节点，静态节点的处理则是将旧节点直接赋值给新节点，不需要做 `patch` 比较了

### 静态提升 hoistStatic

在 Vue2.0 中无论元素是否参与更新，每次都会重新创建，然后再渲染，下面的例子就是 2.0 生成的 `render` 方法

```js
with(this){return _c('div',{attrs:{"id":"app"}},[_c('h1',[_v("静态节点一：")]),_v("\n      Counter:\n      "),_l((counter),function(item){return _c('span',{key:item},[_v(_s(item))])}),_v(" "),_c('h2',[_v("静态节点一：")]),_v("\n      "+_s(info)+"\n  ")],2)}
```

静态节点为：

```js
_c('h1',[_v("静态节点一：")])
_v("\n      Counter:\n      ")
_c('h2',[_v("静态节点一：")])
```

这三个方法每次渲染时都会执行

而在 3.0 中使用了静态提升后，对于不参与更新的元素，只会被创建一次，在渲染时直接复用即可：

![](./static/diff-2.jpg)

### 事件侦听器缓存 cacheHandlers

默认情况下onClick会被视为动态绑定，所以每次都会去追踪它的变化，但是因为是同一个函数，所以没必要去追踪它的变化，想办法将它直接缓存起来复用就会提升性能

**默认**

![](./static/diff-4.jpg)

**开启cacheHandlers后**

![](./static/diff-3.jpg)

但是怎么开启的这个选项，怎么找不到地方也不懂
