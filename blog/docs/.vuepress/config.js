const sidebar = require('./sidebar')
module.exports = {
  title: 'Hello Wold',
  // theme: '@vuepress/blog',
  description: 'Just playing around',
  extraWatchFiles: ['./sidebar.js'],
  port: 5000,
  base: '/lanjz/',
  sidebar: 'auto',
  themeConfig: {
    sidebarDepth: 2,
    nav: [
      { text: 'Home', link: '/', ignore: true },
      {
        text: '前端基础',
        items: [
          { text: 'JavaScript', link: '/JavaScript/' },
          { text: 'ES6', link: '/ES6/' },
          { text: 'HTML5', link: '/HTML5/' },
          { text: 'CSS', link: '/CSS/' },
          { text: 'Browser', link: '/Browser/' },
        ]
      },
      {
        text: '网络&算法',
        items: [
          { text: '网络', link: '/network/' },
          { text: '算法', link: '/Algorithm/' },
          { text: 'Web安全', link: '/secure/' },
        ]
      },
      {
        text: '框架',
        items: [
          { text: 'Vue', link: '/Vue/' },
          { text: 'Vue3', link: '/Vue3/' },
          { text: 'React', link: '/React/' },
          { text: 'qiankun', link: '/qiankun/' },
          { text: '跨平台', link: '/NA/' },
        ]
      },
      {
        text: 'Node',
        items: [
          { text: '基础', link: '/Node/基础/' },
          { text: 'API', link: '/Node/Api/' },
          { text: 'yarn&npm', link: '/Node/Package/' },
          { text: 'Webpack', link: '/Node/Webpack/' },
          /*  {
             text: 'Webpack',
             items: [
               { text: 'Webpack', link: '/Node/Webpack/' },
               { text: '构建速度优化', link: '/Node/Webpack/构建速度优化', }
             ]
             // link: '/Node/Webpack/'
           }, */
        ]
      },
      // { text: '算法', link: '/' },
      {
        text: '工程化',
        items: [
          { text: '前端优化总结', link: '/工程化/前端优化总结/' },
          { text: '系统设计', link: '/工程化/系统设计/' },
          { text: '重构代码原则', link: '/工程化/重构改善既有代码的设计' },
          { text: '开发与调试', link: '/工程化/开发与调试技巧' },
          { text: '组件设计', link: '/工程化/组件设计的基本原则' },
          { text: '公共模块管理', link: '/工程化/公共模块管理' },
          { text: '内存泄漏', link: '/工程化/内存泄漏' },
          { text: '前端异常捕获', link: '/工程化/前端异常捕获' },
          { text: '自动化部署', link: '/工程化/自动化部署' },
          { text: '疑难杂症', link: '/工程化/疑难杂症' },
        ]
      },
      {
        text: '利其器',
        items: [
          { text: 'Mac', link: '/利其器/' },
        ]
      },
      { text: '关于我', link: '/Im/' },
      // { text: 'External', link: 'https://google.com' },
    ],
    sidebar
  },

}
