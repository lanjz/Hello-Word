<template>
  <div class="abnormal-driver">
    <div class="search-container">
      <Fold @submit="submit" @clear="clear">
        <HllForm
            ref="curFrom"
            :formConfig="searchConfig"
            v-model="formDate"
            label-width="100px"
            inline
        >
        </HllForm>
      </Fold>
    </div>
    <div class="operation-container">
      <el-button type="primary" @click="dialogFormVisible = true">新增车队</el-button>
    </div>

    <div class="table-container">
      <HllTable
          ref="hllTable"
          :tableRow="tableRow"
          :tableData="tableData"
          :formDate="formDate"
      ></HllTable>
    </div>
    <el-dialog title="新增车队" v-model="dialogFormVisible" width="600px">
      <HllForm
          ref="curFrom"
          :formConfig="addFormConfig"
          v-model="formDate"
          label-width="110px"
      >
      </HllForm>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import tableRow from "./tableRow";
import { searchConfig, addFormConfig } from './formConfig'
export default {
  name: "Index",
  data(){
    return {
      formDate: {
        date: new Date,
        type: '流水下降',
      },
      searchConfig,
      addFormConfig,
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
      dialogFormVisible: false
    }
  },
  watch: {
    formDate: {
      handler: function (){
        console.log('watch', this.formDate)
      },
      deep: true
    }
  },
  methods: {
    submit(){
      this.$refs.hllTable.forceUpdate()
      console.log('submit')
    },
    clear(){
      console.log('submit')
      this.formDate = {}
      this.$refs.hllTable.forceUpdate()
    },
    handleClick(){
      this.$confirm('确认关闭？')
    },

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