import importHTML from './code/index';

importHTML('http://localhost:5000/')
	.then(res => {
		console.log(res);

/*		res.execScripts().then(exports => {
			const mobx = exports;
			const { observable } = mobx;
			observable({
				name: 'kuitos'
			})
		})*/
	});