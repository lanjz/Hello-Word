import DSearch from './d-search';
import DAction from './d-action';
import DTable from './d-table';
import DDialogForm from './d-dialog-form';

export default {
	install(Vue) {
		Vue.component('DSearch', DSearch);
		Vue.component('DAction', DAction);
		Vue.component('DTable', DTable);
		Vue.component('DDialogForm', DDialogForm);
	},
};
