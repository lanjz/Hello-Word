import { sayHello } from "./main";
import './assets/app.css'
import img from './assets/助力首页新版-活动未开始.png'
import _ from 'lodash'
console.log("process.env.NODE_ENV", process.env.NODE_ENV2)
function component() {
    var element = document.createElement('div');
    element.innerHTML = 'Hello2';
    sayHello()
    const newImt = new Image()
    newImt.src=img
    document.body.appendChild(newImt)
    return element;
}

document.body.appendChild(component());