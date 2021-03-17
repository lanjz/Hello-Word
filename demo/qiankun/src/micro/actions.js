import {
	initGlobalState
} from "qiankun";
import store from '../store'
console.log('store', store)
// 通信
const state = {
	gStore: store
}
const actions = initGlobalState(state);
actions.onGlobalStateChange((state, prev) => {
	// state: 变更后的状态; prev 变更前的状态
	console.log('主应用onGlobalStateChange', state, prev);
});
// actions.setGlobalState(state);
actions.offGlobalStateChange();
