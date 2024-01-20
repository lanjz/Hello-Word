import {LitElement, css, unsafeCSS, html, PropertyValues} from 'lit'
import { FinInject } from '../../mixins/index.ts'
import {
  customElement,
  property,
  queryAssignedElements,
} from 'lit/decorators.js'
import style from './style.scss?inline'
import { findTargetDelegation, litName } from '../../utils/index'

export interface OptionItem {
  label: string
  value: string | number
  [key: string]: any // 其它任意属性
}
@customElement(litName('date-picker'))
export default class View extends FinInject(LitElement) {
  static styles = [
    css`
      ${unsafeCSS(style)}
    `,
  ]
  @property({ type: Array }) options: OptionItem[] = [] // 下拉选项
  @property({ type: Boolean }) disabled = false // 是否禁用
  @property({ type: Boolean }) clearable = false // 是否可以清空选项
  @property({ type: Boolean }) filterable = false // 是否可筛选
  @property({ type: String }) placeholder = '' // 占位符
  @property({ type: Function }) 'remote-method' = null // 异步获取远程方法
  @property({ type: Function }) 'filter-method' = null // 自定义筛选方法
  @property({ type: [Array, String, Number, undefined] }) //
  get value() {
    if(!this.multiple) return this._selected[0].value
    return this._selected.map(item => item.value)
  }
  set value(val) {
    this.initValue(val)
  }
  @property({ type: [Array, String, Number, undefined] }) modelValue = ''
  @property({ type: Boolean }) 'collapse-tags' = true
  @property({ type: Boolean }) multiple = true
  private _selected: OptionItem[] = []
  private _open: Boolean = false
  @queryAssignedElements({ selector: 'fin-option', flatten: true })
  _slotNodes!: Array<Node>
  constructor() {
    super()
    this.toggleOpenOption = this.toggleOpenOption.bind(this)
  }
  initValue(value) {
    if(!value) return;
    const getValue = Array.isArray(value) ? value: [value]
    const initSelected = []
    getValue.forEach(item => {
      const fin = this.options.find(it => it.value === item)
      if(fin) {
        initSelected.push({...fin})
      } else {
        initSelected.push({value: item})
      }
    })
    this._selected = initSelected
    this.broadcast()
    this.requestUpdate()
  }
  connectedCallback() {
    super.connectedCallback();
    this.addEvent()
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEvent()
  }
  render() {
    const hasData = this._selected.length
    return html`
      <div
        class="fin-select ${this.disabled ? 'is-disabled' : ''} ${this._open ? 'is-open': ''} ${hasData ? 'is-selected': ''}"
        @click="${this.handleOpen}"
      >
        ${this.renderSelected()}
        <div class="fin-select-input">
          ${this.renderPlaceholder()}
          ${this.filterable ? html `<input @input="${this.changeInput}"  .disabled=${this.disabled} />`: ''}
        </div>
        ${this.renderClearableEl()}
        ${this.renderIconEl()}
        ${this.renderPopup()}
      </div>
    `
  }
  renderPopup() {
    if(!this._open) return null;
    return html`
          <fin-follower>
            <div class="fin-option-wrap">
              <slot @click="${this.handleOptionClick}">
                ${this.options.map((item) =>(
        html`<fin-option .value=${item.value} .label=${item.label}>${item.label}</fin-option>`
      ),
    )}
              </slot>
            </div>
          </fin-follower>
        `
  }
  renderSelected() {
    if(!this._selected || !this._selected.length) return null;
    if(this['collapse-tags']) {
      const firstData = this._selected[0];
      return html`
          <div class="fin-selected">
            <div class="fin-selected-item">
              <span>${firstData.label || firstData.value}</span>
              ${
        this.disabled ? null: html`
                  <fin-icon
                    @click="${() => this.removeSelected(firstData)}"
                    name="close"
                    size="12px"
                    class="fin-close-icon"
                  />
                `
      }
            </div>
            ${
        this._selected.length > 1
          ? html `<div class="fin-selected-item"><span>+${this._selected.length - 1}</span></div>`
          : null
      }
          </div>
        `
    }
    return html`
          <div class="fin-selected">
            ${this._selected.map((item) => {
      return html`<div class="fin-selected-item">
                <span>${item.label || item.value}</span>
                <fin-icon @click="${() => this.removeSelected(item)}" name="close" size="12px"></fin-icon>
              </div>`})}
          </div>
        `
  }
  renderPlaceholder() {
    if(!this.placeholder || this._selected.length) return null
    return html `
    <div class='fin-select-placeholder'><span>${this.placeholder}</span></div>
    `
  }
  renderIconEl() {
    return html`
        <fin-icon
          class="direct-icon"
          name="down"
          size="12px"
        />
    `
  }
  renderClearableEl() {
    return !this.disabled && this.clearable && this._selected.length
      ? html`
          <div
            class="fin-clear"
            @click="${this.handleClearable}"
          >
            <fin-icon
              @click="${() => this.removeSelected(firstData)}"
              name="close"
              size="12px"
            />
          </div>
        `
      : ''
  }
  removeEvent() {
    document.addEventListener('click', this.toggleOpenOption)
  }
  addEvent(){
    document.addEventListener('click', this.toggleOpenOption)
  }
  toggleOpenOption(e) {
    if(this.contains(e.target)){
      return
    } else {
      this.optionVisibleChange(false)
    }
  }

  handleOpen(){
    this.optionVisibleChange(true)
  }
  async optionVisibleChange(visible) {
    if(this.disabled) return
    this._open = visible
    this.emitEventMX('visible-change', this._open )
    this.requestUpdate()
    await this.updateComplete;
    this.broadcast()
  }
  handleClearable(e) {
    e.stopPropagation()
    this._selected = []
    this.broadcast()
    this.requestUpdate()
  }
  changeInput(e: Event) {
    if(this.filterable) {
      const { value } = e.target
      if( this['remote-method']) {
        this['remote-method'](value)
      } else if(typeof this['filter-method'] === 'function'){
        this['filter-method'](value)
      } else {
        this._slotNodes.forEach((item) => {
          item.handleFilter(value)
        })
      }
    }

  }
// 利用事件委托的形式，监听 option 点击事件
  handleOptionClick(e: Event) {
    const targetOption = findTargetDelegation(e, 'fin-option')
    if (targetOption) {
      const value = targetOption.value
      const label = targetOption.label
      if (value) {
        const findIndex = this._selected.findIndex(
          (item) => item.value === value,
        )
        if (findIndex > -1) {
          this._selected.splice(findIndex, 1)
        } else {
          this._selected.push({ value, label })
        }
        // 更新  _selected 后通过 option
        this.broadcast()
        this.requestUpdate()
      }
    }
  }
  removeSelected({value}) {
    const findIndex = this._selected.findIndex(
      (item) => item.value === value,
    )
    if (findIndex > -1) {
      this._selected.splice(findIndex, 1)
      this.broadcast()
      this.requestUpdate()
    }
  }
// 更新 option 选中数据
  broadcast() {
    const value = this.multiple ? this._selected.map(item => item.value) : this._selected[0].value
    this._slotNodes.forEach((item) => {
      item.updateSelected(this._selected)
    })
  }
}
