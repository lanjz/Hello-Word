import { sayHello } from "./main";
// import '@babel/polyfill'
import './imgs/app.css'
import bg from './assets/助力首页新版-活动未开始.png'
function component() {
	const img = new Image()
	img.src= bg
	document.body.appendChild(img);
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
