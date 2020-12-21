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
    __webpack_require__.m = __webpack_modules__, __webpack_require__.d = (e, r) => {
        for (var _ in r) __webpack_require__.o(r, _) && !__webpack_require__.o(e, _) && Object.defineProperty(e, _, {
            enumerable: !0,
            get: r[_]
        });
    }, __webpack_require__.f = {}, __webpack_require__.e = e => Promise.all(Object.keys(__webpack_require__.f).reduce(((r, _) => (__webpack_require__.f[_](e, r), 
    r)), [])), __webpack_require__.u = e => e + ".bundle.js", __webpack_require__.g = function() {
        if ("object" == typeof globalThis) return globalThis;
        try {
            return this || new Function("return this")();
        } catch (e) {
            if ("object" == typeof window) return window;
        }
    }(), __webpack_require__.o = (e, r) => Object.prototype.hasOwnProperty.call(e, r), 
    inProgress = {}, dataWebpackPrefix = "mind-map:", __webpack_require__.l = (e, r, _) => {
        if (inProgress[e]) inProgress[e].push(r); else {
            var a, t;
            if (void 0 !== _) for (var i = document.getElementsByTagName("script"), o = 0; o < i.length; o++) {
                var c = i[o];
                if (c.getAttribute("src") == e || c.getAttribute("data-webpack") == dataWebpackPrefix + _) {
                    a = c;
                    break;
                }
            }
            a || (t = !0, (a = document.createElement("script")).charset = "utf-8", a.timeout = 120, 
            __webpack_require__.nc && a.setAttribute("nonce", __webpack_require__.nc), a.setAttribute("data-webpack", dataWebpackPrefix + _), 
            a.src = e), inProgress[e] = [ r ];
            var n = (r, _) => {
                a.onerror = a.onload = null, clearTimeout(u);
                var t = inProgress[e];
                if (delete inProgress[e], a.parentNode && a.parentNode.removeChild(a), t && t.forEach((e => e(_))), 
                r) return r(_);
            }, u = setTimeout(n.bind(null, void 0, {
                type: "timeout",
                target: a
            }), 12e4);
            a.onerror = n.bind(null, a.onerror), a.onload = n.bind(null, a.onload), t && document.head.appendChild(a);
        }
    }, __webpack_require__.r = e => {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
            value: "Module"
        }), Object.defineProperty(e, "__esModule", {
            value: !0
        });
    }, (() => {
        var e;
        __webpack_require__.g.importScripts && (e = __webpack_require__.g.location + "");
        var r = __webpack_require__.g.document;
        if (!e && r && (r.currentScript && (e = r.currentScript.src), !e)) {
            var _ = r.getElementsByTagName("script");
            _.length && (e = _[_.length - 1].src);
        }
        if (!e) throw new Error("Automatic publicPath is not supported in this browser");
        e = e.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/"), __webpack_require__.p = e;
    })(), (() => {
        var e = {
            index: 0
        };
        __webpack_require__.f.j = (r, _) => {
            var a = __webpack_require__.o(e, r) ? e[r] : void 0;
            if (0 !== a) if (a) _.push(a[2]); else {
                var t = new Promise(((_, t) => {
                    a = e[r] = [ _, t ];
                }));
                _.push(a[2] = t);
                var i = __webpack_require__.p + __webpack_require__.u(r), o = new Error;
                __webpack_require__.l(i, (_ => {
                    if (__webpack_require__.o(e, r) && (0 !== (a = e[r]) && (e[r] = void 0), a)) {
                        var t = _ && ("load" === _.type ? "missing" : _.type), i = _ && _.target && _.target.src;
                        o.message = "Loading chunk " + r + " failed.\n(" + t + ": " + i + ")", o.name = "ChunkLoadError", 
                        o.type = t, o.request = i, a[1](o);
                    }
                }), "chunk-" + r);
            }
        };
        var r = self.webpackChunkmind_map = self.webpackChunkmind_map || [], _ = r.push.bind(r);
        r.push = r => {
            for (var a, t, [i, o, c] = r, n = 0, u = []; n < i.length; n++) t = i[n], __webpack_require__.o(e, t) && e[t] && u.push(e[t][0]), 
            e[t] = 0;
            for (a in o) __webpack_require__.o(o, a) && (__webpack_require__.m[a] = o[a]);
            for (c && c(__webpack_require__), _(r); u.length; ) u.shift()();
        };
    })(), eval("console.log('AAAAAAAAAAAAA');\n\ndocument.body.onclick = function () {\n  __webpack_require__.e(/*! import() */ \"src_modules_utils_js\").then(__webpack_require__.bind(__webpack_require__, /*! ./modules/utils */ \"./src/modules/utils.js\")).then(function (_ref) {\n    var MB = _ref.MB;\n    console.log('MB', MB);\n  })[\"catch\"](function (error) {\n    return 'An error occurred while loading theS component';\n  });\n};\n\n//# sourceURL=webpack://mind-map/./src/index.js?");
})();