import { LitElement, css, html, unsafeCSS } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { litName } from '../../utils/index'
import style from './style.scss?inline'

@customElement(litName('button'))
export default class Text extends LitElement {
  static styles = [
    css`
      ${unsafeCSS(style)}
    `,
  ]
  @property({ type: Boolean }) disabled = false
  constructor() {
    super()
  }
  render() {
    return html`
      <div class="fin-button" ${this.disabled ? 'is-disabled' : ''}>
        <slot />
      </div>
    `
  }
}
