# render

> [Vue render方法](https://cn.vuejs.org/v2/api/#render)

- 类型: `(createElement: () => VNode) => VNode`

- 详细：

  字符串模板的代替方案，允许你发挥`JavaScript`最大的编程能力。该渲染函数接收一个`createElement`方法作为第一个参数用来创建`VNode`。

  如果组件是一个函数组件，渲染函数还会接收一个额外的`context`参数，为没有实例的函数组件提供上下文信息。

  Vue选项中的`render`函数若存在，则Vue构造函数不会从`template`选项或通过`el`选项指定的挂载元素中提取出的`HTML`模板编译渲染函数。
  
从官方的定义我们看出`render`的作用就是模板
 
## `render`比模板更接近编译器

这里简单介绍一个模板到VNode的过程：模板=》`AST`=>`codegen`=>render方法=》VNode

也就是说模板最终也会转换成`render`方法，这就是为什么`render`比模板更接近编译器原因

## `render`使用

`render`内部是执行函数参数`createElement`方法，这个`createElement`的作用就是生成VNode

`render`接收参数如下：

- tag: 表示标签

- data: 表示VNode的数据

- children：表示子节点

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
  }, this.message) // this.message表示文本子节点
}
```


