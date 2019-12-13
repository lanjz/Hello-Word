/* @flow */


export * from './attrs.js'
export * from './class.js'
export * from './element.js'
export * from './style.js'

/**
 * Query an element selector if it's not an element already.
 */
export function query (el) {
  if (typeof el === 'string') {
    const selected = document.querySelector(el)
    if (!selected) {
      return document.createElement('div')
    }
    return selected
  } else {
    return el
  }
}
