import { createRouter, createWebHashHistory } from 'vue-router'
// import { createPinia } from 'pinia'
import { appInfo } from '../utils/help'
import { userStore } from '../stores/user'
import routerConfig from './modules'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: routerConfig
})

// const userStateIns = userStore(createPinia())
const withoutAuthentication = []; // 不需要鉴权的路由
const needResetPath = []; // 需要做清空登录的路由
router.beforeEach(async (to, from, next) => {
  // 根据路由设置document.title
  const userStateIns = userStore()
  document.title = `${appInfo.appName} - ${to.meta.moduleName}`;
  if (needResetPath.includes(to.path)) {
    store.dispatch('user/LOGIN_OUT_AFTER');
    return next();
  } else if (withoutAuthentication.includes(to.path) || userStateIns.loginInfo.name) {
    let getRoutes = router.getRoutes();
    let isValidRoute = getRoutes.find((item) => item.path === to.path);
    if (!isValidRoute) {
      return next('/error');
    }
    return next();
  } else {
    const { err } = await userStateIns.checkLogin();
    if (!err) {
       return next(to.fullPath);
    }
    next()
  }
});
export default router
