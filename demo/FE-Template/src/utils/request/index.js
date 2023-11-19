/**
 * 业务定制的axios处理方法
 * @desc 可根据业务系统需求进行修改
 */
import { ElMessage } from 'element-plus';
import axiosInstance from './axios';
import { toFormData } from '../index';
import { fetchLoading } from './unit';
import { mockData } from './mockData';
const api = '/';
const option = {
	// baseUrl 开发环境为了使用反向代理全局设置为 "/"
	baseURL: process.env.NODE_ENV === 'development' ? api : window._global.VUE_APP_BASE_API,
	// cookie携带
	withCredentials: true,
	// 超时时间(ms)
	timeout: 50000,
};

// 发送请求时的处理方法
const requestHandler = (config = {}) => {
	if (config.vice.formData) {
		config.headers['Content-Type'] = 'multipart/form-data';
		config.data = toFormData(config.data);
	}
	return config;
};

// 请求返回时的处理方法
const responseHandler = (response) => {
	if (response.config.responseType === 'arraybuffer') {
		try {
			// 尝试 buffer 转 json
			let enc = new TextDecoder('utf-8');
			response.data = JSON.parse(enc.decode(new Uint8Array(response.data))); //转化成json对象
		} catch (e) {
			return Promise.resolve(response);
		}
	}
	if (response.config.vice && response.config.vice.directReturn) {
		return response;
	}
	// 通过这个来判断当前是网关返回的数据
	// eslint-disable-next-line no-prototype-builtins
	if (response.data && response.data.hasOwnProperty('success') && response.data.hasOwnProperty('obj')) {
		const { success } = response.data;
		if (!success) {
			return Promise.reject(new Error('登录失效'));
		}
		// 关键属性与业务接口保持统一
		response.data.code = '0';
		response.data.data = response.data.obj;
		return Promise.resolve(response);
	}
	// 业务接口处理
	const { code, info, msg } = response.data || {};
	if (code != 0) {
		return Promise.reject(new Error(info || msg));
	}
	return Promise.resolve(response);
};
const requestInstance = axiosInstance.getInstance(option, requestHandler, responseHandler);

export function fetch(options, vice = {}) {
	if(options.url.indexOf('/mock') === 0){
		return mockData(options)
	}
	const { method = 'get', url, data, params, ...more } = options;
	const doFetch = requestInstance;
	let fetchConfig = { method, url, data, params, ...more, vice };
	fetchLoading.show(vice);
	// pendingFetch.addFetch(fetchConfig) // 防重复请求
	return doFetch(fetchConfig)
		.then((response) => {
			let res = response.data;
			let result = res instanceof ArrayBuffer ? { data: response } : { err: res.code == 0 ? null : res, data: res };
			if (!result.err && vice.successText) {
				ElMessage({
					message: vice.successText,
					type: 'success',
				});
			}
			return result;
		})
		.catch((err) => {
			const { message = '', response } = err;
			let netError = '';
			if (response && response.data && response.data.errorMessage) {
				netError = response.data.errorMessage;
			} else if (message === 'Network Error' || message.indexOf('net') !== -1) {
				netError = '网络出错，请稍后再试';
			} else if (message.indexOf('time') !== -1 || message.indexOf('请求超时') !== -1) {
				netError = '请求超时，请稍后再试';
			}
			// 网络类型的错误尝试重试
			// todo fetchConfig.config
			if (netError && fetchConfig.config && fetchConfig.config.vice && (fetchConfig.config.vice.repeat || 0) > 0) {
				err.config.vice.repeat--;
				return requestInstance(fetchConfig.config);
			}
			if (netError) {
				err.errInfo = netError;
			}
			if (netError || message) {
				if (!vice.noToast) {
					setTimeout(() => {
						// 解决被组件hideLoading隐藏提示问题
						console.log('netError || message', netError || message);
						ElMessage({
							message: netError || message,
							type: 'error',
						});
					});
				}
			}
			return { err: err.message || err };
		})
		.finally(() => {
			fetchLoading.hide(vice);
			// pendingFetch.removeFetch(fetchConfig)
		});
}
fetch.post = function (url, data, vice) {
	return fetch(
		{
			url,
			method: 'POST',
			data,
		},
		vice
	);
};
fetch.get = function (url, params, vice) {
	return fetch(
		{
			url,
			method: 'GET',
			params,
		},
		vice
	);
};
export default requestInstance;
