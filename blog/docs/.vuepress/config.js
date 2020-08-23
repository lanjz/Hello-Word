const sidebar = require('./sidebar')
module.exports = {
  title: 'Hello VuePress',
  // theme: '@vuepress/blog',
  description: 'Just playing around',
  extraWatchFiles: ['./sidebar.js'],
  port: 5000,
  sidebar: 'auto',
  themeConfig: {
    sidebarDepth: 2,
    nav: [
      { text: 'Home', link: '/' },
      {
        text: '体系',
        items: [
          { text: 'JavaScript', link: '/JavaScript/' },
          { text: 'Node', link: '/language/japanese' },
          { text: 'HTML5', link: '/HTML5/' },
          { text: 'CSS', link: '/CSS/' },
          { text: '网络', link: '/network/' },
          { text: '算法', link: '/language/japanese4' },
          { text: 'Web安全', link: '/secure/' },
          { text: '浏览器', link: '/language/japanese5' },
        ]
      },
      {
        text: '框架',
        items: [
          { text: 'Vue', link: '/Vue/' },
          { text: 'React', link: '/React/' },
        ]
      },
      {
        text: 'Node',
        items: [
          { text: '基础', link: '/Node/基础/' },
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
          { text: '系统设计', link: '/工程化/系统设计' },
          { text: '重构', link: '/工程化/重构改善既有代码的设计' },
          { text: '开发与调试', link: '/工程化/开发与调试技巧' },
        ]
      },
      {
        text: '利其器',
        items: [
          { text: 'Mac', link: '/利其器/' },
        ]
      },
      // { text: 'External', link: 'https://google.com' },
    ],
    sidebar
  },

}
