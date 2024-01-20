import { LitElement, css, unsafeCSS, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { litName } from '../../utils/index'
import style from './date-panel.scss?inline'
import commonStyle from './common-panel.scss?inline'

const dayName = ['日', '一', '二', '三', '四', '五', '六']
@customElement(litName('date-panel'))
export default class View extends LitElement {
  static styles = [
    css`
      ${unsafeCSS(commonStyle)}
      ${unsafeCSS(style)}
    `,
  ]
  @property({ type: String }) type = 'date'
  @property({ type: [Number, String, Date] })
  get value(){
    return this._showDate
  }
  set value(val) {
    this._showDate = new Date(val || new Date())
    this._actDate = val
  }
  @property({ type: String }) format = ''
  _actDate = ''
  get _actWeekDate(){
    const actIns = new Date(this._actDate)
    const getDay = actIns.getDay()
    const date =  actIns.getDate()
    return [this.parseTime(new Date(actIns.setDate(date-getDay))), this.parseTime(new Date(actIns.setDate(date+6-getDay)))]
  }
  _showDate = new Date()
  get _showMonth() {
    return this._showDate.getMonth() + 1
  }
  get _showYear() {
    return this._showDate.getFullYear()
  }
  // 当前月份的第一天
  get _showDateFirstDate() {
    const curDate = new Date(this._showDate.setDate(1))
    return curDate
  }
  // 当前月份的第一天所在星期
  get _showDateFirstDay() {
    return this._showDateFirstDate.getDay()
  }
  // 从哪一天开始显示
  get _startRenderDate() {
    const d = this._showDateFirstDate.getDate()
    const curDate = new Date(this._showDateFirstDate.setDate(d-(this._showDateFirstDay)))
    return curDate
  }
  get _weekOfMonth(){
    const date = new Date(this._actDate)
    const dayOfWeek = date.getDay();
    const dayOfMonth = date.getDate();
    return Math.ceil((dayOfMonth + 6 - dayOfWeek) / 7)
  }
  constructor() {
    super()
  }
  render() {
    return html`
      <div class="fin-date-panel fin-${this.type}"">
        ${this.renderDatePanel()}
      </div>
    `
  }
  renderDatePanel() {
    return html `
      ${this.renderDateHead()}
      ${this.renderDayList()}
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
      <div class="month-btn">
        <fin-icon
          @click="${() => this.changeMonth('pre')}"
          name="left"
          color="#606266"
          size="12px"
        />
      </div>
      <div class="fin-head-content">
        <span>${this._showYear} 年</span>
        <span>${this._showMonth} 月</span>
      </div>
      <div class="month-btn">
        <fin-icon
          @click="${() => this.changeMonth('next')}"
          name="right"
          color="#606266"
          size="12px"
        />
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
  renderDayList() {
    return html `
      <div class="fin-day-list-wrap">
        <div class="fin-date-row">${Array.from({ length: 7 }, (_, i) =>  html `<div class="fin-day-item">${dayName[i]}<div>`)}</div>
      </div>`
  }
  renderDateList() {
    function isActivity(curDate){
      if(this.type === 'week') {
        return this._actWeekDate.includes(this.parseTime(curDate))
      }  else {
        return this.parseTime(curDate) === this.parseTime(this._actDate)
      }
    }
    function oneDate(d) {
      const startDate = this._startRenderDate.getDate()
      const curDate = new Date(this._startRenderDate.setDate(startDate+d))
      const date = curDate.getDate()
      const month = curDate.getMonth() + 1
      const today = new Date().getDate()
      const tomonth = new Date().getMonth() + 1
      return html `<div
        class="fin-date-item ${isActivity.call(this, curDate) ? 'is-active': '' } ${this._showMonth === month ? 'is-cur-month': '' } ${today === date && tomonth === month ? 'is-today': '' }"
      >
        <span class="date-text">${date}</span>
        <div>`
    }
    return html `
      <div class="fin-date-list-wrap">
        ${Array.from({ length: 6 }, (_, row) => {
          return html `<div class="fin-date-row ${row === this._weekOfMonth-1 ? 'is-activity': ''}">${Array.from({ length: 7 }, (_, i) => oneDate.call(this, i + row*7))}</div>`
        })}
      </div>`
  }
  // 选择年
  changeYear(tag) {
    const toYear = tag === 'pre' ? this._showYear-1: this._showYear+1
    this._showDate = new Date(this._showDate.setFullYear(toYear))
    this.requestUpdate()
  }
  changeMonth(tag) {
    const toMonth = tag === 'pre' ? this._showMonth-1-1: this._showMonth-1+1
    this._showDate = new Date(this._showDate.setMonth(toMonth))
    this.requestUpdate()
  }
  parseTime(time, cFormat) {
    if (!time) return '';
    if (arguments.length === 0) {
      return null;
    }
    const format = cFormat || '{y}-{m}-{d}';
    let date;
    if (typeof time === 'object') {
      date = time;
    } else {
      if (typeof time === 'string' && /^[0-9]+$/.test(time)) {
        time = parseInt(time);
      }
      if (typeof time === 'number' && time.toString().length === 10) {
        time = time * 1000;
      }
      date = new Date(time);
    }
    const formatObj = {
      y: date.getFullYear(),
      m: date.getMonth() + 1,
      d: date.getDate(),
      h: date.getHours(),
      i: date.getMinutes(),
      s: date.getSeconds(),
      a: date.getDay(),
    };
    const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
      const value = formatObj[key];
      // Note: getDay() returns 0 on Sunday
      if (key === 'a') {
        return ['日', '一', '二', '三', '四', '五', '六'][value];
      }
      return value.toString().padStart(2, '0');
    });
    return time_str;
  }
  getDaysInMonth(date) {
    date = new Date(date)
    // 获取给定日期的年份和月份
    const year = date.getFullYear();
    const month = date.getMonth();

    // 创建下个月的第一天
    const nextMonthFirstDay = new Date(year, month + 1, 1);

    // 将下个月的第一天减去一天，得到当前月份的最后一天
    const currentMonthLastDay = new Date(nextMonthFirstDay.getTime() - (24 * 60 * 60 * 1000));

    // 返回当前月份的天数
    return currentMonthLastDay.getDate();
  }
}
