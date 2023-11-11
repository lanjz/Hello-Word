import CEmpty from './c-empty/index';
import CForm from './c-form/index';
import CTable from './c-table/index';
import CDrawer from './c-drawer/index';
import CDialog from './c-dialog/index';
import { CViewEmit } from './utils';

export default {
	install(Vue) {
		Vue.component('FEmpty', CEmpty);
		Vue.component('FDrawer', CDrawer);
		Vue.component('CDialog', CDialog);
		Vue.component('FTable', CTable);
		Vue.component('FForm', CForm);
		Vue.prototype.$CViewEmit = CViewEmit;
	},
};
