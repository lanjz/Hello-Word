// 先渲染一个根元素
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
function getAttrsConfig(conf = []) {
  const res = {}
  if (!conf) return res
  conf.forEach(item => {
    res[item.prop] = item.default
  })
  return res
}
export function renderView(createElement, curMeat, vm) {
  if (typeof curMeat === 'string') return curMeat
  const isWrap = isContainerWrap.includes(curMeat.tagName)
  if (!curMeat.propsConfig) { // 用于保存组件的属性，默认无这个属性，根据配置项进行默认赋值
    curMeat.propsConfig = getAttrsConfig(curMeat.__config__)
  }
  curMeat.props = Object.assign((curMeat.props || {}))
  if (isWrap) {
    // 如果是 draggable 渲染，借用 component-data 传递组件属性
    curMeat.props['component-data'] = {
      props: curMeat.propsConfig
    }
    curMeat.props.list = curMeat.childrenView
  } else {
    curMeat.props = Object.assign(curMeat.props, curMeat.propsConfig)
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
    (curMeat.childrenView && curMeat.childrenView.length) ? [...renderChildren(createElement, curMeat, vm), renderTipView(createElement, curMeat)] : [renderTipView(createElement, curMeat)]
  )
}

export const isContainerWrap = ['div', 'el-row', 'el-form']
export const wrapComps = [
  {
    tagName: 'div',
    desc: '块级容器',
    // 组件的自定义配置
    __config__: [],
    defaultStyle: {
      'min-height': '60px',
      background: '#fff',
      padding: '10px'
    },
    childrenView: [] // 如果承载子元素，需要预设此属性
  },
  {
    tagName: 'el-row',
    desc: '行容器布局',
    // 组件的自定义配置
    __config__: [
      {
        label: '栅格间隔',
        prop: 'gutter',
        render: 'el-slider',
        type: 'number',
        max: 24,
        default: 0,
      },
      {
        label: '布局模式',
        prop: 'type',
        default: '',
        render: 'el-select',
        child: [
          { label: 'default', value: '', render: 'el-option' },
          { label: 'flex', value: 'flex', render: 'el-option' }
        ]
      },
      {
        label: '水平排列方式',
        prop: 'justify',
        render: 'el-select',
        default: 'start',
        child: [
          { label: 'start', value: 'start', render: 'el-option' },
          { label: 'end', value: 'end', render: 'el-option' },
          { label: 'space-around', value: 'space-around', render: 'el-option' },
          { label: 'space-between', value: 'space-between', render: 'el-option' }
        ]
      },
      {
        label: '垂直排列方式',
        prop: 'align',
        render: 'el-select',
        default: 'top',
        child: [
          { label: 'top', value: 'top', render: 'el-option' },
          { label: 'middle', value: 'middle', render: 'el-option' },
          { label: 'bottom', value: 'bottom', render: 'el-option' }
        ]
      }
    ],
    childrenView: [], // 如果承载子元素，需要预设此属性
    defaultStyle: {
      'min-height': '60px',
      background: '#fff',
      padding: '10px'
    },
  },
  {
    tagName: 'el-col',
    desc: '列容器布局',
    // 组件的自定义配置
    __config__: [
      {
        label: '栅格列数',
        prop: 'span',
        type: 'number',
        render: 'el-slider',
        default: 12,
        max: 24,
        min: 1,
      },
      {
        label: '左侧间隔格数',
        prop: 'offset',
        type: 'number',
        default: 0,
        max: 24,
        render: 'el-slider',
      },
      {
        label: '向右移动格数',
        prop: 'push',
        type: 'number',
        default: 0,
        max: 24,
        render: 'el-slider',
      },
      {
        label: '向左移动格数',
        prop: 'pull',
        type: 'number',
        default: 0,
        max: 24,
        render: 'el-slider'
      }
    ],
    defaultStyle: {
      'min-height': '50px',
      background: '#fff',
      padding: '10px'
    }
  },
  {
    tagName: 'el-form',
    desc: '表单容器',
    // 组件的自定义配置
    __config__: [
      {
        label: '行内表单模式',
        props: 'inline',
        type: 'boolean',
        default: false
      },
      {
        label: '标签的宽度',
        props: 'label-width',
        type: 'string',
        default: ''
      },
      {
        label: '表单域标签的后缀',
        props: 'label-suffix',
        type: 'string',
        default: ''
      }
    ]
  },

  {
    tagName: 'c-button',
    desc: '按钮',
    __config__: [
      {
        label: '文字',
        prop: 'text',
        render: 'el-input',
        default: '按钮'
      },
      {
        label: '尺寸',
        prop: 'size',
        render: 'el-select',
        default: '',
        child: [
          { label: 'medium', value: 'medium', render: 'el-option' },
          { label: 'small', value: 'small', render: 'el-option' },
          { label: 'mini', value: 'mini', render: 'el-option' }
        ]
      },
      {
        label: '类型',
        prop: 'type',
        render: 'el-select',
        default: 'primary',
        child: [
          { label: 'primary', value: 'primary', render: 'el-option' },
          { label: 'success', value: 'success', render: 'el-option' },
          { label: 'warning', value: 'warning', render: 'el-option' },
          { label: 'danger', value: 'danger', render: 'el-option' },
          { label: 'info', value: 'info', render: 'el-option' },
          { label: 'text', value: 'text', render: 'el-option' },
        ]
      },
      {
        label: '朴素按钮',
        prop: 'plain',
        render: 'el-switch',
        default: false,
      },
      {
        label: '圆角按钮',
        prop: 'round',
        render: 'el-switch',
        default: false,
      },
      {
        label: '圆形按钮',
        prop: 'circle',
        render: 'el-switch',
        default: false,
      },
      {
        label: '图标类名',
        prop: 'icon',
        render: 'el-input',
        default: ''
      },
    ]
  },
]

export const inputComps = [

  {
    tagName: 'el-input',
    desc: '文本框',
    __config__: [
      {
        label: '栅格间隔',
        props: 'getter',
        type: 'number',
        default: 0
      },
      {
        label: '水平排列方式',
        props: 'justify',
        type: 'string',
        default: 'start',
        options: [
          { label: 'start', value: 'start' },
          { label: 'end', value: 'end' },
          { label: 'space-around', value: 'space-around' },
          { label: 'space-between', value: 'space-between' }
        ]
      },
      {
        label: '垂直排列方式',
        props: 'align',
        type: 'string',
        default: 'top',
        options: [
          { label: 'top', value: 'top' },
          { label: 'middle', value: 'middle' },
          { label: 'bottom', value: 'bottom' }
        ]
      }
    ]
  },
]
