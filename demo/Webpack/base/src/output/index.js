const btn = document.createElement('button')
btn.innerText = '按钮'
btn.addEventListener('click', function (){
	debugger
	import('./modules/utils')
		.then(({MB}) => {
			console.log('MB', MB)
		})
		.catch((error) => 'An error occurred while loading theS hllComponent');
	/*	import("app2/Button").then(response => {
      console.log('app2/Button', response)
    })*/
})
document.body.appendChild(btn)

