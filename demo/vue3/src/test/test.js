/*
import importHTML from './importHtmlEntry/index';

importHTML('http://localhost:5000/')
	.then(res => {
		console.log(res);

/!*		res.execScripts().then(exports => {
			const mobx = exports;
			const { observable } = mobx;
			observable({
				name: 'kuitos'
			})
		})*!/
	});*/

setTimeout(() => {
	var head = document.getElementsByTagName('head')[0],
		cssURL = 'https://cdn.bootcdn.net/ajax/libs/twitter-bootstrap/5.0.0-beta2/css/bootstrap-grid.css',
		linkTag = document.createElement('link');

	linkTag.id = 'dynamic-style';
	linkTag.href = cssURL;
	linkTag.setAttribute('rel','stylesheet');
	linkTag.setAttribute('media','all');
	linkTag.setAttribute('type','text/css');

	head.appendChild(linkTag);
}, 1000)