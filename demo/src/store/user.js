/* eslint-disable no-unused-vars */
import { getUrlParams } from '@/utils/index';
import { addRouter, addLocalRouter } from '@/router/router-utils';
import permissionApi from '@/api/permission/index';
import { setSensorsUserInfo } from '@/utils/sensors';
import { getCookie, setCookie, delAllCookie } from '@/utils/cookie';
import perApi from '@/api/permission';
import { fetch } from '@/utils/request';

function findDefaultShareCenter(data, tar) {
	// 有 tar 则找 tar 匹配，没有则找默认选中
	const tem = [...data];
	while (tem.length) {
		let pop = tem.pop();
		if (tar && pop.shareCenterCode === tar) {
			return pop;
		} else if (pop.isDefault === 1) {
			return pop;
		}

		if (pop.children && pop.children.length) {
			tem.push(...pop.children);
		}
	}
	return null;
}
const state = {
	loginInfo: {}, // 登录帐号信息
	roleId: '', // 当前选中的 roleId
	roles: [], // 角色列表
	tenantCode: '', // 当前选中租户
	tenantList: [], // 租户列表
	menuList: [], // 菜单列表
	shareCenterList: [], // 共享中心
	shareCenterCode: '', // 当前共享中心
	menuButton: {}, //菜单配置的按钮
};
const getters = {
	shareCenterFlat: (state) => {
		let res = [];
		let walk = (l, deep = 0) => {
			for (let i of l) {
				i.deep = deep;
				res.push(i);
				if (i.children && i.children.length) {
					walk(i.children, deep + 1);
				}
			}
		};
		walk(state.shareCenterList);
		return res;
	},
	// 当前登录选中的共享中心
	curShareCenter: (state) => {
		return findDefaultShareCenter(state.shareCenterList, state.shareCenterCode) || {};
	},
	// 当前登录选中的完整租户信息
	curTenant: (state) => {
		if (state.tenantList && state.tenantList.length) {
			return state.tenantList.find((item) => item.tenantCode === state.tenantCode);
		}
		return {};
	},
	curRole: (state) => {
		if (state.roles && state.roles.length) {
			return state.roles.find((item) => item.roleCode === state.roleId);
		}
		return {};
	},
};
const mutations = {
	LOGIN_INFO_UPDATE: (state, data = {}) => {
		state.loginInfo = data;
	},
	ROLES_UPDATE: (state, roles) => {
		state.roles = roles;
		// todo 默认角色的选择逻辑
		state.roleId = roles.length ? roles[0].roleCode : '';
	},
	MENU_UPDATE: (state, data) => {
		state.menuList = data;
	},
	TENANT_CODE_UPDATE: (state, tenantCode) => {
		state.tenantCode = tenantCode;
	},
	TENANT_LIST_UPDATE: (state, tenantList) => {
		state.tenantList = tenantList;
	},
	SHARE_CENTER_UPDATE: (state, code) => {
		state.shareCenterCode = code;
	},
	SHARE_CENTER_LIST_UPDATE: (state, tenantList) => {
		state.shareCenterList = tenantList;
	},
	MENU_UPDATE_BUTTON: (state, data) => {
		Object.assign(state.menuButton, data);
	},
};

const actions = {
	// 退出登录
	async LOGIN_OUT_POST({ state, dispatch }) {
		let { err } = await permissionApi.loginOut();
		if (!err) {
			permissionApi.clearTicket();
		}
		return { err };
	},
	// 登出后的处理，重置一些必要信息
	LOGIN_OUT_AFTER({ commit }) {
		commit('ROLES_UPDATE', []); // 清空角色
		commit('TENANT_LIST_UPDATE', []); // 清空租户
		commit('LOGIN_INFO_UPDATE', {}); // 清空登录信息
	},
	async LOGIN_TICKET() {
		const getQueryTicket = getUrlParams('ticket');
		if (getQueryTicket) {
			let res = await fetch(
				{
					url: '/apis-auth/login/cas',
					method: 'post',
					data: {
						appKey: 'fsop',
						appSecret: 'fsop',
						deviceId: 'web',
						ticket: getQueryTicket,
						service: window.location.origin,
					},
				},
				{ directReturn: true }
			);
			if (res.data.success) {
				// setCookie('cas-token', res.data.obj.token);
				let preHref = window.sessionStorage.getItem('pre-href');
				// 种下新 cookie 之后跳转到之前的路径（主要是为了消除 ticket ）
				window.location.replace(preHref || '/');
				return { data: res.data.obj.token };
			} else {
				return { err: 'CAS登录出错' };
			}
		}
		return { err: null };
	},
	// 校验TOKEN
	async CHECK_TOKEN({ commit, dispatch }) {
		const { err } = await dispatch('LOGIN_TICKET');
		if (err) {
			console.log(err);
			return { err };
		}
		let res = await fetch({
			url: '/apis-auth/login/check_token',
		});
		if (!res.err) {
			await dispatch('LOGIN_AFTER', res.data.data);
		}
		return { err: !res.data.success };
	},
	// 校验登录
	async LOGIN_CHECK({ commit, dispatch }) {
		let { err, data = {} } = await permissionApi.checkLogin();
		if (!err) {
			return dispatch('MENU_LIST', data.result);
		} else {
			return { err };
		}
	},
	async LOGIN_AFTER({ commit, dispatch }, data) {
		let result = data;
		commit('LOGIN_INFO_UPDATE', result);
		setSensorsUserInfo(result.userName);
		let { err } = await dispatch('LESSEE_LIST');
		if (!err) {
			// dispatch('ROLES_GET'),
			return Promise.all([dispatch('MENU_LIST'), dispatch('SHARE_CENTER_LIST')]);
		}
		return { err: null };
	},
	// 获取租户列表
	async LESSEE_LIST({ state, commit }) {
		let { err, data } = await permissionApi.getLessee({ userName: state.loginInfo.userName });
		if (!err) {
			const tenantList = data.data;
			commit('TENANT_LIST_UPDATE', tenantList);
			let currTenant = tenantList.find((item) => item.isDefault === 1) || tenantList[0];
			if (currTenant) {
				commit('TENANT_CODE_UPDATE', currTenant.tenantCode);
			}
			return { err, tenantList };
		}
		return { err };
	},
	// 切换默认租户
	async SWITCH_LESSEE({ state, rootState, commit }, tenantCode) {
		const res = await permissionApi.updateTessee({
			lesseeNo: tenantCode,
		});
		// 正常切换租户后会通过 reload 重新加页面，所以不需要手动更新当前选中租户
		return res;
	},
	// 获取共享中心
	async SHARE_CENTER_LIST({ state, commit }) {
		let { err, data } = await fetch({
			url: '/admin/common/sharecenter/list',
			params: {
				tenantCode: state.tenantCode,
				userName: state.loginInfo.userName,
			},
		});
		if (!err) {
			const list = data.data;
			commit('SHARE_CENTER_LIST_UPDATE', list);
			let curData = findDefaultShareCenter(list) || list[0];
			if (curData) {
				commit('SHARE_CENTER_UPDATE', curData.shareCenterCode);
			}
			return { err, list };
		}
		return { err };
	},
	// 切换共享中心
	async SWITCH_SHARE_CENTER({ state, rootState, commit }, shareCenterCode) {
		const res = await fetch({
			url: '/admin/sharecenter/switch',
			method: 'post',
			data: {
				shareCenterCode,
				tenantCode: state.tenantCode,
				userName: state.loginInfo.userName,
			},
		});
		return res;
	},
	//获取角色并赋权
	async ROLES_GET({ state, commit }) {
		let { err, data } = await permissionApi.getRoles();
		if (!err) {
			let roles = data.result;
			commit('ROLES_UPDATE', roles); //状态管理保存角色数组
		}
	},
	//从后台获取当前角色有权限的菜单列表
	async MENU_LIST({ state, getters, commit }) {
		let { err, data = {} } = await permissionApi.getModule({ tenantId: getters.curTenant.tenantId });
		let dealBtn = (module) => {
			let moduleCodeBtns = {};
			module.children.forEach((element) => {
				moduleCodeBtns[element.moduleCode] = {
					hidden: element.hidden,
					isPredevFlag: element.isPredevFlag,
					moduleCode: element.moduleCode,
					moduleName: element.moduleName,
					predeveTips: element.predeveTips,
				};
			});
			let obj = {};
			obj[module.moduleCode] = moduleCodeBtns;
			commit('MENU_UPDATE_BUTTON', obj);
		};
		if (!err) {
			let walk = (list) => {
				return list.filter((item) => {
					item.hide = item.hidden === 'Y';
					item.title = item.moduleName;
					if (item.children && item.children.length) {
						if (item.children.find((i) => i.moduleType === 4)) {
							dealBtn(item);
						}
						item.childModules = walk(item.children);
						item.children = walk(item.children);
					}

					// todo 是否还需要 moduleType
					return item.moduleType === 3;
				});
			};
			let moduleList = data.data && data.data[0] ? data.data[0].children : [];
			const menus = walk(moduleList);
			// getAppMenu 是动态菜单 + 静态菜单的集合
			const getAppMenu = addRouter(menus);
			commit('MENU_UPDATE', getAppMenu);
			return { data: getAppMenu };
		}

		return { err };
	},
	//跳过鉴权直接注册异步路由
	async ADD_LOCAL_MENU_LIST({ state, commit }) {
		if (state.menuList.length) {
			return;
		}
		const getAppMenu = addLocalRouter();
		commit('MENU_UPDATE', getAppMenu);
		return getAppMenu;
	},
};
export default {
	namespaced: true,
	state,
	mutations,
	getters,
	actions,
};
