# qiankun原理

之前大致了玩了下 qiankun 框架的使用，现在开始了解一下它的实现原理，但是稍微看了下源码后，发现源码太多回调了看得实现是晕，所以不细读源码了，直接带些问题去找下对应的实现原理

## 子应用加载过程

子应用路由激活时，将执行 `loadApp` 方法

```js
export async function loadApp<T extends ObjectType>(
  app: LoadableApp<T>,
  configuration: FrameworkConfiguration = {},
  lifeCycles?: FrameworkLifeCycles<T>,
): Promise<ParcelConfigObjectGetter> {
  // entry 子应用链接; name:app名字
  const { entry, name: appName } = app;
  const appInstanceId = `${appName}_${+new Date()}_${Math.floor(Math.random() * 1000)}`;
  const markName = `[qiankun] App ${appInstanceId} Loading`;
  const { singular = false, sandbox = true, excludeAssetFilter, ...importEntryOpts } = configuration;
  // 通过 importEntry 获取子应用内容
  // template 内容+样式; execScripts 要执行的js; assetPublicPath 子应用host
  const { template, execScripts, assetPublicPath } = await importEntry(entry, importEntryOpts);
  // 判断是否单例应用
  if (await validateSingularMode(singular, app)) { 
  	// 是的话等之有应用卸载后再加载当前应用
    await (prevAppUnmountedDeferred && prevAppUnmountedDeferred.promise);
  }
  // 添加一个div元素包装 子应用内容 
  const appContent = getDefaultTplWrapper(appInstanceId, appName)(template);
  const strictStyleIsolation = typeof sandbox === 'object' && !!sandbox.strictStyleIsolation;
  const scopedCSS = isEnableScopedCSS(sandbox);
  // 根据样式隔离配置，对子应用的样式做下处理
  let initialAppWrapperElement: HTMLElement | null = createElement(
    appContent,
    strictStyleIsolation,
    scopedCSS,
    appName,
  );
  const initialContainer = 'container' in app ? app.container : undefined;
  const legacyRender = 'render' in app ? app.render : undefined;
  // 开始将子应用内容添加到 DOM中
  const render = getRender(appName, appContent, legacyRender);

  // 第一次加载设置应用可见区域 dom 结构
  // 确保每次应用加载前容器 dom 结构已经设置完毕
  render({ element: initialAppWrapperElement, loading: true, container: initialContainer }, 'loading');

  const initialAppWrapperGetter = getAppWrapperGetter(
    appName,
    appInstanceId,
    !!legacyRender,
    strictStyleIsolation,
    scopedCSS,
    () => initialAppWrapperElement,
  );
  let global = window;
  let mountSandbox = () => Promise.resolve();
  let unmountSandbox = () => Promise.resolve();
  const useLooseSandbox = typeof sandbox === 'object' && !!sandbox.loose;
  let sandboxContainer;
  if (sandbox) {
    // 创建JS运行环境沙箱
    sandboxContainer = createSandboxContainer(
      appName,
      // FIXME should use a strict sandbox logic while remount, see https://github.com/umijs/qiankun/issues/518
      initialAppWrapperGetter,
      scopedCSS,
      useLooseSandbox,
      excludeAssetFilter,
    );
    // 用沙箱的代理对象作为接下来使用的全局对象
    global = sandboxContainer.instance.proxy as typeof window;
    mountSandbox = sandboxContainer.mount;
    unmountSandbox = sandboxContainer.unmount;
  }
  // 获取钩子
  const { beforeUnmount = [], afterUnmount = [], afterMount = [], beforeMount = [], beforeLoad = [] } = mergeWith(
    {},
    getAddOns(global, assetPublicPath),
    lifeCycles,
    (v1, v2) => concat(v1 ?? [], v2 ?? []),
  );
  // 执行 beforeLoad 钩子
  await execHooksChain(toArray(beforeLoad), app, global);

  // get the lifecycle hooks from module exports
  // 执行子应用JS代码
  const scriptExports: any = await execScripts(global, !useLooseSandbox);
  // 获取钩子
  const { bootstrap, mount, unmount, update } = getLifecyclesFromExports(
    scriptExports,
    appName,
    global,
    sandboxContainer?.instance?.latestSetProp,
  );
  // 通信配置
  const {
    onGlobalStateChange,
    setGlobalState,
    offGlobalStateChange,
  }: Record<string, CallableFunction> = getMicroAppStateActions(appInstanceId);

  // FIXME temporary way
  const syncAppWrapperElement2Sandbox = (element: HTMLElement | null) => (initialAppWrapperElement = element);
  const parcelConfigGetter: ParcelConfigObjectGetter = (remountContainer = initialContainer) => {
    let appWrapperElement: HTMLElement | null = initialAppWrapperElement;
    const appWrapperGetter = getAppWrapperGetter(
      appName,
      appInstanceId,
      !!legacyRender,
      strictStyleIsolation,
      scopedCSS,
      () => appWrapperElement,
    );
    const parcelConfig: ParcelConfigObject = {
      name: appInstanceId,
      bootstrap,
      mount: [
      ],
      unmount: [
      ],
    };

    if (typeof update === 'function') {
      parcelConfig.update = update;
    }
    return parcelConfig;
  };
  return parcelConfigGetter;
}

```

直接挑几个重点部分看一下

**加载子应用内容**

```js
 const { template, execScripts, assetPublicPath } = await importEntry(entry, importEntryOpts);
```

通过 `importEntry` 是 `import-html-entry` 库提供的方法，用于加载子应用的资源，关于 `import-html-entry` 会有单独的一单来讲解，这里先大致介绍下 `importEntry` 返回的三个属性的意思：

- `embedHTML`： html 内容，如果包含 `link` 样式资源的标签，将会把这些样式转换成内联样式直接包含在 html 内容中

- `assetPublicPath`: 子应用加载域名

- `execScripts`: 执行JS代码的方法，如果执行的JS是入口文件的话，返回最后一个设置的全局变量，这个所谓的最后一个设置的全局变量在这里指的就是我们在子应用导出的 `bootstrap`、 `mount` 、 `unmount` 三个方法

**go on**

 ```js
  if (await validateSingularMode(singular, app)) {
    await (prevAppUnmountedDeferred && prevAppUnmountedDeferred.promise);
  }
```

判断是否是单例应用，是单例应用的话则等到之前的应用卸载完成后再继续往下走

**包装子应用内容**

```js
const appContent = getDefaultTplWrapper(appInstanceId, appName)(template);
// getDefaultTplWrapper
export function getDefaultTplWrapper(id: string, name: string) {
  return (tpl: string) => `<div id="${getWrapperId(id)}" data-name="${name}">${tpl}</div>`;
}
```

使用 `getDefaultTplWrapper` 给 `importEntry` 返回的 `template` 内容包一层 `div`，这个 `div` 包含一些 `qiankun` 定义的标志属性

**样式隔离**

```js
  const strictStyleIsolation = typeof sandbox === 'object' && !!sandbox.strictStyleIsolation;
  const scopedCSS = isEnableScopedCSS(sandbox);
  let initialAppWrapperElement: HTMLElement | null = createElement(
    appContent,
    strictStyleIsolation,
    scopedCSS,
    appName,
  );
```

先是获取样式隔离规则，调用 `createElement` 方法根据规则处理当前页面内容，样式隔离的实现大体分两种 `strictStyleIsolation` 和 `scopedCSS`

- strictStyleIsolation：每个微应用的容器包裹上一个 shadow dom 节点

- scopedCSS：qiankun 会改写子应用所添加的样式为所有样式规则增加一个特殊的选择器规则来限定其影响范围

**挂载子应用内容**

```js
const initialContainer = 'container' in app ? app.container : undefined;
const legacyRender = 'render' in app ? app.render : undefined;
const render = getRender(appName, appContent, legacyRender);
render({ element: initialAppWrapperElement, loading: true, container: initialContainer }, 'loading');
// getRender
function getRender(appName: string, appContent: string, legacyRender?: HTMLContentRender) {
  const render: ElementRender = ({ element, loading, container }, phase) => {
    if (legacyRender) {
      return legacyRender({ loading, appContent: element ? appContent : '' });
    }
    const containerElement = getContainer(container!);
    if (phase !== 'unmounted') {
      const errorMsg = (() => {
        switch (phase) {
          case 'loading':
          case 'mounting':
            return `[qiankun] Target container with ${container} not existed while ${appName} ${phase}!`;
          case 'mounted':
            return `[qiankun] Target container with ${container} not existed after ${appName} ${phase}!`;

          default:
            return `[qiankun] Target container with ${container} not existed while ${appName} rendering!`;
        }
      })();
      assertElementExist(containerElement, errorMsg);
    }
    if (containerElement && !containerElement.contains(element)) {
      // clear the container
      while (containerElement!.firstChild) {
        rawRemoveChild.call(containerElement, containerElement!.firstChild);
      }
      // append the element to container if it exist
      if (element) {
        rawAppendChild.call(containerElement, element);
      }
    }
    return undefined;
  };
  return render;
}
```

调用 `getRender` 获取 `render` 方法并执行

` getContainer(container)` 获取子应用要挂载的 DOM 元素，如果挂载 DOM 元素有内容则清空内容，之后就是将我们的子应用添加到挂载 DOM 中去，这一步正常的话容器中将出现我们子应用内容了，但还没有运行子应用中的JS代码

**创建子应用运行环境沙箱**

```js
  let global = window;
  let mountSandbox = () => Promise.resolve();
  let unmountSandbox = () => Promise.resolve();
  const useLooseSandbox = typeof sandbox === 'object' && !!sandbox.loose;
  let sandboxContainer;
  if (sandbox) {
    sandboxContainer = createSandboxContainer(
      appName,
      // FIXME should use a strict sandbox logic while remount, see https://github.com/umijs/qiankun/issues/518
      initialAppWrapperGetter,
      scopedCSS,
      useLooseSandbox,
      excludeAssetFilter,
    );
    // 用沙箱的代理对象作为接下来使用的全局对象
    global = sandboxContainer.instance.proxy as typeof window;
    mountSandbox = sandboxContainer.mount;
    unmountSandbox = sandboxContainer.unmount;
  }
```

沙箱的作用就是保证子应用之间状态能独立运行，不会造成全局污染和相互影响，上面代码通过 `createSandboxContainer` 方法创建一个沙箱，这里返回的 `sandboxContainer` 对象将包含一个 `proxy` 的属性，这个 `sandboxContainer.instance.proxy` 将是子应用的全局运行的环境，也就是子应用的对于全局环境 `window` 的任何操作，也被代理到这个 `proxy` 对象上，以此来达到环境隔离的作用。具体沙箱的实现方式下文再细讲，这里先继续往下走

除了代理全局对象外 `sandboxContainer` 还暴露出来 `mount`，`unmount` 方法，等执行到这里再看他们的作用

**执行beforeLoad钩子函数**

```js
  const { beforeUnmount = [], afterUnmount = [], afterMount = [], beforeMount = [], beforeLoad = [] } = mergeWith(
    {},
    getAddOns(global, assetPublicPath),
    lifeCycles,
    (v1, v2) => concat(v1 ?? [], v2 ?? []),
  );

  await execHooksChain(toArray(beforeLoad), app, global);
```

取出要执行的 `beforeLoad` 钩子方法，以下找到的要执行的钩子的定义：

```js
// addons/engineFlag
export default function getAddOn(global: Window): FrameworkLifeCycles<any> {
  return {
    async beforeLoad() {
      global.__POWERED_BY_QIANKUN__ = true;
    },
    async beforeMount() {
      global.__POWERED_BY_QIANKUN__ = true;
    },
    async beforeUnmount() {
      delete global.__POWERED_BY_QIANKUN__;
    },
  };
}
export default function getAddOn(global: Window, publicPath = '/'): FrameworkLifeCycles<any> {
  let hasMountedOnce = false;
  return {
    async beforeLoad() {
      global.__INJECTED_PUBLIC_PATH_BY_QIANKUN__ = publicPath;
    },
    async beforeMount() {
      if (hasMountedOnce) {
        global.__INJECTED_PUBLIC_PATH_BY_QIANKUN__ = publicPath;
      }
    },
    async beforeUnmount() {
      if (rawPublicPath === undefined) {
        delete global.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
      } else {
        global.__INJECTED_PUBLIC_PATH_BY_QIANKUN__ = rawPublicPath;
      }
      hasMountedOnce = true;
    },
  };
}
// 最后是我们使用 registerMicroApps 定义的钩子 
registerMicroApps(apps, {
  beforeLoad: (app) => {
    console.log("before load", app.name);
    return Promise.resolve();
  },
});
```

先执行 `beforeLoad` 钩子, 从上面贴出的代码可以看到内置 `beforeLoad` 钩子作用就是设置几个全局变量：

-  `global.__POWERED_BY_QIANKUN__ = true`，给子应用全局环境设置当前是微应用启动的标识

-  `global.__INJECTED_PUBLIC_PATH_BY_QIANKUN__ = publicPath`，标识当前子应用启动的根路径

最后将执行我们设置的钩子

**执行子应用中的JS**

```js
const scriptExports: any = await execScripts(global, !useLooseSandbox);
// get the lifecycle hooks from module exports
const scriptExports: any = await execScripts(global, !useLooseSandbox);
const { bootstrap, mount, unmount, update } = getLifecyclesFromExports(
  scriptExports,
  appName,
  global,
  sandboxContainer?.instance?.latestSetProp,
);
```

上文有介绍到 `execScripts` 是执行子应用JS代码的方法，它接收的第一个参数就是 `global`，传入这个 `global` 后，子应用的运行将以 `global` 作为全局变量，这一步的实现就是类似下面的这段Demo

```js
(function (window){
// 子应用的运行水箱
// 这里对全局window 的操作将被隔离，不会影响到外部的全局 window
})(proxy)
// window 将用传入的 proxy 代替
```

执行完 `execScripts` 后将返回的 `bootstrap`, `mount`, `unmount`, `update` 这个导出的方法

**获取微应用中全局状态相关的设置**

```js
  const {
    onGlobalStateChange,
    setGlobalState,
    offGlobalStateChange,
  }: Record<string, CallableFunction> = getMicroAppStateActions(appInstanceId);
```

最后就是执行挂载后的钩子了

到此大致梳理了一下加载子应用的执行过程，接下来针对一些个别地方再深入了解一下

## 子应用沙箱

接下来看看 qiankun 沙箱的实现

```js
/**
 * 生成应用运行时沙箱
 *
 * 沙箱分两个类型：
 * 1. app 环境沙箱
 *  app 环境沙箱是指应用初始化过之后，应用会在什么样的上下文环境运行。每个应用的环境沙箱只会初始化一次，因为子应用只会触发一次 bootstrap 。
 *  子应用在切换时，实际上切换的是 app 环境沙箱。
 * 2. render 沙箱
 *  子应用在 app mount 开始前生成好的的沙箱。每次子应用切换过后，render 沙箱都会重现初始化。
 *
 * 这么设计的目的是为了保证每个子应用切换回来之后，还能运行在应用 bootstrap 之后的环境下。
 *
 * @param appName
 * @param elementGetter
 * @param scopedCSS
 * @param useLooseSandbox
 * @param excludeAssetFilter
 */
export function createSandboxContainer(
  appName: string,
  elementGetter: () => HTMLElement | ShadowRoot,
  scopedCSS: boolean,
  useLooseSandbox?: boolean,
  excludeAssetFilter?: (url: string) => boolean,
) {
  let sandbox: SandBox;
  if (window.Proxy) {
    sandbox = useLooseSandbox ? new LegacySandbox(appName) : new ProxySandbox(appName);
  } else {
    sandbox = new SnapshotSandbox(appName);
  }
  const bootstrappingFreers = patchAtBootstrapping(appName, elementGetter, sandbox, scopedCSS, excludeAssetFilter);
  let mountingFreers: Freer[] = [];
  let sideEffectsRebuilders: Rebuilder[] = [];
  return {
    instance: sandbox,
    /**
     * 沙箱被 mount
     * 可能是从 bootstrap 状态进入的 mount
     * 也可能是从 unmount 之后再次唤醒进入 mount
     */
    async mount() {
      /* ------------------------------------------ 因为有上下文依赖（window），以下代码执行顺序不能变 ------------------------------------------ */

      /* ------------------------------------------ 1. 启动/恢复 沙箱------------------------------------------ */
    },
    /**
     * 恢复 global 状态，使其能回到应用加载之前的状态
     */
    async unmount() {
    },
  };
}
```

根据情况上面有三个创建沙箱的方式：`ProxySandbox`、 `LegacySandbox`、 `SnapshotSandbox` 

### ProxySandbox

```js
/**
 * 基于 Proxy 实现的沙箱
 */
export default class ProxySandbox implements SandBox {
  /** window 值变更记录 */
  private updatedValueSet = new Set<PropertyKey>();
  name: string; // 沙箱的名字
  type: SandBoxType; // 沙箱的类型
  proxy: WindowProxy; // 沙箱导出的代理实体
  sandboxRunning = true; // 沙箱是否在运行中
  latestSetProp: PropertyKey | null = null;
  active() { // 启动沙箱
    if (!this.sandboxRunning) activeSandboxCount++;
    this.sandboxRunning = true;
  }
  inactive() { // 关闭沙箱
    if (process.env.NODE_ENV === 'development') {
      console.info(`[qiankun:sandbox] ${this.name} modified global properties restore...`, [
        ...this.updatedValueSet.keys(),
      ]);
    }
    if (--activeSandboxCount === 0) {
      variableWhiteList.forEach((p) => {
        if (this.proxy.hasOwnProperty(p)) {
          // @ts-ignore
          delete window[p];
        }
      });
    }
    this.sandboxRunning = false;
  }
  constructor(name: string) {
    this.name = name;
    this.type = SandBoxType.Proxy;
    const { updatedValueSet } = this;
    const rawWindow = window;
    const { fakeWindow, propertiesWithGetter } = createFakeWindow(rawWindow);
    const descriptorTargetMap = new Map<PropertyKey, SymbolTarget>();
    const hasOwnProperty = (key: PropertyKey) => fakeWindow.hasOwnProperty(key) || rawWindow.hasOwnProperty(key);
    const proxy = new Proxy(fakeWindow, {
      // prosy 配置
    });
    this.proxy = proxy;
    activeSandboxCount++;
  }
}
```

源码中说明了 `ProxySandbox` 类中几个属性的意思：

- `name`：沙箱的名字

- `type`：沙箱的类型

- `proxy`：沙箱导出的代理实体

- `sandboxRunning`：沙箱是否在运行中

- `latestSetProp`： latest set property

- `active`：启动沙箱

- `inactive`：关闭沙箱

从 `constructor` 中的代码可以看到核心就是使用 `proxy` 给 `fakeWindow` 设置了代理，`fakeWindow` 是通过 `createFakeWindow(rawWindow)` 方法创建的

```js
function createFakeWindow(global: Window) {
  const propertiesWithGetter = new Map<PropertyKey, boolean>();
  const fakeWindow = {} as FakeWindow;
  Object.getOwnPropertyNames(global)
    .filter((p) => {
      const descriptor = Object.getOwnPropertyDescriptor(global, p);
      return !descriptor?.configurable;
    })
    .forEach((p) => {
      const descriptor = Object.getOwnPropertyDescriptor(global, p);
      if (descriptor) {
        const hasGetter = Object.prototype.hasOwnProperty.call(descriptor, 'get');
        if (
          p === 'top' ||
          p === 'parent' ||
          p === 'self' ||
          p === 'window' ||
          (process.env.NODE_ENV === 'test' && (p === 'mockTop' || p === 'mockSafariTop'))
        ) {
          descriptor.configurable = true;
          if (!hasGetter) {
            descriptor.writable = true;
          }
        }
        if (hasGetter) propertiesWithGetter.set(p, true);
        // 利用 Object.definedProperty 代理 window属性到fakeWindow对象中
        rawObjectDefineProperty(fakeWindow, p, Object.freeze(descriptor));
      }
    });

  return {
    fakeWindow,
    propertiesWithGetter,
  };
}
```

解释 `createFakeWindow` 的代码前，先简单回顾一下对象的属性描述符

**对象属性描述符**

对象目前存在两种主要形式的属性描述符：数据描述符和存取描述符

- 数据描述符可选的键值为：

  - value： 该属性对应的值。可以是任何有效的 JavaScript 值（数值，对象，函数等）
  
  - writable：当且仅当该属性的 `writable` 键值为 `true` 时，属性的值，也就是上面的 `value`，才能被赋值运算符改变
  
- 存取描述符可选的键值为：

  - get：当访问该属性时，会调用此函数
  
  - set：当属性值被修改时，会调用此函数
  
- 数据描述符存取描述符都有的键值为：

  - configurable：当且仅当该属性的 `configurable` 键值为 `true` 时，该属性的描述符才能够被改变，同时该属性也能从对应的对象上被删除
  
  - enumerable: 当且仅当该属性的 `enumerable` 键值为 `true` 时，该属性才会出现在对象的枚举属性中

回到 `createFakeWindow` 中，它的作用就是遍历 `window` 所有自身属性，找出具有描述符的属性，对于这些属性进行以下操作：

1. 使用 `Object.defineProperty` 将这些属性代理到 `fakeWindow` 对象上

2. 如果是具有存取描述符（get方法），将这个属性保存到 `propertiesWithGetter` 中 

最后返回 `fakeWindow` 和 `propertiesWithGetter`，总结一下这两个值：

- fakeWindow： 代理了 `window` 后的值

- propertiesWithGetter: 保存 `window` 上具有存取描述符的一些属性

回到 `ProxySandbox` 构建函中

```js
const proxy = new Proxy(fakeWindow, {})
```

`proxy` 代理了 `fakeWindow` 对象，注意 `fakeWindow` 表示真正的全局环境 `window`，`proxy` 则是当前子应用的全局环境

接着重点看`Proxy`中 `set` 和 `get` 方法的实现

**set**

```js
  set: (target: FakeWindow, p: PropertyKey, value: any): boolean => {
    if (this.sandboxRunning) {
      // We must kept its description while the property existed in rawWindow before
      if (!target.hasOwnProperty(p) && rawWindow.hasOwnProperty(p)) {
        const descriptor = Object.getOwnPropertyDescriptor(rawWindow, p);
        const { writable, configurable, enumerable } = descriptor!;
        if (writable) {
          Object.defineProperty(target, p, {
            configurable,
            enumerable,
            writable,
            value,
          });
        }
      } else {
        // @ts-ignore
        target[p] = value;
      }
      if (variableWhiteList.indexOf(p) !== -1) {
        // @ts-ignore
        rawWindow[p] = value;
      }
      updatedValueSet.add(p);
      this.latestSetProp = p;
      return true;
    }
    if (process.env.NODE_ENV === 'development') {
      console.warn(`[qiankun] Set window.${p.toString()} while sandbox destroyed or inactive in ${name}!`);
    }
    // 在 strict-mode 下，Proxy 的 handler.set 返回 false 会抛出 TypeError，在沙箱卸载的情况下应该忽略错误
    return true;
  },
```

上面代码出现的 `target`，表示当前子应用运行全局环境`proxy`；`rawWindow` 表示真正的全局环境 `window`。梳理一下 `set` 的实现逻辑：

- 如果当前这个属性不存在当前的 `proxy` 但又存在于 `rawWindow` 中，则通过 `Object.defineProperty` 给当前这个 `proxy` 添加一个代理

- 如果当前属性已经存于 `prosy` 中，则直接添加修改这个值

- `variableWhiteList` 是一个数组，保存着可以对 `rawWindow` 进行修改的属性，如果当前修改的属性符合条件，那么也对 `rawWindow` 中的属性进行修改
 
  源码 `variableWhiteList` 中的属性不多： `['System',  '__cjsWrapper', ''__REACT_ERROR_OVERLAY_GLOBAL_HOOK__'']`
  
- `updatedValueSet` 是一个 `Set` 结构，作用是保存变更记录，也就是说对当前 `proxy` 进行了修改的属性都会保存到 `updatedValueSet` 中

- `this.latestSetProp = p`，记录最后一个修改的属性


**get**

```js
  get(target: FakeWindow, p: PropertyKey): any {
    // mark the symbol to document while accessing as document.createElement could know is invoked by which sandbox for dynamic append patcher
    if (p === 'document' || p === 'eval') {
      setCurrentRunningSandboxProxy(proxy);
      // FIXME if you have any other good ideas
      // remove the mark in next tick, thus we can identify whether it in micro app or not
      // this approach is just a workaround, it could not cover all complex cases, such as the micro app runs in the same task context with master in some case
      nextTick(() => setCurrentRunningSandboxProxy(null));
      switch (p) {
        case 'document':
          return document;
        case 'eval':
          // eslint-disable-next-line no-eval
          return eval;
        // no default
      }
    }

    // eslint-disable-next-line no-nested-ternary
    const value = propertiesWithGetter.has(p)
      ? (rawWindow as any)[p]
      : p in target
      ? (target as any)[p]
      : (rawWindow as any)[p];
    return getTargetValue(rawWindow, value);
  },
```

`get` 的实现有一个判断分支 `if (p === 'document' || p === 'eval')`，大概意思是如果在当前环境执行了 `document` 和 `eval`，则将当前 `proxy` 保存到一个临时变量中，在下一次事件循环后再将这个临时变量设为 `null`，至于这个临时什么时候用这晨暂不深究，总之这个临时存储的 `prosy` 仅在当前事件循环中会被用到

这里重点看到最后一段取值逻辑，用了几个三目运算符，总结来说是就是优先从当前全局环境 `proxy` 找值，如果不存在再从 `rawWindow` 中取值

最后 `getTargetValue(rawWindow, value)` 作用是判断这个属性是否是一些特殊的属性，是的话再额外做下处理，个别情况这里也不去关心了，总之最终的取值逻辑就是：`prost[properrty]||rawWindow[properrty]`

看到这里其实就差不多揭开了 qiankun 实现运行环境沙箱的神秘面纱，上文的 `proxy` 将用于子应用运行时充当全局 `window` 的角色，为了方便理解，写了一个简单的Demo:

```js
	let fakeWindow = {}
    let rawWindow = window
	function createFakeWindow(global=window) {
		Object.getOwnPropertyNames(global)
			.filter((p) => {
				const descriptor = Object.getOwnPropertyDescriptor(global, p);
				return descriptor.configurable;
			})
			.forEach((p) => {
				const descriptor = Object.getOwnPropertyDescriptor(global, p);
				if (descriptor) {
					Object.defineProperty(fakeWindow, p, Object.freeze(descriptor));
				}
			});

		return fakeWindow;
	}
	const proxy = new Proxy(createFakeWindow(), {
		set: (target, p, value) => {
            if (!target.hasOwnProperty(p) && rawWindow.hasOwnProperty(p)) {
                const descriptor = Object.getOwnPropertyDescriptor(rawWindow, p);
                const { writable, configurable, enumerable } = descriptor
                if (writable) {
                    Object.defineProperty(target, p, {
                        configurable,
                        enumerable,
                        writable,
                        value,
                    });
                }
            } else {
                target[p] = value;
            }
            return true;
		},
		get(target, p) {
			return target[p]||rawWindow[p]
		},
	});
	console.log(window.youName) // undefined
    proxy.youName = 'lanjz'
    console.log(window.youName) // undefined
    console.log(proxy.youName) // lanjz
    console.log(proxy.document) // #document
```

加外两个沙条实现原理暂时先不看了 `LegacySandbox`、 `SnapshotSandbox` 

## 关于动态创建的样式和脚本

对于动态创建的样式和脚本，qiankun 也做了处理，这部分的处理逻辑在创建沙箱时定义的，分别 `mount` 和 `unmount` 两个属性方法中，先看下 `mount` 的定义

```js
    /**
     * 沙箱被 mount
     * 可能是从 bootstrap 状态进入的 mount
     * 也可能是从 unmount 之后再次唤醒进入 mount
     */
    async mount() {
      /* ------------------------------------------ 1. 启动/恢复 沙箱------------------------------------------ */
      sandbox.active();
      const sideEffectsRebuildersAtBootstrapping = sideEffectsRebuilders.slice(0, bootstrappingFreers.length);
      const sideEffectsRebuildersAtMounting = sideEffectsRebuilders.slice(bootstrappingFreers.length);
      if (sideEffectsRebuildersAtBootstrapping.length) {
        sideEffectsRebuildersAtBootstrapping.forEach((rebuild) => rebuild());
      }
      /* ------------------------------------------ 2. 开启全局变量补丁 ------------------------------------------*/
      // render 沙箱启动时开始劫持各类全局监听，尽量不要在应用初始化阶段有 事件监听/定时器 等副作用
      mountingFreers = patchAtMounting(appName, elementGetter, sandbox, scopedCSS, excludeAssetFilter);

      /* ------------------------------------------ 3. 重置一些初始化时的副作用 ------------------------------------------*/
      // 存在 rebuilder 则表明有些副作用需要重建
      if (sideEffectsRebuildersAtMounting.length) {
        sideEffectsRebuildersAtMounting.forEach((rebuild) => rebuild());
      }
      // clean up rebuilders
      sideEffectsRebuilders = [];
    },
```

根据注释，大致可以理解这段代码的作用就是从 `sideEffectsRebuilders` 中取出事件然后执行这些事件的过程，所以先要搞懂 `sideEffectsRebuilders` 和 `bootstrappingFreers` 这两个是什么东西

**sideEffectsRebuilders**

`sideEffectsRebuilders` 出现的地方就三处：

1. 定义时：`let sideEffectsRebuilders: Rebuilder[] = []`

2. 在 `mount` 执行时会取出 `sideEffectsRebuilders`，并执行，最后清空操作：`sideEffectsRebuilders = []`

3. 在 `unmount` 阶段也会取出 `sideEffectsRebuilders`，并执行

总之这些事件是 `sideEffectsRebuilders` 和 `mountingFreers` 组成的，看下他们的定义

**sideEffectsRebuilders**

这个变量的定义是在当前沙箱的构造函数中定义的：`const bootstrappingFreers = patchAtBootstrapping(appName, elementGetter, sandbox, scopedCSS, excludeAssetFilter)`

`patchAtBootstrapping` 根据当前的全局环境代理方式的不同返回不同函数，这里我们看 `patchStrictSandbox(appName, elementGetter, sandbox.proxy, false, scopedCSS, excludeAssetFilter)`，也是意味着 `bootstrappingFreers` 是 `patchStrictSandbox` 方法返回的，看下它的定义：

```js
let bootstrappingPatchCount = 0;
let mountingPatchCount = 0;

export function patchStrictSandbox(
  appName: string,
  appWrapperGetter: () => HTMLElement | ShadowRoot,
  proxy: Window,
  mounting = true,
  scopedCSS = false,
  excludeAssetFilter?: CallableFunction,
): Freer {
  let containerConfig = proxyAttachContainerConfigMap.get(proxy);
  if (!containerConfig) {
    containerConfig = {
      appName,
      proxy,
      appWrapperGetter,
      dynamicStyleSheetElements: [],
      strictGlobal: true,
      excludeAssetFilter,
      scopedCSS,
    };
    // 每个代理环境都映射一个 containerConfig
    proxyAttachContainerConfigMap.set(proxy, containerConfig);
  }
  // 所以有动态样式表都保存在 dynamicStyleSheetElements
  const { dynamicStyleSheetElements } = containerConfig;
  // 劫持 document.createElements方法
  const unpatchDocumentCreate = patchDocumentCreateElement();
  // 劫持appdentChild和removeChild方法
  const unpatchDynamicAppendPrototypeFunctions = patchHTMLDynamicAppendPrototypeFunctions(
    (element) => elementAttachContainerConfigMap.has(element),
    (element) => elementAttachContainerConfigMap.get(element)!,
  );
  if (!mounting) bootstrappingPatchCount++;
  if (mounting) mountingPatchCount++;
  return function free() {
    // bootstrap patch just called once but its freer will be called multiple times
    if (!mounting && bootstrappingPatchCount !== 0) bootstrappingPatchCount--;
    if (mounting) mountingPatchCount--;

    const allMicroAppUnmounted = mountingPatchCount === 0 && bootstrappingPatchCount === 0;
    // release the overwrite prototype after all the micro apps unmounted
    if (allMicroAppUnmounted) {
      unpatchDynamicAppendPrototypeFunctions();
      unpatchDocumentCreate();
    }
    // 记录样式表
    recordStyledComponentsCSSRules(dynamicStyleSheetElements);
    return function rebuild() {
      rebuildCSSRules(dynamicStyleSheetElements, (stylesheetElement) => {
        const appWrapper = appWrapperGetter();
        // 取出样式表执行
        if (!appWrapper.contains(stylesheetElement)) {
          rawHeadAppendChild.call(appWrapper, stylesheetElement);
          return true;
        }

        return false;
      });
    };
  };
}
```

对每个代理 `proxy` 都对应了一个 `containerConfig` 对象，根据注释可以知道动态样式的创建会保存到 `dynamicStyleSheetElements` 属性中

然后执行  `const unpatchDocumentCreate = patchDocumentCreateElement()`

```js
// patchers/dynamicAppend/patchAtBootstrapping
const rawDocumentCreateElement = Document.prototype.createElement;
const proxyAttachContainerConfigMap = new WeakMap<WindowProxy, ContainerConfig>();
const elementAttachContainerConfigMap = new WeakMap<HTMLElement, ContainerConfig>();
function patchDocumentCreateElement() {
  if (Document.prototype.createElement === rawDocumentCreateElement) {
    Document.prototype.createElement = function createElement<K extends keyof HTMLElementTagNameMap>(
      this: Document,
      tagName: K,
      options?: ElementCreationOptions,
    ): HTMLElement {
      const element = rawDocumentCreateElement.call(this, tagName, options);
      if (isHijackingTag(tagName)) {
        const currentRunningSandboxProxy = getCurrentRunningSandboxProxy();
        if (currentRunningSandboxProxy) {
          const proxyContainerConfig = proxyAttachContainerConfigMap.get(currentRunningSandboxProxy);
          if (proxyContainerConfig) {
            elementAttachContainerConfigMap.set(element, proxyContainerConfig);
          }
        }
      }
      return element;
    };
  }
  return function unpatch() {
    Document.prototype.createElement = rawDocumentCreateElement;
  };
}
```

`patchDocumentCreateElement` 的作用其实就是劫持了原生的 `Document.prototype.createElement` 方法。具体流程为：

1. 当触发了 `Document.prototype.createElement` 后先调用原生的`createElement` 方法获取结果 `element`

2. 通过 `if (isHijackingTag(tagName)) ` 语句来判断是否做进一步处理，`isHijackingTag(tagName)` 表示当前动态创建元素是否是 `SCRIPT`、`LINK`、`STYLE` 中的一种，如果是的话以`key-value` 形式保存到 `elementAttachContainerConfigMap`中
 
   - key：当前动态创建元素
    
   - value: 当前 `代理环境proxy` 对应的 `containerConfig`
   
这里我暂时理解为动态创建的元素与当前 `代理环境proxy` 做了映射关系，应该是为了方便之后根据 `动态元素` 找到当前的所属的 `代理环境proxy`

回到 `patchStrictSandbox` 方法中，继续往下走执行以下代码：

```js
  const unpatchDynamicAppendPrototypeFunctions = patchHTMLDynamicAppendPrototypeFunctions(
    (element) => elementAttachContainerConfigMap.has(element),
    (element) => elementAttachContainerConfigMap.get(element)!,
  );
```

```js
// patchers/dynamicAppend/common.ts
export function patchHTMLDynamicAppendPrototypeFunctions(
  isInvokedByMicroApp: (element: HTMLElement) => boolean,
  containerConfigGetter: (element: HTMLElement) => ContainerConfig,
) {
  // Just overwrite it while it have not been overwrite
  if (
    HTMLHeadElement.prototype.appendChild === rawHeadAppendChild &&
    HTMLBodyElement.prototype.appendChild === rawBodyAppendChild &&
    HTMLHeadElement.prototype.insertBefore === rawHeadInsertBefore
  ) {
    HTMLHeadElement.prototype.appendChild = getOverwrittenAppendChildOrInsertBefore({
      rawDOMAppendOrInsertBefore: rawHeadAppendChild,
      containerConfigGetter,
      isInvokedByMicroApp,
    }) as typeof rawHeadAppendChild;
    HTMLBodyElement.prototype.appendChild = getOverwrittenAppendChildOrInsertBefore({
      rawDOMAppendOrInsertBefore: rawBodyAppendChild,
      containerConfigGetter,
      isInvokedByMicroApp,
    }) as typeof rawBodyAppendChild;

    HTMLHeadElement.prototype.insertBefore = getOverwrittenAppendChildOrInsertBefore({
      rawDOMAppendOrInsertBefore: rawHeadInsertBefore as any,
      containerConfigGetter,
      isInvokedByMicroApp,
    }) as typeof rawHeadInsertBefore;
  }

  // Just overwrite it while it have not been overwrite
  if (
    HTMLHeadElement.prototype.removeChild === rawHeadRemoveChild &&
    HTMLBodyElement.prototype.removeChild === rawBodyRemoveChild
  ) {
    HTMLHeadElement.prototype.removeChild = getNewRemoveChild(
      rawHeadRemoveChild,
      (element) => containerConfigGetter(element).appWrapperGetter,
    );
    HTMLBodyElement.prototype.removeChild = getNewRemoveChild(
      rawBodyRemoveChild,
      (element) => containerConfigGetter(element).appWrapperGetter,
    );
  }

  return function unpatch() {
    HTMLHeadElement.prototype.appendChild = rawHeadAppendChild;
    HTMLHeadElement.prototype.removeChild = rawHeadRemoveChild;
    HTMLBodyElement.prototype.appendChild = rawBodyAppendChild;
    HTMLBodyElement.prototype.removeChild = rawBodyRemoveChild;

    HTMLHeadElement.prototype.insertBefore = rawHeadInsertBefore;
  };
}
```

`patchHTMLDynamicAppendPrototypeFunctions` 方法也是劫持了原生的 `appendChild`、`removeChild`等创建元素相关的方法，我们拿 

以 `appendChild` 为例，看下重写方法中做了哪些事件:

```js
function getOverwrittenAppendChildOrInsertBefore(opts: {
  rawDOMAppendOrInsertBefore: <T extends Node>(newChild: T, refChild?: Node | null) => T;
  isInvokedByMicroApp: (element: HTMLElement) => boolean;
  containerConfigGetter: (element: HTMLElement) => ContainerConfig;
}) {
  return function appendChildOrInsertBefore<T extends Node>(
    this: HTMLHeadElement | HTMLBodyElement,
    newChild: T,
    refChild?: Node | null,
  ) {
    let element = newChild as any;
    const { rawDOMAppendOrInsertBefore, isInvokedByMicroApp, containerConfigGetter } = opts;
    if (!isHijackingTag(element.tagName) || !isInvokedByMicroApp(element)) {
      return rawDOMAppendOrInsertBefore.call(this, element, refChild) as T;
    }

    if (element.tagName) {
      const containerConfig = containerConfigGetter(element);
      const {
        appName,
        appWrapperGetter,
        proxy,
        strictGlobal,
        dynamicStyleSheetElements,
        scopedCSS,
        excludeAssetFilter,
      } = containerConfig;

      switch (element.tagName) {
        case LINK_TAG_NAME:
        case STYLE_TAG_NAME: { // 动态样式时执行的语句
        }
        case SCRIPT_TAG_NAME: {  // 动态脚本时执行的语句
        }
        default:
          break;
      }
    }
    return rawDOMAppendOrInsertBefore.call(this, element, refChild);
  };
}
```

从上面定义可以看到根据动态创建的目标不同，处理方式也不同，先看样式的处理：

**动态样式**

```js
  let stylesheetElement: HTMLLinkElement | HTMLStyleElement = newChild as any;
  const { href } = stylesheetElement as HTMLLinkElement;
  if (excludeAssetFilter && href && excludeAssetFilter(href)) {
    return rawDOMAppendOrInsertBefore.call(this, element, refChild) as T;
  }

  const mountDOM = appWrapperGetter();

  if (scopedCSS) {
    // exclude link elements like <link rel="icon" href="favicon.ico">
    const linkElementUsingStylesheet =
      element.tagName?.toUpperCase() === LINK_TAG_NAME &&
      (element as HTMLLinkElement).rel === 'stylesheet' &&
      (element as HTMLLinkElement).href;
    if (linkElementUsingStylesheet) {
      const fetch =
        typeof frameworkConfiguration.fetch === 'function'
          ? frameworkConfiguration.fetch
          : frameworkConfiguration.fetch?.fn;
      stylesheetElement = convertLinkAsStyle(
        element,
        (styleElement) => css.process(mountDOM, styleElement, appName),
        fetch,
      );
      dynamicLinkAttachedInlineStyleMap.set(element, stylesheetElement);
    } else {
      css.process(mountDOM, stylesheetElement, appName);
    }
  }

  // eslint-disable-next-line no-shadow
  dynamicStyleSheetElements.push(stylesheetElement);
  const referenceNode = mountDOM.contains(refChild) ? refChild : null;
  return rawDOMAppendOrInsertBefore.call(mountDOM, stylesheetElement, referenceNode);
```

`excludeAssetFilter` 可以在使用 `registerMicroApps` 时传入，表示如果动态创建的链接包含在 `excludeAssetFilter` 中则不做任何处理

后面出现的 `mountDOM` 表示当前子应用 DOM 内容 ； `scopedCSS` 表示是设置了 `experimentalStyleIsolation: true`

如果当前创建是动态 `link` 标签则调用 `convertLinkAsStyle` 方法使用 `fetch` 获取样式文件内容并调用 `css.process(mountDOM, styleElement, appName)` ；如果是动态创建的内联样式则直接执行 `css.process(mountDOM, stylesheetElement, appName)`

`css.process` 的作用就是给些这样式内容添加特殊的选择器，用于隔离样式使用

之后把当前这个创建的元素保存到 `containerConfig.dynamicStyleSheetElements`

最后执行 `rawDOMAppendOrInsertBefore.call(mountDOM, stylesheetElement, referenceNode)` 即原生的 `HTMLHeadElement.prototype.appendChild` 的方法，将样式内容添加到DOM中，注意添加到子应用中的DOM

**动态脚本**

```js
  const { src, text } = element as HTMLScriptElement;
  // some script like jsonp maybe not support cors which should't use execScripts
  if (excludeAssetFilter && src && excludeAssetFilter(src)) {
    return rawDOMAppendOrInsertBefore.call(this, element, refChild) as T;
  }

  const mountDOM = appWrapperGetter();
  const { fetch } = frameworkConfiguration;
  const referenceNode = mountDOM.contains(refChild) ? refChild : null;

  if (src) {
    execScripts(null, [src], proxy, {
      fetch,
      strictGlobal,
      beforeExec: () => {
        Object.defineProperty(document, 'currentScript', {
          get(): any {
            return element;
          },
          configurable: true,
        });
      },
      success: () => {
        manualInvokeElementOnLoad(element);
        element = null;
      },
      error: () => {
        manualInvokeElementOnError(element);
        element = null;
      },
    });

    const dynamicScriptCommentElement = document.createComment(`dynamic script ${src} replaced by qiankun`);
    dynamicScriptAttachedCommentMap.set(element, dynamicScriptCommentElement);
    return rawDOMAppendOrInsertBefore.call(mountDOM, dynamicScriptCommentElement, referenceNode);
  }

  // inline script never trigger the onload and onerror event
  execScripts(null, [`<script>${text}</script>`], proxy, { strictGlobal });
  const dynamicInlineScriptCommentElement = document.createComment('dynamic inline script replaced by qiankun');
  dynamicScriptAttachedCommentMap.set(element, dynamicInlineScriptCommentElement);
  return rawDOMAppendOrInsertBefore.call(mountDOM, dynamicInlineScriptCommentElement, referenceNode);
```

其实动态创建的脚本时执行的流程跟动态样式差不太多，不过要注意的是使用 `execScripts` 执行脚本时动态设置了脚本执行的全局环境为当前子应用`代理prosy`

所以对于 `insertBefore` 的劫持逻辑大致就是这么一回事，总结一下：

1. 对于样式，如果是远程资源则 `fetch` 内容后再添加到 DOM中，并将元素保存到 `containerConfig.dynamicStyleSheetElements` 中

2. 对于脚本，如果是远程资源则通过 `fetch` 后再执行，执行时指定全局环境到子应用中

3. 执行真正的 `insertBefore` 的操作，注意这些操作都将作用于子应用中

对于 `patchHTMLDynamicAppendPrototypeFunctions` 方法作用大致搞清楚了，那么回到 `patchStrictSandbox` 方法中继续往下走，最后就是返回 `free` 方法，`free` 返回后是会被马上执行的，所以看下 `free` 的作用

```js
  return function free() {
    // bootstrap patch just called once but its freer will be called multiple times
    if (!mounting && bootstrappingPatchCount !== 0) bootstrappingPatchCount--;
    if (mounting) mountingPatchCount--;

    const allMicroAppUnmounted = mountingPatchCount === 0 && bootstrappingPatchCount === 0;
    // release the overwrite prototype after all the micro apps unmounted
    if (allMicroAppUnmounted) {
      unpatchDynamicAppendPrototypeFunctions();
      unpatchDocumentCreate();
    }

    recordStyledComponentsCSSRules(dynamicStyleSheetElements);
    return function rebuild() {
      rebuildCSSRules(dynamicStyleSheetElements, (stylesheetElement) => {
        const appWrapper = appWrapperGetter();
        if (!appWrapper.contains(stylesheetElement)) {
          rawHeadAppendChild.call(appWrapper, stylesheetElement);
          return true;
        }

        return false;
      });
    };
  };
```

重点看下 `recordStyledComponentsCSSRules(dynamicStyleSheetElements)` 的作用记录 `dynamicStyleSheetElements` 到 `styledComponentCSSRulesMap` 中，最后返回 `rebuild` 方法

最后我们回到调用 `patchHTMLDynamicAppendPrototypeFunctions` 也就是 `const bootstrappingFreers = patchAtBootstrapping(appName, elementGetter, sandbox, scopedCSS, excludeAssetFilter);`，这里我们知道了 `bootstrappingFreers` 得到的就是刚提到的 `rebuild` 方法

关于 `rebuild` 方法什么场景下会调用，有点没搞清楚，这部分以后再补充吧~

## 样式隔离

```js
  const strictStyleIsolation = typeof sandbox === 'object' && !!sandbox.strictStyleIsolation;
  const scopedCSS = isEnableScopedCSS(sandbox);
  let initialAppWrapperElement: HTMLElement | null = createElement(
    appContent,
    strictStyleIsolation,
    scopedCSS,
    appName,
  );
```

上面代码就是开始处理样式隔离的地方，首先会获取隔离规则 `strictStyleIsolation` 和 `scopedCSS`，看下 qiankun 对于这两个规则配置的含义说明：

- `strictStyleIsolation`: 为 `true` 时表示开启严格的样式隔离模式。这种模式下 qiankun 会为每个微应用的容器包裹上一个 `shadow dom` 节点，从而确保微应用的样式不会对全局造成影响

- `experimentalStyleIsolation` : qiankun 会改写子应用所添加的样式为所有样式规则增加一个特殊的选择器规则来限定其影响范围，因此改写后的代码会表达类似为如下结构：

  ```css
   .app-main {
     font-size: 14px;
   }
   
   div[data-qiankun-react16] .app-main {
     font-size: 14px;
   }
  ```

看下 `createElement` 方法的定义 

```js
function createElement(
  appContent: string,
  strictStyleIsolation: boolean,
  scopedCSS: boolean,
  appName: string,
): HTMLElement {
  const containerElement = document.createElement('div');
  containerElement.innerHTML = appContent;
  // appContent always wrapped with a singular div
  const appElement = containerElement.firstChild as HTMLElement;
  if (strictStyleIsolation) {
    if (!supportShadowDOM) {
      console.warn(
        '[qiankun]: As current browser not support shadow dom, your strictStyleIsolation configuration will be ignored!',
      );
    } else {
      const { innerHTML } = appElement;
      appElement.innerHTML = '';
      let shadow: ShadowRoot;

      if (appElement.attachShadow) {
        shadow = appElement.attachShadow({ mode: 'open' });
      } else {
        // createShadowRoot was proposed in initial spec, which has then been deprecated
        shadow = (appElement as any).createShadowRoot();
      }
      shadow.innerHTML = innerHTML;
    }
  }

  if (scopedCSS) {
    const attr = appElement.getAttribute(css.QiankunCSSRewriteAttr);
    if (!attr) {
      appElement.setAttribute(css.QiankunCSSRewriteAttr, appName);
    }

    const styleNodes = appElement.querySelectorAll('style') || [];
    forEach(styleNodes, (stylesheetElement: HTMLStyleElement) => {
      css.process(appElement!, stylesheetElement, appName);
    });
  }

  return appElement;
}
```

重点就是下面两个 `if`：`if (strictStyleIsolation)` 和 `if (scopedCSS)`，分别看下他们的实现

### strictStyleIsolation

[shadow DOM](https://developer.mozilla.org/zh-CN/docs/Web/Web_Components/Using_shadow_DOM): Web components 的一个重要属性是封装——可以将标记结构、样式和行为隐藏起来，并与页面上的其他代码相隔离，保证不同的部分不会混在一起，可使代码更加干净、整洁。其中，Shadow DOM 接口是关键所在，它可以将一个隐藏的、独立的 DOM 附加到一个元素上。

```js
    if (!supportShadowDOM) {
      console.warn(
        '[qiankun]: As current browser not support shadow dom, your strictStyleIsolation configuration will be ignored!',
      );
    } else {
      const { innerHTML } = appElement;
      appElement.innerHTML = '';
      let shadow: ShadowRoot;

      if (appElement.attachShadow) {
        shadow = appElement.attachShadow({ mode: 'open' });
      } else {
        // createShadowRoot was proposed in initial spec, which has then been deprecated
        shadow = (appElement as any).createShadowRoot();
      }
      shadow.innerHTML = innerHTML;
    }
```

根据 shadow DOM 的意思所以实现`strictStyleIsolation` 模式的设置很简单，就是给应用内容包一个 `Shadow DOM`

### scopedCSS

```js
const attr = appElement.getAttribute(css.QiankunCSSRewriteAttr);
if (!attr) {
  appElement.setAttribute(css.QiankunCSSRewriteAttr, appName);
}
// 给根元素设置一个 ['data-qiankun' = appName] 的属性
const styleNodes = appElement.querySelectorAll('style') || [];
forEach(styleNodes, (stylesheetElement: HTMLStyleElement) => {
  css.process(appElement, stylesheetElement, appName);
});

export const QiankunCSSRewriteAttr = 'data-qiankun';
```

获取所有的 `style` 标签，遍历他们并调用 `css.process` ，`css.process` 实现

```js
// css.process
export const process = (
  appWrapper: HTMLElement,
  stylesheetElement: HTMLStyleElement | HTMLLinkElement,
  appName: string,
): void => {
  // lazy singleton pattern
  if (!processor) {
    processor = new ScopedCSS();
  }

  if (stylesheetElement.tagName === 'LINK') {
    console.warn('Feature: sandbox.experimentalStyleIsolation is not support for link element yet.');
  }

  const mountDOM = appWrapper;
  if (!mountDOM) {
    return;
  }

  const tag = (mountDOM.tagName || '').toLowerCase();

  if (tag && stylesheetElement.tagName === 'STYLE') {
    const prefix = `${tag}[${QiankunCSSRewriteAttr}="${appName}"]`;
    processor.process(stylesheetElement, prefix);
  }
};
```

从 `process` 方法定义可以看到，样式隔离只能处理内联样式，`link` 加载的样式是不能处理处理的，对于内联样式先生成一个选择器名称，之后调用 `processor.process`

```js
  // processor.process
  process(styleNode: HTMLStyleElement, prefix: string = '') {
    if (styleNode.textContent !== '') {
      const textNode = document.createTextNode(styleNode.textContent || '');
      this.swapNode.appendChild(textNode);
      const sheet = this.swapNode.sheet as any; // type is missing
      const rules = arrayify<CSSRule>(sheet?.cssRules ?? []);
      const css = this.rewrite(rules, prefix);
      // eslint-disable-next-line no-param-reassign
      styleNode.textContent = css;

      // cleanup
      this.swapNode.removeChild(textNode);
      return;
    }
  }
```

`processor.process` 的作用就是给个样式属性添加之前定义的选择器属性，`this.rewrite` 方法就是具体替换实现，这里就略过了

## 应用通信

qiankun 提供了 `initGlobalState(state)` 用于应用通信，示例：

```js
import { initGlobalState, MicroAppStateActions } from 'qiankun';

// 初始化 state
const actions: MicroAppStateActions = initGlobalState(state);

actions.onGlobalStateChange((state, prev) => {
  // state: 变更后的状态; prev 变更前的状态
  console.log(state, prev);
});
actions.setGlobalState(state);
actions.offGlobalStateChange();
```

看下相关的代码的定义

```js
import { cloneDeep } from 'lodash';
import type { OnGlobalStateChangeCallback, MicroAppStateActions } from './interfaces';
let globalState: Record<string, any> = {};
const deps: Record<string, OnGlobalStateChangeCallback> = {};

// 触发全局监听
function emitGlobal(state: Record<string, any>, prevState: Record<string, any>) {
  Object.keys(deps).forEach((id: string) => {
    if (deps[id] instanceof Function) {
      deps[id](cloneDeep(state), cloneDeep(prevState));
    }
  });
}
export function initGlobalState(state: Record<string, any> = {}) {
  if (state === globalState) {
    console.warn('[qiankun] state has not changed！');
  } else {
    const prevGlobalState = cloneDeep(globalState);
    globalState = cloneDeep(state);
    emitGlobal(globalState, prevGlobalState);
  }
  return getMicroAppStateActions(`global-${+new Date()}`, true);
}

export function getMicroAppStateActions(id: string, isMaster?: boolean): MicroAppStateActions {
  return {
    /**
     * onGlobalStateChange 全局依赖监听
     *
     * 收集 setState 时所需要触发的依赖
     *
     * 限制条件：每个子应用只有一个激活状态的全局监听，新监听覆盖旧监听，若只是监听部分属性，请使用 onGlobalStateChange
     *
     * 这么设计是为了减少全局监听滥用导致的内存爆炸
     *
     * 依赖数据结构为：
     * {
     *   {id}: callback
     * }
     *
     * @param callback
     * @param fireImmediately
     */
    onGlobalStateChange(callback: OnGlobalStateChangeCallback, fireImmediately?: boolean) {
      if (!(callback instanceof Function)) {
        console.error('[qiankun] callback must be function!');
        return;
      }
      if (deps[id]) {
        console.warn(`[qiankun] '${id}' global listener already exists before this, new listener will overwrite it.`);
      }
      deps[id] = callback;
      const cloneState = cloneDeep(globalState);
      if (fireImmediately) {
        callback(cloneState, cloneState);
      }
    },
    /**
     * setGlobalState 更新 store 数据
     *
     * 1. 对输入 state 的第一层属性做校验，只有初始化时声明过的第一层（bucket）属性才会被更改
     * 2. 修改 store 并触发全局监听
     *
     * @param state
     */
    setGlobalState(state: Record<string, any> = {}) {
      if (state === globalState) {
        console.warn('[qiankun] state has not changed！');
        return false;
      }

      const changeKeys: string[] = [];
      const prevGlobalState = cloneDeep(globalState);
      globalState = cloneDeep(
        Object.keys(state).reduce((_globalState, changeKey) => {
          if (isMaster || _globalState.hasOwnProperty(changeKey)) {
            changeKeys.push(changeKey);
            return Object.assign(_globalState, { [changeKey]: state[changeKey] });
          }
          console.warn(`[qiankun] '${changeKey}' not declared when init state！`);
          return _globalState;
        }, globalState),
      );
      if (changeKeys.length === 0) {
        console.warn('[qiankun] state has not changed！');
        return false;
      }
      emitGlobal(globalState, prevGlobalState);
      return true;
    },

    // 注销该应用下的依赖
    offGlobalStateChange() {
      delete deps[id];
      return true;
    },
  };
}

```

通过代码可以看到，qiankun 是利用发布订阅者模式来实现应用通信的

对于整个应用只有一个用于保存全局状态的 `globalState` 和一个事件收集器 `deps`，最后执行 `initGlobalState` 函数返回一个 `actions`

子应用创建的时候会传入 `onGlobalStateChange` 和 `setGlobalState`

无论是主应用还是子应用只要触发 `onGlobalStateChange` 时，会将回调函数与当前的 `app id` 一起做个映射保存到 `deps` 中

之后触发 `setGlobalState` 时，将深拷贝一份原本的数据保存到 `prevGlobalState` 中，之后将新的数据合到当前数据`globalState` 中，然后执行 ` emitGlobal(globalState, prevGlobalState)`

```js
// 触发全局监听
function emitGlobal(state: Record<string, any>, prevState: Record<string, any>) {
  Object.keys(deps).forEach((id: string) => {
    if (deps[id] instanceof Function) {
      deps[id](cloneDeep(state), cloneDeep(prevState));
    }
  });
}
```
`emitGlobal` 的作用就是遍历收集到的回调方法，并一一执行

qiankun 应用通信的实现还是比较简单的，就是创建一个发布订阅者模式用来收集事件-执行事件

## 预加载

qiankun 预加载是通过启动 `start` 传入 `prefetch` 属性开启的，默认是 `true`。看下源码相关位置：

```js
export function start(opts: FrameworkConfiguration = {}) {
  frameworkConfiguration = { prefetch: true, singular: true, sandbox: true, ...opts };
  const { prefetch, sandbox, singular, urlRerouteOnly, ...importEntryOpts } = frameworkConfiguration;
  if (prefetch) {
    // 如果有 prefetch 执行 doPrefetchStrategy
    doPrefetchStrategy(microApps, prefetch, importEntryOpts);
  }
  startSingleSpa({ urlRerouteOnly });
  frameworkStartedDefer.resolve();
}
// doPrefetchStrategy
export function doPrefetchStrategy(
  apps: AppMetadata[],
  prefetchStrategy: PrefetchStrategy,
  importEntryOpts?: ImportEntryOpts,
) {
  const appsName2Apps = (names: string[]): AppMetadata[] => apps.filter((app) => names.includes(app.name));
  
  // 如果 prefetchStrategy 是数组或者函数的话，略过这里
  if (Array.isArray(prefetchStrategy)) {
    prefetchAfterFirstMounted(appsName2Apps(prefetchStrategy as string[]), importEntryOpts);
  } else if (isFunction(prefetchStrategy)) {
    (async () => {
      // critical rendering apps would be prefetch as earlier as possible
      const { criticalAppNames = [], minorAppsName = [] } = await prefetchStrategy(apps);
      prefetchImmediately(appsName2Apps(criticalAppNames), importEntryOpts);
      prefetchAfterFirstMounted(appsName2Apps(minorAppsName), importEntryOpts);
    })();
  } else {
    switch (prefetchStrategy) {
      case true:
        // 为true 执行 prefetchAfterFirstMounted
        prefetchAfterFirstMounted(apps, importEntryOpts);
        break;
      case 'all':
        prefetchImmediately(apps, importEntryOpts);
        break;

      default:
        break;
    }
  }
}
// prefetchAfterFirstMounted
function prefetchAfterFirstMounted(apps: AppMetadata[], opts?: ImportEntryOpts): void {
 // 参数是当前要预加的应用
 // 添加一个监听事件
  window.addEventListener('single-spa:first-mount', function listener() {
    const notLoadedApps = apps.filter((app) => getAppStatus(app.name) === NOT_LOADED);
    if (process.env.NODE_ENV === 'development') {
      const mountedApps = getMountedApps();
      console.log(`[qiankun] prefetch starting after ${mountedApps} mounted...`, notLoadedApps);
    }
    // 当产个应用加过载后执行 prefetch
    notLoadedApps.forEach(({ entry }) => prefetch(entry, opts));
    window.removeEventListener('single-spa:first-mount', listener);
  });
}
// prefetch
function prefetch(entry: Entry, opts?: ImportEntryOpts): void {
  if (!navigator.onLine || isSlowNetwork) {
    // Don't prefetch if in a slow network or offline
    return;
  }
  requestIdleCallback(async () => {
    const { getExternalScripts, getExternalStyleSheets } = await importEntry(entry, opts);
    requestIdleCallback(getExternalStyleSheets);
    requestIdleCallback(getExternalScripts);
  });
}
```

根据上面的代码 总结一下 `prefetch` 的实现：

1. 注册事件 `single-spa:first-mount`，当首个应用加载完成后执行回调

2. 回调中过滤掉没有加载的应用，执行 `prefetch`

3. 然后执行 `importEntry` 加载应用内容，`importEntry` 会对加载过的资源做缓存，返回的 `getExternalStyleSheets` 和 `getExternalScripts` 方法是加载对应样式资源和JS资源的方法，也会稍后执行，这些 `importEntry` 内部都会做缓存，所以下次再调用 `importEntry` 将直接从缓存中取

[](https://segmentfault.com/a/1190000022275991)