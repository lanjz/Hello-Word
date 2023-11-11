import Vue from 'vue';
import { recordResourceError } from '@/utils/help';
import ElementUI from 'element-ui';
import App from './App.vue';
import router from './router';
import store from './store';
import comGlobal from '@/components/global';
import libGlobal from '@/components/lib';
import appGlobal from '@/utils/app-global';
import '@/styles/global.scss';
recordResourceError();

Vue.config.productionTip = false;
Vue.use(comGlobal);
Vue.use(libGlobal);
Vue.use(appGlobal);
Vue.use(ElementUI);
new Vue({
	router,
	store,
	render: (h) => h(App),
}).$mount('#app');
