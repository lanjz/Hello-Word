import { LitElement, css, html, unsafeCSS } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'
import { litName } from '../../utils/index'
import style from './style.scss?inline'

@customElement(litName('input'))
export default class Input extends LitElement {
  static styles = [
    css`
      ${unsafeCSS(style)}
    `,
  ]
  @query('.fin-input-inner')
  private inputElement!: HTMLInputElement
  @property({ type: Boolean }) disabled = false
  @property({ type: Boolean }) 'show-password' = false
  @property({ type: Boolean }) 'show-word-limit' = false
  @property({ type: Boolean }) clearable = false
  @property({ type: Boolean }) readonly = false
  @property({ type: String, reflect: true }) type = 'text'
  @property({ type: String, reflect: true }) placeholder = ''
  @property({ type: Function }) formatter?: (value: string) => string
  @property({ type: Number, reflect: true }) rows = 3
  @property({ type: Number, reflect: true }) maxlength = ''
  @property({ type: Number, reflect: true }) minlength = ''
  @property({ type: String, reflect: true }) autocomplete = ''
  @property({ type: String, reflect: true }) name = ''
  @property({ type: Number, reflect: true }) max = ''
  @property({ type: Number, reflect: true }) min = ''
  @property({ type: Number, reflect: true }) step = ''
  @property({ type: String, reflect: true }) form = ''
  @property({ type: String, reflect: true }) tabindex = ''
  @property({ type: Boolean, reflect: true }) autofocus = false
  @property({ type: String }) 'input-style' = ''
  private _showValue = ''
  set value(value: string) {
    const old = this._showValue
    this._showValue = value
    this.requestUpdate('value', old)
  }
  get value(): string {
    return this._showValue
  }
  constructor() {
    super()
    this._showValue = ''
  }
  render() {
    return html`
      <div
        class="
          ${this.type === 'textarea' ? 'fin-textarea' : 'fin-input'}
          ${this.disabled ? 'is-disabled' : ''}
        "
      >
        <div
          class="${this.type === 'textarea'
            ? 'fin-textarea-wrap'
            : 'fin-input-wrap'}"
        >
          ${this.renderBeforeEl()} ${this.renderFinInput()}
          ${this.renderLimit()} ${this.renderClearableEl()}
          ${this.renderChangePasswordEl()} ${this.renderAppendEl()}
        </div>
      </div>
    `
  }
  renderAppendEl() {
    return html`<slot name="append" class="fin-inlay"></slot>`
  }
  renderBeforeEl() {
    return html`<slot name="before" class="fin-inlay"></slot>`
  }
  renderFinInput() {
    return this.type === 'textarea'
      ? html`<textarea
          class="fin-textarea-inner"
          rows="${this.rows}"
          .disabled=${this.disabled}
          .readonly=${this.readonly}
          .value="${this._showValue}"
          .autofocus="${this.autofocus}"
          maxlength="${this.maxlength}"
          minlength="${this.minlength}"
          placeholder="${this.placeholder}"
          autocomplete="${this.autocomplete}"
          name="${this.name}"
          min="${this.min}"
          max="${this.max}"
          step="${this.step}"
          form="${this.form}"
          style="${this['input-style']}"
          @input="${this.onInput}"
          @blur="${this.onBlur}"
          @focus="${this.onFocus}"
          @change="${this.onChange}"
        />`
      : html`<input
          class="fin-input-inner"
          .disabled=${this.disabled}
          .readonly=${this.readonly}
          .autofocus=${this.autofocus}
          .value="${this._showValue}"
          type="${this.type}"
          maxlength="${this.maxlength}"
          minlength="${this.minlength}"
          placeholder="${this.placeholder}"
          autocomplete="${this.autocomplete}"
          name="${this.name}"
          min="${this.min}"
          max="${this.max}"
          step="${this.step}"
          form="${this.form}"
          @input="${this.onInput}"
          @blur="${this.onBlur}"
          @focus="${this.onFocus}"
          @change="${this.onChange}"
          style="${this['input-style']}"
        />`
  }
  renderLimit() {
    if (['input', 'textarea'].includes(this.type)) {
      return this['show-word-limit']
        ? html`
            <div class="fin-inlay fin-limit-wrap">
              ${this.value.length}${this.maxlength
                ? html`/${this.maxlength}`
                : null}
            </div>
          `
        : ''
    }
    return null
  }
  isTextarea() {
    return this.type === 'textarea'
  }
  renderClearableEl() {
    if (this.isTextarea()) return null
    return !this.disabled && this.clearable && this._showValue.length
      ? html`
          <div
            class="fin-inlay fin-clear"
            @click="${this.handleClearable}"
          ></div>
        `
      : ''
  }
  renderChangePasswordEl() {
    return this['show-password'] && ['text', 'password'].includes(this.type)
      ? html` <div class="fin-inlay" @click="${this.toggleType}">显示</div> `
      : ''
  }
  toggleType() {
    if (this.type === 'text') {
      this.type = 'password'
    } else {
      this.type = 'text'
    }
  }
  handleClearable(e: Event) {
    e.stopPropagation()
    this.emitEvent('input', '')
    this.emitEvent('clear', null)
  }
  onInput(e: Event) {
    e.preventDefault()
    e.stopPropagation()
    const value = (e.target as HTMLInputElement).value
    this.emitEvent('input', this.formatter ? this.formatter(value) : value)
  }
  onBlur(e: Event) {
    e.preventDefault()
    e.stopPropagation()
    this.emitEvent('blur', null)
  }
  onFocus(e: Event) {
    e.preventDefault()
    e.stopPropagation()
    this.emitEvent('focus', null)
  }
  onChange(e: Event) {
    e.preventDefault()
    e.stopPropagation()
    const value = (e.target as HTMLInputElement).value
    this.emitEvent('change', value)
  }
  emitEvent(eventName: string, value: string | null) {
    const event = new CustomEvent(eventName, { detail: value })
    this.dispatchEvent(event)
  }
}
