# Vite

Vite，一个基于浏览器原生 ES imports 的开发服务器。利用浏览器去解析 imports，在服务器端按需编译返回，完全跳过了打包这个概念，服务器随起随用。同时不仅有 Vue 文件支持，还搞定了热更新，而且热更新的速度不会随着模块增多而变慢。针对生产环境则可以把同一份代码用 rollup 打

## vite原理简述

声明 script 标签类型为 module

```js
<script type="module" src="/src/main.js"></script>
```

浏览器向服务器发起GET

```js
// 请求main.js文件：
http://localhost:3000/src/main.js

// /src/main.js:
import { createApp } from 'vue'
import App from './App.vue'
createApp(App).mount('#app')
```

请求到main.js文件，检测内部含有import引入的包，会对内部的 import 引用发起 HTTP 请求获取模块的内容文件

劫持浏览器的http请求，在后端进行相应的处理将项目中使用的文件通过简单的分解与整合，然后再返回给浏览器(整个过程没有对文件进行打包编译)

## VS Webpack

vite是直接启动开发服务器，请求哪个模块再对该模块进行实时编译。
由于现代浏览器本身就支持ES Module，会自动向依赖的Module发出请求。vite充分利用这一点，将开发环境下的模块文件，就作为浏览器要执行的文件，而不是像webpack那样进行打包合并。
由于vite在启动的时候不需要打包，也就意味着不需要分析模块的依赖、不需要编译，因此启动速度非常快。当浏览器请求某个模块时，再根据需要对模块内容进行编译。这种按需动态编译的方式，极大的缩减了编译时间，项目越复杂、模块越多，vite的优势越明显。
在HMR方面，当改动了一个模块后，仅需让浏览器重新请求该模块即可，不像webpack那样需要把该模块的相关依赖模块全部编译一次，效率更高。
当需要打包到生产环境时，vite使用传统的rollup进行打包，因此，vite的主要优势在开发阶段。另外，由于vite利用的是ES Module，因此在代码中不可以使用CommonJS


### 打包原理比较

**webpack**

过程：识别入口->逐层识别依赖->分析/转换/编译/输出代码->打包后的代码

原理：逐级递归识别依赖，构建依赖图谱->转化AST语法树->处理代码->转换为浏览器可识别的代码

**Vite**

开发阶段直接省去上停的打包过程，直接基于浏览器原生 ES module，利用浏览器解析 imports，服务器端按需编译返回

webpack会先打包，然后启动开发服务器，请求服务器时直接给予打包结果

https://cn.vitejs.dev/guide/#command-line-interface

https://jishuin.proginn.com/p/763bfbd29d7f

https://bbs.huaweicloud.com/blogs/271090

