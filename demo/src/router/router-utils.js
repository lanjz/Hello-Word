import path from 'path';
import router from '@/router';
import { buildInHomeMenu, asyncRoutes } from '@/router/routes';
import { LAYOUT_ROUTER_MAIN } from './routes/constRoutes';
import store from '@/store';

// todo 404页面的跳转path没有注入到menus数据中

/**
 * @summary 将相对路径(path) 填充成绝对路径
 * @param   { RouteRowConfig[] } router  路由配置
 * @param   { string } parentPath 前缀路径
 * @return  { RouteRowConfig[] } router  路由配置
 * */
export function fillRouterPath(router, parentPath = '') {
	let isArray = Array.isArray(router);
	let walk = (router = [], parentPath = '') => {
		router.forEach((item) => {
			if (item.path && item.path[0] !== '/') {
				item.path = path.resolve(parentPath, item.path);
			}
			if (item.children && item.children.length) {
				walk(item.children, item.path);
			}
		});
	};
	if (isArray) {
		walk(router, parentPath);
	} else {
		walk(router.children, router.path);
	}

	return router;
}

/**
 * @summary 获取页面级别的路由
 * @summary 不管路由层级有多深，只取最里层的路由配置，最里层的是页面级别
 * @param   { RouteRowConfig[] } router 路由配置
 * @return  { RouteRowConfig[] } router 路由配置
 * */
export function getPageRouter(router) {
	let routerList = [];
	let walk = (router) => {
		router.forEach((item) => {
			if (item.children && item.children.length) {
				walk(item.children, item.path);
			} else {
				routerList.push(item);
			}
		});
	};
	walk(router);
	return routerList;
}

/**
 * @summary 获取 路由code 和路由的映射关系
 * @param   { RouteRowConfig[] } r 路由配置
 * @return  <array> [{<code: router>}, {code: [code...]}]
 **/
export function routerToMap(r) {
	// splice 之后原本的数据源将会置空
	// todo 忘了为啥要置空呢？ 怕影响到原本的路由结构？
	r = r.splice(0);
	const obj = {};
	const bindCodes = {};
	const addObj = (rs, tar) => {
		rs.forEach((item) => {
			if (item.children && item.children.length) {
				addObj(item.children, tar);
			} else {
				const { moduleCode: code, bindingCode } = item.meta;
				if (code) {
					if (tar[code]) {
						console.error('同层级下出现的重复路由 code', code);
					}
					tar[code] = item;
				}
				if (bindingCode) {
					bindingCode.forEach((item) => {
						if (!bindCodes[item]) {
							bindCodes[item] = [];
						}
						bindCodes[item].push(code);
					});
				}
				/*				if (item.children && item.children.length) {
					addObj(item.children, tar);
				}*/
			}
		});
	};
	addObj(r, obj);
	return [obj, bindCodes];
}

/**
 * @summary 内置的路由格式转换成类似后台返回的 menu 格式
 * @param   { RouteRowConfig[] } buildInRouter 路由配置
 * @return  { menuItem[] } menu 格式
 * */
export function routerTransformMenu(buildInRouter = []) {
	buildInRouter.forEach((item) => {
		if (!item.meta) {
			// 这一步基本是本地调试使用的
			item.meta = { title: item.name, moduleCode: item.name };
		}
		item.childModules = item.children;
		item.moduleName = item.meta.title;
		item.moduleIcon = item.meta.icon;
		item.title = item.moduleName;
		item.moduleCode = item.meta.moduleCode || item.name;
		if (item.childModules && item.childModules.length) {
			routerTransformMenu(item.childModules);
		}
	});
	return buildInRouter;
}

/**
 * @summary 动态添加路由
 * @summary 所有的路由都作为 index 的子路由，共享同一个index 组件
 * @return  { menuItem[] } 完整的菜单列表 （后台返回的菜单列表+内置的菜单项）
 * */
export function addRouter(menus) {
	let [getRouterMap, bindingCodesMap] = routerToMap(asyncRoutes);
	const registerValidRouter = (item, curRouter, routerObj) => {
		item.title = item.moduleName;
		item.props = {
			AUTHBTN: store.state.user.menuButton[item.moduleCode] || {},
		};
		Object.assign(curRouter.meta, item);
		Object.assign(item, curRouter);
		router.addRoute(LAYOUT_ROUTER_MAIN, item);
		// bindingCodes 作用
		// a 路由的权限可能取决于 b, c路由
		// 也就是只要有 b或c 的权限，就会有 a 的权限
		if (bindingCodesMap[item.moduleCode]) {
			bindingCodesMap[item.moduleCode].forEach((binds) => {
				let bindRouter = routerObj[binds];
				if (bindRouter && !bindRouter.meta.isRegister) {
					// bindRouter.meta.moduleCode = bindRouter.meta.code;
					bindRouter.meta.isRegister = true;
					const it = routerObj[binds];
					it.props = {
						AUTHBTN: item.props.AUTHBTN,
					};
					router.addRoute(LAYOUT_ROUTER_MAIN, it);
				}
			});
		}
	};
	const register404Router = (item) => {
		// 注册404页面
		const route404 = {
			path: '/404/' + item.moduleCode,
			name: item.moduleCode,
			meta: {
				title: '404',
			},
			component: () => import(/* webpackChunkName: "layout-error" */ '@/layouts/error'),
		};
		Object.assign(route404.meta, item);
		item.path = route404.path;
		router.addRoute('/', route404);
	};

	const doWalkMatch = (list, routerObj) => {
		list.forEach((item) => {
			// 只寻找页面级菜单
			const childModulesHas = Array.isArray(item.childModules) && item.childModules.length > 0;
			if (!childModulesHas) {
				let curRouter = routerObj[item.moduleCode];
				if (curRouter) {
					registerValidRouter(item, curRouter, routerObj);
				} else if (item.relationCode && routerObj[item.relationCode]) {
					// todo 功能待验证 直接在复用已有页面
					const r = { ...routerObj[item.relationCode] };
					r.path = `${item.moduleCode}`;
					registerValidRouter(item, r, routerObj);
				} else {
					register404Router(item);
				}
			} else {
				doWalkMatch(item.childModules, routerObj);
			}
		});
	};

	doWalkMatch(menus, getRouterMap);
	return [...menus, ...routerTransformMenu(buildInHomeMenu)];
}

/**
 * @summary 跳过鉴权直接注册异步路由
 * @summary 动态添加本地路由
 * @summary 所有的路由都作为 index 的子路由，共享同一个index 组件
 * @return  { menuItem[] } 完整的菜单列表 （后台返回的菜单列表+内置的菜单项）
 * */
export function addLocalRouter() {
	const menus = asyncRoutes;
	const registerValidRouter = (curRouter) => {
		router.addRoute(LAYOUT_ROUTER_MAIN, curRouter);
	};
	const doWalkMatch = (list) => {
		list.forEach((item) => {
			// 只寻找页面级菜单
			const childModulesHas = item.children && item.children.length > 0;
			if (!childModulesHas) {
				registerValidRouter(item);
			} else {
				doWalkMatch(item.children);
			}
		});
	};

	doWalkMatch(menus);
	return [...routerTransformMenu(menus), ...routerTransformMenu(buildInHomeMenu)];
}
