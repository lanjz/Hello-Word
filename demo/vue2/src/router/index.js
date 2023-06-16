import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Dynamic from '../views/dynamic'

Vue.use(VueRouter)

/**
 * @summary 将相对路径(path) 填充成绝对路径
 * @param   { RouteRowConfig[] } router  路由配置
 * @param   { string } parentPath 前缀路径
 * @return  { RouteRowConfig[] } router  路由配置
 * */
export function fillRouterPath(router, parentPath=''){
  let isArray = Array.isArray(router)
  let walk = (router = [], parentPath = '') => {
    router.forEach(item => {
      if(item.path && item.path[0] !== '/'){
        item.path = parentPath + item.path
      }
      if(item.children&&item.children.length){
        walk(item.children, item.path)
      }
    })
  }
  if(isArray){
    walk(router, parentPath)
  } else {
    walk(router.children , router.path)
  }

  return router
}

export const routes = [
  {
    path: '/',
    name: 'home',
    label: '首页',
    component: HomeView
  },
  {
    path: '/about',
    label: 'About',
    children: [
      {
        path: 'about',
        name: 'about',
        label: 'About',
        component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
      }
    ]
  }
]
export const dynamicRoutes = [
  {
    path: '/dynamic',
    label: '动态生成的页面',
  }
]
const router = new VueRouter({
  routes: fillRouterPath(routes)
})
// 路由守卫
router.beforeEach(async (to, from, next) => {
  try {
    const isRegister = router.getRoutes().find(item => {
      let reg = new RegExp(item.regex)
      return reg.test(to.path)
    })
    if(!isRegister){
      router.addRoute('/', {
        path: to.path,
        name: to.path,
        component: Dynamic
      });
    }
    return isRegister ? next(): next(to.path)
  } catch (error) {
    console.log(error);
  }
});
export default router
