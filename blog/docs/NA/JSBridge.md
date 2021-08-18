# JSBridge

JSBridge 是 native 和webview h5 沟通的桥梁，本文记录一下是怎么通信的

## 通信之native to js

native 调用 js 方法有两种方式：`loadUrl` 和 `evaluateJavascript`

### loadUrl

`mWebview.loadUrl("javascript: func()");`

- 优点: 兼容性好

- 缺点： 1.会刷新页面; 2.无法获取 js 方法执行结果

### evaluateJavascript

```
mWebview.evaluateJavascript("javascript: func()", new ValueCallback<String>() {
    @Override
    public void onReceiveValue(String value) {
        return;
    }
});
```

- 优点: 1.性能好; 2.可获取 js 执行后的返回值

- 缺点： 仅在安卓 4.4 以上可用

**要注意 JS方法要挂在全局环境中**

## 通信之js to native

js 调用 native 方法有以下几种方法：

1. 拦截 Url Schema

2. 拦截 prompt alert confirm
 
### 拦截 Url Schema

即由 h5 发出一条新的跳转请求，native 通过拦截 URL 获取 h5 传过来的数据

h5 和 native 约定一个通信协议，例如 `jsbridge`, 同时约定调用 `native 的方法名 methodName` 作为域名，以及后面带上调用`该方法的参数 arg`，和接收该方法执行结果的 `js 方法名 cbName`

如： `"jsbridge://openScan?{"data": {"scanType": "qrCode"}, "cbName": "handleScanResult"}"`

具体可以在 js 端封装相关方法，供业务端统一调用，代码如下

```js
window.callbackId = 0;

function callNative(methodName, arg, cb) {
    const args = {
      data: arg === undefined ? null : JSON.stringify(arg),
    };

    if (typeof cb === 'function') {
      const cbName = 'CALLBACK' + window.callbackId++;
      window[cbName] = cb;
      args['cbName'] = cbName;
    }

    const url = 'jsbridge://' + methodName + '?' + JSON.stringify(args);

    ...
}
```

注意点：

- 接收 native 执行结果的 `js 回调方法 cb` 要挂载到全局环境中上

- 为防止命名冲突，通过全局的 `callbackId` 来区分，然后将该回调函数在 window 上的名字放在参数中传给 native 端

- native 方法执行后，将执行结果通过上文提到的两种方法（loadUrl 或 evaluateJavascript）调用 `cb回调` 

 最后 h5 中发起请求，可以设置 `window.location.href` 或者创建一个新的 `iframe` 进行跳转. 粟子：
 
 ```js
function callNative(methodName, arg, cb) {
    ...

    const url = 'jsbridge://' + method + '?' + JSON.stringify(args);

    // 通过 location.href 跳转
    window.location.href = url;

    // 通过创建新的 iframe 跳转
    const iframe = document.createElement('iframe');
    iframe.src = url;
    iframe.style.width = 0;
    iframe.style.height = 0;
    document.body.appendChild(iframe);

    window.setTimeout(function() {
        document.body.removeChild(iframe);
    }, 800);
}
```

native 会拦截 h5 发出的请求，当检测到协议为 `jsbridge` ，解析出 URL 中的 `methodName`、`arg`、 `cbName`，相关处理

**通过拦截 URL Schema 的问题**

1. 连续发送时消息会丢失

如下代码：

```js
window.location.href = "jsbridge://callNativeNslog?{"data": "111", "cbName": ""}";
window.location.href = "jsbridge://callNativeNslog?{"data": "222", "cbName": ""}";
```

js 此时的诉求是在同一个运行逻辑内，快速的连续发送出 2 个通信请求，用客户端本身 IDE 的 `log`，按顺序打印 `111，222`，然后实际结果是 `222` 的通信消息根本收不到，直接会被系统抛弃丢掉

原因：因为 h5 的请求归根结底是一种模拟跳转，跳转这件事情上 webview 会有限制，当 h5 连续发送多条跳转的时候，webview 会直接过滤掉后发的跳转请求，因此第二个消息根本收不到

想要收到怎么办？ 只能通过 `setTimeout` 里将第二条消息延时一下

```js
//发第一条消息
location.href = "jsbridge://callNativeNslog?{"data": "111", "cbName": ""}";

//延时发送第二条消息
setTimeout(500,function(){
    location.href = "jsbridge://callNativeNslog?{"data": "222", "cbName": ""}";
});
```

但这并不能保证此时是否有其他地方通过这种方式进行请求，为系统解决此问题，js 端可以封装一层队列，所有 js 代码调用消息都先进入队列并不立刻发送，然后 h5 会周期性比如 500 毫秒，清空一次队列，保证在很快的时间内绝对不会连续发 2 次请求通信。

**URL 长度限制**

如果需要传输的数据较长，例如方法参数很多时，由于 URL 长度限制，仍以丢失部分数据

### prompt alert confirm

即由 h5 发起 `alert` `confirm` `prompt`，native 通过拦截这些方法来获取 h5 传过来的数据

约定的传输数据的组合方式以及 js 端封装方法的可以类似上面的 拦截 URL Schema 提到的方式

```js
function callNative(methodName, arg, cb) {
    ...

    const url = 'jsbridge://' + method + '?' + JSON.stringify(args);

    prompt(url);
}
```

native 会拦截 h5 发出的 `prompt`，当检测到协议为 jsbridge 而非普通的 `http/https/file` 等协议时，会拦截该请求，解析出 URL 中的 `methodName`、`arg`、 `cbName`，执行该方法并调用 js 回调函数。

**这种方式没有太大缺点，也不存在连续发送时信息丢失。不过 iOS 的 UIWebView 不支持该方式**

### 注入 JS 上下文

即由 native 将实例对象通过 webview 提供的方法注入到 js 全局上下文，js 可以通过调用 native 的实例方法来进行通信。

具体有安卓 webview 的 `addJavascriptInterface`，iOS UIWebview 的 JSContext，iOS WKWebview 的 `scriptMessageHandler`。`

下面以安卓 webview 的 `addJavascriptInterface` 为例进行讲解

首先 native 端注入实例对象到 js 全局上下文，代码大致如下

```js
public class MainActivity extends AppCompatActivity {

    private WebView mWebView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        mWebView = (WebView) findViewById(R.id.mWebView);

        ...

        // 将 NativeMethods 类下面的提供给 js 的方法转换成 hashMap
        JSBridge.register("JSBridge", NativeMethods.class);

        // 将 JSBridge 的实例对象注入到 js 全局上下文中，名字为 _jsbridge，该实例对象下有 call 方法
        mWebView.addJavascriptInterface(new JSBridge(mWebView), "_jsbridge");
    }
}

public class NativeMethods {
    // 用来供 js 调用的方法
    public static void methodName(WebView view, JSONObject arg, CallBack callBack) {
    }
}

public class JSBridge {
    private WebView mWebView;

    public JSBridge(WebView webView) {
        this.mWebView = webView;
    }


    private  static Map<String, HashMap<String, Method>> exposeMethods = new HashMap<>();

    // 静态方法，用于将传入的第二个参数的类下面用于提供给 javacript 的接口转成 Map，名字为第一个参数
    public static void register(String exposeName, Class<?> classz) {
        ...
    }

    // 实例方法，用于提供给 js 统一调用的方法
    @JavascriptInterface
    public String call(String methodName, String args) {
        ...
    }
}
```

然后 h5 端可以在 js 调用 window._jsbridge 实例下面的 call 方法，传入的数据组合方式可以类似上面两种方式。具体代码如下：

```js
window.callbackId = 0;

function callNative(method, arg, cb) {
  let args = {
    data: arg === undefined ? null : JSON.stringify(arg)
  };

  if (typeof cb === 'function') {
    const cbName = 'CALLBACK' + window.callbackId++;
    window[cbName] = cb;
    args['cbName'] = cbName;
  }

  if (window._jsbridge) {
    window._jsbridge.call(method, JSON.stringify(args));
  }
}
```

**注入 JS 上下文的问题**

以安卓 webview 的 addJavascriptInterface 为例，在安卓 4.2 版本之前，js 可以利用 java 的反射 Reflection API，取得构造该实例对象的类的內部信息，并能直接操作该对象的内部属性及方法，这种方式会造成安全隐患，例如如果加载了外部网页，该网页的恶意 js 脚本可以获取手机的存储卡上的信息。

在安卓 4.2 版本后，可以通过在提供给 js 调用的 java 方法前加装饰器 @JavascriptInterface，来表明仅该方法可以被 js 调用

