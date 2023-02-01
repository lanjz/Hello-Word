export function searchConfig(){
  return [
    {
      prop: 'name',
      label: '姓名',
      render: 'el-input',
      itemFormAttr: {
        rules: [ { required: true, message: '请输入活动名称', trigger: 'blur' },
        ]
      }
    },
    {
      prop: 'dd',
      label: '姓名',
      render: 'el-time-picker',
      placeholder: '选择时间'
    },
    {
      prop: 'region',
      label: '活动区域',
      render: 'el-select',
      itemFormAttr: {
        rules: [ { required: true, message: '请选择活动区域', trigger: 'change' },]
      },
      child: [
        {label: '区域一', value: 'shanghai', render: 'el-option'},
        {label: '区域二', value: 'beijing', render: 'el-option'},
      ]
    },
    {
      prop: 'type',
      label: '活动性质',
      render: 'el-checkbox-group',
      itemFormAttr: {
        rules: [ { required: true, message: '请选择活动性质', trigger: 'change' },]
      },
      child: [
        {label: '美食/餐厅线上活动', value: '1', name: 'type', render: 'el-checkbox'},
        {label: '地推活动', value: '2', name: 'type',render: 'el-checkbox'},
        {label: '线下主题活动', value: '3', name: 'type',render: 'el-checkbox'},
        {label: '单纯品牌曝光', value: '4', name: 'type',render: 'el-checkbox'},
      ]
    },
    {
      prop: 'delivery',
      label: '即时配送',
      render: 'el-switch',
    },
    {
      prop: 'desc',
      label: '活动形式"',
      render: 'el-input',
      type: 'textarea',
      colSpan: 6
    },
    {
      label: '选择日期',
      renderList: [
        {
          prop: 'date1',
          label: '选择日期',
          render: 'el-date-picker',
          colSpan: 11,
          style: 'width: 100%;'
        },
        {
          render: (h) => (<span>-</span>),
          colSpan: 2,
        },
        {
          prop: 'date2',
          label: '选择时间"',
          render: 'el-time-picker',
          colSpan: 11,
          style: 'width: 100%;'
        }
      ]
    },
    {
      prop: 'rrr',
      label: 'RRR2',
      render: (h, form, root) => (
        <el-input
          type="text"
          v-model={form.rrr}
        />
      )
    },
    {
      prop: 'age',
      label: 'RRR"',
      render: (h, form, root) => (
        <el-input-number
          v-model={form.age}
          max={20}
        />
      )
    }
  ]
}