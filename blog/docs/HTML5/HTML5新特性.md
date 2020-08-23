# HTML5新特性

- Web Worker

- WebSocket

- Web Storage

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