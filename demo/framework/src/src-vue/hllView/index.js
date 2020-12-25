import emitter from './mixins/emitter'
import IndexList from './components/indexList/IndexList'
import IndexListContent from './components/indexList/IndexListContent'
import IndexAnchor from './components/indexList/IndexAnchor'
import Modal from './hllComponents/dialog/Modal'
const components = [
  IndexList,
  IndexListContent,
  IndexAnchor,
  Modal
]
export default {
  install(Vue){
    Vue.mixin({
      ...emitter.default
    })
    components.forEach(component => {
      Vue.component(component.name, component);
    });
  }
}