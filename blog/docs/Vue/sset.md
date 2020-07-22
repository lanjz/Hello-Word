`set` 方法在源码中的定义：

```js
if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.length = Math.max(target.length, key);
    target.splice(key, 1, val);
    return val
}
```

如果目标是数组类型则直接调用 `splice` 方法，这里的 `splice` 不仅仅是调用原数组的 `splice` 的方法，因为 Vue 对于数组类型的值也定义了 `splice` 方法，在执行数组类型的 `splice` 方法时一方面会主动派发依赖的更新，一方面也会执行真正的数组的 `splice` 方法

```js
if (key in target && !(key in Object.prototype)) {
    target[key] = val;
    return val
}
```

如果这个 `key` 已经存在目标中，则直接修改改这个值

```js
var ob = (target).__ob__;
if (!ob) {
    target[key] = val;
    return val
}
defineReactive$$1(ob.value, key, val);
ob.dep.notify();
return val
```

对于对象的类型会做的几件事情：

1. 通过 `(target).__ob__` 获取这个属性的 `Dep` 实例，里面有这个属性收集依赖

2. `defineReactive$$1(ob.value, key, val)` 监听这个属性

3. `ob.dep.notify()` 派发更新，然后再渲染组件的时候，当前的 `Watcher` 会被这个属性收集