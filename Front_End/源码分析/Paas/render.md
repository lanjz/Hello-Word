
# PAAS如何生成页面

PAAS如何生成页面也就是如果生成Vue组件

vue中使用`<component v-bind:is="currentView"></component>`创建动态组件

结合paas机制，现在的问题就变成了如何动态生成组件

先看下paas在这块的实现方式

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
