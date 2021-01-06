import component from './component'
import vueApi from './vue-api'
import Index from '../layout'
import Home from '../page/Home'
import Login from '../page/Login'
import NoPage from '../page/404'
const Foo = { template: '<div>foo</div>' }
const Bar = { template: '<div>bar</div>' }

export const home = {
    path: '/home',
    name: '首页',
    component: Index,
    children: [
        {
            path: '',
            name: '首页-1',
            component: Home
        },
        component,
        vueApi
    ]
}

const routes = [
    {
        path: '/',
        redirect: '/home'
    },
    home,
    { path: '/login', component: Login },
    { path: '/foo', component: Foo },
    { path: '/bar', component: Bar },
    { name: '/404', path: '*', component: NoPage }
]
export default routes