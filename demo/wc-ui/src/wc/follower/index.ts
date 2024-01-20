import { LitElement, css, unsafeCSS, html } from 'lit'
import {customElement, property} from 'lit/decorators.js'
import style from './style.scss?inline'
import { litName } from '../../utils/index'

@customElement(litName('follower'))
export default class Layer extends LitElement {
  static styles = [
    css`
      ${unsafeCSS(style)}
    `,
  ]
  @property({ type: Boolean }) previous = false
  @property({ type: Boolean }) next = false
  private _parentElement: HTMLElement | null = null
  private updatePositionBind: any
  constructor() {
    super()
    this.updatePositionBind = this.updatePosition.bind(this)
  }
  firstUpdated() {
    super.firstUpdated()
    if(this.previous) {
      this._parentElement = this.previousSibling as HTMLElement
    } else if(this.next) {
      this._parentElement = this.nextSibling as HTMLElement
    } else {
      this._parentElement = this.parentNode as HTMLElement
    }
    this.updatePosition()
    this.addResizeObserver()
  }
  connectedCallback() {
    super.connectedCallback()
    window.addEventListener('scroll', this.updatePositionBind)
    window.addEventListener('resize', this.updatePositionBind)
  }
  disconnectedCallback() {
    super.disconnectedCallback()
    window.removeEventListener('scroll', this.updatePositionBind)
    window.removeEventListener('resize', this.updatePositionBind)

    this._observer.unobserve(this._parentElement)
    this._observer = null
  }
  attributeChangedCallback(
    name: string,
    oldValue: null | string,
    newValue: null | string,
  ) {
    super.attributeChangedCallback(name, oldValue, newValue)
  }

  render() {
    return html` <slot /> `
  }

  addResizeObserver() {
    // 创建 ResizeObserver 对象
    this._observer = new ResizeObserver(entries => {
      for (let entry of entries) {
        // 获取被观测元素的新尺寸信息
        const { target } = entry;
        this.updatePosition()
      }
    });
    // 开始观测指定元素的大小变化
    this._observer.observe(this._parentElement);
  }
  updatePosition() {
    const { top, left, height, y } = this._parentElement.getBoundingClientRect()
    this.style.top = height + y + 'px'
    this.style.left = left + 'px'
  }
}
