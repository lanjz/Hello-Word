# v-model

平时我们会把Vue中数据响应，发生视图变化的过程理解为双向绑定，原来这样理解并不是完全正常的。所谓双向绑定，从字面上它的意思应该是
当视图上发生变化数据也会变化、反之数据发生变化视图也能跟着变化，这是一个相互影响的过程，在Vue中，我们知道可以通过数据的改变去驱动 DOM 视图的变化，
但是真实做到改变视图驱动数据变化我们需要通过特定指令来实现比如`v-model`

之前已经分析过模板如何渲染成真实DOM，接下来分析一下当模板中带有`v-model`时，解析过程是如何处理的，
假设模板为`<div id="app"><input v-model ="name" :class="name" /></div>`

## 模板到AST阶段

在解析模板阶段，Vue源码中处理`v-model`指令时，执行的步骤是`closeElement(el) => processElement(el) => processAttrs(el) =>addDirective(el)`，

`el`是一个节点的解析结果，它包含了标签名，属性等信息，这里我们关注的属性信息，节点的属性分别保存在`attrsList`（数组）和`arrtsMap`（对象）中，
`input`的结构如下：

```javascript
{
	tag: "input",
	attr: [
		{
			{name: "v-model", value: "name"},
			{name: "test", value: "test"}
		}
	],
	attrsMap: {
		:class: "name",
		test: "test",
		v-model: "name"
	}
}
```

- 遍历`el`中的属性，查找是否包含指令的属性,然后提取这个指令信息，添加到`directives`属性中

  ```javascript
    {
        tag: "input",
        attr: [
            {
                {name: "v-model", value: "name"},
                {name: "test", value: "test"}
            }
        ],
        attrsMap: {
            :class: "name",
            test: "test",
            v-model: "name"
        },
        directives: [
      	{name: "model", rawName: "v-model", value: "name", arg: null, isDynamicArg: false}
      ]
    }
  ```

## AST转换成`render`函数阶段

源码中的处理流程：`generate(ast)=>genElement(el)=>genData(el)=>genDirectives(el)`

遍历`directives`属性时，对于`v-model`将做以下两件事情：

- 添加事件：如果是标签是`input`且含有`v-model`指定时，默认添加一个`input`事件，执行内容为`name=$event.target.value`

- 添加`value`属性：给`input`添加属性`value="name"`

转换成模板如下：

```javascript
<input
  v-bind:value="name"
  v-on:input="name=$event.target.value">
```

其实就是动态绑定了`input`的`value`指向了`name`变量，并且在触发`input`事件的时候去动态把`name`设置为目标值，
这样实际上就完成了数据双向绑定了，所以说`v-model`实际上就是语法糖

对于我们例子而言，最终生成的`render`代码如下：

```javascript
with(this){
	return _c('div',
	{attrs:{"id":"app"}},
	[
		_c('input',
		{
			directives:[{name:"model",rawName:"v-model",value:(name),expression:"name"}],
			class:name,
			attrs:{"test":"test"},domProps:{"value":(name)},
			on:{"input":function($event){if($event.target.composing)return;name=$event.target.value}}})
	])}
```

# 总结

原来`v-model`就是自动帮我们添加赋值属性和绑定事件
