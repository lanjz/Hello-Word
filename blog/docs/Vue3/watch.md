# watch

通过简单的 `watch` 使用粟子来走下源码:

```js
  data() {
    return {
      counter: [1,2,3]
    }
  },
  watch: {
    counter: function (val){
      console.log('watch', val)
    }
  },
```

3.0 处理 `watch` 属性的位置：

源码追踪： `mountComponent(n2, container) => setupComponent(instance) => setupStatefulComponent() => finishComponentSetup(instance) => applyOptions(instance, Component)`

`applyOptions` 方法有以下语句：

```js
if (watchOptions) {
  deferredWatch.push(watchOptions);
}
if (!asMixin && deferredWatch.length) {
  deferredWatch.forEach(watchOptions => {
    for (const key in watchOptions) {
      createWatcher(watchOptions[key], ctx, publicThis, key);
    }
  });
}
```

遍历 `watch` 配置，执行 `createWatcher(watchOptions[key], ctx, publicThis, key)`
```js
/**
* raw: watch 处理配置
* ctx: 上下文即当前组件 this
* publicThis: 当前组件代理结果，即 this.data
* key: 监听属性
*/
  function createWatcher(raw, ctx, publicThis, key) {
    // getter 是一个方法，返回监听属性的值
    const getter = key.includes('.')
      ? createPathGetter(publicThis, key)
      : () => publicThis[key];
    // raw 表示监听对象对应 handler
    if (isString(raw)) {
      // 如果是字符串，则从当前 `this` 中存找这个方法
      const handler = ctx[raw];
      if (isFunction(handler)) {
        watch(getter, handler);
      }
      else {
        warn(`Invalid watch handler specified by key "${raw}"`, handler);
      }
    }
    // 如果是值定义了函数，调用 watch, watch 实质执行的是 doWatch(source, cb, options)
    else if (isFunction(raw)) {
      watch(getter, raw.bind(publicThis));
    }
    // 下是 watch 是对象形式时的处理方法，先略
    else if (isObject(raw)) {
      if (isArray(raw)) {
        raw.forEach(r => createWatcher(r, ctx, publicThis, key));
      }
      else {
        const handler = isFunction(raw.handler)
          ? raw.handler.bind(publicThis)
          : ctx[raw.handler];
        if (isFunction(handler)) {
          watch(getter, handler, raw);
        }
        else {
          warn(`Invalid watch handler specified by key "${raw.handler}"`, handler);
        }
      }
    }
    else {
      warn(`Invalid watch option: "${key}"`, raw);
    }
  } 
```

```js
/**
* @params {Function} source : 上文中的 getter 方法，返回 监听对象的值
* @params {cb} source : watch 属性对应的 handler
**/

  function doWatch(source, cb, { immediate, deep, flush, onTrack, onTrigger } = EMPTY_OBJ, instance = currentInstance) {
    let getter; // 声明一个 getter 用于获取 watch key 的值
    let forceTrigger = false;
    if (isRef(source)) {
     // 略
    }
    else if (isFunction(source)) {// 当前例子将执行以下代码分支
      if (cb) {
        // 给 getter 赋值
        // callWithErrorHandling 的作用就是执行 source 方法
        getter = () => callWithErrorHandling(source, instance, 2 /* WATCH_GETTER */);
      }
    }
    // job的作用是执行 watch handler的
    const job = () => {
      if (!runner.active) {
        return;
      }
      if (cb) {
        // runner 上 effect
        const newValue = runner();
        if (deep || forceTrigger || hasChanged(newValue, oldValue)) {
          // cleanup before running cb again
          if (cleanup) {
            cleanup();
          }
           // 执行 watch handler
          callWithAsyncErrorHandling(cb, instance, 3 /* WATCH_CALLBACK */, [
            newValue,
            // pass undefined as the old value when it's changed for the first time
            oldValue === INITIAL_WATCHER_VALUE ? undefined : oldValue,
            onInvalidate
          ]);
          oldValue = newValue;
        }
      }
      else {
        // watchEffect
        runner();
      }
    };
    // scheduler 在将保存在 effech.options属性中
    // scheduler 作用是将当前 job(watch handler) 添加到微任务队列中
    let scheduler; 
      scheduler = () => {
        if (!instance || instance.isMounted) {
          queuePreFlushCb(job);
        }
        else {
          // with 'pre' option, the first call must happen before
          // the component is mounted so it is called synchronously.
          job();
        }
      };
    // 创建一个 effect
    const runner = effect(getter, {
      lazy: true,
      onTrack,
      onTrigger,
      scheduler
    });
    // 执行上面创建的 effetch
    if (cb) {
      // 如果有 `immediate` ，则马上执行一个 job(), 即 watch handler
      if (immediate) {
        job();
      }
      else {
        // 否则走这里，当前例子走这里
        // 执行一次 effect 依赖属性收集这个 `effect`
        oldValue = runner();
      }
    }
    return () => {
      stop(runner);
      if (instance) {
        remove(instance.effects, runner);
      }
    };
  }
```

### 重温 effect

```js
  function effect(fn, options = EMPTY_OBJ) {
    if (isEffect(fn)) {
      fn = fn.raw;
    }
    const effect = createReactiveEffect(fn, options);
    if (!options.lazy) {
      effect();
    }
    return effect;
  }

 // createReactiveEffect
  function createReactiveEffect(fn, options) {
    const effect = function reactiveEffect() {
      if (!effect.active) {
        return options.scheduler ? undefined : fn();
      }
      if (!effectStack.includes(effect)) {
        cleanup(effect);
        try {
          enableTracking();
          effectStack.push(effect);
          activeEffect = effect;
          return fn();
        }
        finally {
          effectStack.pop();
          resetTracking();
          activeEffect = effectStack[effectStack.length - 1];
        }
      }
    };
    effect.id = uid++;
    effect.allowRecurse = !!options.allowRecurse;
    effect._isEffect = true;
    effect.active = true;
    effect.raw = fn;
    effect.deps = [];
    effect.options = options;
    return effect;
  }
```

执行 `effect` 接收的参数：

- fn： `effect` 回调，对于 `渲染 effect` ，这个回调是渲染组件，对于 `watch effect`,这个回调是获取 `watch` 属性值的方法

- options: 配置项，重点是其中的一个 `scheduler` 属性，`scheduler` 就是当前 `effect` 要执行 `job` 添加到微任务队列中

  对于 `渲染 effect` ，这个 `job` 是渲染组件，对于 `watch effect`,这个 `job` 是 `watch` 属性对应的 `hanler`

每次执行 `effect` 的时候返回 `createReactiveEffect()` 方法的回调

再次执行 `回调 effect`的时候，则会将这个 `回调 effect` 保存到全局，供当前依赖的属性收集

当有属性更新时，就会执行收集的 `effect` 中的 `scheduler` 方法，添加要执行 `job` 到微任务队列中

## 小结

`watch` 监听的原理

处理 `watch` 时，会声明三个重要的属性：

- 声明一个 `getter` 方法用于读取 `watch 属性` 的值

- 声明一个 `job` 方法用于执行 `watch handler`

- 声明一个 `scheduler` 用于将 `job` 添加到微任务队列

监听流程：

- 上面三个属性准备好后，生成 `effect` 事件，`scheduler` 包含在 `effect.options` 中

- 执行 `effect` 事件，将当前 `effect` 保存到全局，供当前依赖的属性收集

- 接着上一步之后 `effect` 结尾处会执行 `getter` 方法

- 通过 `getter` 方法访问响度式属性，收集保存在全局环境中的 `effect`, 至此完成依赖属性的收集工作 

- 依赖属性更改，执行收到的 `effect.options.scheduler`，将 `job` 添加到微任务队列 

- 清理微任务时，执行 `job` 也就是 `watch handler`


