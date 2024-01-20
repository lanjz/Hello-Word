import { LitElement, html, css } from 'lit-element'
import { customElement, property } from 'lit/decorators.js'
import { styleMap } from 'lit/directives/style-map.js';
import { litName } from '../../utils'
const loadSvgFiles = async () => {
  const svgFiles = {}; // 创建空对象用于保存SVG文件

  // 获取"./svgs"目录下的所有SVG文件
  const files = await import.meta.glob('./svgs/*.svg');

  // 遍历每个文件并进行导入
  for (const path in files) {
    if (files.hasOwnProperty(path)) {
      const module = await files[path]();
      const fileName = path.match(/\.\/svgs\/(.+)\.svg$/)[1];
      svgFiles[fileName] = module.default; // 将SVG模块保存到对象中，对象的Key为文件名
    }
  }
  return svgFiles;
};
@customElement(litName('icon'))
export default class Icon extends LitElement {
  static styles = [
    css`
      .fin-icon {
        width: 1em;
        height: 1em;
        vertical-align: -0.15em;
        fill: currentColor;
        overflow: hidden;
      }
  `,
  ]
  @property({ type: String, reflect: true }) name = ''
  @property({ type: String, reflect: true }) color = ''
  @property({ type: String, reflect: true }) size = ''
  @property({ type: String, reflect: true }) iconClass = ''
  private _icons = {}
  async connectedCallback() {
    super.connectedCallback();
    // 异步执行的方法
    await this.loadSvg();
    // 数据加载成功后重新渲染组件
    this.requestUpdate();
  }
  loadSvg() {
    return new Promise(resolve => {
      loadSvgFiles()
        .then(svgFiles => {
          this._icons = svgFiles || {}
          resolve(svgFiles)
        })
        .catch(() => resolve({}));
    })
  }
  render() {
    const styles = {
      color: this.color,
      width: this.size,
    }
    const svgContent = this._icons[this.name] || '';
    return html`
      <img src="${this._icons[this.name]}" alt="" class="fin-icon ${this.iconClass}" style=${styleMap(styles)}>
    `;
  }
}
