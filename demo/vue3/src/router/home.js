import component from './component'
import vueApi from './vue-api'
import dataBoard from './dataBoard'
import resourceMange from './resourceManage'
import accountManage from './accountManage'
import Home from '../page/home/Index';
const Foo = { template: '<div>foo</div>' }
export default {
  path: '/home',
  name: '首页',
  component: Home,
  children: [
    {
      path: '',
      name: '首页-1',
      component: Foo
    },
    component,
    vueApi,
    dataBoard,
    resourceMange,
    accountManage
  ]
}