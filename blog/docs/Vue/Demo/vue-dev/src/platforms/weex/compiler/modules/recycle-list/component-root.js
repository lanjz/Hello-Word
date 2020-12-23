/* @flow */

import { addAttr } from 'compiler/helpers'

// mark hllComponent root nodes as
export function postTransformComponentRoot (el: ASTElement) {
  if (!el.parent) {
    // hllComponent root
    addAttr(el, '@isComponentRoot', 'true')
    addAttr(el, '@templateId', '_uid')
    addAttr(el, '@componentProps', '$props || {}')
  }
}
