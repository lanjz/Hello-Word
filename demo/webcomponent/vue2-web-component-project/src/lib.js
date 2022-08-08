import Vue from 'vue';
import wrap from '@vue/web-component-wrapper';
import VueWebComponent from './components/virtual-scroll-select';

const CustomElement = wrap(Vue, VueWebComponent);

window.customElements.define('my-custom-element', CustomElement);