import { createRouter,createWebHistory} from "vue-router"
import Login from '../page/login/Login'
import home from './home'
import Guan from '../page/guan/404'
// import component from './component'
const Foo = { template: '<div>foo</div>' }
const Bar = { template: '<div>bar</div>' }
// const About = { template: '<div>About</div>' }
const NoPage = { template: '<div>404</div>' }


const routes = [
   {
        path: '/',
        redirect: '/home'
    },
  { name: '/404', path: '/:catchAll(.*)', component: NoPage },
  {
    path: '/:microApp+',// 匹配微项目
    component: { template: '<div>microApp</div>' }
  },
    home,
    { path: '/login', component: Login },
    { path: '/login', component: Foo },
    { path: '/foo', component: Foo },
    { path: '/bar', component: Bar },
    { path: '/guan', component: Guan },
    

]
export default createRouter({
    history: createWebHistory(),
    routes: routes
})