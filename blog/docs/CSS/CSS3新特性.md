# CSS3新特性

## 布局

- flex

- 多列布局（column-count）

- box-sizing

## 选择器

CSS3中新添加了很多选择器，解决了很多之前需要用javascript才能解决的布局问题。

- `element1~element2`: 选择前面有 `element1` 元素的每个 `element2` 元素

- `[attribute^=value]`: 选择某元素 `attribute` 属性是以 `value` 开头的

- `[attribute$=value]`: 选择某元素 `attribute` 属性是以 `value` 结尾的

- `[attribute*=value]`: 选择某元素 `attribute` 属性包含 `value` 字符串的

- `E:first-of-type`: 选择属于其父元素的首个E元素的每个E元素

- `E:last-of-type`: 选择属于其父元素的最后E元素的每个E元素。

- `E:only-of-type:` 选择属于其父元素唯一的E元素的每个E元素。

- `E:only-child:` 选择属于其父元素的唯一子元素的每个E元素。

- `E:nth-child(n):` 选择属于其父元素的第n个子元素的每个E元素。

- `E:nth-last-child(n):` 选择属于其父元素的倒数第n个子元素的每个E元素。

- `E:nth-of-type(n):` 选择属于其父元素第n个E元素的每个E元素。

- `E:nth-last-of-type(n):` 选择属于其父元素倒数第n个E元素的每个E元素。

- `E:last-child:` 选择属于其父元素最后一个子元素每个E元素。

- `:root:` 选择文档的根元素。

- `E:empty:` 选择没有子元素的每个E元素（包括文本节点)。

- `E:target:` 选择当前活动的E元素。

- `E:enabled:` 选择每个启用的E元素。

- `E:disabled:` 选择每个禁用的E元素。

- `E:checked:` 选择每个被选中的E元素。

- `E:not(selector):` 选择非selector元素的每个元素。

- `E::selection:` 选择被用户选取的元素部分。

## 动画

- transition

- transform

- Animation

**文字样式**

- word-wrap

- text-overflow

- text-shadow

- text-decoration

## 其它

- box-shadow

- @font-face

- 渐变

## 布局单位

- vw：根据窗口大小分成100份为基础进行布局

- rem：根据 HTML `font-size` 值进行相对转换

- em: 根据父级 `font-size` 值进行相对转换