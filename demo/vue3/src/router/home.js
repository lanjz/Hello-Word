import component from './component'
import vueApi from './vue-api'
import resourceMange from './resourceManage'
import Home from '../page/home/Index';
import HomeIndex from '../page/home/Home';
export default {
  path: '/home',
  name: '首页',
  component: Home,
  children: [
    {
      path: '',
      name: '首页',
      component: HomeIndex
    },
    component,
    vueApi,
    resourceMange,
  ]
}