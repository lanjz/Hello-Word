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
    label:"车队长账号：",
    type: 'input',
    model: 'date33',
    placeholder: '请输入车队长账号',
  },
]

export const addFormConfig = [
  {
    label:"车队名称：",
    type: 'input',
    model: 'date4',
    placeholder: '请输入车队名称',
    rules: [{ required: true, message: '请输入车队名称', trigger: 'blur' }],
  },
  {
    label:"所在城市：",
    type: 'select',
    model: 'date2',
    placeholder: '请输入所在城市',
    rules: [{ required: true, message: '请输入所在城市', trigger: 'blur' }],
    options: [
      {label: '宁德2', value: '宁德2'},
      {label: '厦门', value: '厦门'},
    ],
    slot: (item) => (
      {
        default: () => {
          return [<div>{item.value}A</div>]
        }
      }
    )
  },
  {
    label:"车队长姓名：",
    type: 'input',
    model: 'date3',
    placeholder: '请输入车队长姓名',
    rules: [{ required: true, message: '请输入车队长姓名', trigger: 'blur' }],
  },
  {
    label:"队长手机号：",
    type: 'input',
    model: 'date3',
    placeholder: '车队长手机号',
    rules: [{ required: true, message: '请输入车队长手机号', trigger: 'blur' }],
  },
  {
    label:"车队长账号：",
    type: 'input',
    model: 'date5',
    placeholder: '请输入车队长账号',
    rules: [{ required: true, message: '请输入车队长账号', trigger: 'blur' }],
  },
  {
    label:"车队密码：",
    type: 'input',
    model: 'date7',
    'show-password': true,
    placeholder: '请输入车队密码',
    rules: [{ required: true, message: '请输入车队密码', trigger: 'blur' }],
  },
]