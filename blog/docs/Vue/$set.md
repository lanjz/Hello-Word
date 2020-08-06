# $set

用法: `Vue.set( target, propertyName/index, value )`

参数说明：

- `{Object | Array} target`

- `{string | number} propertyName/index`

- `{any} value`

返回值：设置的值

向响应式对象中添加一个 `property`，并确保这个新 `property` 同样是响应式的，且触发视图更新。它必须用于向响应式对象上添加新 `property`，因为 Vue 无法探测普通的新增 `property` (比如 `this.myObject.newProperty = 'hi'`)

`set` 方法在源码中的定义：

```js
  /**
   * 设置对象的属性。添加新属性如果属性不存在
   */
  function set (target, key, val) {
    if (isUndef(target) || isPrimitive(target)
    ) {
      warn(("Cannot set reactive property on undefined, null, or primitive value: " + ((target))));
    }
    if (Array.isArray(target) && isValidArrayIndex(key)) {
      target.length = Math.max(target.length, key);
      target.splice(key, 1, val);
      return val
    }
    if (key in target && !(key in Object.prototype)) {
      target[key] = val;
      return val
    }
    var ob = (target).__ob__;
    if (target._isVue || (ob && ob.vmCount)) {
      warn(
        'Avoid adding reactive properties to a Vue instance or its root $data ' +
        'at runtime - declare it upfront in the data option.'
      );
      return val
    }
    if (!ob) {
      target[key] = val;
      return val
    }
    defineReactive$$1(ob.value, key, val);
    ob.dep.notify();
    return val
  }
```

分析分析

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