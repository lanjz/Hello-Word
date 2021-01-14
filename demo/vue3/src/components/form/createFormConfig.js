export function formConfig() {
  return [
    {
      label:"上传",
      type: 'upload',
      model: 'upload',
      placeholder: '销售城市',
      rules: [{ required: true, message: '请上传', trigger: 'blur, change' }]
    },
    {
      label:"销售城市",
      type: 'select',
      model: 'statusList',
      placeholder: '销售城市',
      options: [{label: '福州', value: 'fuzhou'}],
      rules: [{ required: true, message: '选择公司', trigger: 'blur, change' }]
    },
    {
      label:"车辆品牌",
      type: 'select',
      model: 'statusList2',
      placeholder: '销售城市',
      options: [{label: '福州', value: 'fuzhou'}],
      rules: [{ required: true, message: '选择公司', trigger: 'blur, change' }]
    },
    {
      label:"是否挂靠",
      type: 'radio',
      model: 'radio',
      options: [{label: '福州', value: 'fuzhou'}, {label: '厦门', value: 'xiamen'}],
      rules: [{ required: true, message: '是否挂靠', trigger: 'blur, change' }]
    },
    {
      label:"联动Select",
      type: 'select',
      model: 'statusList22',
      placeholder: '销售城市',
      options: [{label: '福州', value: 'fuzhou'}],
      rules: [{ required: true, message: '选择公司', trigger: 'blur, change' }],
    },
    {
      label:"联动Input",
      type: 'input',
      model: 'sn',
      placeholder: '订单编号',
      clearable: true,
    },
    {
      label:"备注",
      type: 'textarea',
      model: 'beizhu',
      placeholder: '订单编号',
      clearable: true,
      itemSpan: 20
    },
    {
      type: 'title_1',
      title: '金额 设置',
      itemSpan: '24',
      itemOffset: '4',
    },
    {
      label:"会员费",
      type: 'input',
      model: 'sn234',
      placeholder: '会员费',
      clearable: true,
      disabled: true,
    },
    {
      placeholder:"选择时间范围",
      label:"选择时间范围",
      type:'datePicker',
      format: 'yyyy/MM/dd',
      model:'dateTimeRange',
    },
    {
      label:"选择时间范围",
      'range-separator':"至",
      'start-placeholder':"开始时间",
      'end-placeholder':"结束时间",
      placeholder:"选择时间范围",
      type: 'timePicker',
      model: 'timePicker',
    },
    {
      label:"选择时间范围",
      type: 'inputNumber',
      model: 'inputNumber',
    },
    {
      label:"选择时间范围",
      type: 'cascader',
      model: 'comIds',
      clearable: true,
      'collapse-tags': true,
      filterable: true,
      props: { multiple: true },
      placeholder: '请选择城市',
      options: []
    },
    {
      label:"选择时间范围",
      type: 'dateRange',
      model: 'date',
      clearable: true,
    },
    {
      type: 'select',
      model: 'types',
      multiple: true,
      placeholder: '订单类型',
      'collapse-tags': true,
      filterable: true,
      clearable: true,
      options: [],
    },
    {
      label:"选择时间范围",
      type: 'input',
      model: 'name',
      placeholder: '客户名称',
      clearable: true
    },
    {
      label:"选择时间范围",
      type: 'input',
      model: 'mobile',
      placeholder: '手机号',
      clearable: true
    },
    {
      label:"选择时间范围",
      type: 'select',
      model: 'usedCars',
      placeholder: '购车类型',
      options: [
        { label: '新车', value: 1},
        { label: '回收车', value: 2},
      ],
    },
    {
      label:"选择时间范围",
      type: 'select',
      model: 'vehicleModelIdList',
      multiple: true,
      placeholder: '车型',
      'collapse-tags': true,
      filterable: true,
      clearable: true,
      options: [],
    },
    {
      label:"选择时间范围",
      type: 'input',
      model: 'salesManagers',
      placeholder: '销售人员',
      clearable: true
    },
    {
      label:"选择时间范围",
      type: 'input',
      model: 'plateNumber',
      placeholder: '车牌号码',
      clearable: true
    },
    {
      label:"选择时间范围",
      type: 'input',
      model: 'frameNumber',
      placeholder: '车架号',
      clearable: true
    },
    {
      label:"选择时间范围",
      type: 'input',
      model: 'auditorName',
      placeholder: '审核人',
      clearable: true
    },
    {
      label:"选择时间范围",
      type: 'select',
      filterable: true,
      clearable: true,
      model: 'flowNodeName',
      placeholder: '购车类型',
      options: [],
    },
    {
      label:"选择时间范围",
      type: 'select',
      filterable: true,
      clearable: true,
      model: 'leaseSource',
      placeholder: '购车类型',
      options: [],
    },
    {
      label:"选择时间范围",
      type: 'input',
      model: 'scOwnerName',
      placeholder: '电销跟进人',
      clearable: true
    },
  ]
}
