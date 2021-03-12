import component from './component'
import vueApi from './vue-api'
import dataBoard from './dataBoard'
import resourceMange from './resourceManage'
import accountManage from './accountManage'
import Home from '../page/home/Index';
const Foo = { template: '<div>foo</div>' }
const Shou = { template: '<div>首页</div>' }
const MicroApp = { template: '<div id="frame"></div>' }
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
    component,
    vueApi,
    dataBoard,
    resourceMange,
    accountManage,
/*    {
      path: ':microApp+',// 匹配微项目
      component: MicroApp
    },*/

  ]
}