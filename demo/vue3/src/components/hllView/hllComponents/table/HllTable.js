import usePagination from './usePagination'
import useTable from './useTable'
export default {
  name: "HllTable",
  componentAlias: "HllTable",
  props: {
    tableRow: Array,
    initialPageInfo: {
      type: Object,
      default: function (){
        return {}
      }
    },
    api: {
      type: String,
      default: function () {
        return ''
      }
    },
    params: {
      type: Object,
      default: function (){
        return {}
      }
    }
  },
  setup(props){
    const { paging, handleSizeChange, handleCurrentChange, forceUpdatePage } = usePagination(props.initialPageInfo)
    const { dataTotal, tableData } = useTable(paging)
    function getData(){
      return {
        pageInfo: paging,
        data: tableData,
        dataTotal
      }
    }
    return {
      tableData,
      dataTotal,
      paging,
      handleSizeChange,
      handleCurrentChange,
      forceUpdate: forceUpdatePage,
      getData,
    }
  },
  render(){
    const tableAttrs = {
      data: this.tableData,
      style: "width: 100%",
      'max-height': "650",
    }
    return (
      <>
        <el-table
          {...tableAttrs}
        >
          {
            this.tableRow.map((item, index) =>{
              return (
                <el-table-column
                  key={item.prop || index}
                  {...item}
                  v-slots={item.slot ? item.slot() : null}
                >
                </el-table-column>
              )
            })
          }
        </el-table>
        <div class="app-table-pagination">
          <el-pagination
            background
            layout="total,sizes,prev,pager,next,jumper"
            page-size={this.paging.pageSize}
            page-sizes={[10, 20, 50, 100]}
            current-page={this.paging.pageNum}
            total={this.dataTotal}
            onCurrentChange={this.handleCurrentChange}
            onSizeChange={this.handleSizeChange}
        ></el-pagination>
      </div>
      </>
    )
  }
}