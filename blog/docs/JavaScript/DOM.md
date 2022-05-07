# DOM

## 事件

### DOMContentLoaded

DOMContentLoaded 事件发生在 `document` 对象上，我们必须使用 `addEventListener` 来捕获它：

```js
document.addEventListener("DOMContentLoaded", ready);
// 不是 "document.onDOMContentLoaded = ..."
```

```js
<script>
  function ready() {
    alert('DOM is ready');

    // 图片目前尚未加载完成（除非已经被缓存），所以图片的大小为 0x0
    alert(`Image size: ${img.offsetWidth}x${img.offsetHeight}`);
  }

  document.addEventListener("DOMContentLoaded", ready);
</script>

<img id="img" src="https://en.js.cx/clipart/train.gif?speed=1&cache=0">
```

在示例中，`DOMContentLoaded` 处理程序在文档加载完成后触发，所以它可以查看所有元素，包括它下面的 `<img>` 元素。

但是，它不会等待图片加载。因此，`alert` 显示其大小为零。
 
:::tip
DOMContentLoaded 的触发条件 -- DOM 树准备就绪
:::

#### DOMContentLoaded 和脚本

当浏览器处理一个 HTML 文档，并在文档中遇到 `<script>` 标签时，就会在继续构建 DOM 之前运行它。这是一种防范措施，因为脚本可能想要修改 DOM，甚至对其执行 `document.write` 操作，所以 DOMContentLoaded 必须等待脚本执行结束。

因此，DOMContentLoaded 肯定在下面的这些脚本执行结束之后发生：

```js
<script>
  document.addEventListener("DOMContentLoaded", () => {
    alert("DOM ready!");
  });
</script>

<script src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.3.0/lodash.js"></script>

<script>
  alert("Library loaded, inline script executed");
</script>
```

在上面这个例子中，我们首先会看到 “Library loaded…”，然后才会看到 “DOM ready!”（所有脚本都已经执行结束）

**不会阻塞 DOMContentLoaded 的脚本有两种方式**

1. 具有 `async` 特性的脚本不会阻塞 DOMContentLoaded

2. 使用 `document.createElement('script')` 动态生成并添加到网页的脚本也不会阻塞 DOMContentLoaded

#### DOMContentLoaded 和样式

外部样式表不会影响 DOM，因此 DOMContentLoaded 不会等待它们。

但这里有一个陷阱。如果在样式后面有一个脚本，那么该脚本必须等待样式表加载完成：

```js
<link type="text/css" rel="stylesheet" href="style.css">
<script>
  // 在样式表加载完成之前，脚本都不会执行
  alert(getComputedStyle(document.body).marginTop);
</script>
```

原因是，脚本可能想要获取元素的坐标和其他与样式相关的属性，如上例所示。因此，它必须等待样式加载完成。

当 DOMContentLoaded 等待脚本时，它现在也在等待脚本前面的样式

```html
<body>

<div class="my-3" style="padding: 200px; background: red" id="d"></div>
</body>
<script>
    document.addEventListener("DOMContentLoaded", function(event) {
        // 还是会等样式加载后才加载
        console.log("DOM fully loaded and parsed", document.getElementById('d').offsetTop);
    });
    window.onload = function (){
        console.log("DOM fully loaded and parsed", document.getElementById('d').offsetTop);
    }
</script>
<link href="https://cdn.bootcdn.net/ajax/libs/twitter-bootstrap/4.6.1/css/bootstrap-grid.css" rel="stylesheet">
</html>
```

同上面所描述， `script` 里的脚本仍然需要等待样式加载完成，所以很维显现得验证 DOMContentLoaded 触发不受样式的加载影响

[页面生命周期：DOMContentLoaded，load，beforeunload，unload](https://zh.javascript.info/onload-ondomcontentloaded#domcontentloaded-he-jiao-ben)

