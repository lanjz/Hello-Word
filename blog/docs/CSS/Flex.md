# Flex

Flex 是 `Flexible Box` 的缩写，意为"弹性布局"，用来为盒状模型提供最大的灵活性。

任何一个容器都可以指定为 Flex 布局。

```css
.box{
  display: flex;
}
```

行内元素也可以使用 Flex 布局。

```css
.box{
  display: inline-flex;
}
```
## 基本概念

采用 Flex 布局的元素，称为 Flex 容器（flex container），简称`容器`

它的所有子元素自动成为容器成员，称为 Flex 项目（flex item），简称`项目`

![](http://www.ruanyifeng.com/blogimg/asset/2015/bg2015071004.png)

容器默认存在两根轴：水平的主轴（`main axis`）和垂直的交叉轴（`cross axis`）。主轴的开始位置（与边框的交叉点）叫做`main start`，结束位置叫做`main end`；交叉轴的开始位置叫做`cross start`，结束位置叫做`cross end`。

项目默认沿主轴排列。单个项目占据的主轴空间叫做`main size`，占据的交叉轴空间叫做`cross size`

## 容器的属性

- `flex-direction`: 决定主轴的方向，即项目的排列方向

  - `row`: 水平排列，顺序从左到右，`flex-direction`的默认值

  - `row-reverse`: 水平排列，顺序从右到左

  - `column`: 垂直排列，顺序从上到下

  - `column-reverse`: 垂直排列，顺序从下到上

  ![](http://www.ruanyifeng.com/blogimg/asset/2015/bg2015071005.png)

- `flex-wrap`: 决定项目在一条轴上排列不下时，如何换行

  - `nowrap`: 不换行，`flex-wrap`的默认值

  - `wrap`: 换行，第一行在上方

  - `wrap-reverse`: 换行，第一行在下方

- `flex-flow`: `flex-direction`和`flex-wrap`的合并简写方式,默认值为`row nowrap`

  ```
  flex-flow: <flex-direction>  <flex-wrap>;
  ```

- `justify-content`: 定义了项目在主轴上的对齐方式

  - `flex-start`（默认值）: 左对齐

  - `flex-end`: 右对齐

  - `center`: 居中对齐

  - `space-beteen`: 两端对齐，项目之间的间隔都相等

  - `space-around`: 每个项目两侧的间隔相等。所以，项目之间的间隔比项目与边框的间隔大一倍

  ![](http://www.ruanyifeng.com/blogimg/asset/2015/bg2015071010.png)

- `align-item`: 定义项目在交叉轴上如何对齐

  - `stretch`（默认值）: 如果项目未设置高度或设为auto，将占满整个容器的高度。

  - `flex-start`: 顶部对齐

  - `flex-end`: 尾部对齐

  - `center`: 居中对齐

  - `baseline`: 项目的第一行文字的基线对齐

  ![](http://www.ruanyifeng.com/blogimg/asset/2015/bg2015071011.png)

- `align-content`: 属性定义了多根轴线的对齐方式。如果项目只有一根轴线，该属性不起作用

  - `flex-start`：与交叉轴的起点对齐

  - `flex-end`：与交叉轴的终点对齐

  - `center`：与交叉轴的中点对齐

  - `space-between`：与交叉轴两端对齐，轴线之间的间隔平均分布

  - `space-around`：每根轴线两侧的间隔都相等。所以，轴线之间的间隔比轴线与边框的间隔大一倍

  - `stretch`（默认值）：轴线占满整个交叉轴

![](http://www.ruanyifeng.com/blogimg/asset/2015/bg2015071012.png)

## 项目上的属性

- `order`: `order`属性定义项目的排列顺序。数值越小，排列越靠前，默认为`0`

- `flex-grow`: 定义项目的放大比例，默认为`0`，即如果存在剩余空间，也不放大

- `flex-shrink`: 定义了项目的缩小比例，默认为`1`，即如果空间不足，该项目将缩小,如果所有项目的`flex-shrink`属性都为`1`，当空间不足时，都将等比例缩小。如果一个项目的`flex-shrink`属性为`0`，则空间不足时，将不会缩小

- `flex-basis`: 定义了在分配多余空间之前，项目占据的主轴空间（`main size`）。浏览器根据这个属性，计算主轴是否有多余空间。它的默认值为`auto`，即项目的本来大小

- `flex`: `flex`属性是`flex-grow`, `flex-shrink` 和 `flex-basis`的简写，默认值为`0 1 auto`。后两个属性可选

- `align-self`: `align-self`属性允许单个项目有与其他项目不一样的对齐方式，可覆盖`align-items`属性。默认值为`auto`，表示继承父元素的`align-items`属性，如果没有父元素，则等同于`stretch`

该属性可能取6个值，除了`auto`，其他都与`align-items`属性完全一致

## Q&A

### `flex` 子项元素使用 `ellipsis` 无效

原因： 一般情况下 `min-width` 属性默认值是 `0`，但是 Flexbox 容器中的 `flex项` 的 `min-width` 属性默认值是 `auto`

解决方案： 给 `flex项` 设计样式：`min-width：0`

> [阮一峰的网络日志 - Flex 布局教程](http://www.ruanyifeng.com/blog/2015/07/flex-grammar.html)