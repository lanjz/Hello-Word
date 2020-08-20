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
    '/CSS/CSS3新特性',
    '/CSS/Flex',
    '/CSS/多列',
    '/CSS/移动端适配方案',
    '/CSS/移动端一像素问题',
    '/CSS/换肤',
    '/CSS/BFC和IFC',
    '/CSS/适配iponeX',
    '/CSS/样式实现',
  ],
  '/Vue/': [
    '/Vue/组件通信',
    '/Vue/模板到DOM',
    '/Vue/响应式原理',
    '/Vue/Watcher更新顺序',
    '/Vue/PatchNode',
    '/Vue/Watch',
    '/Vue/Computed',
    '/Vue/v-model',
    '/Vue/$nextTick',
    '/Vue/$set',
    '/Vue/数据代理',
    '/Vue/VueRouter',
    '/Vue/Vuex',
    '/Vue/Extend',
    '/Vue/Paas应用',
    '/Vue/吱不吱',
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
    '/network/keep-alive',
    '/network/WebSocket',
    '/network/网络层的优化',
  ],
  '/Node/基础/': [
    '/Node/基础/认识Node',
    '/Node/基础/基础使用',
    '/Node/基础/事件循环',
    '/Node/基础/Node模块',
    '/Node/基础/守护服务',
  ],
  '/Node/Package/': ['/Node/Package/'],
  '/Node/Webpack/': [
    '/Node/Webpack/Plugin',
    '/Node/Webpack/Loader',
    '/Node/Webpack/Babel-Loader',
    '/Node/Webpack/css-loader&style-loader',
    '/Node/Webpack/构建优化方案',
  ]
}