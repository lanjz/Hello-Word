/* @flow */

import { toString } from '../utils/index.js'
import { createTextVNode } from '../vdom/vnode.js'
import { renderList } from './render-list.js'

export function installRenderHelpers (target) {
  target._s = toString
  target._l = renderList
  target._v = createTextVNode
}
