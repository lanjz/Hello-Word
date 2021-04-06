# 粗读响应式API

## reactive

在使用 Vue 时，正常来说只有在 `data` 中的属性是响应式，如果希望在后期添加可响应的元素就可以通过 `reactive` 方法，粟子

```js
  created() {
    this.info = Vue.reactive({
      name: 'lanjz'
    })
  },
```

如果组件有用到 `this.info`，当 `this.info` 改变时，组件中使用到的地方也跟着更新

### 源码定义

```js
function reactive(target) {
  // 如果是已经设置过只读的对象，则略过
  if (target && target["__v_isReadonly" /* IS_READONLY */]) {
    return target;
  }
  return createReactiveObject(target, false, mutableHandlers, mutableCollectionHandlers);
}

function createReactiveObject(target, isReadonly, baseHandlers, collectionHandlers) {
  // targe 必需是对象
  if (!isObject(target)) {
    {
      console.warn(`value cannot be made reactive: ${String(target)}`);
    }
    return target;
  }
  // target 已经是个被代理对象，则直接返回
  if (target["__v_raw" /* RAW */] &&
    !(isReadonly && target["__v_isReactive" /* IS_REACTIVE */])) {
    return target;
  }
  // 根据是否只读使用 readonlyMap或reactiveMap 存储当前对象
  const proxyMap = isReadonly ? readonlyMap : reactiveMap;
  // 已经保存过则直接返回
  const existingProxy = proxyMap.get(target);
  if (existingProxy) {
    return existingProxy;
  }
  // 对于不可扩展的，获者是已经被标志不可用的对象，则略过
  const targetType = getTargetType(target);
  if (targetType === 0 /* INVALID */) {
    return target;
  }
  // 设置代理
  const proxy = new Proxy(target, targetType === 2 /* COLLECTION */ ? collectionHandlers : baseHandlers);
  proxyMap.set(target, proxy);
  return proxy;
}
```

核心还是最后的 `Proxy` 代理的使用，看下这个代理具体配置了啥

**get**

```js
// get
function createGetter(isReadonly = false, shallow = false) {
  return function get(target, key, receiver) {
    if (key === "__v_isReactive" /* IS_REACTIVE */) {
      return !isReadonly;
    }
    else if (key === "__v_isReadonly" /* IS_READONLY */) {
      return isReadonly;
    }
    else if (key === "__v_raw" /* RAW */ &&
      receiver === (isReadonly ? readonlyMap : reactiveMap).get(target)) {
      return target;
    }
    const targetIsArray = isArray(target);
    if (!isReadonly && targetIsArray && hasOwn(arrayInstrumentations, key)) {
      return Reflect.get(arrayInstrumentations, key, receiver);
    }
    const res = Reflect.get(target, key, receiver);
    if (isSymbol(key)
      ? builtInSymbols.has(key)
      : key === `__proto__` || key === `__v_isRef`) {
      return res;
    }
    if (!isReadonly) {
      track(target, "get" /* GET */, key);
    }
    if (shallow) {
      return res;
    }
    if (isRef(res)) {
      // ref unwrapping - does not apply for Array + integer key.
      const shouldUnwrap = !targetIsArray || !isIntegerKey(key);
      return shouldUnwrap ? res.value : res;
    }
    if (isObject(res)) {
      // Convert returned value into a proxy as well. we do the isObject check
      // here to avoid invalid value warning. Also need to lazy access readonly
      // and reactive here to avoid circular dependency.
      return isReadonly ? readonly(res) : reactive(res);
    }
    return res;
  };
}
```

先看下几个自定义属性的意思：

- __v_isReadonly: 是否是已读的

- __v_raw：属性是否响应式的

- __v_isReactive： !isReadonly

之后分别判断对象是数组类型和 Symbol 类型分别走不同的分支

之后执行`track(target, "get" /* GET */, key)` 给当前属性收集事件

`shallow` 应该是表示是否要进一步处理得到的值？

`isRef(res)` 是否有属性 `__v_isRef`，表示是否是使用 `refs` 创建的对象

如果得到值是对象的话，继续调用 `reactive` 处理这个对象

总得来说， `get` 重点主要还是收集依赖的作用

**set**

```js
function createSetter(shallow = false) {
  return function set(target, key, value, receiver) {
    const oldValue = target[key];
    if (!shallow) {
      value = toRaw(value);
      if (!isArray(target) && isRef(oldValue) && !isRef(value)) {
        oldValue.value = value;
        return true;
      }
    }
    // 设置是否是已存在的属性
    const hadKey = isArray(target) && isIntegerKey(key)
      ? Number(key) < target.length
      : hasOwn(target, key);
    const result = Reflect.set(target, key, value, receiver);
    // don't trigger if target is something up in the prototype chain of original
    if (target === toRaw(receiver)) {
      if (!hadKey) {
        trigger(target, "add" /* ADD */, key, value);
      }
      else if (hasChanged(value, oldValue)) {
        trigger(target, "set" /* SET */, key, value, oldValue);
      }
    }
    return result;
  };
}
```

`set` 被触发时通过 `trigger` 去执行收集的事件

## refs

`ref` 和 `reactive` 一样, 也是用来实现响应式数据的方法

**作用？**

由于 `reactive` 必须传递一个对象, 所以导致在企业开发中，如果我们只想让某个变量实现响应式的时候会非常麻烦 ，所以Vue3就给我们提供了 `ref` 方法, 为非对象的基础数据类型创建响应性

### ref

接受一个内部值并返回一个响应式且可变的 ref 对象。ref 对象具有指向内部值的单个 `property .value`

源码定义：

```js
 function ref(value) {
    return createRef(value);
  }
function createRef(rawValue, shallow = false) {
  if (isRef(rawValue)) {
    return rawValue;
  }
  return new RefImpl(rawValue, shallow);
}

class RefImpl {
  constructor(_rawValue, _shallow = false) {
    this._rawValue = _rawValue; // 保存值
    this._shallow = _shallow;  // 是否深层处理
    this.__v_isRef = true; // 设置 ref 标识
    this._value = _shallow ? _rawValue : convert(_rawValue); // 添加代理
  }
  get value() {
    track(toRaw(this), "get" /* GET */, 'value');
    return this._value;
  }
  set value(newVal) {
    if (hasChanged(toRaw(newVal), this._rawValue)) {
      this._rawValue = newVal;
      this._value = this._shallow ? newVal : convert(newVal);
      trigger(toRaw(this), "set" /* SET */, 'value', newVal);
    }
  }
}
```

当调用 `ref` 实际是生成了一个 `RefImpl` 实例，并且对外定义了 `value` 属性，当 `set` 和 `get` 时，分别也会调用对应用 `trigger` 发布事件和 `track` 收集事件

### unref

如果参数为 ref，则返回内部值，否则返回参数本身。这是 `val = isRef(val) ? val.value : val`

源码定义：

```js
  function unref(ref) {
    return isRef(ref) ? ref.value : ref;
  }
```

### toRef

可以用来为源响应式对象上的 property 性创建一个 ref。然后可以将 ref 传递出去，从而保持对其源 property 的响应式连接

源码：

```js
function toRef(object, key) {
    return isRef(object[key])
      ? object[key]
      : new ObjectRefImpl(object, key);
  }
// ObjectRefImpl
  class ObjectRefImpl {
    constructor(_object, _key) {
      this._object = _object;
      this._key = _key;
      this.__v_isRef = true;
    }
    get value() {
      return this._object[this._key];
    }
    set value(newVal) {
      this._object[this._key] = newVal;
    }
  }
```

如果已经是 ref 对象则直接返回，否则调用 `ObjectRefImpl` 生成一个 ref，跟 `RefImpl` 相比少了在 `get/set` 方法触发了少了主动触发收集事件和派发事件的操作，因为 `toRef` 的对象本身就是响应式对象了

### toRefs

将响应式对象转换为普通对象，其中结果对象的每个 property 都是指向原始对象相应 property 的ref。

源码：

```js
function toRefs(object) {
    if ( !isProxy(object)) {
      console.warn(`toRefs() expects a reactive object but received a plain one.`);
    }
    const ret = isArray(object) ? new Array(object.length) : {};
    for (const key in object) {
      ret[key] = toRef(object, key);
    }
    return ret;
  }
```

先判断 `object` 是否被代理的，之后遍历属性调用 `toRef` ，将每个属性变成 `ref 对象`

## 总结

`refs` 本质:

- `ref` 底层的本质其实还是 `reactive` 
  
  `ref(xx) -> reactive({value:xx})`
  
使用 `ref` 注意点:

- 在Vue中使用 `ref` 的值不用通过 `value` 获取
  
- 在JS中使用 `ref` 的值必须通过 `value` 获取

换汤不换药～
