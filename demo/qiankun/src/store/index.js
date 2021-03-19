import { createStore } from 'vuex'
import modules from './modules'
// import { actions } from '@/src/micro/index'

const store = createStore({
	modules,
	// plugins: [myPlugin],
	strict: process.env.NODE_ENV !== 'production'
})
export default store