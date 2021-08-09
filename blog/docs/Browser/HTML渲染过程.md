# HTML渲染过程

## HTML解析过程

解析 HTML 的过程实质就是根据文档结构转换成可以表示文档结构的语法树的过程

![](./static/browser_13.png)

**解析HTML文档的过程**

- 浏览器采用流式布局模型（Flow Based Layou）

- 解析HTML，生成 DOM 树；解析 CSS 生成 CSSOM 树

- 将 DOM 树和 CSSOM 树结合生成渲染树（Render Tree）

- **Layout(回流)**：根据生成的渲染树，进行回流（Layout），得到的几何信息（位置、大小）

- **Painting(重绘)**：根据渲染树及回流得到的几何信息，得到节点绝对像素

- **Display**：将像素发送给GPU，展示在页面上

:::tip
`布局`，`重排`, `回流`是一个意思，只是不同浏览器的内核术语不同
:::

## 渲染过程各环节进行分解

### 生成渲染树

图解：

![](./static/browser_14.png)

为构建渲染树，浏览器主要完成了以下工作：

1. 从DOM树的根节点开始遍历每个节点

2. 对于每个见的节点，从CSSOM树中找到对应的样式规则，并应用它们

3. 根据可见节点和对应的样式，组合生成渲染树 

第一步中提到了可见节点，那么我就得知道怎么区别可见和不可见节点。比如不可见的节点包含

- 一些不会渲染输出的节点，比如`script`、`link`等

- 通过CSS隐藏的节点。比如`display:none`。注意，利用`visibility`和`opecity`隐藏的节点，还是会显示在渲染树上。只有`display:none`的节点才不会显示在渲染树上。

从上面的例子来讲，我们可以看到 `span` 标签的样式有一个 `display:none`，因此，它最终并没有在渲染树上。

**注意：渲染树只包含可见的节点**

### 回流

上文提到通过DOM节点和样式规则生成渲染树，可是我们还需要计算他们在视图（viewport）内的确切位置和大小，这个计算的阶段就是回流。

为了弄清楚每个对象在页面中的确切大不和位置，浏览器从渲染树的根节点开始遍历。看例子：

```html
<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>Critial Path: Hello world!</title>
  </head>
  <body>
    <div style="width: 50%">
      <div style="width: 50%">Hello world!</div>
    </div>
  </body>
</html>
```

我们可以看到，第一个 `div` 将节点的显示尺寸设置为视口宽度的50%，第二个 `div` 将其尺寸设置为父节点的50%。而在回流这个阶段，我们就需要根据视口具体的宽度，将其转为实际的像素值。（如下图）

![](./static/browser_15.png)

### 重绘

我们通过渲染树和回流阶段，知道了哪些节点是可见的，并且知道了节点的样式、大小、位置信息等，那么我就可以将渲染树的各个节点都转换屏幕上的实际像素，这个阶段就是做重绘节点

既然知道了浏览器的渲染过程后，我们就来探讨下，何时会发生回流重绘。

### 何时发生回流重绘

从前面我们知道回流是计算节点的大小、位置等几何信息，那么当节点的布局几何信息发生变化的时候，就需要回流。比如以下情况

- 添加或删除可见DOM节点

- 节点尺寸发生了变化包括外边距、内边框、边框大小、高度和宽度等）

- 节点位置发生了变化

- 节点内容发生了变化，比如文本变化或图片被另一个不同尺寸的图片所替代。

- 页面一开始加载的时候

- 浏览器窗口大小改变的时候（因为回流的根据视图大小来计算元素的位置和大小等几何信息的）

## 浏览器的优化机制

由于每次回流重绘都会造成额外的计算消耗，因此现代浏览器通过队列化修改并批量执行来优化重排过程。浏览器会将修改的操作放入到队列中，直到过一段时间或者到了一定的阈值，才清空队列。但是 **当你获取布局信息的操作时候，会强制队列刷新** ，比如当你访问以下属性或者使用以下方法：

- `offsetTop`、`offsetLeft`、`offsetWidth`、`offsetHeight`

- `scrollTop`、`scrollLeft`、`scrollWidth`、`scrollHeight`

- `clientTop`、`clientLeft`、`clientWidth`、`clientHeight`

- `getComputedStyle()`

- `getBoundingClientRect`

- 具体可以访问这个网站：[https://gist.github.com/paulirish/5d52fb081b3570c81e3a](https://gist.github.com/paulirish/5d52fb081b3570c81e3a)

以上属性和方法都需要返回最新的布局信息，因此浏览器不得不清空队列，触发回流重绘来返回正确的值。因此，我们在修改样式的时候，**最好避免频繁使用上面列出的属性，他们都会刷新渲染队列。** 如果要使用它们，最好将值缓存起来

### 减少回流和重绘

既然我们大概了解了回流和重绘的理论知识，也知道回流和重绘对浏览器渲染性能的影响，那接下就总结一下如何减少回流和重绘

**最小化回流和重绘**

由于回流和重绘可能造成比较昂贵的代价，因此最好减少它的发生次数。为了减少发生次数，我们可以合并多次对 DOM 和样式的修改，然后一次处理掉。考虑这个例子

```js
const el = document.getElementById('test');
el.style.padding = '5px';
el.style.borderLeft = '1px';
el.style.borderRight = '2px';
```

例子中，有三个样式属性被修改了，每一个都会影响元素的几何结构，引起回流。当然，大部分现代浏览器都对其做了优化，因此，只会触发一次重排。但是如果在旧版的浏览器或者在上面代码执行的时候，有其他代码访问了布局信息(上文中的会触发回流的布局信息)，那么就会导致三次重排。

因此，我们可以合并所有的改变然后依次处理，比如我们可以采取以下的方式

1. 使用 `cssText`

```js
const el = document.getElementById('test');
el.style.cssText += 'border-left: 1px; border-right: 2px; padding: 5px;';
```

2. 修改 CSS 的 `class`

```js
const el = document.getElementById('test');
el.className += ' active';
```

**批量修改 DOM**

当我们需要对 DOM 对一系列修改的时候，可以通过以下涌出减少回流重绘次数：

1. 使元素脱离文档流

2. 对其进行多次修改

3. 将元素带回到文档中

该过程的第一步和第三步可能会引起回流，但是经过第一步，对 DOM 的所有修改都不会引起回流重绘，因为它已经不在渲染树了

有三种方式可以让 DOM 脱离文档流：

- 隐藏元素，应用修改，重新显示

- 使用文档片段（document fragment）在当前DOM之外构建一个子树，再把它拷贝因文档

- 将原始元素拷贝到一个脱离文档的节点中，修改节点后，再替换原始的元素

考虑我们要执行一段批量插入节点的代码：

```js
function appendDataToElement(appendToElement, data) {
    let li;
    for (let i = 0; i < data.length; i++) {
    	li = document.createElement('li');
        li.textContent = 'text';
        appendToElement.appendChild(li);
    }
}

const ul = document.getElementById('list');
appendDataToElement(ul, data);
```

如果我们直接这样执行的话，由于每次循环都会插入一个新的节点，会导致浏览器回流一次。

我们可以使用这三中方式进行优化：

1. 隐藏元素、应用修改、重新显示

这个会在节点隐藏和显示的时候，产生两次回流

```js
function appendDataToElement(appendToElement, data) {
    let li;
    for (let i = 0; i < data.length; i++) {
    	li = document.createElement('li');
        li.textContent = 'text';
        appendToElement.appendChild(li);
    }
}
const ul = document.getElementById('list');
ul.style.display = 'none';
appendDataToElement(ul, data);
ul.style.display = 'block';
```

2. 使用文档片段(document fragment)在当前 DOM 之外构建一个子树，再把它拷贝回文档

```js
const ul = document.getElementById('list');
const fragment = document.createDocumentFragment();
appendDataToElement(fragment, data);
ul.appendChild(fragment)
```

3. 将原始元素拷贝到一个脱离文档的节点中，修改节点后，再替换原始的元素。

```js
const ul = document.getElementById('list');
const clone = ul.cloneNode(true);
appendDataToElement(clone, data);
ul.parentNode.replaceChild(clone, ul);
```

**避免触发同步布局事件**

上文我们说过，当我们访问元素的一些属性的时候，会导致浏览器强制清空队列，进行强制同步布局。举个例子，比如说我们想将一个 `p` 标签数组的宽度赋值为一个元素的宽度，我们可能写出这样的代码：

```js
function initP() {
    for (let i = 0; i < paragraphs.length; i++) {
        paragraphs[i].style.width = box.offsetWidth + 'px';
    }
}
```

这段代码看上去是没有什么问题，可是其实会造成很大的性能问题。在每次循环的时候，都读取了 `box` 的一个 `offsetWidth` 属性值，然后利用它来更新 `p` 标签的 `width` 属性。这就导致了每一次循环的时候，浏览器都必须先使上一次循环中的样式更新操作生效，才能响应本次循环的样式读取操作。每一次循环都会强制浏览器刷新队列。我们可以优化为:

```js
const width = box.offsetWidth;
function initP() {
    for (let i = 0; i < paragraphs.length; i++) {
        paragraphs[i].style.width = width + 'px';
    }
}
```

**对于复杂动画效果，使用定位让其脱离文档流**

对于复杂动画效果，由于会经常的引起回流重绘，因此，我们可以使用绝对定位，让它脱离文档流。否则会引起父元素以及后续元素频繁的回流。

**css3硬件加速（GPU加速）**

比起考虑如何减少回流重绘，我们更期望的是，根本不要回流重绘。这个时候，css3硬件加速就闪亮登场啦！！

- 使用 css3 硬件加速，可以让 `transform`、`opacity`、`filters` 这些动画不会引起回流重绘

- 对于动画的其它属性，比如 `background-color` 这些，还是会引起回流重绘的，不过它还是可以提升这些动画的性能

css3硬件加速的坑:

- 如果你为太多元素使用 css3 硬件加速，会导致内存占用较大，会有性能问题

- 在GPU渲染字体会导致抗锯齿无效。这是因为 GPU 和 CPU 的算法不同。因此如果你不在动画结束的时候关闭硬件加速，会产生字体模糊。（后面会说如果避免这个问题）

**避免使用 CSS 表达式，可能会引发回流**

**避免使用 table 布局，可能很小的一个小改动会造成整个 table 的重新布局**

删除冗余的样式，提高构建呈现树阶段的样式匹配速度

## Q&A

### 关于使用CSS3硬件加速，导致字体模糊

总结来说就是使用 `transform` 时，`translate`、`scale`、`rotate` 属性的值应该尽量为整数，如果是非整数的话会导致字体模糊

### 说一下从 url 输入到返回请求的过程

1. `url` 解析，根据 `dns` 系统进行 `ip` 查找

2. 查找到IP之后，就是http协议的三次握手

3. 返回 HTML，可能存在缓存

4. HTML 内容的解析 和 脚本执行

### dom树节点和渲染树节点一一对应吗

![](./static/browser_14.png)

根据之前上图的渲染图未所以发现 dom 树节点和渲染树节点并不是一一对应的，比如 `display:node` 的元素将不会出现在渲染树中

### CSS会阻塞dom解析吗

虽然DOM渲染需要 CSS解析后和 DOM解析后才会生成，但是 CSS 解析和 DOM解析 这两个相互并不影响

### CSS会阻塞dom树渲染吗

会

### css加载会阻塞后面js语句的执行嘛

会

[浏览器的工作原理：新式网络浏览器幕后揭秘](https://www.html5rocks.com/zh/tutorials/internals/howbrowserswork/)
