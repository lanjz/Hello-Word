import './css/app.less'
const btn = document.createElement('div')
btn.innerText = '按钮2'
document.body.appendChild(btn)


const fn = () => {console.log('箭头函数')}
const { a } = { a: 'abc'}
new Promise(()=> {})
console.log([].includes)