import CButton from './c-button/index.vue';
import CIcon from './c-svg-icon/index.vue';
import CTabs from './c-tags/index.vue';
import OperateItem from './operate-item/index.vue';
import OperateGroup from './operate-group/index.vue';
import CFormItemUpload from './c-upload/form-item-upload.vue';
import CInput from './c-input/index.vue';
// 工程化导入svg图片
/*const req = require.context('../../assets/svgs', true, /\.svg$/);
const requireAll = (requireContext) => {
	return requireContext.keys().map(requireContext);
};
requireAll(req);*/
export default {
	install(Vue) {
		Vue.component('CIcon', CIcon);
		Vue.component('CButton', CButton);
		Vue.component('CTabs', CTabs);
		Vue.component('OperateItem', OperateItem);
		Vue.component('OperateGroup', OperateGroup);
		Vue.component('CFormItemUpload', CFormItemUpload);
		Vue.component('CNumber', CInput);
	},
};
