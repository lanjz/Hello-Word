import { createRouter,createWebHashHistory} from "vue-router"
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
    home,
    { path: '/login', component: Login },
    { path: '/foo', component: Foo },
    { path: '/bar', component: Bar },
    { path: '/guan', component: Guan },
    { name: '/404', path: '/:catchAll(.*)', component: NoPage }
]
export default createRouter({
    history: createWebHashHistory(),
    routes: routes
})