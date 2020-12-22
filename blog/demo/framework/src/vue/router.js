import Index from './layout/Index'
import Home from './page/Home'
import Login from './page/Login'
import NoPage from './page/404'
const Foo = { template: '<div>foo</div>' }
const Bar = { template: '<div>bar</div>' }
const Dir = { template: '<div>Dir</div>' }
const diff = { template: '<div>diff</div>' }

/*要注意，以 / 开头的嵌套路径会被当作根路径。 这让你充分的使用嵌套组件而无须设置嵌套的路径*/
const component = {
    name: '组件',
    path: 'component',
    component: { template: ' <router-view></router-view>'},
    children: [
        {
            path: 'profile2',
            name: '首页',
            component: Dir
        },
        {
            name: '首页2',
            path: 'profile',
            component: Bar
        },
        {
            name: '首页3',
            path: 'posts',
            component: diff
        }
    ]
}
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
        component
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