import CEmpty from './c-empty/index.vue';
import CForm from './c-form/index.vue';
import CTable from './c-table/index.vue';
import CDrawer from './c-drawer/index.vue';
import CDialog from './c-dialog/index.vue';
import { CViewEmit } from './utils';

export default {
	install(Vue) {
		Vue.component('CEmpty', CEmpty);
		Vue.component('FDrawer', CDrawer);
		Vue.component('CDialog', CDialog);
		Vue.component('FTable', CTable);
		Vue.component('FForm', CForm);
		Vue.config.globalProperties.$CViewEmit = CViewEmit;
	},
};
