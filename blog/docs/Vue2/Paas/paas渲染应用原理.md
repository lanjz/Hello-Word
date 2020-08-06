
# PAAS动态创建应用机制

回顾一下一个PAAS应用的加载过程：

浏览器打开PAAS应用时（https://webapp.mypaas.com.cn/b2c/yk_qmyx/test/?tenant_code=yajuleadmin_test），
先是发出`meta`请求获取到元数据，这个元数据包含了当前应用的一些配置信息，然后才显示页面，本文就是了解下通过请求得到元数据到页面展示之间发生了什么事情

> PAAS动态创建应用的核心是使用了VUE提供的`render`方法，Vue`render`方法的作用生成VNode，所以在正式讲PAAS之前先简单介绍一下`render`方法


# render

> [render Api](https://cn.vuejs.org/v2/api/#paas渲染应用原理.md)
> [render说明](http://doc.vue-js.com/v2/guide/render-function.html)

- 类型: `(createElement: () => VNode) => VNode`

- 详细：

  字符串模板的代替方案，允许你发挥`JavaScript`最大的编程能力。该渲染函数接收一个`createElement`方法作为第一个参数用来创建`VNode`。

  如果组件是一个函数组件，渲染函数还会接收一个额外的`context`参数，为没有实例的函数组件提供上下文信息。

  Vue选项中的`render`函数若存在，则Vue构造函数不会从`template`选项或通过`el`选项指定的挂载元素中提取出的`HTML`模板编译渲染函数。
  
**简单来说`render`中的参数`createElement方法`就是创建VNode的方法**

我们来简单例子演示一下`render`方法的使用

```javascript
import components1 from './components1.vue'
Vue.component('components-1', components1)
```
组件`component`的内容是一下包含`h1`的标题DOM

```javascript
<h1>components-1</h1>
```


上面例子我们使用平时学用的注册组件的方法

接下来我们使用`render()`实现上面的效果

```javascript
	Vue.component('components-2', {
		render: function (createElement) {
			return createElement(
				'h1',
				{},
				['components-1']
			)
		}
	})
```

效果跟之前是一样的，同时可以看到我们提供`render`方法实际是执行它的参数`createElement`方法

## 为什么可以使用`render`方法创建组件

这里简单介绍一下Vue的渲染机制

![avatar](https://raw.githubusercontent.com/lanjz/Hello-Word/master/_static/images/1578393221966_%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_20200107181533A.png)

实例化一个Vue和组件时候可以是DOM元素、DOM字符、Vue模板

- 初始Vue项目时使用el属性

  ```javascript
  	var app = new Vue({
  		el: '#app', // id为app的DOM元素
  		data: {}
  	})
  ```

- 注册组件Vue模板时使用字符串

  ```javascript
    Vue.component('components-1', {template: '<h1>components-2</h1>'})
  ```
  
- 注册组件Vue模板时使用导入的Vue组件

  ```javascript
    Vue.component('components-1', components1)
  ```
  
无论是`el`元素还是Vue模板都会首先都会转为一个`dom`字符串，然后通过正则方式转换成AST语法树，
每个AST元素保存这个元素的标签、属性、Vue动态属性等，然后再通过`codegen`和`new Functon`
转换成`render`函数，这个`render`可以生成VNode

总而言之，我们的组件最终都会转换在成`render`方法，这也是为什么官网介绍`render`时有这么一句话
**`render`比模板更接近编译器**的原因

也就是说当实例组件时，如果有`render`方法那么就直接使用这个`render`方法，接下再看`render`的参数`createElement`的使用

## createElement

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

上文的`createElement`方法，表示创建一个`id=app`的`div`，这个`div`内部有一个节点`this.message`, `this.message`
在这里表示是一个文本节点

对`render`方法有了一些了解之后，接下来我们开始正入正题

# 元数据&创建应用

先简单看下PAAS引擎中的入口函数，这里为了方法阅读，对代码做了删减，关注重点即可

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

上面代码先是实例化了一个`$instance`实例，然后再调用`$mount`方法，把`$instance`挂载到`#app`元素中，
至于`$instance`的内容可以看到是通过`render`方法创建的，这里的`h`方法对应的上文中`createComponent`方法，上文介绍`createComponent`
时说过第一个参数可以接收`DOM`字符串、Vue组件等，这里的`App`就是一个`import`进来的Vue组件
这个`$instance`实例创建时会执行`store.dispatch(appTypes.GET_APP_META)`方法请求元数据

> [Vue.$mount](http://doc.vue-js.com/v2/api/#vm-mount)如果Vue实例在实例化时没有收到`el`选项，则它处于“未挂载”状态，没有关联的 DOM 元素。可以使用`vm.$mount()`手动地挂载一个未挂载的实例。

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

回到PAAS的代码中,看下`h`方法的使用

执行`h`方法的第一个参数'page'，结合上文的`h`方法的介绍，可以知道`page`应该是个已经注册的了组件名，第二参数是给这个`page`组件传入的`props`属性，
第三个参数表示这个`page`组件中包含哪些子组件,这些子组件分别使用`renderViewHeader(h, header, showHeader)`、
` renderViewArea(h, view, appMeta, renderAreaList)`、`renderTabFooter(h, appMeta, tabIndex)`生成

![avatar](https://raw.githubusercontent.com/lanjz/Hello-Word/master/_static/images/1578314228749_1578314178.jpg)

从上图可以看到我们平时开发paas组做的组件是通过`renderViewArea(h, view, appMeta, renderAreaList)`渲染的

这里不细讲这些函数的具体实现了，因为它们内部也是调用`h`方法生成的。看到这里就可以大致明白PAAS的应用动态创建组件并且把元数据传入到组件中了

这里唯一让人困惑的是`h`方法的第一参数是要已经定义好的组件，那么这些组件在什么时候注册的呢？

# 注册组件

paas中的组件在这里分为两类，一类是内置的基础组件，一类是我们开发的业务组件（包括钩子组件）

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

这个文件是把所有内置组件导入并使用`Vue.component`方法注册成全局组件，可以也看到上文中我们看到`page`组件也是在这里注册的

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

也是使用的`Vue.component(component.name, component)`注册的组件

## 注册业务组件

我们业务组件在引擎的`src`目录下并没有直接找到引用的地方，因为它们是通过`webpack`构建项目时处理的

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
这个配置会使用自定义`loader` `biz-loader`处理`node_modules/webapp/src/biz/register.js`文件，这个loader就是注册业务组件的关键

首先我们先看下`register.js`的内容

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

我们先看下`biz-loade`的作用，根据`webpack`配置可找到自定义`loader`的配置位置

```javascript
  resolveLoader: {
        modules: ['node_modules', path.join(__dirname, './loader')]
    },
```

下面是`biz-loade.js`的代码

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

首先定义了一个数组`componentList`，这个数组就是存放我们的业务组件||钩子组件信息的地方，
在开发环境下`componentList`通过`parseComponents`方法进行填充，
它实际又调用了`utils.parseComponents(path.join(__dirname, '../../..'), callback)`方法
这里给`utils.parseComponents`传递一下参数，这个参数是一下路径，这个路径是哪儿？就是我们项目根目录的路径

接下来我们看下`utils.parseComponents`的定义

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
是业务组件||钩子组件（通过文件下是否包含`index.js`或者`package.json`），如果符合的话执行`cb(parseComponent(currentPath, parent))`方法，
如果文件夹且名字是`['packages', 'workspace', 'modules']`中的一个则继续执行自身函数获取文件，这些是我们开发的组件存放的地方，
接下来我们看下`parseComponent()`方法


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

`parseComponent`方法则是通过读取`package.json`文件，然后返回当前组件目录的一些基本信息`dir`（目录路径）、`id`、`isComponent`（是否是业务组件||钩子组件）等

回到`biz-loader`，这些组件信息就存入`componentList`数组中了

最后看下`biz-loader`的导出结果

```javascript
module.exports = function (source) {
    return source + ';\n' + getWxmlCodes() + genRegisterComponentCodes()
};
```

直接返回`register.js`内容加上两个函数`getWxmlCodes()`、`genRegisterComponentCodes()`的返回结果,这里我们重点关注一下`genRegisterComponentCodes()`方法

```javascript
function genRegisterComponentCodes() {
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
`genRegisterComponentCodes()`方法中遍历`componentList`，即上文收集到所以组件信息，然后根据钩子组件还是业务组件执行不同的方法

这里我们先看业务组件的处理，它是执行`getComponentCode(component, componentId)`

```javascript
function getComponentCode(component, componentId) {
    return exists(component + '/src') ? tryBlock(
        `registerComponent('${ componentId }', require('${ component}/src').default || {})`,
        componentId
    ) : ''
}
```

这里返回的一个执行函数的字符串，这些函数将在`register.js`文件被读取时执行。

`register.js`被loader处理后代码如下

```javascript
import Vue from 'vue';
import router from '@platform/router';
import store from '@platform/store';
import { BODY_PARSER_PROPS as bodyProps } from '@utils/variable';
import { error } from '@platform/log';

export var modules = [];

function isVueOptions(options) {
    if (!options) {
        return false;
    }
    return typeof options.template === 'string' || typeof options.render === 'function';
}

function getOptionItems() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    return Array.isArray(options) ? options : options.items || [];
}

function registerBody(id, _ref) {
    var body = _ref.body,
        component = _ref.component,
        name = _ref.name;

    var routeBody = body || component;
    if (routeBody) {
        if (typeof routeBody === 'function') {
            Vue.component(['parsed', id, name].join('-'), routeBody);
        } else {
            bodyProps.forEach(function (prop) {
                getOptionItems(routeBody[prop]).forEach(function (item, index) {
                    Vue.component(['parsed', id, name, prop, index].join('-'), item);
                });
            });
            if (isVueOptions(routeBody)) {
                Vue.component(['parsed', id, name].join('-'), routeBody);
            }
        }
    }
}

function registerPlugin(id, module) {
    if (module && module.install) {
        modules.push(module);
    } else {
        error('\u94A9\u5B50\u7EC4\u4EF6' + (id ? '(' + id + ')' : '') + '\u4E0D\u7B26\u5408\u89C4\u8303');
    }
}

function registerComponent(id, _ref2) {
    var component = _ref2.component,
        routes = _ref2.routes,
        storeModule = _ref2.storeModule;

    if (id && component) {
        Vue.component(id, component);
        if (routes) {
            routes.forEach(function (route) {
                var body = route.body,
                    component = route.component;

                if (body || typeof component === 'function' || bodyProps.some(function (prop) {
                    return component && !!component[prop];
                })) {
                    registerBody(id, route);
                } else {
                    router.addRoutes([route]);
                }
            });
        }
        var hasDefined = storeModule && store && store._modules;
        if (hasDefined && store._modules.get && !store._modules.get([id])) {
            store.registerModule(id, storeModule);
        }
    }
};
// 下面是loader处理添加的代码
const MpComponents = require('D:/Project/p_qudao/yunke-paas/node_modules/webapp/build/MiniProgram/wxml').default;
Vue.use(MpComponents);


registerPlugin('b2c-jssdk', require('D:/Project/p_qudao/yunke-paas/modules/b2c-jssdk').default || {})
registerPlugin('broker-common', require('D:/Project/p_qudao/yunke-paas/modules/broker-common').default || {})



registerComponent('b2c-bespeak-house', require('D:/Project/p_qudao/yunke-paas/packages/b2c-bespeak-house/src').default || {})
registerComponent('b2c-broadcast', require('D:/Project/p_qudao/yunke-paas/packages/b2c-broadcast/src').default || {})
registerComponent('b2c-my-listmenu', require('D:/Project/p_qudao/yunke-paas/packages/b2c-my-listmenu/src').default || {})
registerComponent('b2c-search', require('D:/Project/p_qudao/yunke-paas/packages/b2c-search/src').default || {})

```

那么`register.js`被调用时，将执行这些`registerPlugin`、`registerComponent`方法，在`registerComponent`函数的定义中
终于找到了`Vue.component(id, component)`，在这里注册我们编写的业务组件的同时还处理组件中的路由和`store`等

回到PAAS应用的入口函数可以找到`register`确实会引入了

```javascript
import { modules } from '@root/biz/register'
```

致此，原来我们的业务是这么注册进来~

# 例子

这例子需要实现的功能

- 结合`webpack`配置注册全局

- 使用`render方法`渲染组件

- 异步获取元数据，并动态更新组件

例子使用`Vue-cli`初始的项目，首页添加`register.js`文件

```javascript
// src/biz/register.js
import Vue from 'vue'

function registerComponent(com) {
  console.log('com', com)
  Vue.component('page1', com)
}
export default function () {
  console.log('加载了register')
}

```

`register`内容很简单，提供一个注册组件的方法

然后给`webpack`添加处理`register.js`的`Loader`

```javascript
// build/loader/biz-loader.js
const fn = `registerComponent(require('../page/index.vue').default)`
module.exports = function (source) {
  const abc = source + ';\n' + fn
  console.log('source', abc)
  return abc
};

```

`biz-loader`Loader的内容也很简单，就是添加一个`registerComponent(require('../page/index.vue').default)`的执行方法，
这里直接传入我们要动态注册的组件的路径

然后添加loader配置

```javascript
// build/webpack.base.conf.js
  module: {
    rules: [
      {
        test: /register\.js$/,
        include: resolve('src/biz'),
        loader: 'biz-loader'
      },
     // ....
    ]
  },
```

在入口函数中引入`register.js`

```javascript
import register from './biz/register'
```
然后在挂载组件`App.vue`使用`setTimeout`方法模拟异步更新数据，并加载组件

```javascript
<template>
  <div id="app">
    <comment :is="view"></comment>
  </div>
</template>
<script>
  export default {
    name: 'App',
    data() {
      return {
        meta: '是谁'
      }
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

运行后页面将显示如下效果

![avatar](https://raw.githubusercontent.com/lanjz/Hello-Word/master/_static/images/1578400055111_%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_20200107202720.png)

两秒页面将更新

![avatar](https://raw.githubusercontent.com/lanjz/Hello-Word/master/_static/images/1578400104137_%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_20200107202725.png)


