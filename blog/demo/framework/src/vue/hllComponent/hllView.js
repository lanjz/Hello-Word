import emitter from './mixins/emitter'
export default {
  install(Vue){
    Vue.mixin({
      ...emitter.default
    })

  }
}