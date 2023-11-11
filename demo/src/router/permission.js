/**
 * 使用路由鉴权的设计思路， 在router.beforeEach钩子中进行权限校验
 */
import router from '@/router';
import store from '../store';

const withoutAuthentication = []; // 不需要鉴权的路由
const needResetPath = []; // 需要做清空登录的路由
export default async function routerPermission(to) {
	// 跳过鉴权直接注册异步路由
	/*	if (store.state.user.menuList.length) {
		return;
	} else {
		store.dispatch('user/ADD_LOCAL_MENU_LIST');
		return to.fullPath;
	}*/
	// eslint-disable-next-line no-unreachable
	if (needResetPath.includes(to.path)) {
		store.dispatch('user/LOGIN_OUT_AFTER');
		return;
	} else if (withoutAuthentication.includes(to.path) || store.state.user.loginInfo.userId) {
		let getRoutes = router.getRoutes();
		let isValidRoute = getRoutes.find((item) => item.regex.test(to.path));
		if (!isValidRoute) {
			return '/error';
		}
		return;
	} else {
		const { err } = await store.dispatch('user/CHECK_TOKEN');
		if (!err) {
			return to.fullPath;
		}
	}
}
