import axios from 'axios'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
let devEvn = 'dev'
export const baseUrl = {}
const http = new axios.create({
	baseURL: `${baseUrl[process.env.BUILD_ENV || devEvn]}/pos-admin`
});

export const userToken = {
	value: '',
	getValue(){
		return this.value
	},
	setValue(val){
		localStorage.setItem('pos-token', val);
		this.value = val
	}
}
let posToken = localStorage.getItem('pos-token');
if(posToken){
	userToken.setValue(posToken)
}
http.interceptors.request.use((config) => { // 可使用async await 做异步操作
	if(userToken.getValue()){
		config.headers['token'] = userToken.getValue()
	}
	return config
}, err => { // 可使用async await 做异步操作
	return Promise.reject(err)
})

http.interceptors.response.use(async (response) => {
	if(response.config.noToast){ // 不用显示
		return response.data
	}
	let err = ''
	if(response.data.code === 455){
		useRouter().push('/login')
		window.location.reload()
	} else if(response.data.code === 501 || response.data.code === 202){
		err = response.data.msg
	} else if(response.data.code === 500){
		err = '发生未知错误'
	} else if(response.data.code !== 200){
		err = response.data.msg || '发生未知错误'
	}
	if(err){
		setTimeout(() => { // 解决被hideLoading隐藏
			ElMessage.error(err);
		})
	}
	return response.data
}, (response) => { /*  对响应错误做点什么 （statusCode !== 200）*/
	ElMessage.error('发生了请求错误');
	return Promise.reject(response)
})


export function fetch(options, config = {}){
	const { method = 'get', url, data} = options
	const doFetch = http.request
	return doFetch({
		method,
		url,
		data,
		config
	})
		.then(res => {
			return { err: res.code === 200 ? null : res, data: res }
		})
		.catch(err => {
			return { err }
		})
}
export function uploadFile(options){
	const { path, ...opt } = options
	return http.upload('/file/upload', {
		header: { "Content-Type": "multipart/form-data" },
		filePath: path,
		name: 'file',
		formData: opt
	}).then(res => {
		return { err: res.code === 200 ? null : res, data: res }
	})
		.catch(err => {
			return { err }
		})
}

export default {
	fetch
}
