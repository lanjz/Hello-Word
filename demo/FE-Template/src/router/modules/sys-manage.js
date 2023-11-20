import { fillRouterPath } from '../router-utils';
const config = [
	{
		path: '/user',
		name: 'userManage',
		component: () => import(/* webpackChunkName: "user-info" */ '../../views/sys-manage/user-manage/index.vue'),
		meta: {
			title: '用户管理',
			moduleCode: 'userManage',
			icon: 'icon-tupian'
		},
	},
	{
		path: '/role',
		name: 'roleManage',
		component: () => import(/* webpackChunkName: "role-info" */ '../../views/sys-manage/role-manage/index.vue'),
		meta: {
			title: '角色管理',
			moduleCode: 'roleManage',
			icon: 'icon-gouwu'
		},
	},
	{
		path: '/module',
		name: 'moduleManage',
		component: () => import(/* webpackChunkName: "module-info" */ '../../views/sys-manage/module-manage/index.vue'),
		meta: {
			title: '模块管理',
			moduleCode: 'moduleManage',
			icon: 'icon-shezhi'
		},
	},
	{
		path: '/system-parameter',
		name: 'systemParameter',
		component: () => import(/* webpackChunkName: "system-parameter" */ '../../views/sys-manage/system-parameter/index.vue'),
		meta: {
			title: '系统参数',
			moduleCode: 'systemParameter',
			icon: 'icon-jinnang'
		},
	},
];

export default fillRouterPath(config);
