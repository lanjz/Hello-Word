export function formConfig() {
  return [
    {
      label:"上传",
      type: 'input',
      model: 'name',
      placeholder: '销售城市',
      'suffix-icon':"el-icon-date",
      rules: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
      slot: () => (
        {
          prepend: [<div>A</div>]
        }
      )
    },
    {
      label:"姓名",
      type: 'input',
      model: 'age',
      placeholder: '请输入姓名',
      rules: [{ required: true, message: '请输入姓名', trigger: 'blur' }]
    },
    {
      label:"姓名",
      type: 'input',
      model: 'age3',
      placeholder: '请输入姓名',
      rules: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
    },
  ]
}
