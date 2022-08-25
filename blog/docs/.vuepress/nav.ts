export const navbar = [
  { text: 'Home', link: '/', ignore: true },
  {
    text: '前端基础',
    children: [
      { text: 'JavaScript', link: '/JavaScript/' },
      { text: 'ES6', link: '/ES6/' },
      { text: 'HTML5', link: '/HTML5/' },
      { text: 'CSS', link: '/CSS/' },
      { text: 'Browser', link: '/Browser/' },
    ]
  },
  {
    text: '网络&算法',
    children: [
      { text: '网络', link: '/network/' },
      { text: '算法', link: '/Algorithm/' },
      { text: 'Web安全', link: '/secure/' },
    ]
  },
  {
    text: '框架',
    children: [
      { text: 'Vue', link: '/Vue/' },
      { text: 'Vue3', link: '/Vue3/' },
      { text: 'React', link: '/React/' },
      { text: 'qiankun', link: '/qiankun/' },
      { text: '跨平台', link: '/NA/' },
    ]
  },
  {
    text: 'Node',
    children: [
      {text: '基础', link: '/Node/基础/'},
      {text: 'API', link: '/Node/Api/'},
      {text: 'yarn&npm', link: '/Node/Package/'},
      {text: 'Webpack', link: '/Node/Webpack/'},
      {text: 'Vite', link: '/Node/Vite/'},
      {text: 'esbuild', link: '/Node/ESBuild/'},
      {text: 'SQL', link: '/Node/数据库/'},
    ]
  },
  {
    text: '工程化',
    children: [
      {text: '前端优化总结', link: '/工程化/前端优化总结.md' },
      {text: '系统设计', link: '/工程化/系统设计/'},
      {text: '预加载&预解析', link: '/工程化/预加载&预解析.md'},
      {text: '重构代码原则', link: '/工程化/重构改善既有代码的设计.md'},
      {text: '开发与调试', link: '/工程化/开发与调试技巧.md'},
      {text: '组件设计', link: '/工程化/组件设计的基本原则.md'},
      {text: '公共模块管理', link: '/工程化/公共模块管理.md'},
      {text: '内存泄漏', link: '/工程化/内存泄漏.md'},
      {text: '前端异常捕获', link: '/工程化/前端异常捕获.md'},
      {text: '自动化部署', link: '/工程化/自动化部署.md'},
      {text: '问题小计', link: '/工程化/疑难杂症.md'},
      {text: '性能指标', link: '/工程化/性能指标.md'},
      {text: 'Lighthouse', link: '/工程化/Lighthouse.md'},
      {text: '规范', link: '/工程化/前端规范/'},
      {text: '前端规范', link: '/工程化/前端规范/前端规范.md'},
      {text: '项目模板', link: '/工程化/前端规范/项目模板.md'},
      {text: '埋点', link: '/工程化/埋点方案.md'},
    ]
  },
  {
    text: '利其器',
    children: [
      { text: 'Mac', link: '/利其器/Mac.md' },
      { text: 'Git', link: '/利其器/Git.md' },
    ]
  },
  {
    text: '小工具',
    children: [
      { text: 'MD', link: '/online-tools/MD.md' },
    ]
  },
  { text: '关于我', link: '/Im/' },
]
export const sidebar = {
  '/secure/': [
    '/secure/'
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
    '/JavaScript/JS面象对象',
    '/JavaScript/正则',
    '/JavaScript/事件',
    '/JavaScript/吱不吱',
    '/JavaScript/吱不吱二',
    '/JavaScript/代码实现',
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
  '/ES6/': [
    '/ES6/函数的扩展',
    '/ES6/Symbol',
    '/ES6/数组',
    '/ES6/对象',
    '/ES6/Set和WeakSet',
    '/ES6/Map和WeakMap',
    '/ES6/Promise',
    '/ES6/Iterator',
    '/ES6/Generator',
    '/ES6/async函数',
    '/ES6/Proxy',
    '/ES6/Class',
    '/ES6/Class继承',
    '/ES6/Module',
    '/ES6/Module的加载实现'
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
    '/CSS/Image',
  ],
  '/Browser/': [
    '/Browser/浏览器中的进程与线程',
    '/Browser/HTML渲染过程',
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
    '/Vue/SSR',
    '/Vue/共享状态思想',
    '/Vue/Paas应用',
    '/Vue/吱不吱',
  ],
  '/Vue3/': [
    '/Vue3/V3升级目的',
    '/Vue3/使用区别',
    '/Vue3/SFC还是JSX',
    '/Vue3/createApp',
    '/Vue3/响应式原理',
    '/Vue3/watch',
    '/Vue3/setup',
    '/Vue3/响应式API',
    '/Vue3/Diff',
    '/Vue3/预渲染',
  ],
  '/React/': [
    '/React/vsVue',
    '/React/ReactDOM.render',
    '/React/Fiber',
    '/React/时间切片',
    '/React/Diff',
    '/React/高阶组件',
    '/React/React16新特性',
    '/React/Hook',
    '/React/性能优化',
    '/React/React高级指引',
    '/React/服务端渲染',
    '/React/吱不吱',
  ],
  '/qiankun/': [
    '/qiankun/微前端',
    '/qiankun/qiankun原理',
    '/qiankun/importHtmlEntry',
  ],
  '/NA/': [
    '/NA/微信小程序',
    '/NA/uniapp',
    '/NA/JSBridge',
  ],
  '/Algorithm/': [
    '/Algorithm/时间&空间复杂度',
    '/Algorithm/简单排序',
    '/Algorithm/动态规划',
    '/Algorithm/回溯',
    '/Algorithm/回文串',
    '/Algorithm/树',
    '/Algorithm/剑指offer二',
    '/Algorithm/小题',
    '/Algorithm/字节前端',
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
    '/network/网络层的优化'
  ],
  '/Node/基础/': [
    '/Node/基础/认识Node',
    '/Node/基础/进程和线程',
    '/Node/基础/事件循环',
    '/Node/基础/基础使用',
    '/Node/基础/Node模块',
    '/Node/基础/守护服务',
    '/Node/基础/吱不吱',
  ],
  '/Node/Api/': [
    '/Node/Api/Buffer',
    '/Node/Api/流',
    '/Node/Api/Node中的进程和线程',
  ],
  '/Node/Package/': ['/Node/Package/'],
  '/Node/Webpack/': [
    '/Node/Webpack/Webpack5新特性',
    '/Node/Webpack/Plugin',
    '/Node/Webpack/Loader',
    '/Node/Webpack/Babel-Loader',
    '/Node/Webpack/css-loader&style-loader',
    '/Node/Webpack/library',
    '/Node/Webpack/原理/tree-shaking',
    '/Node/Webpack/原理/code-split',
    '/Node/Webpack/ModuleFederation',
    '/Node/Webpack/原理/模块热替换',
    '/Node/Webpack/构建优化方案',
    '/Node/Webpack/优化实践之Vue-Cli',
    '/Node/Webpack/配置小记',
  ],
  '/Node/Vite/': [
    '/Node/Vite/Vite是啥',
  ],
  '/工程化/系统设计/': [
    '/工程化/系统设计/登录系统'
  ],
  '/HTML5/': [
    '/HTML5/HTML5新特性',
    '/HTML5/SVG',
    '/HTML5/Worker',
    '/HTML5/Preload和Prefetch',
    '/HTML5/IntersectionObserver',
    '/HTML5/requestIdleCallback和requestAnimationFrame',
  ]
}
