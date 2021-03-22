const btn = document.createElement('button')
btn.innerText = '按钮'
btn.addEventListener('click', function (){
	import('./modules/utils')
		.then(({ MB }) => {
			console.log('MB', MB)
		})
		.catch((error) => 'An error occurred while loading theS hllComponent');
})
document.body.appendChild(btn)