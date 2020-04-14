# Vue 组件通信方式

## `props` / `$emit `

父组件通过`props`的方式向子组件传递数据，而子组件通过`$emit`父组件通信

**通信范围**

父子组件

## `update:myPropName`

```
<comA @update:title="title = $event"></comA>
```  

```
// comA

this.$emit('update:title', 'newTitle')
```      

## .sync

`update:myPropName`的简写

```
<comA :title.sync="title"></comA>
```


## $children / $parent

- `$children`：当前组件包含的子组件实例数组。需要注意 `$children` 并不保证顺序，也不是响应式的。

- `$parent`: 当前组件对应的父组件实例

> 要注意边界情况，如在`#app`上拿`$parent`得到的是`new Vue()`的实例，在这实例上再拿`$parent`得到的是`undefined`，
> 而在最底层的子组件拿`$children`是个空数组。也要注意得到`$parent`和`$children`的值不一样，`$children` 的值是数组，而`$parent`是个对象

**通信范围**
 
父子组件

## provide/ inject

这对选项需要一起使用，以允许一个祖先组件向其所有子孙后代注入一个依赖，不论组件层次有多深，并在起上下游关系成立的时间里始终生

- `provide`: 选项应该是一个对象或返回一个对象的函数。该对象包含可注入其子孙的属性。在该对象中你可以使用 1ES2015 Symbols` 作为 `key`，
  但是只在原生支持 `Symbol` 和 `Reflect.ownKeys` 的环境下可工作
  
- `inject`: 选项应该是:

  - 一个字符串数组
  
  - 一个对象，对象的 key 是本地的绑定名，value 是：
  
    - 在可用的注入内容中搜索用的 key (字符串或 Symbol)
    
    - 一个对象，该对象的：
    
      - from 属性是在可用的注入内容中搜索用的 key (字符串或 Symbol)
      
      - default 属性是降级情况下使用的 value
      
```
// 父组件
provide () {
    return {
        provideData: this.provideData
    }
},
data:function () {
    return {
        show: false,
        arr: [1,2,3],
        provideData: {
            name: 'lanjz'
        }
    }
}
```
```
// 子组件
inject: ['provideData']
```

注意点：

- 如果`provide`里的属性要使用 组件实例 中的数据，则必需使用函数的形式，如果只是表态数据则可以使用 对象 的形式

- 如果希望`provide`是响应式的，即子组件能跟着 父组件的 `provide`变化而变化，那么 `provide`的值需要是一个对象，那么这个对象里的属性将是可更新
  > 官方解释：provide 和 inject 绑定并不是可响应的。这是刻意为之的。然而，如果你传入了一个可监听的对象，那么其对象的属性还是可响应的

**通信范围**
 
父对子，且可多层

## ref/ refs

如果在普通的 DOM 元素上使用，引用指向的就是 DOM 元素；如果用在子组件上，引用就指向组件实例，可以通过实例直接调用组件的方法或访问数据

## eventBus

`eventBus` 又称为事件总线，在vue中可以使用它来作为沟通桥梁的概念, 就像是所有组件共用相同的事件中心，可以向该中心注册发送事件或接收事件， 所以组件都可以通知其他组件

初始化一个事件总线
```
// event-bus.js

import Vue from 'vue'
export const EventBus = new Vue()
```

发送事件
```
import {EventBus} from './event-bus.js'
EventBus.$emit('addition', {})
```

接收事件
```
import {EventBus} from './event-bus.js'
EventBus.$on('addition', param => {})
```                

移除事件总线

```
mport { EventBus } from './event-bus.js'
EventBus.$off('addition', {})
```        

移除所有事件总线

```
EventBus.$off()
```

````


## VueX

## $attrs与 $listeners

- $listeners: 包含了父作用域中的 (不含 .native 修饰器的) v-on 事件监听器。它可以通过 v-on="$listeners" 传入内部组件——在创建更高层次的组件时非常有用

- $attrs:   包含了父作用域中不作为 prop 被识别 (且获取) 的 attribute 绑定 (class 和 style 除外)。当一个组件没有声明任何 prop 时，
这里会包含所有父作用域的绑定 (class 和 style 除外)，并且可以通过 v-bind="$attrs" 传入内部组件——在创建高级别的组件时非常有


## `update:myPropName`

