import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './directive'

// import sensors from './utils/sa'
Vue.config.productionTip = false
/*sensors.init({
  server_url: 'http://test-syg.datasink.sensorsdata.cn/sa?token=xxxxx&project=xxxxxx',
  is_track_single_page:true, // 单页面配置，默认开启，若页面中有锚点设计，需要将该配置删除，否则触发锚点会多触发 $pageview 事件
  use_client_time:true,
  send_type:'ajax',
  heatmap: {
    //是否开启点击图，default 表示开启，自动采集 $WebClick 事件，可以设置 'not_collect' 表示关闭。
    clickmap:'default',
    //是否开启触达图，not_collect 表示关闭，不会自动采集 $WebStay 事件，可以设置 'default' 表示开启。
    scroll_notice_map:'default'
  }
});
sensors.quick('autoTrack');*/
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

/*
window.addEventListener('click', function (e){
  console.log('window',e)
  e.stopPropagation()
  e.preventDefault()
}, true)*/
