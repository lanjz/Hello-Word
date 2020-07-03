const defaultStyle = {
  position: 'absolute',
  top: 0,
  background: 'rgb(25, 122, 251)',
  height: '2px',
  width: 0,
  'z-index': 100,
  left: 0,
  transition: '.2s',
  display: 'none',
  opacity: 0
}

function initLineStyle(lineDom) {
  Object.keys(defaultStyle).forEach(item => {
    lineDom.style[item] = defaultStyle[item]
  })
  lineDom.className = 'v-loading-progress-line'
  return lineDom
}

function doAnimate(el) {
  const curW = parseInt(el.style.width || 0)
  const topW = Math.ceil((100 - curW) / 2 + curW)
  const percent = Math.min(topW, 70)
  if(percent >= 70){
    clearInterval(el.lineTimeInterval)
  }
  el.style.width = percent + '%'
}
function showLoading(el, parentEl) {
  el.style.display = 'block'
  el.style.opacity = 1
  if(el.position === 'bottom'){
    el.style.bottom = 0
    el.style.top = 'unset'
  }
  if(!parentEl.style.position || parentEl.style.position === 'static'){
    parentEl.style.position = 'relative'
  }
  parentEl.appendChild(el)
  clearTimeout(el.lineTimeOut)
  clearInterval(el.lineTimeInterval)
  el.lineTimeInterval = setInterval(() => {
    doAnimate(el)
  }, 500)
}
function hideLoading(el) {
  if(!el.style.display || el.style.display === 'none') return
  clearTimeout(el.lineTimeOut)
  clearInterval(el.lineTimeInterval)
  el.style.width = '100%'
  setTimeout(() => {
    el.style.opacity = 0
    setTimeout(() => {
      el.style.display = 'none'
    }, 500)
  }, 500)
}
function getLineDome(el) {
  const line = el.getElementsByClassName('v-loading-progress-line')[0] || document.createElement('div')
  return line
}
export default function (el, binding) {
  const position = el.getAttribute('position') || ''
  if(el.getAttribute('loading-line-attach')){
    el = el.querySelector(el.getAttribute('loading-line-attach'))
  }
  const lineDom = getLineDome(el)
  lineDom.position = position
  if(binding.value) {
    initLineStyle(lineDom, el)
    showLoading(lineDom, el)
  } else {
    hideLoading(lineDom, el)
  }
  el.style.backgroundColor = binding.value
}