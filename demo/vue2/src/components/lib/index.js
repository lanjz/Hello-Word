import CEmpty from './c-empty/index';
import CForm from './c-form/index';
import CTable from './c-table/index';
import CDrawer from './c-drawer/index';
import { CViewEmit } from './utils';

export default {
	install(Vue) {
		Vue.component('CEmpty', CEmpty);
		Vue.component('CDrawer', CDrawer);
		Vue.component('CTable', CTable);
		Vue.component('CForm', CForm);
		Vue.prototype.$CViewEmit = CViewEmit;
	},
};
