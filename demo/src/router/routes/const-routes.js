import store from '@/store';
export const LAYOUT_ROUTER_MAIN = 'main';
export const HOME_PATH = '/';
const constRoutes = [
	{
		path: HOME_PATH,
		name: LAYOUT_ROUTER_MAIN,
		component: () => import(/* webpackChunkName: "layout-main" */ '@/layouts/main'),
		redirect: '/task-center/own/to-be-done',
		props: () => {
			return {
				menus: store.state.user.menuList,
			};
		},
		children: [
			{
				path: 'home',
				name: 'home',
				meta: {
					title: '首页',
				},
				component: () => import(/* webpackChunkName: "component-home" */ '@/views/home'),
			},
			{
				path: 'refresh-page',
				component: () => import('@/views/refresh-page/index'),
				hide: true,
				meta: {},
			},
		],
	},
	{
		path: '/error',
		name: 'error',
		meta: {
			title: 'HOME',
		},
		component: () => import(/* webpackChunkName: "layout-main" */ '@/layouts/error/index'),
	},
	{
		path: '/login',
		name: 'login',
		meta: {
			title: '登录',
		},
		component: () => import(/* webpackChunkName: "layout-login" */ '@/layouts/login'),
	},
];

export default constRoutes;
