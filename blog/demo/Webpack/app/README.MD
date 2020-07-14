# 手脚架

## 单页面

- 开发命令： `yarn start`

- 生产打包命令： `yarn build`

- 入口文件： `src/index.js`

## 多页面

将根据 `src/views` 里的目录自动生成相应页面

每个页面的入口函数为相应目录下的 `index.js` 

比如：

```js
- src
  -views
    - page1
      - index.js
    -page2
      - index.js
```

上面命令将生成两个页面： `page1` 和 `page2`

- 开发命令： `yarn start:`

- 生产打包命令： `yarn build:m`

- 入口文件： `src/views/[page]/index.js`

## 待处理问题

- 多页面模式下使用 `optimization` 页面不能正常访问 