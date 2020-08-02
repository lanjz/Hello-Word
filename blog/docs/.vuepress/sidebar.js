module.exports = {
  // 侧边栏在 /foo/ 上
  '/guide/': [
    '',
    'page-a',
  
  ],
  // 侧边栏在 /bar/ 上
  '/page-a/': [
    '',
  ],
  '/secure/': [
    '/secure/'
  ],
  '/利其器/': [
    '/利其器/Mac'
  ],
  '/JavaScript/': [
    '/JavaScript/JS基础',
    '/JavaScript/JS核心',
    '/JavaScript/编写高质量JavaScript代码的基本要点',
    '/JavaScript/函数',
    '/JavaScript/全面解析Module模式',
    '/JavaScript/闭包',
    '/JavaScript/设计模式',
    '/JavaScript/对象创建模式',
    '/JavaScript/吱不吱',
    {
      title: 'ES6',
      collapsable: false,
      children: [
        '/JavaScript/guide/',
        '/JavaScript/ES6/函数的扩展',
        '/JavaScript/ES6/Symbol',
        '/JavaScript/ES6/数组',
        '/JavaScript/ES6/对象',
        '/JavaScript/ES6/Set和WeakSet',
        '/JavaScript/ES6/Map和WeakMap',
        '/JavaScript/ES6/Promise',
        '/JavaScript/ES6/Iterator',
        '/JavaScript/ES6/Generater',
        '/JavaScript/ES6/async函数',
        '/JavaScript/ES6/Proxy',
        '/JavaScript/ES6/Class',
        '/JavaScript/ES6/Class继承',
        '/JavaScript/ES6/Module',
        '/JavaScript/ES6/Module的加载实现'
      ]
    }
   /*  {
      title: 'Group 1',
      collapsable: false,
      children: [
        '/'
      ]
    },
    {
      title: 'Group 2',
      children: [ 
          '/guide/',
          '/page-a/',
       ]
    }, */
  ],
  '/CSS/': [
    '/CSS/样式实现'
  ],
  '/Vue/': [
    '/Vue/组件通信',
    '/Vue/响应式原理',
    '/Vue/Watch',
    '/Vue/Computed',
    '/Vue/响应更新',
    '/Vue/VirtualDom',
    '/Vue/$nextTick',
    '/Vue/VueRouter',
  ],
  '/React/': [
    '/React/ReactDOM.render',
    '/React/Fiber',
    '/React/高阶组件',
    '/React/React16新特性',
    '/React/Hook',
    '/React/Diff',
    '/React/性能优化',
    '/React/React高级指引',
    '/React/Redux',
    '/React/服务端渲染',
  ],
  '/network/': [
    '/network/HTTP及演变',
    '/network/HTTPS',
    '/network/浏览器缓存',
    '/network/跨域',
    '/network/CDN',
    '/network/Cookie',
    '/network/DNS',
    '/network/TCP',
  ],
  '/Node/Webpack/': [
    '/Node/Webpack/配置小记',
    '/Node/Webpack/构建速度优化',
    '/Node/Webpack/开发效率优化',
    '/Node/Webpack/Plugin',
    '/Node/Webpack/Webpack流程分析',
    '/Node/Webpack/吱不吱',
  ]
}