function component() {
  var element = document.createElement('div');
  let a = 'A'
  element.innerHTML = `Hello${a}`;
  const abc = () => {
    console.log('箭头函数')
  }
  new Promise(() => {})
  var b = [1, 2, 3].includes(1);
  return element;
}

document.body.appendChild(component());
