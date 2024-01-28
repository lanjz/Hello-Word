import { fillRouterPath } from '../router-utils';
const config = [
	{
		path: '/doc',
		name: 'doc',
		component: () => import(/* webpackChunkName: "doc-msg" */ '../../views/doc/index.vue'),
		meta: {
			title: '文档管理',
			moduleCode: 'doc',
			icon: 'icon-tupian'
		},
	},
];

export default fillRouterPath(config);
