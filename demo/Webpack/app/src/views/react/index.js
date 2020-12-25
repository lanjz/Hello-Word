import React, { Component } from 'react';
import ReactDOM from 'react-dom';
// 引入样式和阿里巴巴的图标
// 引入组件
const root = document.createElement('div')
root.id = 'app'
document.body.appendChild(root)
ReactDOM.render(
  <h1>Hello, world!</h1>,
  document.getElementById('app')
);