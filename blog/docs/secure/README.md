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

- 谨慎使用`eval`, `new Function()`，`document.write()`方法

- 使用`escape()`方法对字符进行转义

   `escape()`可以对一些构成 HTML 标签的元素转义，比如 <，>，空格等
   
给上例的中代码添加`escape()`

```js
<script>
  if(location.href.indexOf('default=') > -1) {
    let getDefault = decodeURI(location.href.substring(location.href.indexOf('default=') + 8))
    console.log(getDefault)
    getDefault = escape(getDefault)
    console.log(getDefault)
    document.write(getDefault);
  }
</script>
```

刷新页面，发现`alert`没有弹出

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
 
 SQL 注入御防方案
 
 - 不要信任用户的输入，要对用户的输入进行校验，可以通过正则表达式，或限制长度，对单引号和双"-"进行转换等
 
 - 不要使用动态拼装SQL，使用预编译语句进行数据库操作
 
 - 不要使用管理员权限的数据库连接，为每个应用使用单独的权限有限的数据库连接
 
 - 加密信息明文存放，请加密或者hash掉密码和敏感的信息
 
 **预编译语句**
 
 因为SQL语句也不能直接操作数据库，在操作前也需要进行编译，预编译语句就是已经编译好的语句，
 SQL注入只对编译过程有破坏作用，执行阶段只是把输入串作为数据处理，不需要再转换成SQL语句，因此解决了注入问题
 
## 点击劫持

点击劫持是一种视觉欺骗的攻击手段。攻击者将需要攻击的网站通过 `iframe` 嵌套的方式嵌入自己的网页中，并将 `iframe` 设置为透明，当用点击页面中的按钮时直接点的是`iframe`中的按钮

对于这种攻击方式，推荐防御的方法有两种

**X-FRAME-OPTIONS** 

`X-FRAME-OPTIONS` 是一个 HTTP 响应头，在现代浏览器有一个很好的支持。这个 HTTP 响应头 就是为了防御用 `iframe` 嵌套的点击劫持攻击

该响应头有三个值可选，分别是

- `DENY`，表示页面不允许通过 `iframe` 的方式展示

- `SAMEORIGIN`,表示页面可以在相同域名下通过 `iframe` 的方式展示

- `ALLOW-FROM`, 表示页面可以在指定来源的 `iframe` 中展示

**JS 防御**

对于某些远古浏览器来说，并不能支持上面的这种方式，那我们只有通过 JS 的方式来防御点击劫持了

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