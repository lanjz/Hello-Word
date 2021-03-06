# 模板到真实DOM经历了什么？

这里通过一个例子来介绍下 VUE 中模板到真实 DOM 需要哪些过程：

```html
<div class="page">
	{{name}}的列表:<span v-for="(item, index) in list" :key="index">{{item}}</span>
</div>
```

## 模板解析

模板解析就是通过正则手段对模板字符串进行解析，生成 AST 抽象语法树，我们例子解析完成得到以下 AST：
  
```javascript
{
	type:1,
	tag:"div",
	attrsList:[],
	attrsMap:{
		class:"page"
	},
	rawAttrsMap:{},
	plain:false,
	staticClass:""page"",
	children:[
		{
			type:2,
			expression:"_s(name)+"的列表:"",
			tokens:[
				{
					@binding:"name"
				},
				"的列表："
			],
			text: "{{name}}的列表:"
		},
		{
			alias: "item",
			attrsList: [],
			attrsMap: {
				":key": "index",
				"v-for": "(item, index) in list"
			},
			children: [
				{
					expression: "_s(item)"
					text: "{{item}}",
					tokens: [
						{
							@binding: "item"
						}
					]
				}
			],
			for: "list"
			forProcessed: true
			iterator1: "index"
			key: "index",
			parent: (父级的引用),
			plain: false
			pre: undefined,
			rawAttrsMap: {},
			tag: "span"
			type: 1
		}
	
	],
}
```

## 将AST转换成函数字符串

Vue中模块最终都会转换成 `render` 函数，这个 `render` 函数的作用是用于生成`VNode`。`VNode` 就是 `Virsual DOM` ，简单理解它就是 `DOM` 的 JS 对象表示

可能有人会疑惑这跟上文的 `ast` 有什么区别，这个下文会解释

上文AST首先会转换成函数字符串

```js
"with(this){return _c('div',{staticClass:"page"},[_v(_s(name)+"的列表:"),_l((list),function(item,index){return _c('span',{key:index},[_v(_s(item))])})],2)}"
```

通过`new Function`方法将函数字符串转换成可执行函数，生成 `render` 方法

上文的 ` _c`， `_v` 都是 Vue 内置的一些方法，作用都是生成 `VNode`。比如例子中一开始是渲染一个`<div class="page"></div>` 那么这个节点将转换成 `_c('div',{staticClass:"page"}，[])` 字符串,这个 `_c` 是一个已经定义好的的函数，作用就是生成一个 `VNode`，接收的主要参数就是标签名、属性、及子元素

再比如 `v-for` 则使用 `_l` 方法进行渲染, `_l` 表示使用列表渲染，它将循环生成 `VNode`，从上文的转换结果可以看 `_l` 的第一个参数就是渲染源数据 `list`，每二个参数则是一个具体渲染子节点 `VNode` 的方法
  
除了 `_c` 、 `_l`，`Vue` 中还内置其它的生成 `VNode` 方法，如 `_v` 对应 `createTextVNode` 创建文本 `VNode`、`_s` 是生成字符串方法等等等等等等等，这里就不一一列表了
  
##　通过`render`方法，创建VNode

上文中 `render` 方法开始是 `with(this)`，函数体中用到变量都从这个 `this` 中获取，在 Vue 中这个 `this` 是指向Vue实例的，这里作为演示，我们使用一个简单对象调用 `render` 方法

```javascript
const data = { name: 'lanjz', list: ['A', 'B'] } //
render.call(data)
```

得到如下 `VNode`

```javascript
VNode{
	context: 'div',
	tag: {
		staticClass: "page"
	},
	text: undefined,
	children: [
		VNode{
			text: "lanjz的列表:",
			children: undefined
		},
		VNode{
			key: "__vlist_1_0__",
			tag: {
				key: 0
			},
			context: "span",
			text: undefined,
			children: [
				VNode{
					text: "A",
					context: undefined
				}
			]
		},
		VNode{
			key: "__vlist_1_1__",
			tag: {
				key: 1
			},
			text: undefined,
			context: "span",
			children: [
				VNode{
					text: "B",
					context: undefined
				}
			]
		}
	]
	
}

```  

上面的 VNode 对象做了简化，可以看到其实结构跟之前 AST 对象有点相似，都是使用JS对象表示 `DOM` 元素节点，他们具体的区别是什么呢？

- AST只是模板的对象表示，并没结合具体的 `data` 值进行渲染

- `VNode` 是结合了 `vue指令` 和 `data` 值最终渲染出的 `DOM` 的对象描述

## 渲染成真实DOM

这一步就是遍历 `VNode` 转生成真实DOM，并插入到浏览器视图中

# 总结

`template => AST => Render => VNode => DOM`


  
  
  
  
  
  
  


