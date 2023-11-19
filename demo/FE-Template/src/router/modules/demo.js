import { fillRouterPath } from '../router-utils';
const config = [
	{
		path: '/demo',
		meta: {
			title: 'Demo',
			moduleCode: 'demo',
			icon: 'icon-dixiaofei'
		},
		children: [
			{
				path: 'button',
				name: 'button',
				meta: {
					title: '按钮',
					moduleCode: 'button',
				},
				children: [
					{
						path: 'button',
						name: 'button',
						component: () => import(/* webpackChunkName: "user-info" */ '../../views/demo/button.vue'),
						meta: {
							title: '按钮',
							moduleCode: 'button',
						},
					},
					{
						path: 'button2',
						name: 'button2',
						component: () => import(/* webpackChunkName: "user-info" */ '../../views/demo/button.vue'),
						meta: {
							title: '按钮2',
							moduleCode: 'button2',
						},
					},
				],
			},
		],
	},
];

export default fillRouterPath(config);
