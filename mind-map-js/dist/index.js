/******/ (() => { // webpackBootstrap
function component() {
  var element = document.createElement('div');
  var a = 'A';
  element.innerHTML = "Hello".concat(a);

  var abc = function abc() {
    console.log('箭头函数');
  };

  new Promise(function () {});
  var b = [1, 2, 3].includes(1);
  return element;
}

document.body.appendChild(component());
/******/ })()
;