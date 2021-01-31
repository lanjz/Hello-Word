<template>
  <HForm
      :formConfig="formConfig"
      v-model="searchForm"
  >
  </HForm>
</template>

<script>
export default {
  name: "Index",
  data(){
    return {
      searchForm: {},
      formConfig: [
        {
          label:"选择时间范围",
          type:'indexTitle',
          index: '1'
        },
        {
          'is-range': true,
          'range-separator':"至",
          'start-placeholder':"开始时间",
          'end-placeholder':"结束时间",
          placeholder:"选择时间范围",
          type: 'timePicker',
          model: 'timePicker',
        },
        {
          type: 'inputNumber',
          model: 'inputNumber',
        },
        {
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
          type: 'dateRange',
          model: 'date',
          clearable: true,
        },
        {
          type: 'input',
          model: 'sn',
          placeholder: '订单编号',
          clearable: true
        },
        {
          type: 'select',
          model: 'types',
          multiple: true,
          placeholder: '订单类型',
          'collapse-tags': true,
          filterable: true,
          clearable: true,
          options: []
        },
        {
          type: 'input',
          model: 'name',
          placeholder: '客户名称',
          clearable: true
        },
        {
          type: 'input',
          model: 'mobile',
          placeholder: '手机号',
          clearable: true
        },
        {
          type: 'select',
          model: 'usedCars',
          placeholder: '购车类型',
          options: [
            { label: '新车', value: 1},
            { label: '回收车', value: 2},
          ],
        },
        {
          type: 'select',
          model: 'vehicleModelIdList',
          multiple: true,
          placeholder: '车型',
          'collapse-tags': true,
          filterable: true,
          clearable: true,
          options: []
        },
        {
          type: 'input',
          model: 'salesManagers',
          placeholder: '销售人员',
          clearable: true
        },
        {
          type: 'select',
          model: 'statusList',
          multiple: true,
          placeholder: '订单状态',
          'collapse-tags': true,
          filterable: true,
          clearable: true,
          options: []
        },
        {
          type: 'input',
          model: 'plateNumber',
          placeholder: '车牌号码',
          clearable: true
        },
        {
          label:"Index二",
          type:'indexTitle',
          index: '2'
        },
        {
          type: 'input',
          model: 'frameNumber',
          placeholder: '车架号',
          clearable: true
        },
        {
          type: 'input',
          model: 'auditorName',
          placeholder: '审核人',
          clearable: true
        },
        {
          type: 'select',
          filterable: true,
          clearable: true,
          model: 'flowNodeName',
          placeholder: '购车类型',
          options: []
        },
        {
          type: 'select',
          filterable: true,
          clearable: true,
          model: 'leaseSource',
          placeholder: '购车类型',
          options: []
        },
        {
          type: 'input',
          model: 'scOwnerName',
          placeholder: '电销跟进人',
          clearable: true
        },
      ],
    }
  }
}
</script>

<style scoped>

</style>