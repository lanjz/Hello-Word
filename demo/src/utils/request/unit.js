import { Loading } from 'element-ui';
import axios from 'axios';

export const fetchLoading = {
	loadingInstance: null, // loading 实例
	loadingNumber: 0, // 正在Loading的中请求
	show: function (vice) {
		// eslint-disable-next-line no-prototype-builtins
		if (vice.hasOwnProperty('loading')) {
			this.loadingNumber++;
			this.loadingInstance = Loading.service({
				lock: true,
				body: true,
				text: vice.loading,
			});
		}
	},
	hide: function (vice) {
		// eslint-disable-next-line no-prototype-builtins
		if (vice.hasOwnProperty('loading')) {
			this.loadingNumber--;
		}
		if (this.loadingNumber <= 0) {
			this.loadingNumber = 0;
			this.loadingInstance && this.loadingInstance.close();
		}
	},
};

const CancelToken = axios.CancelToken;

export const pendingFetch = {
	pendingRequestKey: new Map(), // 通过字符串参数保存对象参数，两个相同的参数只会映射最后一个
	pendingRequest: new WeakMap(), // 通过字符串参数保存对象参数，两个相同的参数只会映射最后一个
	createUniRequestKey: function (config) {
		let { url, method, params = {}, data } = config;
		let temParams = { ...params };
		if (typeof data === 'object') data = JSON.stringify(data);
		return [url, method, JSON.stringify(temParams), data].join('-');
	},
	addFetch: function (config) {
		const { cancelToken } = config; // 自有的cancelToken属性
		const { createCancelToken } = config.vice; // 自定义的cancelToken
		if (!cancelToken) {
			// 存在自有的cancelToken方法时，将无法防重复请求
			let pendingKey = this.createUniRequestKey(config);
			let hasReady = this.pendingRequestKey.has(pendingKey);
			let that = this;
			config.cancelToken = new CancelToken(function executor(c) {
				createCancelToken && createCancelToken(c);
				if (hasReady) {
					console.error('重复请求', config.url, '已在发起时取消');
					c();
				} else {
					that.pendingRequest.set(config, c);
					that.pendingRequestKey.set(pendingKey, config);
				}
			});
		}
	},
	removeFetch: function (config) {
		let pendingKey = this.createUniRequestKey(config);
		// 相同的请求 pendingRequestKey和pendingRequest 只会记录一个记录
		// 但触发 removePendingKey 的条件有多种
		// 比如触发了 cancel 时，也会执行当前方法，此时pendingRequest并没有保存 cancel掉的请求
		// 只有要删除的config 真实存在时，才移除pendingRequestKey中key
		if (this.pendingRequest.has(config)) {
			this.pendingRequestKey.delete(pendingKey);
		}
		this.pendingRequest.delete(config);
		// console.log('pendingRequest', this.pendingRequest, this.pendingRequestKey)
	},
};

export function toFormData(data = {}) {
	let formData = new FormData();
	for (let key of Object.keys(data)) {
		formData.append(key, data[key]);
	}
	return formData;
}
