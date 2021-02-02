<template>
  <div style="height: 300px;border: solid 1px red">
    <IndexList :defaultActivity="2">
      <HForm
          :formConfig="formConfig"
          v-model="searchForm"
          ref="HForm"
      >
      </HForm>
    </IndexList>
  </div>


</template>

<script>
export default {
  name: "Index",
  data(){
    return {
      searchForm: {
      },
      formConfig: [
        {
          formType:'indexTitle',
          index: '1',
          text: 'indexTitle',
        },
        {
          formType: 'datePicker',
          type: 'datetimerange',
          model: 'date2',
          placeholder: '时间',
          clearable: true,
          min: new Date(),
        },
        {
          'is-range': true,
          'range-separator':"至",
          'start-placeholder':"开始时间",
          'end-placeholder':"结束时间",
          placeholder:"选择时间范围",
          formType: 'timePicker',
          model: 'timePicker',
        },
        {
          formType: 'inputNumber',
          model: 'inputNumber',
        },
        {
          formType: 'cascader',
          model: 'comIds',
          clearable: true,
          'collapse-tags': true,
          filterable: true,
          props: { multiple: true },
          placeholder: '请选择城市',
          options: []
        },
        {
          formType: 'input',
          model: 'sn',
          placeholder: '订单编号',
          clearable: true,
          slot: {
            slotName: 'prepend',
            render: (h) => {
             return h('div', ['ABC'], ['ABC'])
            }
          },
          rules: [
            { required: true, message: '请输入活动名称', trigger: 'blur' },
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ]
        },
        {
          formType: 'select',
          model: 'types',
          multiple: true,
          placeholder: '订单类型',
          'collapse-tags': true,
          filterable: true,
          clearable: true,
          options: []
        },
        {
          formType: 'input',
          model: 'name',
          placeholder: '客户名称',
          clearable: true
        },
        {
          formType: 'input',
          model: 'mobile',
          placeholder: '手机号',
          clearable: true
        },
        {
          formType: 'radio',
          model: 'checkboxCars',
          placeholder: 'checkbox类型',
          showCheckAll: true,
          options: [
            { label: '新车', value: 1},
            { label: '回收车', value: 2},
          ],
        },
        {
          formType: 'select',
          model: 'usedCars',
          placeholder: '购车类型',
          options: [
            { label: '新车', value: 1},
            { label: '回收车', value: 2},
          ],
        },
        {
          formType: 'select',
          model: 'vehicleModelIdList',
          multiple: true,
          placeholder: '车型',
          'collapse-tags': true,
          filterable: true,
          clearable: true,
          options: []
        },
        {
          formType: 'input',
          model: 'salesManagers',
          placeholder: '销售人员',
          clearable: true
        },
        {
          formType: 'select',
          model: 'statusList',
          multiple: true,
          placeholder: '订单状态',
          'collapse-tags': true,
          filterable: true,
          clearable: true,
          options: []
        },
        {
          formType: 'input',
          model: 'plateNumber',
          placeholder: '车牌号码',
          clearable: true
        },
        {
          text:"Index二",
          formType:'indexTitle',
          index: '2'
        },
        {
          formType: 'input',
          model: 'frameNumber',
          placeholder: '车架号',
          clearable: true
        },
        {
          formType: 'input',
          model: 'auditorName',
          placeholder: '审核人',
          clearable: true
        },
        {
          formType: 'select',
          filterable: true,
          clearable: true,
          model: 'flowNodeName',
          placeholder: '购车类型',
          options: []
        },
        {
          formType: 'select',
          filterable: true,
          clearable: true,
          model: 'leaseSource',
          placeholder: '购车类型',
          options: []
        },
        {
          formType: 'input',
          model: 'scOwnerName',
          placeholder: '电销跟进人',
          clearable: true
        },
      ],
    }
  },
  watch: {
    searchForm: {
      handler: function (){
        console.log('searchForm', this.searchForm)
      },
      deep: true
    }
  },
  methods: {
   vad(){
     this.$refs.HForm.validate((valid, mes) => {
       console.log(valid, mes)
     })
   }
  },
  mounted() {
    console.log('this', this)
  }
}
</script>

<style scoped>

</style>