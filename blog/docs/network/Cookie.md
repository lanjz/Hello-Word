# Cookie

Cookie 是服务端存储在浏览器本地的一小段数据，它会在浏览器下次向同一服务器再发起请求时被携带并发送到服务器上

Cookie的作用：

- 会话管理

- 用户行为追踪

- 个性化设置如（用户自定义设置、主题等）

## 创建Cookie

`set-cookie: [cookie 名] = [cookie 值];[cookie 名] = [cookie 值]`

当服务器收到请求后，可以在响应头里添加一个 `set-cookie`选项。浏览器在收到会保存 Cookie 到本地

Cookie 可设置的属性有：

- `Expires`：设置一个绝对时间,用GMT或者UTC时间格式

- `Max-Age`: 设置一个相对秒数

  > 当Cookie的过期时间被设定时，设定的日期和时间只与客户端相关，而不是服务端。

  > 正常情况下 Cookie 仅在会话周期有效，当浏晌器关闭，Cookie 就会失效

- `HttpOnly`: 禁止Cookie被JavasScript访问，`document.cookie`将拿不到存储的Cookie，可以防止 `XSS` 攻击

- `Secure`: 设置 Cookie 只能被 HTTPS 协议传输

- `Domain`: 设置Cookie的作用域，即Cookie可以发送给哪些URL

- `Path`: 指定了主机下的哪些路径可以接受Cookie

- `SameSite`: `SameSite`属性用来限制第三方 Cookie，从而减少安全风险, 御防 CSRF 攻击，它有以下三个选项

  - `Strict`: 完全禁止第三方 Cookie，跨站点时，任何情况下都不会发送 Cookie。换言之，只有当前网页的 URL 与请求目标一致，才会带上 Cookie

  `Set-Cookie: CookieName=CookieValue; SameSite=Strict`

  - `Lax`: `Lax` 规则稍稍放宽，大多数情况也是不发送第三方 Cookie，但是导航到目标网址的 Get 请求除外

  - `None`: Chrome 计划将 `Lax` 变为默认设置。这时，网站可以选择显式关闭 `SameSite` 属性，将其设为 `None`。不过，前提是必须同时设置 `Secure` 属性, 否则无效。

下图是使用和不使用 `SameSite` 时常见请求方式下的 `cookie` 携带发送情况  

![](./static/cookie_1.png)

## Cookie有效时间

默认情况下，Cookie只在会话期有效。关闭浏览器后Cookie就自动删除了，当然不是所有的浏览器都这么正常，有的浏览器提供了会话恢复功能。我们可以通过设置`Expire`或`Max-age`来控制Cookie的时效性

## Cookie长度限制

| 浏览器        | 允许cookie条数            | 每个Cookie的最大长度  |
| -------------|:-----------------------:|-----:|
| IE           | 原先为20个，后来升级为50个  | 4095 |
| Firefox      | 50个                       |   4079字节|
| Opera        | 30个                       |    4096字节 |
| Chrome       | 150个                      |    4079字节 |
| Safari       | 无限制                      |   4079字节 |

总之，在进行页面cookie操作的时候，应该尽量保证每个域cookie个数小于50个，单条cookie总长度4KB（包阔键和值以及等号）