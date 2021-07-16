# requestIdleCallback和requestAnimationFrame

## 浏览器绘制

页面是一帧一帧绘制出来的，当每秒绘制的帧数（FPS）达到 60 时，页面是流畅的，小于这个值时，用户会感觉到卡顿。

1s 60帧，所以每一帧分到的时间是 1000/60 ≈ 16 ms

一帧内需要完成如下六个步骤的任务：

- 处理用户的交互

- JS 解析执行

- 帧开始。窗口尺寸变更，页面滚去等的处理

- requestAnimationFrame

- 布局

- 绘制

## [requestIdleCallback](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestIdleCallback)

上文说到页面一帧（16ms）需要大致执行六个步骤，当上面六个步骤完成后没超过 16 ms，说明时间有富余，此时就会执行 `requestIdleCallback` 里注册的任务

`window.requestIdleCallback()` 方法将在浏览器的空闲时段内调用的函数排队

## [requestAnimationFrame](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestAnimationFrame)

`window.requestAnimationFrame()` 告诉浏览器希望执行一个动画，并且要求浏览器在下次重绘之前调用指定的回调函数更新动画。该方法需要传入一个回调函数作为参数，该回调函数会在浏览器下一次重绘之前执行