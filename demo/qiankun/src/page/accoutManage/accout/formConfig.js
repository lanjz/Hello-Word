export const searchConfig = [
  {
    label:"车队ID：",
    type: 'input',
    model: 'date10',
    placeholder: '请输入账户英文名',
  },
]

export const addFormConfig = [
  {
    label:"账号：",
    type: 'input',
    model: 'date3',
    placeholder: '请输入车队长姓名',
    rules: [{ required: true, message: '请输入车队长姓名', trigger: 'blur' }],
  },
  {
    label:"所属车队：",
    type: 'input',
    model: 'date3',
    placeholder: '车队长手机号',
    rules: [{ required: true, message: '请输入车队长手机号', trigger: 'blur' }],
  },
]