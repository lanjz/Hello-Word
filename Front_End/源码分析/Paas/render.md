
# PAAS动态创建应用机制

> PAAS动态创建应用主要使用了VUE的`render`方法，所以在往下看之前建议先对`render`方法有些了解，如果真的暂时不想去了解，那么至少请记住
Vue提供的`render`方法的作用就是**生成VUE组件**（这个说法其实不是很准确，这里只是为了帮助理解）

浏览器打开PAAS应用时（https://webapp.mypaas.com.cn/b2c/yk_qmyx/test/?tenant_code=yajuleadmin_test），
先是发出`meta`请求获取到元数据，这个元数据包含了当前应用的一些配置信息，然后根据元数据生成应用，本文就是了解下请求到元素到页面生成之间发生了什么事情

先简单看下PAAS引擎中针对这块的实现代码

```javascript
// node_modules/webapp/src/engine/src/main.js
const $instance = new Vue({
    router,
    store,
    render: h => {
        return h(App)
    },
    created() {
    	store.dispatch(appTypes.GET_APP_META, { tenant, role }).then(roleMeta => {
              store.commit(appTypes.SET_APP_META, roleMeta) }).catch(() => { }
)
    	// do something
    },
    methods: {
    	// 定义一些方法
    }
});

$instance.$mount('#app');

```

上面代码先是实例化了一个`$instance`实例，然后再调用`$mount`方法，把`$instance`挂载到`#app`元素中，至于`$instance`的内容就是通过`render`方法创建的，这个`$instance`实例创建时会执行`store.dispatch(appTypes.GET_APP_META)`方法请求元数据，至于处理元数据的操作是在`APP`组件中做的

`APP`是`import`进来的`vue组件`，下面是`APP.vue`简化后的代码

```javascript
<template>
    <div id="app">
        <keep-alive :exclude="exclude"
                    :include="include">
            <router-view class="router-view"></router-view>
        </keep-alive>
    </div>
</template>
export default {
    name: 'App',
        watch: {
            appMeta: {
                immediate: true,
                handler(meta = {}, oldMeta = {}) {
                    const self = this;
                    // 注册元数据所有的视图路由
                    const routes = [];
                    if (meta.views) {
                    	// 遍历配置的路由信息，生成一条Vue路由信息
                        meta.views.forEach(view => {
                            const { name, path, alias } = view;
                            // 获取路由额外配置属性：页面标题、是否子路由、是否需要登录、别名、当前角色 
                            const routeMeta = getRouteMeta(self.isDynamicTitle, self.role, view);
                            const routeView = {
                                name,
                                path,
                                meta: routeMeta,
                                props() {
                                    return {
                                        view: self.cache[name]
                                    }
                                },
                                component: {
                                    name: `router-view-${name}`,
                                    beforeRouteLeave,
                                    props: ['view'],
                                    render(h) {
                                        console.log('this1', this)
                                        return renderView(h, this.view, self.appMeta)
                                    }
                                }
                            };
                            // 如果已经包含这个路由，则不添加到routes中
                            if (!self.cache[name]) {
                                routes.push(routeView)
                            }
                            self.cache[name] = view;
                            // 如果存在children，则遍历并获取子路由，内容跟上面差不多
                            (view.children || []).forEach(child => {
                                const childRouteView = {
                                    name: child.name,
                                    path: child.path,
                                    meta: getRouteMeta(self.isDynamicTitle, self.role, child, routeMeta),
                                    props() {
                                        return {
                                            view: self.cache[child.name]
                                        }
                                    },
                                    component: {
                                        name: `router-view-${child.name}`,
                                        beforeRouteLeave,
                                        props: ['view'],
                                        render(h) {
                                            return renderView(h, this.view, self.appMeta)
                                        }
                                    }
                                };
                                if (!self.cache[child.name]) {
                                    routes.push(childRouteView)
                                }
                                self.cache[child.name] = child
                            })
                        })
                    }
    
                    // 最后动态生成路由
                    if (routes && routes.length > 0) {
                        routes.push({ path: '*', redirect: { name: 'home' } });
                        self.$router.addRoutes(routes)
                    }
                }
            }
        },
}
```

`APP.vue`跟元数据相关的核心部分就是上面`watch`中的`appMeta`监听函数部分，因为`appMeta`带有`immediate`属性，所以组件加载时`handler`中的
方法会先执行一次，`handler`函数中代码不长也没有特别复杂的代码，主要功能就是遍历元数据中的页面信息，动态生成Vue路由，这里就不一一解释了，
重点需要注意的是以下几点

- 元数据中一条路由信息的结构信息如下

  ```javascript
  {
	name:39f228fd-66cb-0b40-bffd-e1d1829f4aab, // 路由名称
    path:/39f228fd-66cb-0b40-bffd-e1d1829f4aab， // 路由路径
    body:{
		header:{}, // 当前页面的头部信息。如：页面标题，是否显示页面标题等
		content: {
			item: [ // 当前页面包含的哪些组件
				{
					type: 'b2c-search', // 组件名称
					_key: 'b453edb8-439b-498f-ba8b-bc5c9165b01c', // 唯一标识
					props: { // 组件配置信息，通过props传入当前组件中
						
					}
					routeAlias: '/alias', // 路由别名
				}
			] , 
		}，
		isLogin: false, // 进入页面前是否必须先登录
	    alias: [], // 别名
	    children: []	
    }

  }
  ```

- 一个路由信息要加载的组件`component`也是通过`render`方法创建的

  ```javascript
    component: {
            name: `router-view-${child.name}`,
            beforeRouteLeave,
            props: ['view'],
            render(h) {
                return renderView(h, this.view, self.appMeta)
            }
        }
  ```
  
- 上面代码中的`render`方法内部并不是直接执行的函数参数`h`方法，而是执行PAAS额外封装的`renderView`方法，接下来我们来分析下`renderView`方法

## renderView方法

```javascript
// node_modules/webapp/src/emulator/src/utils/renderView.js
export function renderView(h, view, appMeta) {
    let isTabView = false;
    let tabIndex = 0;
    if (appMeta.tabs && appMeta.tabs.items) {
        tabIndex = appMeta.tabs.items.findIndex(tabItem => tabItem.href && tabItem.href.name === view.name);
        if (tabIndex > -1) {
            isTabView = true
        }
    }
    const globalHeader = get(appMeta, 'common.body.header', {});
    const header = get(view, 'body.header', {});
    const footer = get(view, 'body.footer', {});
    const showHeader = isShowHeader(globalHeader, header);

    return h(
        'Page',
        {
            props: {
                showHeader,
                title: get(header, 'title', ''),
                showHeaderBack: !isTabView,
                showFooter: !footer.hide,
                pageStyle: view.style,
                headerStyle: header.style,
                footerStyle: footer.style
            }
        },
        [
            renderViewHeader(h, header, showHeader),
            renderViewArea(h, view, appMeta, renderAreaList),
            isTabView ? renderTabFooter(h, appMeta, tabIndex) : null
        ]
    )
}

```

`renderView`方法接收的参数：

- h: `render`的参数方法，创建VNode使用

- view: 路由信息

- appMeta: 元数据

- options：额外配置

`renderView`首先是从元数据获取一些配置信息，最后返回并执行`h()`

`h`方法是Vue内部创建VNode的方法，这里先简单解释一下它接收的参数：

- tag: {String | Object | Function}表示一个 HTML 标签名、组件、选项对象，或者

- data: 可选参数，表示VNode的数据，完整的数据对象如下

  ```
    {
      // 和`v-bind:class`一样的 API
      'class': {
        foo: true,
        bar: false
      },
      // 和`v-bind:style`一样的 API
      style: {
        color: 'red',
        fontSize: '14px'
      },
      // 正常的 HTML 特性
      attrs: {
        id: 'foo'
      },
      // 组件 props
      props: {
        myProp: 'bar'
      },
      // DOM 属性
      domProps: {
        innerHTML: 'baz'
      },
      // 事件监听器基于 "on"
      // 所以不再支持如 v-on:keyup.enter 修饰器
      // 需要手动匹配 keyCode。
      on: {
        click: this.clickHandler
      },
      // 仅对于组件，用于监听原生事件，而不是组件使用 vm.$emit 触发的事件。
      nativeOn: {
        click: this.nativeClickHandler
      },
      // 自定义指令. 注意事项：不能对绑定的旧值设值
      // Vue 会为您持续追踨
      directives: [
        {
          name: 'my-custom-directive',
          value: '2'
          expression: '1 + 1',
          arg: 'foo',
          modifiers: {
            bar: true
          }
        }
      ],
      // 如果子组件有定义 slot 的名称
      slot: 'name-of-slot'
      // 其他特殊顶层属性
      key: 'myKey',
      ref: 'myRef'
    }
  ```

- children：{String | Array} 表示子节点

回到PAAS的代码中

```javascript
return h(
    'Page',
    {
        props: {
            showHeader,
            title: get(header, 'title', ''),
            showHeaderBack: !isTabView,
            showFooter: !footer.hide,
            pageStyle: view.style,
            headerStyle: header.style,
            footerStyle: footer.style
        }
    },
    [
        renderViewHeader(h, header, showHeader),
        renderViewArea(h, view, appMeta, renderAreaList),
        isTabView ? renderTabFooter(h, appMeta, tabIndex) : null
    ]
)
```

执行`h`方法的第一个参数'page'，结合上文的`h`方法的介绍，可以知道`page`应该是个已经注册的了组件名，第二参数是给这个`page`组件传入的`props`属性，
第三个参数表示这个`page`组件中包含哪些子组件,这些子组件分别使用`renderViewHeader(h, header, showHeader)`、
` renderViewArea(h, view, appMeta, renderAreaList)`、`renderTabFooter(h, appMeta, tabIndex)`生成

![avatar](https://raw.githubusercontent.com/lanjz/Hello-Word/master/_static/images/1578314228749_1578314178.jpg)

从上图可以看到平时paas组做的组件是通过`renderViewArea(h, view, appMeta, renderAreaList)`渲染的

这里不细讲这些函数的具体实现了，因为它们内部也是调用`h`方法生成的。这里唯一让人困惑的是`h`方法的第一参数是要已经定义，比如引擎中`h`方法
的第一个参数是组件名的话，那这些组件在什么时候注册的呢？

# 注册全局组件

paas中的全局组件在这里分为两类，一类是内置的基础组件，一类是我们开发的业务组件

## 注册基础组件

内置的基础组件在入口文件`node_modules/webapp/src/engine/src/main.js`中注册的，我们要下具体代码

```javascript
import InnerComponents from '@engine/components'
import BaseComponents from '@components'
Vue.use(InnerComponents);
Vue.use(BaseComponents);
```

`BaseComponents`在`node_modules/webapp/src/engine/src/components/index.js`目录下

```javascript
/**
 * 全局注册内置组件
 */
import Page from './Page'
import TabMenu from './TabMenu'

const components = [
    Page,
    TabMenu,
];

export default {
    install(Vue) {
        components.forEach(component => Vue.component(component.name, component))
    },
    components
};

export {
    Page,
    TabMenu
}

```

这个文件是把所有内置组件导入并使用`Vue.component`方法注册成全局组件，可以也看到了上文中我们看到`page`组件

`InnerComponents`也是同理，它定义在`node_modules/webapp/src/component/packages/index.js`目录下

```javascript
/**
 * 全局注册内置组件
 */
import Banner from './banner'
import MenuGrid from './menu-grid'
// 就不一一列举了

const components = [
    Banner,
    MenuGrid,
    // 就不一一列举了
];

export default {
    install(Vue) {
        components.forEach(component => Vue.component(component.name, component))
    },
    components
};

export {
    Banner,
    MenuGrid,
    // 就不一一列举了
}

```

也是使用的`Vue.component(component.name, component)`注册的全局组件

## 注册业务组件

我们业务组件在引擎的`src`目录下并没有直接找到引用的地方，因为它们是通过`webpack`处理

我们查看`webpack`配置文件`module`部分有定义一个`rules`

```javascript
// node_modules/webapp/build/webpack.base.conf.js
 rules: [
            {
                test: /register\.js$/, // node_modules/webapp/src/biz/register.js
                include: [resolveUtils.resolve('src/biz')],
                loader: 'biz-loader'
            },
            ....
        ]
```
这个配置会使用自定义`loader` `biz-loader`处理`node_modules/webapp/src/biz/register.js`

首先`register.js`的内容

```javascript
import Vue from 'vue'
import router from '@platform/router'
import store from '@platform/store'
import { BODY_PARSER_PROPS as bodyProps } from '@utils/variable'
import { error } from '@platform/log'

export const modules = [];

/**
 * 根据 VueJS 组件特殊属性判断
 * @param options
 * @returns {boolean}
 */
function isVueOptions(options) {
    if (!options) {
        return false
    }
    return typeof options.template === 'string' || typeof options.render === 'function'
}

function getOptionItems(options = {}) {
    return Array.isArray(options) ? options : (options.items || [])
}

function registerBody(id, { body, component, name }) {
    const routeBody = body || component;
    if (routeBody) {
        if (typeof routeBody === 'function') {
            // 异步组件
            Vue.component(['parsed', id, name].join('-'), routeBody)
        } else {
            bodyProps.forEach(prop => {
                getOptionItems(routeBody[prop]).forEach((item, index) => {
                    // 增加 parsed 前缀，方便识别
                    Vue.component(['parsed', id, name, prop, index].join('-'), item)
                })
            });
            if (isVueOptions(routeBody)) {
                Vue.component(['parsed', id, name].join('-'), routeBody)
            }
        }
    }
}

/* eslint-disable */
function registerPlugin(id, module) {
    if (module && module.install) {
        modules.push(module)
    } else {
        error(`钩子组件${id ? `(${id})` : ''}不符合规范`)
    }
}

/* eslint-disable */
function registerComponent(id, { component, routes, storeModule }) {
    if (id && component) {
        Vue.component(id, component);
        if (routes) {
            routes.forEach(route => {
                const { body, component } = route;
                if (body || typeof component === 'function' || bodyProps.some(prop => component && !!component[prop])) {
                    registerBody(id, route)
                } else {
                    router.addRoutes([route])
                }
            })
        }
        const hasDefined = storeModule && store && store._modules
        if (hasDefined && store._modules.get && !store._modules.get([id])) {
            store.registerModule(id, storeModule)
        }
    }
}

```

这个文件只是定义了一些函数

在根据`webpack`配置查看自定义`loader`的配置位置

```javascript
  resolveLoader: {
        modules: ['node_modules', path.join(__dirname, './loader')]
    },
```

看下里面重点代码

```javascript
const fs = require('fs');
const path = require('path');
const argv = require('../argv').argv;
const loadJSON = require('../helper').loadJSON;
const parseComponents = require('../parseComponents');
const pluginIds = typeof argv.pluginIds === 'string' ? argv.pluginIds.split(',') : [];
const clients = typeof argv.clients === 'string' ? argv.clients.toLowerCase().split(',') : [];
const withMp = clients.indexOf('miniprogram') > -1

//开发者业务组件列表
let componentList = [];
const devComponentMap = {};

// 业务组件开发模式
console.log('argv', argv)
if (argv.devmode) {
    parseComponents(function (data) {
        const parsedDir = data.dir.replace(/\\/g, '/');
        componentList.push(parsedDir);
        devComponentMap[parsedDir] = data
    })
} else {
    componentList = require('../../src/biz/list')
}

function getComponentId(component) {
    return argv.devmode ? loadJSON(`${component}/package.json`).name : component
}

if (componentList.length) {
    console.log(
        '[Biz components include list]\n>',
        componentList.map(function (component) {
            return component + (pluginIds.indexOf(getComponentId(component)) > -1 ? '[hook]' : '')
        }).join('\n> ')
    );
}

function exists(dir) {
    return argv.devmode ?
        fs.existsSync(dir) && fs.existsSync(path.join(dir, 'index.js')) :
        fs.existsSync(path.join(__dirname, '../../node_modules', dir)) && fs.existsSync(path.join(__dirname, '../../node_modules', dir, 'index.js'))
}

function tryBlock(code, component) {
    return argv.devmode ? code : `
try {
    ${code}
} catch (e) {
    error(e, {tags: { component: '${ component }' }})
}`
}

function getPluginCode(component, componentId) {
    return exists(component) ? tryBlock(
        `registerPlugin('${ componentId }', require('${ component}').default || {})`,
        componentId
    ) : ''
}

function getComponentCode(component, componentId) {
    return exists(component + '/src') ? tryBlock(
        `registerComponent('${ componentId }', require('${ component}/src').default || {})`,
        componentId
    ) : ''
}

function genRegisterComponentCodes() {
    console.log('componentList',componentList)
    return componentList.map(function (component) {
        const componentId = getComponentId(component);
        // 非业务组件、钩子组件，忽略
        if (argv.devmode && devComponentMap[component] && !devComponentMap[component].isComponent) {
            return ''
        }
        return pluginIds.indexOf(componentId) === -1 ?
            getComponentCode(component, componentId) :
            getPluginCode(component, componentId)
    }).join('\n')
}

function getWxmlCodes() {
    const target = path.resolve(__dirname, '../MiniProgram/wxml').replace(/\\/g, '/')
    console.log('__dirname', __dirname)
    console.log('target', target)
    // 非最终构建，即引用组件或清除引擎缓存之后的构建
    const emulatorUse = argv.devmode === 'biz'
        || /buildDesigner\.js$/.test(argv['$0'])
        || /buildBiz\.js$/.test(argv['$0'])
    return (emulatorUse || withMp) ? `\
const MpComponents = require('${target}').default;
Vue.use(MpComponents);\n
` : ''
}

module.exports = function (source) {
    console.log('source', source)
    return source + ';\n' + getWxmlCodes() + genRegisterComponentCodes()
};


```

首先定义了一个`componentList`存放我们的业务组件，在开发环境下`componentList`通过`parseComponents`方法进行填充，下面是`parseComponents`的代码内容

```javascript
function parseComponents(callback) {
    if (config.isUnderNodeModules) {
        utils.parseComponents(path.join(__dirname, '../../..'), callback)
    } else {
        utils.parseComponents(path.join(__dirname, '..', 'example'), callback, true)
    }
}
```


开发环境下执行`utils.parseComponents(path.join(__dirname, '../../..'), callback)`，`path.join(__dirname, '../../..')`则定位到的是项目根目录路径，
将根路径传给`utils.parseComponents`函数：

```javascript
const deepDirs = ['packages', 'workspace', 'modules'];
function parseComponents(rootDir, cb, isNotDeep, checkFiles, filter, parent) {
    if (rootDir && fs.existsSync(rootDir)) {
        const dirList = fs.readdirSync(rootDir);
        dirList.forEach(biz => {
            const currentPath = path.join(rootDir, biz);
            if (isComponentDir(currentPath, checkFiles)) {
                if (filter.test(biz)) {
                    cb(parseComponent(currentPath, parent))
                }
            } else if (!isNotDeep && deepDirs.indexOf(biz) > -1) {
                parseComponents(currentPath, cb, isNotDeep, checkFiles, filter, biz)
            }
        });
    }
}
```

`parseComponents`函数中先是根据路径获取该路径下的所有文件并遍历他们，通过`isComponentDir(currentPath, checkFiles)`方法判断是否
是业务组件（通过文件下是否包含`index.js`或者`package.json`），如果符合的话执行`cb(parseComponent(currentPath, parent))`方法，
如果还是文件夹且名字是`['packages', 'workspace', 'modules']`中的一个则继续执行自身函数获取文件，接下来我们看下`parseComponent()`方法


```javascript
function parseComponent(dir, parent) {
    const packagePath = path.join(dir, 'package.json');
    const packageInfo = loadJSON(packagePath);
    const id = packageInfo.name || dir.replace(/\\/g, '/').split('/').pop();

    return Object.assign(
        {
            title: packageInfo.description || id
        },
        packageInfo.componentConfig,
        {
            dir: dir,
            id: id,
            type: 'biz',
            visible: pluginIds.indexOf(id) > -1 ? 0 : 1,
            isComponent: parent !== 'modules' || pluginIds.indexOf(id) > -1
        }
    )
}

```

`parseComponent`方法则是通过读取`package.json`文件获取`id`信息，然后返回当前目录的一些基本信息`dir`（目录路径）、`id`、`isComponent`（是否是业务组件）等

回到`biz-loader`，这些组件信息就存入`componentList`中

最后看下loader的导出结果

```javascript
module.exports = function (source) {
    console.log('source', source)
    return source + ';\n' + getWxmlCodes() + genRegisterComponentCodes()
};
```

直接返回`register.js`内容加上两个函数`getWxmlCodes()`、`genRegisterComponentCodes()`的返回结果,这里我们关注一下`genRegisterComponentCodes()`方法

```javascript
function genRegisterComponentCodes() {
    console.log('componentList',componentList)
    return componentList.map(function (component) {
        const componentId = getComponentId(component);
        // 非业务组件、钩子组件，忽略
        if (argv.devmode && devComponentMap[component] && !devComponentMap[component].isComponent) {
            return ''
        }
        return pluginIds.indexOf(componentId) === -1 ?
            getComponentCode(component, componentId) :
            getPluginCode(component, componentId)
    }).join('\n')
}

```

`genRegisterComponentCodes()`方法中遍历`componentList`，即上文收集到所以组件信息，`pluginIds`指的是钩子组件如`b2c-jssdk`、`broker-common`，这些
不算业务组件
对于业务组件执行`getComponentCode(component, componentId)`

```javascript
function getComponentCode(component, componentId) {
    return exists(component + '/src') ? tryBlock(
        `registerComponent('${ componentId }', require('${ component}/src').default || {})`,
        componentId
    ) : ''
}
```

然后会执行`registerComponent`方法，`registerComponent`函数定义在`register.js`中

```javascript
function registerComponent(id, { component, routes, storeModule }) {
    if (id && component) {
        Vue.component(id, component);
        if (routes) {
            routes.forEach(route => {
                const { body, component } = route;
                if (body || typeof component === 'function' || bodyProps.some(prop => component && !!component[prop])) {
                    registerBody(id, route)
                } else {
                    router.addRoutes([route])
                }
            })
        }
        const hasDefined = storeModule && store && store._modules
        if (hasDefined && store._modules.get && !store._modules.get([id])) {
            store.registerModule(id, storeModule)
        }
    }
}
```

在这里终于找到了`Vue.component(id, component)`，在这里注册我们编写的业务组件同时处理组件中的路由和`store`等


vue中使用`<component v-bind:is="currentView"></component>`创建动态组件


```html
 <component :is="view"></component>
```

```javascript
  computed: {
    view() {
      const vm = this;
      return {
        render(h) {
          return renderView(h, vm.meta.views[0]);
        }
      };
    }
  }
```

上面的例子`view`就是一个组件，平时我们定义组件常用的方式是用`Vue.component`注册组件，如下

```
Vue.component('my-component', {
  template: '<div>A custom component!</div>',
  data: function () {
      return {}
    },
  props: []
})

```

而paas中是通过`render`方法代替组件，之所以能这样是因为在Vue在处理所有的组件时最终都会转换成`render`方法

## Vue的渲染机制

模板||el||template=》`AST`=>`codegen`=>render方法=》VNode

无论我们是用单文件`.vue`还是写了`el`、`template`属性，最终都会转换成`render`方法，
这就是官网所说的为什么`render比模板更接近编译器`原因

其次，Vue允许自定义`render`方法，并且当存在`render`方法时就直接使用定义的`render`方法

这就是paas组件可以直接返回`render`做为组件的原因了

## render

> [render Api](https://cn.vuejs.org/v2/api/#render)
> [render说明](http://doc.vue-js.com/v2/guide/render-function.html)

- 类型: `(createElement: () => VNode) => VNode`

- 详细：

  字符串模板的代替方案，允许你发挥`JavaScript`最大的编程能力。该渲染函数接收一个`createElement`方法作为第一个参数用来创建`VNode`。

  如果组件是一个函数组件，渲染函数还会接收一个额外的`context`参数，为没有实例的函数组件提供上下文信息。

  Vue选项中的`render`函数若存在，则Vue构造函数不会从`template`选项或通过`el`选项指定的挂载元素中提取出的`HTML`模板编译渲染函数。
  
**简单来说`render`中的参数`createElement方法`就是创建VNode的方法**
 
## `render`比模板更接近编译器

这里简单介绍一个模板到VNode的过程：模板=》`AST`=>`codegen`=>render方法=》patch =》VNode

也就是说模板最终也会转换成`render`方法，这就是为什么`render`比模板更接近编译器原因，因为这里省了模板到`AST`
再到`render`方法的转换过程

## `render`使用

`render`本质是执行函数参数`createElement`方法，这个`createElement`的作用就是生成VNode

`createElement`接收参数如下：

- tag: {String | Object | Function}表示一个 HTML 标签名、组件选项对象，或者

- data: 可选参数，表示VNode的数据，完整的数据对象如下

  ```
    {
      // 和`v-bind:class`一样的 API
      'class': {
        foo: true,
        bar: false
      },
      // 和`v-bind:style`一样的 API
      style: {
        color: 'red',
        fontSize: '14px'
      },
      // 正常的 HTML 特性
      attrs: {
        id: 'foo'
      },
      // 组件 props
      props: {
        myProp: 'bar'
      },
      // DOM 属性
      domProps: {
        innerHTML: 'baz'
      },
      // 事件监听器基于 "on"
      // 所以不再支持如 v-on:keyup.enter 修饰器
      // 需要手动匹配 keyCode。
      on: {
        click: this.clickHandler
      },
      // 仅对于组件，用于监听原生事件，而不是组件使用 vm.$emit 触发的事件。
      nativeOn: {
        click: this.nativeClickHandler
      },
      // 自定义指令. 注意事项：不能对绑定的旧值设值
      // Vue 会为您持续追踨
      directives: [
        {
          name: 'my-custom-directive',
          value: '2'
          expression: '1 + 1',
          arg: 'foo',
          modifiers: {
            bar: true
          }
        }
      ],
      // 如果子组件有定义 slot 的名称
      slot: 'name-of-slot'
      // 其他特殊顶层属性
      key: 'myKey',
      ref: 'myRef'
    }
  ```

- children：{String | Array} 表示子节点

这里着重了解一下`createComponent`第一个参数`tag`，`tag`可有的类型以及对应的内部处理大致如下

- 如果是`String`类型

  - 选判断如果是内置的一些节点，则直接创建一个普通`VNode`

  - 如果是为已注册的组件名，则通过`createComponent`创建一个组件类型的`VNode`

-  如果是`tag`一个 Component 类型，则直接调用`createComponent`创建一个组件类型的`VNode`节点

- 其它类型先略过

例子：

```html
<div id="app">
  {{ message }}
</div>
```

相当于我们编写的如下`render`函数:

```javascript
render: function (createElement) {
  return createElement('div', {
     attrs: {
        id: 'app'
      },
  }, this.message)
}
```

上文的`render`方法，表示创建一个`id=app`的`div`，这个`div`内部有一个节点`this.message`, `this.message`
在这里表示是一个文本节点

给合render方法我们模拟实现异步语法元数据，并动态渲染组件的例子：

```javascript
  import PageIndex from './page/index.vue'
  export default {
    name: 'App',
    data() {
      return {
        meta: '是谁'
      }
    },
    components: {
      // 'Page': PageIndex
    },
    computed: {
      view() {
        console.log('this.meta', this.meta)
        const vm = this
        return {
          render(createElement) {
            return createElement('Page', {
              props: {
                meta: vm.meta
              }
            })
          }
        }
      }
    },
    mounted() {
      setTimeout(() => {
        this.meta = 'lanjz'
      }, 2000)
    }
  }
</script>
```

例子中`createElement`方法第一个参数`Page`是个我们已经注册好的全局组件

到这里我们就已经明白Paas元数据是怎么注入到组件中

## Paas的组件是什么时候注册为全局组件的
