# BFC

一个块格式化上下文（block formatting context） 是Web页面的可视化CSS渲染出的一部分。它是块级盒布局出现的区域，也是浮动层元素进行交互的区域。

它是页面中的一块渲染区域，并且有一套渲染规则，它决定了其子元素将如何定位，以及和其他元素的关系和相互作用

一个块格式化上下文由以下之一创建：

- `display: flow-root`

- 内联块 (元素具有 `display: inline-block`)

- 浮动元素 (元素的 `float` 不是 `none`)

- 绝对定位元素 (元素具有 `position` 为 `absolute` 或 `fixed`)

- 具有`overflow` 且值不是 `visible` 的块元素，

- `column-span: all` 应当总是会创建一个新的格式化上下文，即便具有 `column-span: all` 的元素并不被包裹在一个多列容器中。

- 表格标题 (元素具有 `display: table-caption`, HTML表格标题默认属性)

- 表格单元格 (元素具有 `display: table-cell`，HTML表格单元格默认属性)

块格式化上下文对于定位 (参见 float) 与清除浮动 (参见 clear) 很重要。定位和清除浮动的样式规则只适用于处于同一块格式化上下文内的元素。浮动不会影响其它块格式化上下文中元素的布局，并且清除浮动只能清除同一块格式化上下文中在它前面的元素的浮动。

## BFC布局规则特性：

- 在BFC中，盒子从顶端开始垂直地一个接一个地排列

- 子垂直方向的距离由margin决定。属于同一个BFC的两个相邻盒子的margin会发生重叠

- 在BFC中，每一个盒子的左外边缘（margin-left）会触碰到容器的左边缘(border-left)（对于从右到左的格式来说，则触碰到右边缘）。

## BFC的主要用途

- 清除元素内部浮动

  只要把父元素设为BFC就可以清理子元素的浮动了，最常见的用法就是在父元素上设置`overflow: hidden`样式，对于IE6加上zoom:1就可以了。

- 解决外边距合并问题

  外边距合并的问题。

  属于同一个BFC的两个相邻盒子的`margin`会发生重叠，那么我们创建不属于同一个BFC，就不会发生`margin`重叠了。

- 制作右侧自适应的盒子问题

# BFC总结

BFC就是页面上的一个隔离的独立容器，容器里面的子元素不会影响到外面的元素。因此，有了这个特性我们布局的时候就不会出现意外情况了。

# IFC

Inline Formatting Contexts，也就是“内联格式化上下文”。

符合以下条件即会生成一个IFC

- 块级元素中仅包含内联级别元素

## IFC布局规则

- 子元素水平方向横向排列，并且垂直方向起点为元素顶部。

- 子元素只会计算横向样式空间，【padding、border、margin】，垂直方向样式空间不会被计算，【padding、border、margin】

- 在垂直方向上，子元素会以不同形式来对齐（vertical-align）

- 能把在一行上的框都完全包含进去的一个矩形区域，被称为该行的行框（line box）。行框的宽度是由包含块（containing box）和与其中的浮动来决定。

- IFC中的“line box”一般左右边贴紧其包含块，但float元素会优先排列。

- IFC中的“line box”高度由 CSS 行高计算规则来确定，同个IFC下的多个line box高度可能会不同。

- 当 inline-level boxes的总宽度少于包含它们的line box时，其水平渲染规则由 text-align 属性值来决定。

- 当一个“inline box”超过父元素的宽度时，它会被分割成多个boxes，这些 oxes 分布在多个“line box”中。如果子元素未设置强制换行的情况下，“inline box”将不可被分割，将会溢出父元素。

通过几个例子来明白其特性

### 很多时候，上下间距不生效可以使用IFC来解释

```
.warp { border: 1px solid red; display: inline-block; }
.text { margin: 20px; background: green; }
```

```
<div class="warp">
    <span class="text">文本一</span>
    <span class="text">文本二</span>
</div>
```

![](https://segmentfault.com/img/bVbkDNT?w=300&h=47)

左右margin撑开，上下margin并未撑开，符合IFC规范，只计算横向样式控件，不计算纵向样式空间。

### 多个元素水平居中

```
.warp { border: 1px solid red; width: 200px; text-align: center; }
.text { background: green; }
```

```
<div class="warp">
    <span class="text">文本一</span>
    <span class="text">文本二</span>
</div>
```

![](https://segmentfault.com/img/bVbkDNg?w=300&h=38)

水平排列规则根据IFC容器的text-align值来排列，可以用来实现多个子元素的水平居中。

### float元素优先排列

```
.warp { border: 1px solid red; width: 200px; }
.text { background: green; }
.f-l { float: left; }

```

```
<div class="warp">
    <span class="text">这是文本1</span>
    <span class="text">这是文本2</span>
    <span class="text f-l">这是文本3</span>
    <span class="text">这是文本4</span>
</div>
```

![](https://segmentfault.com/img/bVbkDNi?w=400&h=145)

# IFC总结

利用IFC还可以做很多其他的事情，例如：解决元素垂直居中、多个文本元素行高不一致排列混乱。



