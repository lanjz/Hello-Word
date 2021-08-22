# VirtualDom

Virtual DOM 本质上是JavaScript对象，是对真实DOM的的一种描述方式。 即JS对象模拟的DOM结构，将DOM变化的对比放在JS层来做

示例：HTML里的一段标签文本

```js
<ul id="list">
    <li class="item">Item1</li>
    <li class="item">Item2</li>
</ul>
```

用虚拟DOM结构可以表示为：

```js
{
    tag: "ul",
    attrs: {
        id: "list"
    },
    children: [
        {
            tag: "li",
            attrs: { className: "item" },
            children: ["Item1"]
        }, {
            tag: "li",
            attrs: { className: "item" },
            children: ["Item2"]
        }
    ]
}
```

Virtual DOM 其实是一个JS对象，类似JSON格式，React中就是将JSX元素的名称、属性和内容作为对象及其属性来创建Virtual DOM。

## 为什么需要Virtual DOM

- 跨平台。支持跨平台，可以将JS对象渲染到浏览器DOM以外的环境中，通过 Virtual DOM 可以实现服务器端渲染。比如在Node.js中没有DOM，可以借助 Virtual DOM 来实现SSR。支持了跨平台开发，比如ReactNative。

- 性能优化。前端性能优化的一个秘诀就是尽可能少地操作DOM，优秀的 Virtual DOM Diff 算法使得 Virtual DOM 将DOM的比对操作放在JS层，实现的在 `patch` 过程中尽可能地一次性将差异更新到DOM中，减少浏览器不必要的重绘，提高效率。这样保证了DOM不会出现性能很差的情况

## React中的Virtual DOM

在React开发中，Virtual DOM 元素即是React 元素，经常会使用JSX来写React元素，比如

```js
// jsx
<div className="divStyleName" onClick={(e) => console.log('点击了')}>
    Hello
    <img src="pic_url">img</img>
    <div>div2</div>
    <div></div>
</div>;
```

浏览器是不能直接读取JSX，为了使浏览器能够读取JSX，在项目构建阶段对 JSX 编译进行编译，最终转换成 `React.createElement` 方法的形式

用纯JavaScript来写上面的JSX示例（经过babel转译）

```js
React.createElement("div", {
    className: "divStyleName",
    onClick: e => console.log('点击了')
  }, "Hello", React.createElement("img", {
    src: "pic_url"
  }, "img"), React.createElement("div", null, "div2"), React.createElement("div", null));

```

再来自定义一个组件，名为HelloComponent，JSX实现为

```js
class HelloComponent extends React.Component {
  render() {
    return <div>Hello {this.props.toWhat}</div>;
  }
}

<HelloComponent toWhat="World" />
```

Babel转译后对应的js代码为

```js
class HelloComponent extends React.Component {
  render() {
    return React.createElement("div", null, "Hello ", this.props.toWhat);
  }
}

React.createElement(HelloComponent, {
    toWhat: "World"
  });

```