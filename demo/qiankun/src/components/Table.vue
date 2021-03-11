<template>
  <HllTable
      ref="hllTable"
      :tableRow="tableRow"
      :tableData="tableData"
      :initialPageInfo="pageInfo"
  ></HllTable>
</template>

<script>
import HllTable from './HllTable'
import tableRow from './tableData.jsx'
export default {
  data(){
    return {
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
      pageInfo: {
        pageSize: 20,
        pageNum: 2,
      }
    }
  },
  components: {
    HllTable
  },
  methods: {
    handleClick(index, rows) {
      console.log('index, rows', index, rows)
      // rows.splice(index, 1);
    },
    deleteRow({$index, rows}) {
      console.log('index', $index, rows)
      this.tableData.splice($index, 1);
      console.log('this.tableData', this.tableData)
    }
  },
  mounted() {
    console.log('this', this)
  }
}
</script>