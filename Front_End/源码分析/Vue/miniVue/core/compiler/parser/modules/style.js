import { parseStyleText } from '../../../patch/helpers/style.js'
import { getBindingAttr, getAndRemoveAttr } from '../../parser/helper/index.js'
function transformNode (el, options) {
  const warn = options.warn || function () {}
  const staticStyle = getAndRemoveAttr(el, 'style')
  if (staticStyle) {
    el.staticStyle = JSON.stringify(parseStyleText(staticStyle))
  }

  const styleBinding = getBindingAttr(el, 'style', false /* getStatic */)
  if (styleBinding) {
    el.styleBinding = styleBinding
  }
}

function genData (el) {
  let data = ''
  if (el.staticStyle) {
    data += `staticStyle:${el.staticStyle},`
  }
  if (el.styleBinding) {
    data += `style:(${el.styleBinding}),`
  }
  return data
}

export default {
  staticKeys: ['staticStyle'],
  transformNode,
  genData
}
