import list from "ant-design-vue/lib/transfer/list";

const state = function (){
	return {
		global: [1],
		microMenu: {}
	}
}
const mutations = {
	GLOBAL_UPDATE(state, data) {
		state.global.push(data)
		state.global = [ ...state.global ]
	},
	MICRO_MENU_UPDATE(state, { key, list }){
		state.microMenu[key] = list
		state.microMenu = JSON.parse(JSON.stringify(state.microMenu))
	}
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