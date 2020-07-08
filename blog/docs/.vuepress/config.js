const sidebar = require('./sidebar')
module.exports = {
  title: 'Hello VuePress',
  // theme: '@vuepress/blog',
  description: 'Just playing around',  
  port: 5000,
  themeConfig: {
      sidebarDepth: 2,
      nav: [
      { text: 'Home', link: '/' },
      {
        text: '体系',
        items: [
          { text: 'JavaScript', link: '/JavaScript/' },
          { text: 'Node', link: '/language/japanese' },
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
      { text: '工程化', 
      items: [
        { text: '部署', link: '/language/japanese6' },
      ]
    },
      // { text: '开发调试', link: '/guide/' },
      // { text: 'Guide', link: '/guide/' },
      // { text: 'PageA', link: '/page-a/' },
      // { text: 'External', link: 'https://google.com' },
      {
          text: 'Languages',
          items: [
            { text: 'Chinese', link: '/language/chinese7' },
            { text: 'Japanese', link: '/language/japanese' }
          ]
        }
      ],
      sidebar      

  },
  
}
