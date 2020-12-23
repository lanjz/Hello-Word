/*! For license information please see index.bundle.js.LICENSE.txt */
(() => {
    "use strict";
    var __webpack_modules__ = {
        "./src/modules/utils.js": (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
            eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"MA\": () => /* binding */ MA,\n/* harmony export */   \"MB\": () => /* binding */ MB\n/* harmony export */ });\nfunction MA() {\n  console.log('执行MA');\n}\nfunction MB() {\n  console.log('执行MB');\n}\n\n//# sourceURL=webpack://mind-map/./src/modules/utils.js?");
        }
    }, __webpack_module_cache__ = {};
    function __webpack_require__(_) {
        if (__webpack_module_cache__[_]) return __webpack_module_cache__[_].exports;
        var e = __webpack_module_cache__[_] = {
            exports: {}
        };
        return __webpack_modules__[_](e, e.exports, __webpack_require__), e.exports;
    }
    __webpack_require__.d = (_, e) => {
        for (var r in e) __webpack_require__.o(e, r) && !__webpack_require__.o(_, r) && Object.defineProperty(_, r, {
            enumerable: !0,
            get: e[r]
        });
    }, __webpack_require__.o = (_, e) => Object.prototype.hasOwnProperty.call(_, e), 
    __webpack_require__.r = _ => {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(_, Symbol.toStringTag, {
            value: "Module"
        }), Object.defineProperty(_, "__esModule", {
            value: !0
        });
    }, (() => {
        eval("/* harmony import */ var _modules_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./modules/utils */ \"./src/modules/utils.js\");\nconsole.log('AAAAAAAAAAAAA', _modules_utils__WEBPACK_IMPORTED_MODULE_0__.MB());\n\ndocument.body.onclick = function () {\n  Promise.resolve(/*! import() */).then(__webpack_require__.bind(__webpack_require__, /*! ./modules/utils */ \"./src/modules/utils.js\")).then(function (_ref) {\n    var MB = _ref.MB;\n    console.log('MB', MB);\n  })[\"catch\"](function (error) {\n    return 'An error occurred while loading theS hllComponent';\n  });\n};\n\n\nconsole.log('22222222', _modules_utils__WEBPACK_IMPORTED_MODULE_0__);\n\n//# sourceURL=webpack://mind-map/./src/index.js?");
    })();
})();