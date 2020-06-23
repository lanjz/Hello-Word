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
    '/JavaScript/JS执行机制',
    '/JavaScript/编写高质量JavaScript代码的基本要点',
    '/JavaScript/揭秘命名函数表达式',
    '/JavaScript/吱不吱',
    '/JavaScript/README2',
    {
      title: 'Group 2',
      collapsable: false,
      children: [
        '/JavaScript/guide/'
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