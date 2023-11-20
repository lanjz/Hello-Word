import sysManageRoutes from './sys-manage';
import demoRoutes from './demo';

export const LAYOUT_ROUTER_MAIN = 'main';
export const HOME_PATH = '/';
export const moduleRoutes = [...demoRoutes, ...sysManageRoutes];
const mainRouter = [
    {
        path: HOME_PATH,
        name: LAYOUT_ROUTER_MAIN,
        component: () => import(/* webpackChunkName: "layout-main" */ '../../layouts/main/index.vue'),
        children: [
            {
                path: 'home',
                name: 'home',
                meta: {
                    title: '首页',
                },
                component: () => import(/* webpackChunkName: "component-home" */ '../../views/home/index.vue'),
            },
            {
                path: 'refresh-page',
                component: () => import('../../views/refresh-page/index.vue'),
                hide: true,
                meta: {},
            },
            ...moduleRoutes
        ],
    },
    {
        path: '/error',
        name: 'error',
        meta: {
            title: 'HOME',
        },
        component: () => import(/* webpackChunkName: "layout-main" */ '../../layouts/error/index.vue'),
    },
    {
        path: '/login',
        name: 'login',
        meta: {
            title: '登录',
        },
        component: () => import(/* webpackChunkName: "layout-login" */ '../../layouts/login/index.vue'),
    },
]

const homeRouter = mainRouter.find((item) => item.name === 'LAYOUT_ROUTER_MAIN') || {};

export const buildInHomeMenu = homeRouter.children || [];
export default mainRouter

