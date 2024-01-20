import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { convertToInlineStyles, litName } from '../../utils/index'

@customElement(litName('view'))
export default class View extends LitElement {
  static styles = css`
    :host {
      display: block;
    }
  `
  @property({ type: [Object, String], reflect: true }) sty = {}
  constructor() {
    super()
  }
  render() {
    return html`
      <style>
        :host {${convertToInlineStyles(this.sty)}}
      </style>
      <slot />
    `
  }
}
