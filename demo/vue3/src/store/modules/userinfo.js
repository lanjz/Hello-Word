import { fetch } from '../../utils/request.js'
const state = function (){
	return {
		userinfo: {
			nickname: '未登录'
		},
	}
}
const getters = {
	hasLogin: state => {
		return !!state.userinfo.userId
	},
}
const mutations = {
	USER_INFO_UPDATE(state, {data = {}, cover}) {
		const info = cover ? data : {...state.userinfo, ...data}
		state.userinfo = info
	},
};
const actions = {
	async USER_LOGIN({ state, commit }, options = {}){
		let { _force = false, ...params } = options
		const { userinfo } = state
		if(!_force && userinfo.mobile){
			return { data: userinfo}
		}
		const response = await fetch(params)
		if(!response.err){
			const { data } = response.data
			commit('USER_INFO_UPDATE', {data: {...data}, cover: true })
		}
		return response
	},
	async getUserinfo({ state, commit }, options = {}){
		let { _force = false, ...params } = options
		const { userinfo } = state
		if(!_force && userinfo.mobile){
			return { data: userinfo}
		}
		const response = await fetch('/abc', params)
		if(!response.err){
			const { data } = response.data
			commit('USER_INFO_UPDATE', {data: {...data}, cover: true })
		}
		return response
	},
}
export default {
  namespaced: true,
  state,
	getters,
  mutations,
  actions
}