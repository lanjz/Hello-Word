# 安全区域

在iPhoneX发布后，许多厂商相继推出了具有边缘屏幕的手机

这些手机和普通手机在外观上无外乎做了三个改动：圆角（corners）、刘海（sensor housing）和小黑条（Home Indicator）。为了适配这些手机，安全区域这个概念变诞生了：安全区域就是一个不受上面三个效果的可视窗口范围。

为了保证页面的显示效果，我们必须把页面限制在安全范围内

下面以 iphoneX 为例

## viewport-fit

`viewport-fit` 是专门为了适配 iPhoneX 而诞生的一个属性，它用于限制网页如何在安全区域内进行展示

`<meta name="viewport" content="viewport-fit=cover">`

`viewport-fit` 的值：

- `auto`: 此值不影响初始布局视图端口，并且整个web页面都是可查看的

- `contain`: 视图端口按比例缩放，以适合显示内嵌的最大矩形

- `cover`：视图端口被缩放以填充设备显示。强烈建议使用 `safe area inset` 变量，以确保重要内容不会出现在显示之外

### env、constant

`env()`和 `constant()` CSS 函数以类似于 `var` 函数将用户代理定义的环境变量值插入你的 CSS 中

如 `env(safe-area-inset-bottom)`表示获取安全区域距离底部边界距离

`safe-area-inset-[]`可以是四个常量：

- `safe-area-inset-left`：安全区域距离左边边界距离

- `safe-area-inset-right`：安全区域距离右边边界距离

- `safe-area-inset-top`：安全区域距离顶部边界距离

- `safe-area-inset-bottom`：安全区域距离底部边界距离

`constant` 在 `iOS < 11.2` 的版本中生效，`env` 在 `iOS >= 11.2` 的版本中生效，这意味着我们往往要同时设置他们，将页面限制在安全区域内：

```css
body {
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}
``` 

上面样式规则表示排除了底部不可用的一块区域