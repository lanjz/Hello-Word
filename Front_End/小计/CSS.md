## 选择器优先级

`!important`>行内样式 > `id选择器` > `类选择器`>`tag`>`*`>继承>默认

## 盒模型

> CSS合模型常用用的W3C标准盒模型`content-box`和IE盒型`border-box`，还有`padding-box`和`margin-box`（待了解）

一个`html`标签可以理解为一个盒子，一个块盒子由`content`、`padding`、`border`、`margin`组成

- W3C标准盒模型`box-sizing：content-box`

  `width`和`height`等于`content`的宽度和高度

- IE盒模型`box-sizing：border-box`

  `width` = `content`的宽度+padding+border

  `height` = `content`的高度+padding+border

- `padding-box` 

  `// todo`

-`margin-box` 

  `// todo`

## 居中布局

### 水平居中

### 水平居中

- `block`元素：`margin: 0 auto`

- 行内元素: 父级设置`text-align: center`

- `absolute` + `transform`

- `flex`布局：`justify-content: center`

### 垂直居中

- `line-height`

- `absolute` + `transform`

- `flex`布局：`align-item: center`

- `table`布局：`display: table-cell；verticle-align: center`

## 层叠上下文

层叠上下文（stacking context）是HTML中的一个三维概念，一个盒子模型在平面中的布局其实有对应的`x轴`、`y轴`和`z轴`。
平时写样式时，元素都是水平排列或者垂直排列的，即在`x轴`和`y轴`上排列，所以对`z轴`感知不明显。
但是当两个或多个重叠时，就会发现有个元素覆盖在其它元素元素上面

> 如果一个元素含有**层叠上下文**，那么这个元素在`z轴`上就会高人一等，即离屏幕最近。

触发条件

- 根元素(html)本身就属于层叠上下文元素

- 普通元素设置`position != static`，并设有`z-index`

- css3属性：`fiex`

层叠等级

![](https://user-gold-cdn.xitu.io/2019/2/14/168e9d9f3a1d368b?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

## 去除浮动

-  父元素设置高度或者`overflow: auto`


- 尾部添加元素并设置`clear: both`

- 父元素添加伪元素

  ```
  :after{
   content: ' '
   clear: both
   display: block
   visibility: hidden // 非必需，渲染不显示罢了
  }
  ```

- 设置低级BCF ?

## link和@import

- `link`可以定义RSS、Rel等属性，`@import`只能用于加载css

  - `rel`: 规定当前文档与被链接文档之间的关系。

- `link`会同页面一起加载，而`@import`要等页面加载完才被加载

- `@import`要IE5以上才支持

- `link`可以用js动态加载，而`@import`不行

## BFC

[BFC](https://juejin.im/post/5909db2fda2f60005d2093db)
