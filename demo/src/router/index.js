import Vue from 'vue';
import VueRouter from 'vue-router';
import { Message } from 'element-ui';
import { appInfo } from '@/utils/sensors';
import routerPermission from './permission';
import { constRoutes } from './routes';
// 解决重复点击相同路由报错
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
	return originalPush.call(this, location).catch((err) => err);
};
const originalReplace = VueRouter.prototype.replace;
VueRouter.prototype.replace = function replace(location) {
	return originalReplace.call(this, location).catch((err) => err);
};
Vue.use(VueRouter);

const routes = constRoutes;

// 创建路由
const createRouter = (routes) => {
	return new VueRouter({
		scrollBehavior: () => ({
			y: 0,
		}),
		routes,
	});
};

// 实例化注册路由
const router = createRouter(routes);

// 重置路由设置
export function resetRouter(routes) {
	const newRouter = createRouter(routes);
	router.matcher = newRouter.matcher; // reset router
}

// 路由守卫
router.beforeEach(async (to, from, next) => {
	const { actionUrl } = to.meta;
	if (actionUrl) {
		window.open(actionUrl);
		return;
	}
	try {
		// 根据路由设置document.title
		document.title = `${appInfo.platform_name} - ${to.meta.moduleName || to.meta.title}`;
		const option = await routerPermission(to, from, next);
		option ? next(option) : next();
	} catch (error) {
		console.log(error);
	}
});
router.afterEach((to) => {
	if (to.meta && to.meta.isPredevFlag === 'Y' && to.meta.predeveTips) {
		Message({
			message: to.meta.predeveTips,
			type: 'warning',
		});
	}
});
export default router;
