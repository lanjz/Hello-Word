# HTML5新特性

- Web Worker

- WebSocket

- `Geolocation` - 定位用户的位置

```js
navigator.geolocation.getCurrentPosition(
  function(pos){  //定位成功的回调
　　　　console.log('用户定位数据获取成功')
　　　　//console.log(arguments);
　　　　console.log('定位时间：',pos.timestamp)
　　　　console.log('经度：',pos.coords.longitude)
　　　　console.log('纬度：',pos.coords.latitude)
　　　　console.log('海拔：',pos.coords.altitude)
　　　　console.log('速度：',pos.coords.speed)
    },   
    function(err){ //定位失败的回调
　　  　　console.log('用户定位数据获取失败')
　  　　　//console.log(arguments);
    }  
  ) 
```

- 拖放API

  拖放是一种常见的特性，即抓取对象以后拖到另一个位置。在 HTML5 中，拖放是标准的一部分，任何元素都能够拖放。

　拖放的过程分为源对象和目标对象。源对象是指你即将拖动元素，而目标对象则是指拖动之后要放置的目标位置。

  源对象(可能发生移动的)可以触发的事件:

  - `dragstart`：拖动开始

  - `drag`：拖动中

  - `dragend`：拖动结束

  拖放的目标对象(不会发生移动)可以触发的事件:

  - `dragenter`：拖动者进入

  - `dragover`：拖动者悬停

  - `dragleave`：拖动者离开

  - `drop`：释放

  拖动传递数据

  - 在拖动源对象事件中使用 `e.dataTransfer` 属性保存数据：`e.dataTransfer.setData( k,  v )`

  - 在拖动目标对象事件中使用 `e.dataTransfer` 属性读取数据: `var value = e.dataTransfer.getData( k )`

- Canvas 绘图

- SVG

- 更多语义化的标签

  - `hrader` - 定义了文档的头部区域

  - `footer` - 定义了文档的尾部区域

  - `nav` - 定义文档的导航

  - `section` - 定义文档中的节（section、区段）

  - `article` - 定义页面独立的内容区域

  - `aside` - 定义页面的侧边栏内容

  - `detailes` - 用于描述文档或文档某个部分的细节

  - `summary` - 标签包含 details 元素的标题

  - `dialog` - 定义对话框，比如提示框

- 视频和音频

  - `audio` - 播放音频文件的标准

  - `video` - 播放视频文件的标准

- 增强型表单

  HTML5 拥有多个新的表单 `input` 输入类型。这些新特性提供了更好的输入控制和验证,具体略
  
## Web Storage

### [localstorage](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API)

`localstorage` 允许将数据长期保留在计算机中，以键值对我形式进行存储

### 用法

- 设置值：`localStorage.setItem('myCat', 'Tom')`

- 读取值：`localStorage.getItem('myCat')`

- 移除值：`localStorage.removeItem('myCat')`

- 移除所有的 `localStorage` 项: `localStorage.clear()`

注意点：

- 只可访问当前源的本地空间的`localstorage`对象

- 存储的类型会自动转化为字符串类型

### 监听localStorage变化

```js
window.addEventListener('storage', function(e) {
  document.querySelector('.my-key').textContent = e.key;
  document.querySelector('.my-old').textContent = e.oldValue;
  document.querySelector('.my-new').textContent = e.newValue;
  document.querySelector('.my-url').textContent = e.url;
  document.querySelector('.my-storage').textContent = e.storageArea;
});
```

**注意点**

- 重复设置相同的键值不会触发该事件

- `Storage.clear()` 方法至多触发一次该事件

- 在同一个页面内发生的改变不会起作用

- 在相同域名下的其他页面（如一个新标签或 iframe）发生的改变才会起作用

- 在其他域名下的页面不能访问相同的 Storage 对象

**如何在同一页面中监听 `localStorage` 的变化？**

通过重写 `localStorage` 的 `setItem` 方法实现监听 `localStorage` 的变化，思路如下：

- 新建一个事件，并且监这个事件

- 在`localStorage.setItem`方法中使用`window.dispatchEvent`触发事件

完整例子：

```js
var orignalSetItem = localStorage.setItem;
    localStorage.setItem = function(key,newValue){
        var setItemEvent = new Event("setItemEvent");
        setItemEvent.newValue = newValue;
        window.dispatchEvent(setItemEvent);
        orignalSetItem.apply(this,arguments);
    }
    window.addEventListener("setItemEvent", function (e) {
        alert(e.newValue);
    });
    localStorage.setItem("name","wang");
    console.log(window.localStorage)
```

## sessionStorage

`sessionStorage` 和 `localstorage` 类似，区别在于 `sessionStorage` 存在周期仅限于会话期间且**只有在同一浏览器的同一窗口（浏览器标签页）下才能够共享**

如果当前标签页关闭或者浏览器关闭，`sessionStorage` 将会消失

### 用法

- 设置值：`sessionStorage.setItem('myCat', 'Tom')`

- 读取值：`sessionStorage.getItem('myCat')`

- 移除值：`sessionStorage.removeItem('myCat')`

- 移除所有的 `sessionStorage` 项: `sessionStorage.clear()`

**注意 `sessionStorage` 仅存于同一标签中，意味着相同域名在不周标签下打开 `sessionStorage` 也是不共享的**

## IndexedDB

IndexedDB 具有以下特点：

**键值对储存**

IndexedDB 内部采用对象仓库（object store）存放数据。所有类型的数据都可以直接存入，包括 JavaScript 对象。对象仓库中，数据以"键值对"的形式保存，每一个数据记录都有对应的主键，主键是独一无二的，不能有重复，否则会抛出一个错误

**异步**

IndexedDB 操作时不会锁死浏览器，用户依然可以进行其他操作，这与 LocalStorage 形成对比，后者的操作是同步的。异步设计是为了防止大量数据的读写，拖慢网页的表现

**支持事务**

IndexedDB 支持事务（transaction），这意味着一系列操作步骤之中，只要有一步失败，整个事务就都取消，数据库回滚到事务发生之前的状态，不存在只改写一部分数据的情况。

**同源限制**
 
IndexedDB 受到同源限制，每一个数据库对应创建它的域名。网页只能访问自身域名下的数据库，而不能访问跨域的数据库。

**储存空间大**

IndexedDB 的储存空间比 LocalStorage 大得多，一般来说不少于 250MB，甚至没有上限

**支持二进制储存**

IndexedDB 不仅可以储存字符串，还可以储存二进制数据（ArrayBuffer 对象和 Blob 对象）。

##  前端储存方式小结

**cookies：** 在HTML5标准前本地储存的主要⽅式，优点是兼容性好，请求头⾃带 cookie ⽅便，缺点是⼤⼩只有 4k，⾃动请求头加⼊ cookie 浪费流量，每个 domain 限制20个cookie，使⽤起来麻烦，需要⾃⾏封装；

**localStorage**：HTML5加⼊的以键值对(Key-Value)为标准的⽅式，优点是操作⽅便，永久性储存（除⾮⼿动删除），⼤⼩为5M，兼容IE8+ ；

**sessionStorage：** 与localStorage基本类似，区别是sessionStorage当⻚⾯关闭后会被清理，⽽且与cookie、localStorage不同，他不能在所有同源窗⼝中共享，是会话级别的储存⽅式；

**IndexedDB：** 是被正式纳⼊HTML5标准的数据库储存⽅案，它是NoSQL数据库，⽤键值对进⾏储存，可以进⾏快速读取操作，⾮常适合web场景，同时⽤JavaScript进⾏操作会⾮常便。