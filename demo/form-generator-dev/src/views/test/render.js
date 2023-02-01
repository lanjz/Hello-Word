// 先渲染一个根元素
import { isContainerWrap } from './component-meta'

export default function renderRoot(createElement, curMeat) {
  return createElement(
    'div',
    {
      props: {
        className: 'group-wrap'
      }
    },
    curMeat.map(item => renderView(createElement, item))
  )
}

const isFormEl = ['el-input']
// 渲染被 el-form-item 包裹的元素
export function renderElFormItemView(createElement, curMeat, vm) {
  if (!curMeat.elFormItemProp) { // 用于保存组件的属性，默认无这个属性，根据配置项进行默认赋值
    curMeat.elFormItemProp = getAttrsConfig(curMeat.__config__['el-form-item'])
  }
  return [
    createElement(
      'el-form-item',
      {
        props: curMeat.elFormItemProp || { label: '', prop: '' }
      },
      [renderView(createElement, curMeat, vm, true)]
    )
  ]
}
// 渲染被使用的提示元素
export function renderTipView(createElement, curMeat) {
  return createElement(
    'div',
    {
      class: {
        'preview-component-desc': true
      }
    },
    [curMeat.desc]
  )
}
// 渲染被 draggable 包裹的元素
export function renderDraggableView(createElement, curMeat, vm) {
  return [
    createElement(
      'draggable',
      {
        props: {
          list: curMeat.childrenView
        },
        attrs: {
          group: 'g1'
        }
      },
      curMeat.childrenView.map(item => renderView(createElement, item, vm))
    )
  ]
}

function renderChildren(createElement, curMeat, vm) {
  if (curMeat.isDraggable) {
    // todo 好像没用到
    return renderDraggableView(createElement, curMeat, vm)
  }
  return curMeat.childrenView.map(item => renderView(createElement, item, vm))
}

function getAttrsConfig(conf = []) {
  const res = {}
  if (!conf) return res
  conf.forEach(item => {
    res[item.prop] = item.default
  })
  return res
}
export function renderView(createElement, curMeat, vm, strictRenderCurNode) {
  debugger
  if (typeof curMeat === 'string') return curMeat
  const isFormItem = isFormEl.includes(curMeat.tagName)
  if (!strictRenderCurNode && isFormItem) {
    return renderElFormItemView(createElement, curMeat, vm)
  }
  if (!curMeat.props) { // 用于保存组件的属性，默认无这个属性，根据配置项进行默认赋值
    curMeat.props = getAttrsConfig(curMeat.__config__.default)
  }
  if (!curMeat.childrenView) {
    curMeat.childrenView = []
  }
  // 如果有打开 slots 作为子节点插入
  if (curMeat.slot) {
    Object.keys(curMeat.slot).forEach(item => {
      if (curMeat.props[`__slot__${item}`]) {
        curMeat.childrenView.push({
          tagName: 'span',
          slotName: item,
          defaultStyle: {
            'min-height': '50px',
            background: '#fff',
            padding: '10px'
          }
        })
      }
    })
  }
  const isWrap = isContainerWrap.includes(curMeat.tagName)
  const propConfig = isWrap
    ? {
      'component-data': {
        props: curMeat.props,
        attrs: curMeat.props
      },
      list: curMeat.childrenView
    }
    : curMeat.props

  return createElement(
    // 如果是可承载内容的 标签，则使用 draggable 代替
    isWrap ? 'draggable' : curMeat.tagName,
    {
      props: propConfig,
      style: {
        ...(curMeat.defaultStyle || {})
      },
      // tag、group 只在 draggable 标签下有效
      attrs: {
        tag: isWrap ? curMeat.tagName : undefined, // 只在 draggable 元素下使用，要不然会出现重复 样式类
        group: 'g1',
        ...curMeat.propsConfig
      },
      class: {
        'draggable-wrap': isWrap,
        'el-wrap': true,
        'is-activity': vm.activityEl === curMeat
      },
      nativeOn: {
        click: e => vm.handleFormPreviewEl(curMeat, e)
      },
      slot: curMeat.slotName
    },
    (curMeat.childrenView && curMeat.childrenView.length)
      ? [...renderChildren(createElement, curMeat, vm), renderTipView(createElement, curMeat)]
      : [renderTipView(createElement, curMeat)]
  )
}
