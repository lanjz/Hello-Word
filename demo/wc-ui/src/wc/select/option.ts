import { LitElement, css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { litName } from '../../utils/index'
import { OptionItem } from './index.ts'
@customElement(litName('option'))
export default class View extends LitElement {
  static styles = css`
    .fin-select-option {
      font-size: 14px;
      padding: 12px 20px;
      position: relative;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      color: #606266;
      box-sizing: border-box;
      cursor: pointer;
    }
    .fin-select-option:hover {
      background-color: #f5f7fa;
    }
    .fin-select-option.selected {
      color: #409eff;
      font-weight: 700;
    }
  `
  @property({ type: Boolean }) selected = false
  @property({ type: [Number, String] }) value = ''
  @property({ type: [Number, String] }) label = ''
  private _selected: OptionItem[] = []
  private _show: Boolean = true
  constructor() {
    super()
  }
  render() {
    const isSelected = this._selected.find((item) => item.value === this.value)
    if(!this._show) return
    return html`
      <div class="fin-select-option ${isSelected ? 'selected' : ''}">
        <slot></slot>
      </div>
    `
  }
  // 接收 select 组件触发的内容，保存当前select选择的数据
  updateSelected(data: OptionItem[]) {
    this._selected = data
    this.requestUpdate()
  }
  handleFilter(key: any) {
    if(key === undefined || key === null) return this._show = true
    const value = String(this.value)
    const label = String(this.label)
    this._show = value.indexOf(key) > -1 || label.indexOf(key) > -1
    this.requestUpdate()
  }
}
