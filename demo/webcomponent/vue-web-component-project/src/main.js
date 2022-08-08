/*
import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')
*/

import Vue from 'vue';
import wrap from '@vue/web-component-wrapper';
import VueWebComponent from './components/VueWebComponent';

const CustomElement = wrap(Vue, VueWebComponent);

window.customElements.define('my-custom-element', CustomElement);