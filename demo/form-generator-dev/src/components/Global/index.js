import Button from './Button'
import cForm from '../cForm/indexJS'

export default {
  install(Vue) {
    Vue.component('c-button', Button)
    Vue.component('c-form', cForm)
  }
}
