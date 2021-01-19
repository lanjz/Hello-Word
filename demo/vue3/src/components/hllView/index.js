import emitter from './mixins/emitter'
import IndexList from './components/indexList/IndexList'
import IndexListContent from './components/indexList/IndexListContent'
import IndexAnchor from './components/indexList/IndexAnchor'
import Fold from './components/fold/Fold'
import Modal from './hllComponents/modal/Modal'
import Neat from './hllComponents/neat/Neat'
import NeatItem from './hllComponents/neat/NeatItem'
import HllTable from './hllComponents/table/HllTable'
/*import HllUpload from './hllComponents/upload/HllUpload'
import PreviewFile from './hllComponents/preivew/PreviewFile'
import PreviewImage from './hllComponents/preivew/PreviewImage'
*/
import Form from './hllComponents/form/Form'
// api 组件
// import PreviewFileApi from './hllComponents/preivew/api'
const components = [
  IndexList,
  IndexListContent,
  IndexAnchor,
  Modal,
  Neat,
  NeatItem,
/*  HllUpload,
  PreviewFile,
  PreviewImage,*/
  Form,
  Fold,
  HllTable
]
const apiCom = [
  // PreviewFileApi
]
export default {
  install(Vue){
    Vue.mixin({
      ...emitter.default
    })
    components.forEach(component => {
      Vue.component(component.name, component);
    });
    apiCom.forEach(componentApi => {
      Vue.prototype['$'+componentApi.alias] = componentApi
    });
  }
}
