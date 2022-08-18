import Vue from 'vue'
import App from './App.vue'
import router from './router'

Vue.config.productionTip = false

window.addEventListener('message', function (e) {
  changeStateToIframe(e)
})
function changeStateToIframe(e){
  try {
    let fromData = JSON.parse(e.data)
    const { fullPath, arg = [] } = fromData
    arg[2] = fullPath
    window.history.replaceState(...arg)
  } catch (error) {
    console.log(error)
  }
}
function changeState(e){
  try {
    let fromData = JSON.parse(e.data)
    const { type, fullPath, arg = [] } = fromData
    if(type === 'pushState'){
      arg[2] = fullPath
      window.history.pushState(...arg)
    } else  if(type === 'replaceState'){
      arg[2] = fullPath
      window.history.replaceState(...arg)
    }else if(type === 'go'){
      window.history.go(...arg)
    }  else if(type === 'back'){
      window.history.back(...arg)
    }
  } catch (error) {
    console.log(error)
  }
}

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
