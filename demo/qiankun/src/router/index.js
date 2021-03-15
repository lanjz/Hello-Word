import { createRouter,createWebHistory} from "vue-router"
import Login from '../page/login/Login'
import home from './home'
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
export default createRouter({
    history: createWebHistory(),
    routes: routes
})