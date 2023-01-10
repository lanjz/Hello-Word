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
        default: 0
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
    }
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
        min: 1
      },
      {
        label: '左侧间隔格数',
        prop: 'offset',
        type: 'number',
        default: 0,
        max: 24,
        render: 'el-slider'
      },
      {
        label: '向右移动格数',
        prop: 'push',
        type: 'number',
        default: 0,
        max: 24,
        render: 'el-slider'
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
    tagName: 'c-form',
    desc: '表单容器',
    childrenView: [], // 如果承载子元素，需要预设此属性
    // 组件的自定义配置
    __config__: [
      {
        label: '内联模式',
        prop: 'inline',
        default: false,
        render: 'el-switch'
      },
      {
        label: '标签宽度',
        prop: 'label-width',
        type: 'string',
        default: '80px',
        render: 'el-input'
      },
      {
        label: '标签后缀',
        prop: 'label-suffix',
        type: 'string',
        default: '',
        render: 'el-input'
      },
      {
        label: '自定义按钮',
        prop: 'needSlot',
        default: false,
        slotName: ['action'],
        render: 'el-switch'
      },
    ],
    defaultStyle: {
      'min-height': '50px',
      background: '#fff',
      padding: '10px'
    }
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
          { label: 'text', value: 'text', render: 'el-option' }
        ]
      },
      {
        label: '朴素按钮',
        prop: 'plain',
        render: 'el-switch',
        default: false
      },
      {
        label: '圆角按钮',
        prop: 'round',
        render: 'el-switch',
        default: false
      },
      {
        label: '圆形按钮',
        prop: 'circle',
        render: 'el-switch',
        default: false
      },
      {
        label: '图标类名',
        prop: 'icon',
        render: 'el-input',
        default: ''
      }
    ]
  }
]
export const inputComps = [
  {
    tagName: 'el-input',
    desc: '文本框',
    __config__: [
      {
        label: '类型',
        prop: 'type',
        default: 'text',
        render: 'el-select',
        child: [
          { label: '单行文本', value: 'text', render: 'el-option' },
          { label: '多行文本 ', value: 'textarea', render: 'el-option' }
        ]
      },
      {
        label: '描述',
        prop: 'label',
        default: '文本框',
        render: 'el-input'
      },
      {
        label: '绑定属性',
        prop: 'model',
        default: 'start',
        render: 'el-input'
      },
      {
        label: '最大输入长度',
        prop: 'maxlength',
        render: 'el-input'
      },
      {
        label: '最小输入长度',
        prop: 'minlength',
        render: 'el-input'
      },
      {
        label: '字数统计',
        prop: 'show-word-limit',
        render: 'el-switch',
        default: false,
        tooltip: '只在 type = "text" 或 type = "textarea" 时有效'
      },
      {
        label: '提示文本',
        prop: 'placeholder',
        render: 'el-input',
        default: ''
      },
      {
        label: '是否可清空',
        prop: 'clearable',
        render: 'el-switch',
        default: true
      },
      {
        label: '显示切换密码图标',
        prop: 'show-password',
        render: 'el-switch',
        default: false
      },
      {
        label: '尺寸',
        prop: 'size',
        default: 'medium',
        render: 'el-select',
        child: [
          { label: 'medium', value: 'medium', render: 'el-option' },
          { label: 'small ', value: 'small', render: 'el-option' },
          { label: 'mini ', value: 'mini', render: 'el-option' }
        ]
      },
      {
        label: '头部图标',
        prop: 'prefix-icon',
        render: 'el-input',
        default: ''
      },
      {
        label: '尾部图标',
        prop: 'suffix-icon',
        render: 'el-input',
        default: ''
      },
      {
        label: '输入框行数',
        prop: 'rows',
        render: 'el-input',
        default: '',
        tooltip: '只对 type="textarea" 有效'
      },
      {
        label: '自适应高度',
        prop: 'autosize',
        render: 'el-switch',
        default: false,
        tooltip: '只对 type="textarea" 有效'
      },
    ],
    slot: {
      prefix: { label: '输入框头部内容', show: false },
      suffix: { label: '输入框尾部内容', show: false },
      prepend: { label: '输入框前置内容', show: false },
      append: { label: '输入框后置内容', show: false },
    }
  }
]
