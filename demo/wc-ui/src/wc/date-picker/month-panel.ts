import { LitElement, css, unsafeCSS, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { litName } from '../../utils/index'
import commonStyle from './common-panel.scss?inline'
import style from './year-month-panel.scss?inline'
import { FinInject } from '../../mixins'

const monthName = [
  '一',
  '二',
  '三',
  '四',
  '五',
  '六',
  '七',
  '八',
  '九',
  '十',
  '十一',
  '十二',
]
@customElement(litName('month-panel'))
export default class View extends FinInject(LitElement) {
  static styles = [
    css`
      ${unsafeCSS(commonStyle)}
      ${unsafeCSS(style)}
    `,
  ]
  @property({ type: [Number, String, Date] })
  get value(){
    return this._showDate
  }
  set value(val) {
    this._showDate = new Date(val || new Date())
    this._actDate = val
  }
  @property({ type: String }) format = ''
  _actDate:string | Date = ''
  _showDate = new Date()
  get _showMonth() {
    return this._showDate.getMonth() + 1
  }
  get _showYear() {
    return this._showDate.getFullYear()
  }
  constructor() {
    super()
  }
  render() {
    return html`
      <div class="fin-date-panel">
        ${this.renderDatePanel()}
      </div>
    `
  }
  renderDatePanel() {
    return html `
      ${this.renderDateHead()}
      ${this.renderDateList()}
    `
  }
  renderDateHead() {
    return html `<div class="fin-date-header-wrap">
      <div class="year-btn">
        <fin-icon
          @click="${() => this.changeYear('pre')}"
          name="doubleLeft"
          color="#606266"
          size="12px"
        />
      </div>
      <div class="fin-head-content">
        <span>${this._showYear} 年</span>
      </div>
      <div class="year-btn">
        <fin-icon
          @click="${() => this.changeYear('next')}"
          name="doubleRight"
          color="#606266"
          size="12px"
        />
      </div>
    </div>`
  }
  private renderDateList() {
    const oneDate = (d: number) => {
      const year = this._showYear;
      const toyear = new Date().getFullYear();
      const tomonth = new Date().getMonth();
      const actYear = this._actDate instanceof Date ? this._actDate.getFullYear() : toyear;
      const actMonth = this._actDate instanceof Date ? this._actDate.getMonth() : tomonth;

      return html`
        <div
          class="fin-month-item ${year === actYear && actMonth === d ? 'is-active' : ''} ${
        year === toyear && tomonth === d ? 'is-tomonth' : ''
      }"
        >
          <span class="date-text">${monthName[d]}月</span>
        </div>
      `;
    };

    return html`
      <div class="fin-date-list-wrap">
        ${Array.from({ length: 3 }, (_, row) => {
      return html`<div class="fin-date-row">${Array.from({ length: 4 }, (_, i) =>
        oneDate(i + row * 4)
      )}</div>`;
    })}
      </div>
    `;
  }
  // 选择年
  changeYear(tag:string) {
    const toYear = tag === 'pre' ? this._showYear-1: this._showYear+1
    this._showDate = new Date(this._showDate.setFullYear(toYear))
    this.requestUpdate()
  }
}
