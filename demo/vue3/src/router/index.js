import { createRouter,createWebHistory} from "vue-router"
import Login from '../page/login/Login'
import home from './home'
import Test from '../page/Test'
const NoPage = { template: '<div>404</div>' }

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: "/test",
    component: Test
  },
  home,
  { path: '/login', component: Login },
  { name: '/404', path: '/:catchAll(.*)', component: NoPage }
]
export default createRouter({
  history: createWebHistory( '/vue/'),
  routes: routes,
})