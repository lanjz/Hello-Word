export default {
  props: {
    tableRow: Array,
    tableData: Array,
  },
  setup(props){
    console.log('props', props)
    return {}
  },
  render(){
    const tableAttrs = {
      data: this.tableData,
      style: "width: 100%",
      'max-height': "650",
    }
    const slots = {
      default: () => <i className="el-icon-menu"></i>,
    }
    console.log('this.tableRow', slots)
    return (
      <el-table
        {...tableAttrs}
      >
        {
          this.tableRow.map((item, index) =>{
            if(item.prop === 'name'){
              console.log('item.slot2', item.slot2)
            }
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
    )
  }
}