import { LitElement, html, css, CSSResult } from 'lit-element'
import { customElement, property } from 'lit/decorators.js'
import { styleMap } from 'lit/directives/style-map.js'
import { litName } from '../../utils'

interface SvgFiles {
  [key: string]: string
}

const loadSvgFiles = async () => {
  const svgFiles: SvgFiles = {}

  const files = await import.meta.glob('./svgs/*.svg')

  for (const path in files) {
    if (files.hasOwnProperty(path)) {
      const module:any = await files[path]()
      const fileName = path.match(/\.\/svgs\/(.+)\.svg$/)?.[1]
      if (fileName) {
        svgFiles[fileName] = module.default
      }
    }
  }
  return svgFiles
}

@customElement(litName('icon'))
export default class Icon extends LitElement {
  static styles: CSSResult[] = [
    css`
      .fin-icon {
        width: 1em;
        height: 1em;
        vertical-align: -0.15em;
        fill: currentColor;
        overflow: hidden;
      }
    `
  ]

  @property({ type: String, reflect: true }) name = ''
  @property({ type: String, reflect: true }) color = ''
  @property({ type: String, reflect: true }) size = ''
  @property({ type: String, reflect: true }) iconClass = ''

  private _icons: SvgFiles = {}

  async connectedCallback() {
    super.connectedCallback()
    await this.loadSvg()
    this.requestUpdate()
  }

  async loadSvg() {
    try {
      this._icons = await loadSvgFiles()
    } catch (error) {
      console.error('Error loading SVG files:', error)
    }
  }

  render() {
    const styles = {
      color: this.color,
      width: this.size
    }
    const svgContent = this._icons[this.name] || ''
    return html`
      <img
        src="${svgContent}"
        alt=""
        class="fin-icon ${this.iconClass}"
        style=${styleMap(styles)}
      />
    `
  }
}
