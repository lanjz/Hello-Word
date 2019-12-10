# 模板到真实DOM经历了什么？

> 文章会尽可能少的赋加源码，如果想到知道这块内容对应的源码内容可以看[Vue.js技术揭秘](https://ustbhuangyi.github.io/vue-analysis/v2/data-driven/render.html)，
中数据驱动和编译两大章

这里用一个简单模板做为例子：`<div class="page">{{name}}的列表:<span v-for="(item, index) in list" :key="index">{{item}}</span></div>`

## 模板到真实DOM的渲染大致经历如下过程

- 以正则方式解析模板字符串，生成AST语法树

  经过这一步上文模板将解析成如下对象
  
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
			parent: (parent的引用),
			plain: false
			pre: undefined,
			rawAttrsMap: {},
			tag: "span"
			type: 1
		}
	
	],
}
````

- 将AST语法树转换成函数字符串

  `"with(this){return _c('div',{staticClass:"page"},[_v(_s(name)+"的列表:"),_l((list),function(item,index){return _c('span',{key:index},[_v(_s(item))])})],2)}"`

- 通过`new Function`方法将函数字符串转换成可执行函数，生成`render`方法

  ```javascript
	with(this){
		return _c('div',{staticClass:"page"},
			[
				_v(_s(name)+"的列表:"),
				_l((list),
					function(item,index){
					return _c('span',{key:index},[_v(_s(item))])
				})
			], 2)
	}
  ```
  
  上面这段代码中使用`whit`来设置内部变量的所属对象，还有出现的`_c`、`v`、`_s`、`_l`这些方法是Vue中已经设置好的一些函数方法，
  `_c`表示执行`createElement`去创建VNode，`_v`对应`createTextVNode`创建文本VNode,`_s`是生成字符串方法,`_l`是用于列表渲染的
  
  当然除了上面这些方法，Vue还有内置了其它方法分别处理列表渲染(v-for)、条件渲染(v-if)等等等等等等
  
- 现在就可以通过`render`方法，创建VNode了

```javascript
const data = { name: 'lanjz', list: ['A', 'B'] } //
installRenderHelpers(data) // 给data添加`_c`、`v`、`_s`方法
render.call(data)
```

上文的中`data`对应的就是一个Vue实例的`data`数据，执行完之后将得到一个VNode对象

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

上面的VNode对象做了简化，可以看到其实结构跟之前AST对象有点相似，区别在于在VNode里他已经对指令和数据模板做了处理，替换成真正的值

- 根据VNode渲染成真实DOM

  
  
  
  
  
  
  


