import { LitElement, css, unsafeCSS, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import style from './style.scss?inline'
import { convertToInlineStyles, litName } from '../../utils/index'

@customElement(litName('flex'))
export default class Flex extends LitElement {
  static styles = [
    css`
      ${unsafeCSS(style)}
    `,
  ]
  @property({ type: String, reflect: true }) 'justify-content' = ''
  @property({ type: String, reflect: true }) 'align-items' = ''
  @property({ type: String, reflect: true }) 'flex-direction' = ''
  @property({ type: String, reflect: true }) 'flex-wrap' = ''
  @property({ type: String, reflect: true }) 'flex-grow' = ''
  @property({ type: String, reflect: true }) width = ''
  @property({ type: String, reflect: true }) height = ''
  constructor() {
    super()
  }
  render() {
    const style = {
      display: 'flex',
      'align-items': this['align-items'],
      'justify-content': this['justify-content'],
      'flex-direction': this['flex-direction'],
      'flex-wrap': this['flex-wrap'],
      'flex-grow': this['flex-grow'],
      width: this.width,
      height: this.height,
    }
    return html`
      <style>
        :host {${convertToInlineStyles(style)}}
      </style>
      <slot />
    `
  }
}
