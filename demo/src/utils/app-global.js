import { fetch } from '@/utils/request';
import { listToEnum } from '@/utils/index';
const successOrNot = [
	{ label: '失败', value: 0, render: 'el-option' },
	{ label: '成功', value: 1, render: 'el-option' },
];
const successOrNotMap = listToEnum(successOrNot);
const planPeriod = [
	{ label: '当期', value: 0, render: 'el-option' },
	{ label: '下期', value: 1, render: 'el-option' },
];
const planPeriodMap = listToEnum(planPeriod);
const whether = [
	{ label: '是', value: 1, render: 'el-option' },
	{ label: '否', value: 0, render: 'el-option' },
];
export const whetherMap = listToEnum(whether);
// ruleModel
const ruleModelList = [
	{ label: '不启用规则', value: 0, render: 'el-option' },
	{ label: '启用规则', value: 1, render: 'el-option' },
];
const ruleModelListMap = listToEnum(ruleModelList);
// 非工作日生成
const holidaysExecuteList = [
	{ label: '不生成', value: 0, render: 'el-option' },
	{ label: '生成', value: 1, render: 'el-option' },
];
const holidaysExecuteMap = listToEnum(holidaysExecuteList);
// 是否线上
const isOnlineList = [
	{ label: '线上', value: 1, render: 'el-option' },
	{ label: '线下', value: 2, render: 'el-option' },
];
const isOnlineListMap = listToEnum(isOnlineList);
// 生成模式
const relModelType = [
	{ label: '单个生成模式', value: 1, render: 'el-option' },
	{ label: '组合生成模式', value: 2, render: 'el-option' },
];
const relModelTypeMap = listToEnum(relModelType);
// 状态
const baseStatus = [
	{ label: '有效', value: 1, render: 'el-option' },
	{ label: '无效', value: 0, render: 'el-option' },
];
const baseStatusMap = listToEnum(baseStatus);
// 状态
const searchStatus = [{ label: '全部', value: '', render: 'el-option' }, ...baseStatus];
const searchStatusMap = listToEnum(searchStatus);
const mixin = {
	data() {
		return {
			dictMX: {
				whether,
				isOnlineList,
				ruleModelList,
				holidaysExecuteList,
				relModelType,
				baseStatus,
				searchStatus,
				planPeriod,
				successOrNot,
			},
			dictMapMX: {
				whether: whetherMap,
				planPeriod: planPeriodMap,
				successOrNot: successOrNotMap,
				isOnlineList: isOnlineListMap,
				ruleModelList: ruleModelListMap,
				relModelType: relModelTypeMap,
				baseStatus: baseStatusMap,
				searchStatus: searchStatusMap,
				holidaysExecuteList: holidaysExecuteMap,
			},
		};
	},
	props: {
		AUTHBTN: {
			type: Object,
			default: () => ({}),
		},
	},
	computed: {
		authBtnMX() {
			let res = null;
			let parentIns = this;
			while (!res && parentIns) {
				if (parentIns.AUTHBTN && Object.keys(parentIns.AUTHBTN).length) {
					res = parentIns.AUTHBTN;
				}
				parentIns = parentIns.$parent;
			}
			return res || {};
		},
		dealResultMX() {
			return {
				create: {},
				dispatch: this.dictMapMX['Auth_Transfer_Reason'] || {},
				transfer: this.dictMapMX['Auth_Transfer_Reason'] || {},
				froze: this.dictMapMX['Frozen_Reason'] || {},
				unfroze: {},
				reject: this.dictMapMX['Rejected_Reason'] || {},
				delete: {},
				cancel: {},
				pass: {},
			};
		},
	},
	methods: {
		dealResMX(data, key, dictKey = 'dicKey', dictName = 'dicName') {
			let result = [];
			let map = {};
			data.forEach((item) => {
				map[item[dictKey]] = item[dictName];
				if (item.status === 1) {
					result.push({ label: item[dictName], value: item[dictKey], render: 'el-option', key: item[dictKey] });
				}
			});
			this.$set(this.dictMX, key, Object.freeze(result));
			this.$set(this.dictMapMX, key, Object.freeze(map));
			return { data: result, map };
		},
		async getDictMX(key) {
			if (this.dictMX[key]) {
				return { data: this.dictMX[key], map: this.dictMapMX[key] };
			}
			let dictResult = [];
			let localValue = sessionStorage.getItem(key);
			try {
				if (localValue && JSON.parse(localValue).length) {
					dictResult = JSON.parse(localValue);
				}
			} catch (e) {
				console.log('字典解析失败', e);
			}
			if (dictResult.length) {
				return this.dealResMX(dictResult, key);
			}
			if (!this.loadingTag) {
				this.loadingTag = {};
			}
			if (this.loadingTag[key]) return { data: [], map: {} };
			this.loadingTag[key] = true;
			const { err, data } = await fetch({
				url: '/admin/dictionary/selectAll',
				method: 'post',
				data: {
					pkeyPath: key,
				},
			});
			let result = err ? [] : data.data;
			sessionStorage.setItem(key, JSON.stringify(result));
			return this.dealResMX(result, key);
		},
		async getDictListMX(list = []) {
			const fetchArr = list.map((item) => this.getDictMX(item));
			const res = await Promise.all(fetchArr);
			return res;
		},
		async getTransferDictMX(url, params, dictKey, dictName, method = 'get') {
			params.pageSize = 50;
			const fetchOption = {
				url,
				method,
			};
			if (method === 'get') {
				fetchOption.params = params;
			} else {
				fetchOption.data = params;
			}
			let { err, data } = await fetch(fetchOption);
			if (!err) {
				this.dealResMX(data.data.rows, dictKey, dictName);
			}
		},
		confirmMix(message, title, options = {}) {
			return new Promise((resolve) => {
				this.$confirm(message, title, {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					...options,
				})
					.then(() => {
						resolve(true);
					})
					.catch(() => {
						resolve(false);
					});
			});
		},
		/**
		 * @summary 自动转换配置化表格里的字典数据
		 * */
		higherDictMX(config) {
			return config.map((item) => {
				if (item.render || !item.prop || item.prop.indexOf('.') < 0) {
					return item;
				}
				const [mapKey, dictKey] = item.prop.split('.');
				this.getDictMX(mapKey);
				return {
					...item,
					render: (h, { row }) => {
						const dict = this.dictMapMX[mapKey] || {};
						const value = row[dictKey];
						if (value && typeof value === 'object') {
							return value.map((it) => <span class="global-table-tag">{dict[it] || it || ''}</span>);
						}
						return <span>{dict[value] || value || ''}</span>;
					},
				};
			});
		},
		/**
		 * @summary 自动转换配置化表单里的下拉列表
		 * */
		higherDictListMX(config, allGroup) {
			return config.map((item) => {
				if (!item.child || typeof item.child === 'object') {
					return item;
				}
				const dictKey = item.child;
				this.getDictMX(dictKey);
				const child = [];
				if (allGroup && allGroup.length === 0) {
					// 传空数组，表示所有的字典下拉添加 全部选择
					child.push({ label: '全部', value: '', render: 'el-option' });
				} else if (allGroup && allGroup.length && allGroup.includes('dictKey')) {
					// 非空数组，根据具体字段添加 全部选择
					child.push({ label: '全部', value: '', render: 'el-option' });
				}
				child.push(...(this.dictMX[dictKey] || []));
				return {
					...item,
					child,
				};
			});
		},
	},
};
export default {
	install(Vue) {
		Vue.mixin(mixin);
	},
};
