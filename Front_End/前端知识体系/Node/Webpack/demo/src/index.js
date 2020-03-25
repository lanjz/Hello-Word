import { sayHello } from "./main";
// import '@babel/polyfill'
function component() {
    var element = document.createElement('div');
    element.innerHTML = 'Hello';
    const abc = () => {
        console.log('箭头函数')
    }
    new Promise(() => {})
	console.log('Array.includes',[1, 2, 3].includes(1))
    return element;
}

document.body.appendChild(component());
