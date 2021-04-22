const path = require('path')
const PrerenderSPAPlugin = require('prerender-spa-plugin'); // 预渲染
const Renderer = PrerenderSPAPlugin.PuppeteerRenderer;
/*const rendererPlugin = new PrerenderSPAPlugin({
  staticDir: path.join(__dirname, '../dist'),
  // 对应自己的路由文件，比如index有参数，就需要写成 /index/param1。
  routes: ['/vue/home/'], // 因为该系统操作都是基于登录后的，所以只做登录页面的预渲染就行了
  renderer: new Renderer({
    inject: {
      foo: 'bar',
    },
    headless: false,
    // 在 main.js 中 document.dispatchEvent(new Event('render-event'))，两者的事件名称要对应上。
    renderAfterDocumentEvent: 'render-event',
  }),
})*/
module.exports = {
  lintOnSave: false,
  devServer: {
    // 关闭主机检查，使微应用可以被 fetch
    disableHostCheck: true,
    // 配置跨域请求头，解决开发环境的跨域问题
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  },
  configureWebpack: {
    output: {
      // 微应用的包名，这里与主应用中注册的微应用名称一致
      library: "VueMicroApp",
      // 将你的 library 暴露为所有的模块定义下都可运行的方式
      libraryTarget: "umd",
      // 按需加载相关，设置为 webpackJsonp_VueMicroApp 即可
      jsonpFunction: `webpackJsonp_VueMicroApp`,
    },
  },
  /*plugins: [
    // rendererPlugin
  ]*/
};