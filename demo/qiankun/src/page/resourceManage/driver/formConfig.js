export const searchConfig = [
  {
    label:"车队ID：",
    type: 'input',
    model: 'date10',
    placeholder: '请输入车队ID',
  },
  {
    label:"车队名称：",
    type: 'input',
    model: 'date2',
    placeholder: '请输入车队名称',
  },
  {
    label:"司机手机：",
    type: 'input',
    model: 'date33',
    placeholder: '请输入司机手机',
  },
  {
    label:"车牌号：",
    type: 'input',
    model: 'date333',
    placeholder: '请输入车牌号',
  },
  {
    label:"认证状态：",
    type: 'select',
    model: 'select',
    placeholder: '请选择状态',
    clearable: true,
    options: [
      { label: '已邀请', value: '已邀请'},
      { label: '已认证', value: '已认证'},
    ]
  },
]

export const addFormConfig = [
  {
    label:"司机ID：",
    type: 'input',
    model: 'date3',
    placeholder: '请输入车队长姓名',
    rules: [{ required: true, message: '请输入车队长姓名', trigger: 'blur' }],
  },
  {
    label:"手机号：",
    type: 'input',
    model: 'date3',
    placeholder: '车队长手机号',
    rules: [{ required: true, message: '请输入车队长手机号', trigger: 'blur' }],
  },
]