import { LitElement, css, unsafeCSS, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { litName } from '../../utils/index';
import commonStyle from './common-panel.scss?inline';
import style from './year-month-panel.scss?inline';
import { FinInject } from '../../mixins';

@customElement(litName('year-panel'))
export default class YearPanel extends FinInject(LitElement) {
  static styles = [
    css`
      ${unsafeCSS(commonStyle)}
      ${unsafeCSS(style)}
    `,
  ];

  @property({ type: [Number, String, Date] }) value: number | string | Date = '';

  @property({ type: String }) format = '';

  private _actDate: string | Date = '';
  private _showDate = new Date();
  private get _showYear() {
    return this._showDate.getFullYear();
  }

  // 从哪一年开始显示
  private get _startRenderYear() {
    const str = String(this._showYear);
    return parseInt(str.substring(0, str.length - 1)) * 10;
  }

  constructor() {
    super();
  }

  render() {
    return html`
      <div class="fin-date-panel">
        ${this.renderDatePanel()}
      </div>
    `;
  }

  private renderDatePanel() {
    return html`
      ${this.renderDateHead()}
      ${this.renderDateList()}
    `;
  }

  private renderDateHead() {
    return html`
      <div class="fin-date-header-wrap">
        <div class="year-btn">
          <fin-icon
            @click="${() => this.changeYear('pre')}"
            name="doubleLeft"
            color="#606266"
            size="12px"
          ></fin-icon>
        </div>
        <div class="fin-head-content">
          <span>${this._startRenderYear} 年</span>
          -
          <span>${this._startRenderYear + 9} 年</span>
        </div>
        <div class="year-btn">
          <fin-icon
            @click="${() => this.changeYear('next')}"
            name="doubleRight"
            color="#606266"
            size="12px"
          ></fin-icon>
        </div>
      </div>
    `;
  }

  private renderDateList() {
    const oneDate = (d: number) => {
      const year = this._startRenderYear + d;
      const toyear = new Date().getFullYear();
      const actYear = this._actDate instanceof Date ? this._actDate.getFullYear() : toyear;

      return html`
        <div
          class="fin-year-item ${year === actYear ? 'is-active' : ''} ${
        year === toyear ? 'is-toyear' : ''
      }"
        >
          <span class="date-text">${year}</span>
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
  private changeYear(tag: string) {
    const toYear = tag === 'pre' ? this._showYear - 10 : this._showYear + 10;
    this._showDate = new Date(this._showDate.setFullYear(toYear));
    this.requestUpdate();
  }
}
