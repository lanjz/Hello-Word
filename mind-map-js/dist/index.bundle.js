/*! For license information please see index.bundle.js.LICENSE.txt */
(() => {
    var __webpack_modules__ = {}, __webpack_module_cache__ = {}, inProgress, dataWebpackPrefix;
    function __webpack_require__(e) {
        if (__webpack_module_cache__[e]) return __webpack_module_cache__[e].exports;
        var r = __webpack_module_cache__[e] = {
            exports: {}
        };
        return __webpack_modules__[e](r, r.exports, __webpack_require__), r.exports;
    }
    __webpack_require__.m = __webpack_modules__
    __webpack_require__.d = (e, r) => {
        for (var _ in r) __webpack_require__.o(r, _) && !__webpack_require__.o(e, _) && Object.defineProperty(e, _, {
            enumerable: !0,
            get: r[_]
        });
    }
    __webpack_require__.f = {}
    __webpack_require__.e = e => {
        return Promise.all(Object.keys(__webpack_require__.f)
          .reduce(((r, _) => {
              return __webpack_require__.f[_](e, r), r
          }), []))
    }
    __webpack_require__.u = e => e + ".bundle.js"
    __webpack_require__.g = function() {
        if ("object" == typeof globalThis) return globalThis;
        try {
            return this || new Function("return this")();
        } catch (e) {
            if ("object" == typeof window) return window;
        }
    }()
    __webpack_require__.o = (e, r) => Object.prototype.hasOwnProperty.call(e, r)
    inProgress = {}
    dataWebpackPrefix = "mind-map:"
    /**
     * @params {String} e : 模块路径
     * @params {Function} r
     * @params {String} _ : "chunk-" + 模块
     * */
    __webpack_require__.l = (e, r, _) => {
        if (inProgress[e]){ // 如果 inProgress[e] 已存在，将当前函数添加到 inProgress[e] 队列中
            inProgress[e].push(r)
        } else {
            var a, t;
            if (void 0 !== _) {
                for (var i = document.getElementsByTagName("script"), o = 0; o < i.length; o++) {
                    // 判断当前要加载模块是否已经存在于 dom中
                    var c = i[o];
                    if (c.getAttribute("src") == e || c.getAttribute("data-webpack") == dataWebpackPrefix + _) {
                        // 如果存在刚保存到变量a
                        a = c;
                        break;
                    }
                }
            }
            /* a || (t = !0, (a = document.createElement("script")).charset = "utf-8", a.timeout = 120,
            __webpack_require__.nc && a.setAttribute("nonce", __webpack_require__.nc), a.setAttribute("data-webpack", dataWebpackPrefix + _),
            a.src = e), inProgress[e] = [ r ];*/
            // 将上面的注释的源代码转换了下，方便阅读
            if(!a){
                // 动态创建 script 标签加载模块
                t = !0 // t = true
                a = document.createElement("script")
                a.charset = "utf-8"
                a.timeout = 120
                __webpack_require__.nc && a.setAttribute("nonce", __webpack_require__.nc)
                a.setAttribute("data-webpack", dataWebpackPrefix + _) // 标记 data-webpack 属性
                a.src = e
            }
            inProgress[e] = [ r ] // inProgress创建对象的队列
            // n的作用就是当模块加载成功或者失败或者超时要做的事情
            // 当成功时，r=a.onload方法，_=成功的事件信息，取出inProgress中保存的回调一一执行 t.forEach((e => e(_))，此时 _ 为成功后事件信息
            // 当失败时，r=a.onerror，_=失败的事件信息，取出inProgress中保存的回调一一执行 t.forEach((e => e(_))，此时 _ 为失败后事件信息
            // 当超时时，_ 为 {type: "timeout",target: a}
            debugger
            var n = (r, _) => {
                a.onerror = a.onload = null, clearTimeout(u);
                var t = inProgress[e];
                if (delete inProgress[e], a.parentNode && a.parentNode.removeChild(a), t && t.forEach((e => e(_))), 
                r) return r(_);
            }, u = setTimeout(n.bind(null, void 0, {
                type: "timeout",
                target: a
            }), 12e4);
            // 将动态创建script 标签 添加添加DOM,开始下载模块，并定义对应的 onerror 和 onload 方法
            a.onerror = n.bind(null, a.onerror), a.onload = n.bind(null, a.onload), t && document.head.appendChild(a);
        }
    }
    __webpack_require__.r = e => {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
            value: "Module"
        }), Object.defineProperty(e, "__esModule", {
            value: !0
        });
    }
    (() => {
        var e;
        // importScripts 返回的undefined，暂不确定表示什么
        __webpack_require__.g.importScripts && (e = __webpack_require__.g.location + "");
        var r = __webpack_require__.g.document;
        // currentScript 表示当前执行脚本的信息，获取脚本的路径并赋值给 e
        // 当前例子 e=http://localhost:63342/Hello-Word/mind-map-js/dist/index.bundle.js
        if (!e && r && (r.currentScript && (e = r.currentScript.src), !e)) {
            // 如果没上一步获取不到，则通过获取 script 标签来获取脚本路径
            var _ = r.getElementsByTagName("script");
            _.length && (e = _[_.length - 1].src);
        }
        if (!e) throw new Error("Automatic publicPath is not supported in this browser");
        // 获取脚本所在目录 __webpack_require__.p = e = http://localhost:63342/Hello-Word/mind-map-js/dist/
        e = e.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/"), __webpack_require__.p = e;
    })();
    (() => {
        var e = {
            index: 0
        };
        // 参数 r 表示要获取的模块名
        __webpack_require__.f.j = (r, _) => {
            // 等同于Object.prototype.hasOwnProperty.call(e, r)，判断 r(key) 是否包含在 e 中
            var a = __webpack_require__.o(e, r) ? e[r] : void 0;
            if (0 !== a) {
                if (a) {
                    _.push(a[2]); // 如果a有值，则将 a[2] 保存到 _中，a[2]的意思下面的else分支会介绍到
                } else {
                    var t = new Promise(((_, t) => {
                        // Promise 构造函数是同步的，这里面 “_” 表示 `resolve`, “t” 表示 `reject`
                        // 将 `resolve` 和 `reject`，保存到 e[r]
                        a = e[r] = [ _, t ];
                    }));
                    // 将上文返回的 Promise保存到 a[2]中
                    // a[0] => Promise.resolve   a[1] => Promise.reject  a[2] => Promise
                    _.push(a[2] = t);
                    // 获取这个模块的完整的路径
                    var i = __webpack_require__.p + __webpack_require__.u(r), o = new Error;
                    // 加载模块i，加载成功则执行第二个函数参数
                    __webpack_require__.l(i, (_ => {
                        // 上文中已经向e中添加当前模块的队列属性，将这个队列属性保存到变量a中，然后删除队列属性
                        debugger
                        if (__webpack_require__.o(e, r) && (0 !== (a = e[r]) && (e[r] = void 0), a)) {
                            var t = _ && ("load" === _.type ? "missing" : _.type), i = _ && _.target && _.target.src;
                            o.message = "Loading chunk " + r + " failed.\n(" + t + ": " + i + ")"
                            o.name = "ChunkLoadError"
                            o.type = t
                            o.request = i, a[1](o);
                        }
                    }), "chunk-" + r);
                }
            }
        };
        var r = self.webpackChunkmind_map = self.webpackChunkmind_map || [], _ = r.push.bind(r);
        r.push = r => {
            for (var a, t, [i, o, c] = r, n = 0, u = []; n < i.length; n++) t = i[n], __webpack_require__.o(e, t) && e[t] && u.push(e[t][0]), 
            e[t] = 0;
            for (a in o) __webpack_require__.o(o, a) && (__webpack_require__.m[a] = o[a]);
            for (c && c(__webpack_require__), _(r); u.length; ) u.shift()();
        };
    })()
    console.log('__webpack_require__', __webpack_require__);
    console.log('AAAAAAAAAAAAA');
    __webpack_require__.e("src_modules_utils_js")
      .then(__webpack_require__.bind(__webpack_require__, "./src/modules/utils.js"))
      .then(function (_ref) {
          var MB = _ref.MB;
          console.log('MB', MB);
      })
      .catch(function (error) {
            return 'An error occurred while loading theS component';
        });
    //# sourceURL=webpack://mind-map/./src/index.js?
})();