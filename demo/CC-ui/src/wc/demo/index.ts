import { LitElement, css, unsafeCSS, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import style from './demo.scss?inline'

@customElement('simple-greeting')
export default class SimpleGreeting extends LitElement {
  static styles = [
    css`
      ${unsafeCSS(style)}
    `,
    css`
      span {
        color: red;
      }
    `,
  ]
  @property({ type: String }) name = ''
  @property({ type: String }) showName = ''
  private des = ''
  constructor() {
    super()
    this.des = '这一个WC组件'
  }
  shouldUpdate(changedProperties: Map<PropertyKey, unknown>) {
    if (changedProperties.has('name')) {
      console.log('this.', this.name)
      this.showName = this.name
    }
    return true
  }

  // Render the UI as a function of component state
  render() {
    console.log('render')
    return html`
      <p>
        ${this.des}：
        <input type="text" value="${this.showName}" @input="${this.onInput}" />
        !
      </p>
    `
  }
  onInput(e: Event) {
    const inputValue = (e.target as HTMLInputElement).value
    console.log('e', inputValue)
    const event = new CustomEvent('my-input', { detail: inputValue })
    this.dispatchEvent(event)
  }
}
