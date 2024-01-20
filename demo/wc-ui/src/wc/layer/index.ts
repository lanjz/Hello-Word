import { LitElement, css, unsafeCSS, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import style from './style.scss?inline'
import { convertToInlineStyles, litName } from '../../utils/index'

@customElement(litName('layer'))
export default class Layer extends LitElement {
  static styles = [
    css`
      ${unsafeCSS(style)}
    `,
  ]
  @property({ type: String, reflect: true }) display = ''
  @property({ type: String, reflect: true }) position = ''
  @property({ type: String, reflect: true }) left = ''
  @property({ type: String, reflect: true }) top = ''
  @property({ type: String, reflect: true }) right = ''
  @property({ type: String, reflect: true }) bottom = ''
  @property({ type: String, reflect: true }) width = ''
  @property({ type: String, reflect: true }) height = ''
  @property({ type: String, reflect: true }) 'z-index' = ''
  @property({ type: String, reflect: true }) 'append-to' = ''
  private _preAppendTo: HTMLElement | null = null
  constructor() {
    super()
  }
  firstUpdated() {
    this._preAppendTo = this.parentNode as HTMLElement;
    this.changeAppendTo()
  }
  connectedCallback() {
    super.connectedCallback()
  }
  attributeChangedCallback(
    name: string,
    oldValue: null | string,
    newValue: null | string,
  ) {
    super.attributeChangedCallback(name, oldValue, newValue)
    if (name === 'append-to') {
      this.changeAppendTo()
    }
  }
  render() {
    const style = {
      display: this.display || 'block',
      width: this.width,
      height: this.height,
      position: this.position,
      left: this.left,
      top: this.top,
      right: this.right,
      bottom: this.bottom,
      'z-index': this['z-index'],
    }
    return html`
      <style>
        :host {${convertToInlineStyles(style)}}
      </style>
      <slot />
    `
  }
  changeAppendTo() {
    // 避免在 firstUpdated 之前执行
    if (!this._preAppendTo) return
    // 将组件元素插入到body标签下
    const appendTo = this['append-to']
    let appendToEl = null
    if (appendTo === 'body') {
      appendToEl = document.body
    } else if (appendTo) {
      appendToEl = document.querySelectorAll(appendTo)[0]
    } else if (this._preAppendTo) {
      appendToEl = this._preAppendTo
    }
    if (appendToEl && this.parentElement !== appendToEl) {
      appendToEl.appendChild(this)
    }
  }
}
