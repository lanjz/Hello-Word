import axios from 'axios';

class AxiosService {
	constructor() {
		this.instance = null;
	}

	/**
	 * 获取实例
	 * @params option {} axios配置参数
	 */
	getInstance(option = {}, requestHandler, responseHandler) {
		if (!this.instance) {
			const { baseURL = '' } = option;
			if (!baseURL) {
				const error = new Error('缺少必须参数：baseURL');
				return Promise.reject(error);
			}
			this.instance = axios.create(option);

			// 添加请求拦截器
			this.instance.interceptors.request.use(
				(config) => {
					if (requestHandler) {
						return requestHandler(config);
					}
					return config;
				},
				(error) => {
					return Promise.reject(error);
				}
			);

			// 添加响应拦截器
			this.instance.interceptors.response.use(
				(response) => {
					if (responseHandler) {
						return responseHandler(response);
					}
					return response;
				},
				(error) => {
					return Promise.reject(error);
				}
			);
		}

		return this.instance;
	}
}

export default new AxiosService();
