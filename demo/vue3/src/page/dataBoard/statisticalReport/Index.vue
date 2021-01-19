<template>
  <div class="abnormal-driver">
   <div class="search-container">
     <Fold>
       <HllForm
           ref="curFrom"
           :formConfig="formConfig"
           v-model="formDate"
           label-width="100px"
           inline
       >
       </HllForm>
       <template v-slot:action>
         <el-button type="primary" icon="el-icon-search" @click="submit">查询</el-button>
       </template>
     </Fold>
   </div>
    <div class="table-container">
      <HllTable
          ref="hllTable"
          :tableRow="tableRow"
          :tableData="tableData"
      ></HllTable>
    </div>
  </div>
</template>

<script>
import tableRow from "./tableRow";

const formConfig = [
  {
    label:"选择日期：",
    type: 'datePicker',
    model: 'date',
    placeholder: '选择日期',
    max: new Date()
  },
  {
    useButton: true,
    label:"原因：",
    type: 'radio',
    model: 'type',
    options: [
      { value: '日报', label: '日报' },
      { value: '周报', label: '周报' },
    ]
  },
  {
    useButton: true,
    label:"原因：",
    type: 'radio',
    model: 'type',
    options: [
      { value: '司机车队流水表', label: '司机车队流水表' },
      { value: '司机异常报表', label: '司机异常报表' }
    ]
  },
]
export default {
  name: "Index",
  data(){
    return {
      formDate: {
        date: new Date,
        type: '流水下降',
      },
      formConfig,
      tableRow: tableRow.call(this),
      tableData: [
        {
          date: '2016-05-03',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333
        }, {
          date: '2016-05-02',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333
        }, {
          date: '2016-05-04',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333
        }, {
          date: '2016-05-01',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333
        }, {
          date: '2016-05-08',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333
        }, {
          date: '2016-05-06',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333
        }, {
          date: '2016-05-07',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333
        }
      ],
    }
  },
  methods: {
    submit(){},
    handleClick(){},

  }
}
</script>

<style scoped lang="scss">
.data-overview{
  color: #7d7b7b;
}
.c-black{
  color: #333;
}
.view-box{
  width: 300px;
  background: #fff;
  border-radius: 5px;
  padding: 10px 15px;
  font-size: 14px;
  b{
    font-size: 40px;
  }
  .m-t{
    margin-top: 5px;
  }
}
.refresh-icon{
  font-size: 18px;
  color: #f56c6c;
}
.title-bar{
  background: #fff;
  padding: 10px 15px;
  font-size: 14px;
  .title{
    font-size: 22px;
    font-weight: bold;
    color: #333;
  }
}
.view-panel{
  margin: 10px 0;
  margin-bottom: 30px;
}
.operation-title{
  margin-top: 20px;
  font-size: 16px;
  border-left: solid 4px #ff5103;
  padding-left: 10px;
}
</style>