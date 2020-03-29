# css-loader & style-loader

如果在webpack配置中，只配置了`css-loader`,而没有配置`style-loader`,打包后我们会发现样式并没有应用于DOM 元素中

```
// webpack.config.js
{
    test: /.css$/,
    loader: 'css-loader',
}
```

```
// public.css
.div{
    background-color: red;
    width: 100px;
    height: 100px;
}
```

```
import './public.css';
let div = document.createElement("div");
div.className = "div";
div.innerText = "hello div";
document.getElementsByTagName("body")[0].appendChild(div);
```

样式内容并没有应用到div上面，原因是css-loader只是帮我们解析了css文件里面的css代码，默认webpack是只解析js代码的，
所以 css-loader 的作用就是把css文件打包成 js模块而已，
想要应用样式我们要把解析完的css代码应用到 DOM 元素中

我们在`index.js`打印看下 css 解析后的内容

![](https://upload-images.jianshu.io/upload_images/10812004-1db169a3934ed1c8.png?imageMogr2/auto-orient/strip|imageView2/2/w/567/format/webp)

根据这个格式我们更改一下index.js代码

```
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

但是手动将style标签加入到html文档中很麻烦，所以就有了style-loader

style-loader就是帮我们直接将css-loader解析后的内容挂载到html页面当中，我们来看一下



