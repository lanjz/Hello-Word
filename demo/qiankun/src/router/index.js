import {createRouter, createWebHistory, useRouter} from "vue-router"
import Login from '../page/login/Login'
import home from './home'
import microMenu from "../micro/apps";
const NoPage = { template: '<div>404</div>' }
const routes = [
   {
        path: '/',
        redirect: '/home'
    },
    home,
    { path: '/login', component: Login },
    { name: '/404', path: '/:catchAll(.*)', component: NoPage },
]
const appRoute = createRouter({
  history: createWebHistory(),
  routes: routes
})
function getMicroRouter(router){
  if(!microMenu) return []
  let component = { template: '<div id="frame">微应用</div>' }
  microMenu.forEach(item => {
    router.addRoute( '首页',{ path: item.activeRule, component  })
    router.addRoute( '首页', { path: item.activeRule+'/:microApp(.*)', component })
  })
  return microMenu
}
getMicroRouter(appRoute)
export default appRoute