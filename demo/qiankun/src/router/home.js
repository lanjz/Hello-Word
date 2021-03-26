import component from './component'
import vueApi from './vue-api'
import dataBoard from './dataBoard'
import resourceMange from './resourceManage'
import accountManage from './accountManage'
import Home from '../page/home/Index';
const Foo = { template: '<div>foo</div>' }
const Shou = { template: '<div>首2页</div>' }
export default {
  path: '/home',
  name: '首页',
  component: Home,
  children: [
    {
      path: '',
      name: '首页-1',
      component: Shou
    },
    {
      path: '/abc',// 匹配微项目
      component: Foo
    },
    component,
    vueApi,
    dataBoard,
    resourceMange,
    accountManage,
    {
      path: '/vue/:microApp(.*)',// 匹配微项目
      component: { template: '<div id="frame"></div>' }
    },
    {
      path: '/abc/:microApp(.*)',// 匹配微项目
      component: { template: '<div id="frame"></div>' }
    },
    {
      path: '/react/:microApp(.*)',
      component: { template: '<div id="frame"></div>' }
    }
  ]
}