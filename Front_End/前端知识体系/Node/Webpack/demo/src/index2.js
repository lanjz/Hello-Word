import { sayHello } from "./main";
import _ from 'lodash'
console.log("process.env.NODE_ENV", process.env.NODE_ENV2)
function component() {
    var element = document.createElement('div');
    element.innerHTML = 'Hello2';
    sayHello()
    document.body.appendChild(newImt)
    return element;
}

document.body.appendChild(component());