import vue from 'vue'
import previewComponent from './PreviewFile.vue'

let instance;
const PreviewConstructor = vue.extend(previewComponent)
const initInstance = () => {
  instance = new PreviewConstructor({
    el: document.createElement('div')
  })
}

function showPreviewBox(options) {
  if(!instance){
    initInstance()
  }
  if(instance){
    document.body.appendChild(instance.$el);
  }
  instance.open(options)
}
const defaultOptions = {
  initialIndex: 0,
  list: 0
}

function previewFile(options){
  if( Object.prototype.toString.call(options) !== '[object Object]') {
    options = {}
  }
  showPreviewBox({ ...defaultOptions, ...options })
}
previewFile.alias = previewComponent.name
export default previewFile
