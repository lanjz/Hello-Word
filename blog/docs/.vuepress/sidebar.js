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
  '/JavaScript/': [
    '/JavaScript/JS基础',
    '/JavaScript/JS核心',
    '/JavaScript/ES6',
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
        '/JavaScript/ES6/Symbol',
        '/JavaScript/ES6/数组',
        '/JavaScript/ES6/对象',
        '/JavaScript/ES6/Set和WeakSet',
        '/JavaScript/ES6/Map和WeakMap',
        '/JavaScript/ES6/Iterator',
        '/JavaScript/ES6/Proxy',
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
  ]
}