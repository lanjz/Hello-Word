# CSS/Style-Loader

如果在 Webpack 配置中，只配置了 `css-loader` ,而没有配置 `style-loader` ,打包后我们会发现样式并没有应用于DOM 元素中

```js
// webpack.config.js
{
    test: /.css$/,
    loader: 'css-loader',
}
```

```css
// public.css
.div{
    background-color: red;
    width: 100px;
    height: 100px;
}
```

```js
import './public.css';
let div = document.createElement("div");
div.className = "div";
div.innerText = "hello div";
document.getElementsByTagName("body")[0].appendChild(div);
```

样式内容并没有应用到 `div` 上面，原因是 `css-loader` 只是帮我们解析了 css 文件里面的 css 代码，默认 Webpack 是只解析 js 代码的，所以 `css-loader` 的作用就是把 css 文件打包成 js 模块而已，想要应用样式我们要把解析完的 css 代码应用到 DOM 元素中

我们在 `index.js` 打印看下 css 解析后的内容

![](https://upload-images.jianshu.io/upload_images/10812004-1db169a3934ed1c8.png?imageMogr2/auto-orient/strip|imageView2/2/w/567/format/webp)

根据这个格式我们更改一下 `index.js` 代码

```js
import css from './public.css';

let div = document.createElement("div");
div.className = "rect";
div.innerText = "hello div";

let body = document.getElementsByTagName("body")[0];

let style = document.createElement("style");
style.innerText = css[0][1];

body.appendChild(style);
body.appendChild(div);
```

运行后就看到效果了

但是手动将 `style` 标签加入到 `html` 文档中很麻烦，所以就有了 `style-loader`

`style-loader` 就是帮我们直接将 `css-loader` 解析后的内容挂载到 `html` 页面当中，我们来看一下



