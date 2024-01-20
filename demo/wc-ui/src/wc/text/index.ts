import { LitElement, css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { convertToInlineStyles, litName } from '../../utils/index'

@customElement(litName('text'))
export default class Text extends LitElement {
  static styles = [
    css`
      :host {
      }
    `,
  ]
  @property({ type: [Object, String], reflect: true }) sty = {}
  @property({ type: String }) color = ''
  @property({ type: String }) 'font-size' = ''
  @property({ type: String }) 'font-weight' = 'normal '
  @property({ type: Number }) clamp = ''
  constructor() {
    super()
  }
  render() {
    let style: Record<string, string> = {
      'font-size': this['font-size'],
      'font-weight': this['font-weight'],
      color: this.color,
    }
    if (this.clamp) {
      style = {
        ...style,
        'word-break': 'break-all',
        'text-overflow': 'ellipsis',
        display: '-webkit-box',
        '-webkit-box-orient': 'vertical',
        '-webkit-line-clamp': this.clamp,
        overflow: 'hidden',
      }
    }
    return html`
      <style>
        :host {${convertToInlineStyles(this.sty)}}
        :host {${convertToInlineStyles(style)}}
      </style>
      <slot />
    `
  }
}
