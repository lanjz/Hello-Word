import {LitElement, css, unsafeCSS, html} from 'lit'
import { customElement, property, } from 'lit/decorators.js'
import { FinInject } from '../../mixins/index.ts'
import style from './style.scss?inline'
import { litName } from '../../utils/index'

@customElement(litName('date-picker'))
export default class DatePicker extends FinInject(LitElement) {
  static styles = [
    css`
      ${unsafeCSS(style)}
    `,
  ]
  @property({ type: Boolean }) disabled = false // 是否禁用
  @property({ type: Boolean }) clearable = false // 是否可以清空选项
  @property({ type: Boolean }) filterable = false // 是否可筛选
  @property({ type: String }) placeholder = '' // 占位符
  constructor() {
    super()
  }
  render() {
    return html`<div></div>`
  }
}
