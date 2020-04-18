# Electron

Electron 是一个用 `HTML`，`CSS` 和 `JavaScript` 来构建跨平台桌面应用程序的一个开源库

## 核心概念

Electron 结合了 Chromium、Node.js 和用于调用操作系统本地功能的 API（如打开文件窗口、通知、图标等）

Electron 的核心理念是:保持 Electron 的体积小和可持续性开发。
如:为了保持 Electron 的小巧 (文件体积) 和可持续性开发 (以防依赖库和 API 的泛滥) ， Electron 限制了所使用的核心项目的数量。
比如 Electron 只用了 Chromium 的渲染库而不是其全部组件。这使得升级 Chromium 更加容易，但也意味着 Electron 缺少了 Google Chrome 里的一些浏览器相关的特性。 添加到 Electron 的新功能应该主要是原生 API。 如果可以的话，一个功能应该尽可能的成 为一个 Node.js 模块。

# Electron 运行流程

![](https://upload-images.jianshu.io/upload_images/1480597-7d07da8dccab3159.png?imageMogr2/auto-orient/strip|imageView2/2/w/1200/format/webp)

## Electron 主进程和渲染进程

- Electron 运行 `package.json` 的 `main` 脚本的进程被称为主进程

- 在主进程中运行的脚本通过创建 web 页面来展示用户界面。 一个 Electron 应用总是有且只有一个主进程。

- 由于 Electron 使用了 Chromium(谷歌浏览器)来展示 web 页面，所以 Chromium 的 多进程架构也被使用到。 每个 Electron 中的 web 页面运行在它自己的渲染进程中

- 主进程使用 BrowserWindow 实例创建页面。每个 BrowserWindow 实例都在自己的渲 染进程里运行页面。 当一个 BrowserWindow实例被销毁后，相应的渲染进程也会被终止

## Electron 渲染进程中通过 Nodejs 读取本地文件

在普通的浏览器中，web页面通常在一个沙盒环境中运行，不被允许去接触原生的资源。 然而 Electron 的用户在 Node.js 的 API支持下可以在页面中和操作系统进行一些底层交 互。
Nodejs 在主进程和渲染进程中都可以使用。渲染进程因为安全限制，不能直接操作生 GUI。虽然如此，因为集成了 Nodejs，渲染进程也有了操作系统底层 API的能力，Nodejs 中常用的 Path、fs、Crypto 等模块在 Electron 可以直接使用，方便我们处理链接、路径、 文件 MD5 等，同时 npm 还有成千上万的模块供我们选择。

```
var fs = require('fs');
var content = document.getElementById('content'); 
var button = document.getElementById('button');

button.addEventListener('click',function(e){
    fs.readFile('package.json','utf8',function(err,data){ 
        content.textContent = data;
        console.log(data);
    }); 
});

```

## electron 更新

- 使用`electron-build`打包

- 在`package.json`文件中的`public`的配置远程远程放置新包的地址

- 服务器放置新的包和`latest-mac.yml`文件（说明版本内容）

- 在主进程中使用`electron-update`进行检查更新的操作

[Electron](https://www.jianshu.com/p/2244653515a7)

