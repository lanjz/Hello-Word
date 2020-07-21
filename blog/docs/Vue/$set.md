# $set

用法: `Vue.set( target, propertyName/index, value )`

参数说明：

- `{Object | Array} target`

- `{string | number} propertyName/index`

- `{any} value`

返回值：设置的值

向响应式对象中添加一个 `property`，并确保这个新 `property` 同样是响应式的，且触发视图更新。它必须用于向响应式对象上添加新 `property`，因为 Vue 无法探测普通的新增 `property` (比如 `this.myObject.newProperty = 'hi'`)

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