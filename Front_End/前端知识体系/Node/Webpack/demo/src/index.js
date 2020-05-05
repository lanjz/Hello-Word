import 'lib-flexible'
import Vue from 'vue'
import App from './App.vue'
import './assets/app.css'

const root = document.createElement('div')
root.id = 'app'
document.body.appendChild(root)

new Vue({
    render:(h)=> h(App)
}).$mount(root)
