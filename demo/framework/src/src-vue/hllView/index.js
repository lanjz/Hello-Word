import emitter from './mixins/emitter'
import IndexList from './components/indexList/IndexList'
import IndexListContent from './components/indexList/IndexListContent'
import IndexAnchor from './components/indexList/IndexAnchor'
import Dialog from './hllComponents/dialog/Dialog'
const components = [
  IndexList,
  IndexListContent,
  IndexAnchor,
  Dialog
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