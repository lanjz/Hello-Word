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
  return [
    createElement(
      'el-form-item',
      {
        props: {
          label: curMeat.propsConfig.label || '',
          prop: curMeat.propsConfig.prop
        },
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

function renderChildren(createElement, curMeat, vm){
  if (curMeat.isDraggable) {
    return renderDraggableView(createElement, curMeat, vm)
  }
  return curMeat.childrenView.map(item => renderView(createElement, item, vm))
}
function renderSlot(createElement, curMeat){

}
function getAttrsConfig(conf = []) {
  const res = {}
  if (!conf) return res
  conf.forEach(item => {
    res[item.prop] = item.default
  })
  return res
}
export function renderView(createElement, curMeat, vm, formEd) {
  if (typeof curMeat === 'string') return curMeat
  const isWrap = isContainerWrap.includes(curMeat.tagName)
  if (!curMeat.propsConfig) { // 用于保存组件的属性，默认无这个属性，根据配置项进行默认赋值
    curMeat.propsConfig = getAttrsConfig(curMeat.__config__)
  }
  curMeat.props = Object.assign((curMeat.props || {}))
  if (isWrap) {
    // 如果是 draggable 渲染，借用 component-data 传递组件属性
    curMeat.props['component-data'] = {
      props: curMeat.propsConfig,
      attrs: curMeat.propsConfig
    }
    curMeat.props.list = curMeat.childrenView
  } else {
    curMeat.props = Object.assign(curMeat.props, curMeat.propsConfig)
  }
  const isFormItem = isFormEl.includes(curMeat.tagName)
  if (!formEd && isFormItem) {
    return renderElFormItemView(createElement, curMeat, vm)
  }
  // slots
  if (!curMeat.childrenView){
    curMeat.childrenView = []
  }
  if (curMeat.propsConfig && curMeat.propsConfig.needSlot) {
    const findSlotSet = curMeat.__config__.find(item => item.prop === 'needSlot')
    if (findSlotSet) {
      findSlotSet.slotName.forEach(item => {
        const isExit = curMeat.childrenView.find(it => it.desc === item && it.isSlot)
        if (!isExit) {
          curMeat.childrenView.push({
            tagName: 'div',
            desc: item,
            childrenView: [], // 如果承载子元素，需要预设此属性
            isSlot: true,
            defaultStyle: {
              'min-height': '50px',
              background: '#fff',
              padding: '10px'
            }
          })
        }
      })
    }
  }
  return createElement(
    // 如果是可承载内容的 标签，则使用 draggable 代替
    isWrap ? 'draggable' : curMeat.tagName,
    {
      props: curMeat.props,
      style: {
        ...(curMeat.defaultStyle||{})
      },
      // tag、group 只在 draggable 标签下有效
      attrs: {
        tag: isWrap ? curMeat.tagName: undefined, // 只在 draggable 元素下使用，要不然会出现重复 样式类
        group: 'g1',
        ...curMeat.propsConfig
      },
      class: {
        'draggable-wrap': isWrap,
        'el-wrap': true,
        'is-activity': vm.activityEl === curMeat
      },
      nativeOn: {
        click: (e) => vm.handleFormPreviewEl(curMeat, e)
      }
    },
    (curMeat.childrenView && curMeat.childrenView.length)
      ? [...renderChildren(createElement, curMeat, vm), renderTipView(createElement, curMeat)]
      : [renderTipView(createElement, curMeat)]
  )
}
