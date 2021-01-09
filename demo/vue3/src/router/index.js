import { createRouter,createWebHashHistory} from "vue-router"
import component from './component'
const Foo = { template: '<div>foo</div>' }
const Bar = { template: '<div>bar</div>' }

export const home = {
    path: '/home',
    name: '首页',
    component: Foo,
    children: [
        {
            path: '',
            name: '首页-1',
            component: Foo
        },
        component,
        Bar
    ]
}

const routes = [
    {
        path: '/',
        redirect: '/home'
    },
    home,
    { path: '/login', component: Bar },
    { path: '/foo', component: Foo },
    { path: '/bar', component: Bar },
    { name: '/404', path: '*', component: Bar }
]
export default createRouter({
    history: createWebHashHistory(),
    routes: routes
})