# 常见web安全攻防小结

## XSS

XSS (Cross Site Script)，跨站脚本攻击，因为缩写和 CSS (Cascading Style Sheets) 重叠，所以只能叫 XSS。

XSS 的原理是恶意攻击者往 Web 页面里插入恶意可执行网页脚本代码，当用户浏览该页之时，嵌入其中 Web 里面的脚本代码会被执行，
从而可以达到攻击者盗取用户信息或其他侵犯用户安全隐私的目的。XSS 的攻击方式千变万化，但还是可以大致细分为几种类型。

### 非持久型 XSS

非持久型XSS漏洞，也叫反射型XSS漏洞，一般是攻击者将可执行JS代码放入到URL中，
页面获取了URL中可执行代码并解析，然后执行

假设页面中有如下代码

```js
if(location.href.indexOf('default=') > -1) {
      let getDefault = decodeURI(location.href.substring(location.href.indexOf('default=') + 8))
      console.log(getDefault)
      document.write(getDefault);
}
```

现在我们URL的参数为： `?default=<script>alert(document.cookie)</script>`

刷新页面后，会出现 `alert` 提示，说明成功执行了攻击代码

非持久XSS漏洞攻击有以下特征：

- 即时性，不经过服务器存储，如上面的例子直接通过URL请求就能完成一次攻击，拿到用户隐私数据

- 攻击者需要诱骗点击

防御方案：

- 谨慎使用可以将内容解析成 html 语句的方法

  1. `innerHTML`和 `outerHTML`。如前所述，`innerHTML` 和 `outerHTML` 属性允许开发者将字符串赋值为HTML元素的内部或外部HTML，如果这些字符串包含恶意脚本，那么脚本将被执行。
     
  `element.innerHTML = '<script>alert("XSS")</script>';`

  2. `document.write`和`document.writeln`。`document.write`和`document.writeln`方法用于直接向文档写入HTML内容。如果包含恶意脚本，这些脚本将被浏览器解析和执行。

  `document.write('<script>alert("XSS")</script>');`

  3. `eval` 函数。如果攻击者能够控制传递给eval的字符串，他们就可以执行任意脚本。

      ```javascript
      var userContent = 'alert("XSS")'; // 可能来自用户输入
      eval(userContent);
      ```
  4. `setTimeout` 和 `setInterval`。当 `setTimeout` 和 `setInterval` 的第一个参数为字符串时，这些字符串会被解析并执行为JavaScript代码。如果这些字符串是由用户控制的，就存在执行恶意脚本的风险。

      `setTimeout("alert('XSS')", 1000);`

  5. `Function` 构造函数。`Function` 构造函数类似于 `eval`，可以从字符串中创建新的函数。如果这个字符串是由用户提供的，那么同样存在安全风险。

      ```javascript
      var dynamicFunction = new Function("alert('XSS')");
      dynamicFunction();
      ```
  6. URL跳转和重定向。通过修改URL或执行重定向操作，攻击者可以利用JavaScript协议（如javascript:）来执行恶意代码。

      `window.location = 'javascript:alert("XSS")'; // 非常危险`

- 使用内容安全政策（Content Security Policy, CSP）限制可执行的脚本

- 对敏感操作使用HTTPOnly和Secure属性的Cookie，减少XSS攻击的影响
   
:::warning
类似 `escape`、`encodeURIComponent`这些字符转义不足以防御XSS,因为它不会对HTML所有相关的字符（如<、>、"、'等）进行编码
:::

### 持久型XSS

持久型 XSS 漏洞，也被称为存储型 XSS 漏洞，一般存在于 Form 表单提交等交互功能，如发帖留言，提交文本信息等，
黑客利用的 XSS 漏洞，将可执行的JS代码通过表单的形式提交到后端，并存储到数据库中，当前端页面从后端获取到含攻击代码的数据，并渲染到
页面上时，就会执行这些攻击代码

持久型攻击步骤：

- 通过`POST`请求将没做过转义的攻击代码传给后端并存入数据库

- 后端从数据库中取出数据没做转义直接输出给前端

- 前端拿到后端数据没做转义直接渲染成 DOM

持久型 XSS 有以下几个特点 :

- 持久性，植入在数据库中

- 危害面广，如多个用户访问了能获取这些攻击代码的页面

御防方案：

- 将cookie设置为HttpOnly
  CRSF攻击很大程度上是利用了浏览器的cookie，为了防止站内的XSS漏洞盗取cookie,需要在cookie中设置“HttpOnly”属性，
  这样通过程序（如JavaScript脚本、Applet等）就无法读取到cookie信息，避免了攻击者伪造cookie的情况出现

- 后端在入库前应该选择不相信任何前端数据，将所有的字段统一进行转义处理

- 获者后端在输出给前端数据统一进行转义处理

- 前端在渲染页面 DOM 的时候应该选择不相信任何后端数据，任何字段都需要做转义处理

持久型XSS与非持久型XSS的异同点

- 攻击代码的执行方式类似，都是通过渲染含攻击代码的数据的方式进行攻击

- 攻击方式不同，非持久型XSS是将攻击代码存储在URL中，并且需要引诱用户打开链接，而持久型XSS漏洞则是将攻击代码存储到后台数据库中

- 非持久型XSS漏洞是即时，而持久型XSS漏洞是持久的，除非将数据从数据库中删除

### 基于字符集的 XSS

其实现在很多的浏览器以及各种开源的库都专门针对了 XSS 进行转义处理，尽量默认抵御绝大多数 XSS 攻击，
但是还是有很多方式可以绕过转义规则，让人防不胜防。比如「基于字符集的 XSS 攻击」就是绕过这些转义处理的一种攻击方式，
比如有些 Web 页面字符集不固定，用户输入非期望字符集的字符，有时会绕过转义过滤规则。如下以以基于 `utf-7` 的 XSS 为例

`utf-7` 是可以将所有的 `unicode` 通过 `7bit` 来表示的一种字符集 (但现在已经从 `Unicode` 规格中移除)。

这个字符集为了通过 `7bit` 来表示所有的文字, 除去数字和一部分的符号,其它的部分将都以 `base64` 编码为基础的方式呈现。

```js
<script>alert("xss")</script>
可以被解释为：
+ADw-script+AD4-alert(+ACI-xss+ACI-)+ADw-/script+AD4-
```

可以形成「基于字符集的 XSS 攻击」的原因是由于浏览器在 meta 没有指定 charset 的时候有自动识别编码的机制，所以这类攻击通常就是发生在没有指定或者没来得及指定 meta 标签的 charset 的情况下。

`utf-7`字符集攻击御防方案：

- 记住指定 `<meta charset="utf-8">`

- XML 中不仅要指定字符集为 `utf-8`，而且标签要闭合

### 未经验证的跳转 XSS

有一些场景是后端需要对一个传进来的待跳转的 URL 参数进行一个 302 跳转，可能其中会带有一些用户的敏感（cookie）信息。
如果服务器端做302 跳转，跳转的地址来自用户的输入，攻击者可以输入一个恶意的跳转地址来执行脚本。

御防方案：

- 对待跳转的 URL 参数做白名单或者某种规则过滤

- 后端注意对敏感信息的保护, 比如 cookie 使用来源验证

## CSRF

CSRF（Cross-Site Request Forgery），中文名称：跨站请求伪造攻击

攻击者可以盗用你的登陆信息，以你的身份模拟发送各种请求，例如通过 QQ 等聊天软件发送的链接(有些还伪装成短域名，用户无法分辨)，
攻击者就能迫使 Web 应用的用户去执行攻击者预设的操作。例如，当用户登录网络银行去查看其存款余额，
在他没有退出时，就点击了一个 QQ 好友发来的链接，那么该用户银行帐户中的资金就有可能被转移到攻击者指定的帐户中。

CSRF 原理：

1. 浏览器登陆信任网A

2. 通过验证，在浏览器中产生cookie

3. 用户在没有退出A网站登录态的情况下，访问危险网站B

4. 网站B请求网站A的接口，此时请求将会携带网站A的cookie

CSRF 攻击必须要有三个条件 :

- 用户已经登录了站点 A，并在本地记录了 cookie

- 用户没有登出站点 A 的情况下（也就是 cookie 生效的情况下），访问了恶意攻击者提供的引诱危险站点 B。

- 站点 A 没有做任何 CSRF 防御

CSRF 预防方案

- 在非 GET 请求中增加 token，不要完全使用cookie做为认证

- 将cookie设置为HttpOnly

- 通过`Referer`识别

  在HTTP头中有一个字段叫`Referer`，它记录了该HTTP请求的来源地址,
  但有些场景不适合将来源URL暴露给服务器，所以可以设置不用上传，
  并且referer属性是可以修改的，所以在服务器端校验referer属性并没有那么可靠
  
- 通过`origin`属性

  通过`XMLHttpRequest`、`Fetch`发起的跨站请求或者`Post`方法发送请求时，都会带上`origin`,
  所以服务器可以优先判断`Origin`属性，再根据实际情况判断是否使用`referer`判断。

- 渲染表单的时候，为每一个表单包含一个 `csrfToken`，提交表单的时候，带上 `csrfToken`，然后在后端做 `csrfToken` 验证。

### CSRF攻击实现

1.（可略）CSRF具体攻击实现一：后端设置允许跨域携带cookie

- 后端设置允许跨域携带cookie:`ctx.set("Access-Control-Allow-Credentials", true)`

- 恶意网站B请求时设置`credentials`，如下

  ```js
  fetch('http://localhost:3001/api/users', {
    credentials: 'include'
  }).then(response => response.json())
    .then(data => console.log('fetch success', data))
    .catch((e => console.log('fetch error', e)))
  ```
  
以上这种实现方式条件局限性比较高：

- 正常网站不会允许跨域携带cookie

- 后端即使设置了`"Access-Control-Allow-Credentials", true`，也是需要设置具体的允许跨域的域名，
  所以也不会碰巧将未知的其它域名添加到跨域配置中
  
2. CSRF具体攻击实现二：：使用`img`，`script`等标签，这些不受同源策略的影响

假如恶意网站中有一个`img`标签，其`src`为网站A的接口地址，使用发送请求时可以发现是携带了cookie过去的

这种方式就不受跨域的影响，但是种方式只能用于`get`请求

3. 使用form表单提交

form表单可以跨域一个历史原因是要保持兼容性，因为form表单会刷新页面不会把结果返回给js，所以认为是安全的

```js
<form id="aaa" action="http://localhost:3001/api/csrf" method="POST" display="none">
    <input type="text" name="accountNum" value="10001"/>
    <input type="text" name="money" value="10000"/>
</form>
<script>
  var form = document.getElementById('aaa');
  form.submit();
</script>
```

当打个页面的时将会成功提交一个`post`请求


## SQL 注入

 SQL 注入的攻击方式：因为程序没有有效的转义过滤用户的输入，使攻击者成功的向服务器提交恶意的 SQL 查询代码，
 程序在接收后错误的将攻击者的输入作为查询语句的一部分执行，导致原始的查询逻辑被改变，额外的执行了攻击者精心构造的恶意代码。

 如用户登录表单中，攻击者在用户名或密码字段输入`' OR '1'='1`，导致生成的SQL查询语句逻辑上总是为真，从而绕过身份验证
 
 SQL 注入御防方案

  - 不要使用动态拼装SQL，使用参数化查询或预编译语句，避免直接将用户输入嵌入到SQL语句中
 
 - 不要信任用户的输入，要对用户的输入进行校验，可以通过正则表达式，或限制长度，对单引号和双"-"进行转换等
 
 - 最小化数据库权限
 
 **预编译语句**
 
 因为SQL语句也不能直接操作数据库，在操作前也需要进行编译，预编译语句就是已经编译好的语句，
 SQL注入只对编译过程有破坏作用，执行阶段只是把输入串作为数据处理，不需要再转换成SQL语句，因此解决了注入问题

粟子： 假设有一个用户登录的场景，用户需要输入用户名和密码。未使用参数化查询的代码可能直接拼接用户输入来构造SQL语句：

`SELECT * FROM users WHERE username = '输入的用户名' AND password = '输入的密码';`

如果用户输入的用户名是 `admin' --`，并且密码字段留空，这将导致生成的SQL语句变为：

`SELECT * FROM users WHERE username = 'admin' --' AND password = '';`

这里，--是SQL中的注释符号，意味着密码检查部分会被数据库忽略，攻击者可能以admin用户的身份登录。

使用参数化查询的代码则完全不同，它会像这样：

`SELECT * FROM users WHERE username = ? AND password = ?;`

在执行这条SQL语句之前，会先将用户输入的用户名和密码绑定到两个问号占位符上。这样，即使用户尝试输入恶意的SQL代码，这些输入也只会被当作字符串数据处理，而不会影响SQL语句的结构
 
## 点击劫持

点击劫持（Clickjacking）是一种视觉欺骗的安全攻击，攻击者通过在一个透明的iframe上覆盖一个看似无害的元素，诱使用户在不知情的情况下点击那个透明的iframe。实际上，用户的点击行为被劫持，执行了攻击者在底层页面上预设的恶意操作。

```
// 粟子
假设有一个网银网站，它允许用户通过点击一个按钮来进行转账。攻击者构造了一个诱人的页面，比如一个游戏或者抽奖页面，并在这个页面上通过<iframe>嵌入了网银网站的转账页面，将<iframe>设置为透明，并精确地将“转账”按钮对齐到诱人点击的位置上。用户在点击“抽奖”按钮的时候，实际上触发了转账操作。
```

对于这种攻击方式，推荐防御的方法有：

**X-FRAME-OPTIONS** 

`X-FRAME-OPTIONS` 服务器可以通过发送X-Frame-Options HTTP响应头来告诉浏览器不允许将网页嵌入到iframe、frame或object中

该响应头有三个值可选，分别是

- `DENY`，表示页面不允许通过 `iframe` 的方式展示

- `SAMEORIGIN`,表示页面可以在相同域名下通过 `iframe` 的方式展示

- `ALLOW-FROM`, 表示页面可以在指定来源的 `iframe` 中展示

**Content Security Policy（CSP）：**

CSP是一个额外的安全层，它可以用来减少XSS攻击的风险，并防止数据注入攻击。通过设置CSP的frame-ancestors指令，网站可以控制哪些网页可以将其作为`<iframe>`、`<frame>`或`<object>`等内容嵌入。

**JS 防御**

一些JavaScript技术，例如检测当前页面是否被嵌入到另一个页面中，如果是，则可以通过JavaScript将用户重定向到正确的地址或者显示一个警告信息

```html
<head>
  <style id="click-jack">
    html {
      display: none !important;
    }
  </style>
</head>
<body>
  <script>
    if (self == top) {
      var style = document.getElementById('click-jack')
      document.body.removeChild(style)
    } else {
      top.location = self.location
    }
  </script>
</body>
```

 
 ## 中间人攻击
 
 中间人攻击是攻击方同时与服务端和客户端建立起了连接，并让对方认为连接是安全的，但是实际上整个通信过程都被攻击者控制了。攻击者不仅能获得双方的通信信息，还能修改通信信息
 
 通常来说不建议使用公共的 Wi-Fi，因为很可能就会发生中间人攻击的情况。如果你在通信的过程中涉及到了某些敏感信息，就完全暴露给攻击方了
 
 当然防御中间人攻击其实并不难，只需要增加一个安全通道来传输信息。HTTPS 就可以用来防御中间人攻击，但是并不是说使用了 HTTPS 就可以高枕无忧了，因为如果你没有完全关闭 HTTP 访问的话，攻击方可以通过某些方式将 HTTPS 降级为 HTTP 从而实现中间人攻击。

类似  charles 这类的代理工具就是类似中间人攻击

## CSP

CSP（Content-Security-Policy） 即内容安全策略，用于检测和减轻用于 Web 站点的特定类型的攻击，例如 XSS 和数据注入等。

该安全策略的实现基于一个称作 `Content-Security-Policy` 的 HTTP 首部

### 作用

CSP 的主要目标是减少和报告 XSS 攻击，XSS 攻击利用了浏览器对于从服务器所获取的内容的信任。恶意脚本在受害者的浏览器中得以运行，即使有的时候这些脚本并非来自于它本该来的地方

CSP 通过指定有效域——即限制浏览器可加载资源有效来源，防止加载其它资源的脚本和内容

### 使用

方式一：服务器返回  `Content-Security-Policy:[策略规则]`  HTTP 头部

:::tip
有时候会看到 `X-Content-Security-Policy`的 Header 这是是旧版本写法
:::

方式二： `<meta>`  元素也可以被用来配置该策略, 如

`<meta http-equiv="Content-Security-Policy" content="default-src 'self'; img-src https://*; child-src 'none';">`

通过策略规则控制浏览器可以为该页面获取哪些资源，这些资源包括图片，样式，JS脚本等

### 例子

- `Content-Security-Policy: default-src 'self'`: 所有内容均来自站点的同一个源 (不包括其子域名)

- `Content-Security-Policy: default-src 'self' *.trusted.com`: 一个网站管理者允许内容来自信任的域名及其子域名 (域名不必须与CSP设置所在的域名相同)

 - `Content-Security-Policy: default-src 'self'; img-src *; media-src media1.com media2.com; script-src userscripts.example.com`，该策略表示：

   - 图片可以从任何地方加载(注意 "*" 通配符)。
   
   - 多媒体文件仅允许从 `media1.com` 和 `media2.com` 加载(不允许从这些站点的子域名)。
   
   - 可运行脚本仅允许来自于 `userscripts.example.com`

### 违规报告

在策略中添加 `report-uri`,就可以启用发送违规报告，如下例子：

`Content-Security-Policy: default-src 'self'; report-uri http://reportcollector.example.com/collector.cgi`

#### 违例报告的内容

作为报告的JSON对象报告包含了以下数据：

- `document-uri`: 发生违规的文档的URI

- `referrer`: 违规发生处的文档引用（地址）

- `blocked-uri`: 被 CSP 阻止的资源 URI。如果被阻止的 URI 来自不同的源而非文档 URI ，那么被阻止的资源 URI 会被删减，仅保留协议，主机和端口号

- `violated-directive`: 违反的策略名称

- `original-policy`:  在 `Content-Security-Policy` HTTP 头部中指明的原始策略

#### 违例报告样本

假设当前如下 CSP 策略：

`Content-Security-Policy: default-src 'none'; style-src cdn.example.com; report-uri /_/csp-reports`

HTML(signup.html) 内容如下：

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Sign Up</title>
    <link rel="stylesheet" href="css/style.css">
  </head>
  <body>
    ... Content ...
  </body>
</html>

```

样式表仅允许加载自 `cdn.example.com`，然而该页面企图从自己的源 ( `http://example.com` )加载。当该文档被访问时，一个兼容 CSP 的浏览器将以 POST 请求的形式发送违规报告到 `http://example.com/_/csp-reports` ，内容如下：

```js
{
  "csp-report": {
    "document-uri": "http://example.com/signup.html",
    "referrer": "",
    "blocked-uri": "http://example.com/css/style.css",
    "violated-directive": "style-src cdn.example.com",
    "original-policy": "default-src 'none'; style-src cdn.example.com; report-uri /_/csp-reports"
  }
}
```

如你所见，该报告在 `blocked-uri` 字段中包含了违规资源的完整路径 ，但情况并非总是如此。比如，当 `signup.html` 试图从 `http://anothercdn.example.com/stylesheet.css` 加载 CSS 时，浏览器将不会包含完整路径，而只会保留源路径 (`http://anothercdn.example.com`)

### Content-Security-Policy-Report-Only

`Content-Security-Policy-Report-Only` 和 `Content-Security-Policy` 用法一样，区别在于在`Content-Security-Policy` 头部中指定的策略有强制性 ，而 `Content-Security-Policy-Report-Only` 中的策略仅产生报告而不具有强制性,意味着违规内容仍能正常加载

[MDN-CSP](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/CSP)

## DDoS 攻击

全称是 Distributed Denial of Service，翻译成中文就是分布式拒绝服务。一般来说是指攻击者利用“肉鸡”对目标网站在较短的时间内发起大量请求，大规模消耗目标网站的主机资源，让它无法正常服务

**肉鸡：** 通常指被控制的联网设备，服务器，摄像头，手机，个人电脑等都有可能成为肉鸡。

### 防御

**高防服务器**

高防服务器主要是指能独立硬防御 50Gbps 以上的服务器，能够帮助网站拒绝服务攻击，定期扫描网络主节点等，这东西是不错，就是贵~

**黑名单**

设置黑名单，此方法秉承的就是“错杀一千，也不放一百”的原则，会封锁正常流量，影响到正常业务。

**DDoS 清洗**

DDoS 清洗会对用户请求数据进行实时监控，及时发现DOS攻击等异常流量，在不影响正常业务开展的情况下清洗掉这些异常流量。

**CDN 加速**

在现实中，CDN 服务将网站访问流量分配到了各个节点中，这样一方面隐藏网站的真实 IP，另一方面即使遭遇 DDoS 攻击，也可以将流量分散到各个节点中，防止源站崩溃

