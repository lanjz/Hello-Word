import component from './component'
import vueApi from './vue-api'
import dataBoard from './dataBoard'
import resourceMange from './resourceManage'
import accountManage from './accountManage'
import Home from '../page/home/Index';
const Shou = { template: '<div>HOME 页面</div>' }
export default {
  path: '/home',
  name: '首页',
  alias: '/home',
  component: Home,
  children: [
    {
      path: '',
      name: '首页-1',
      component: Shou
    },
    component,
    vueApi,
    dataBoard,
    resourceMange,
    accountManage,
  /*
    {
      path: '/a/:microApp(.*)',// 匹配微项目
      component: Shou
    },
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
    }*/
  ]
}