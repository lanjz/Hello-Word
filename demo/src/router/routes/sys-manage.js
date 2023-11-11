import { fillRouterPath } from '@/router/router-utils';
const config = [
	{
		path: '/sys-manage',
		meta: {
			title: '系统管理',
			moduleCode: 'sysManage',
			icon: 'menu-sys-manage',
		},
		children: [
			{
				path: 'user',
				name: 'userManage',
				component: () => import(/* webpackChunkName: "user-info" */ '@/views/sys-manage/user-manage'),
				meta: {
					title: '用户管理',
					moduleCode: 'userManage',
				},
			},
			{
				path: 'role',
				name: 'roleManage',
				component: () => import(/* webpackChunkName: "role-info" */ '@/views/sys-manage/role-manage'),
				meta: {
					title: '角色管理',
					moduleCode: 'roleManage',
				},
			},
			{
				path: 'module',
				name: 'moduleManage',
				component: () => import(/* webpackChunkName: "module-info" */ '@/views/sys-manage/module-manage'),
				meta: {
					title: '模块管理',
					moduleCode: 'moduleManage',
				},
			},
			{
				path: 'log',
				name: 'logManage',
				component: () => import(/* webpackChunkName: "/log-manage" */ '@/views/sys-manage/log-manage'),
				meta: {
					title: '系统日志',
					moduleCode: 'logManage',
				},
			},
			{
				path: 'shared-center',
				name: 'sharedCenter',
				component: () => import(/* webpackChunkName: "shared-center" */ '@/views/sys-manage/shared-center/index'),
				meta: {
					title: '共享中心',
					moduleCode: 'sharedCenter',
				},
			},
			{
				path: 'system-parameter',
				name: 'systemParameter',
				component: () => import(/* webpackChunkName: "system-parameter" */ '@/views/sys-manage/system-parameter/index'),
				meta: {
					title: '系统参数',
					moduleCode: 'systemParameter',
				},
			},
			// {
			// 	path: 'integration-rule',
			// 	name: 'integrationRule',
			// 	component: () => import(/* webpackChunkName: "integration-rule" */ '@/views/sys-manage/integration-rule/index'),
			// 	meta: {
			// 		title: '集成规则',
			// 		moduleCode: 'integrationRule',
			// 	},
			// },
			{
				path: 'cycle-setting',
				name: 'cycleSetting',
				component: () => import(/* webpackChunkName: "cycle-setting" */ '@/views/sys-manage/cycle-setting/index'),
				meta: {
					title: '周期设置',
					moduleCode: 'cycleSetting',
				},
			},
			{
				path: '/ims',
				meta: {
					title: '集成管理',
					moduleCode: 'ims',
				},
				children: [
					{
						path: 'sysAuth',
						name: 'sysAuth',
						component: () => import('@/views/sys-manage/ims/sysAuth'),
						meta: {
							title: '系统授权',
							moduleCode: 'sysAuth',
						},
					},
					{
						path: 'apiAuth',
						name: 'apiAuth',
						component: () => import('@/views/sys-manage/ims/apiAuth'),
						meta: {
							title: '接口授权',
							moduleCode: 'apiAuth',
						},
					},
					{
						path: 'imRule',
						name: 'imRule',
						component: () => import('@/views/sys-manage/ims/imRule'),
						meta: {
							title: '集成规则',
							moduleCode: 'imRule',
						},
					},
				],
			},
			{
				path: 'download',
				name: 'download',
				component: () => import(/* webpackChunkName: "download" */ '@/views/sys-manage/download/admin-download'),
				meta: {
					title: '批导明细',
					moduleCode: 'download',
				},
			},
		],
	},
];

export default fillRouterPath(config);
