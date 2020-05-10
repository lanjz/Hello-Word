import Vue from 'vue'

function registerComponent(com) {
  console.log('com', com)
  Vue.component('page1', com)
}
export default function () {
  console.log('加载了register')
}
