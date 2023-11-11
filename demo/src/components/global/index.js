import CButton from './c-button/index';
import CIcon from './c-svg-icon/index';
import CTabs from './c-tags/index';
import OperateItem from './operate-item/index';
import OperateGroup from './operate-group/index';
import CFormItemUpload from './c-upload/form-item-upload';
import CInput from './c-input/index';
// 工程化导入svg图片
const req = require.context('../../assets/svgs', true, /\.svg$/);
const requireAll = (requireContext) => {
	return requireContext.keys().map(requireContext);
};
requireAll(req);
export default {
	install(Vue) {
		Vue.component('CSvgIcon', CIcon);
		Vue.component('CButton', CButton);
		Vue.component('CTabs', CTabs);
		Vue.component('OperateItem', OperateItem);
		Vue.component('OperateGroup', OperateGroup);
		Vue.component('CFormItemUpload', CFormItemUpload);
		Vue.component('CNumber', CInput);
	},
};
