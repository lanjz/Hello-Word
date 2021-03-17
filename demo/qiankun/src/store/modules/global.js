import { fetch } from '../../utils/request.js'
const state = function (){
	return {
		global: [1],
	}
}
const mutations = {
	GLOBAL_UPDATE(state, data) {
		state.global.push(data)
		state.global = [ ...state.global ]
	},
};
const actions = {
	async fetchGlobal({ state, commit }, options = {}){
		commit('GLOBAL_UPDATE', 'fetch')
		return state.global
	},
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}