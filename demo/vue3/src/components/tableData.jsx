/*const App = {
  data() {
    return { visible: true };
  },
  render() {
    return <input  />;
  },
}*/
export default function (){
  return [
    {
      prop: "name",
      label: "姓名",
      width: "120",
    },
    {
      prop: "province",
      label: "省份",
      width: "120",
    },
    {
      prop: "city",
      label: "市区",
      width: "120",
    },
    {
      prop: "address",
      label: "地址",
      width: "300",
    },
    {
      prop: "zip",
      label: "邮编",
      width: "120",
    },
    {
      fixed: 'right',
      label: "操作",
      prop: "zip",
      width: "120",
      slot: () => {
        return {
          default: (scope) => [
            <el-button onClick={() => this.handleClick(scope)} type="text" size="small">查看</el-button>,
            <el-button onClick={() => this.deleteRow(scope)} type="text" size="small">移除</el-button>,
            <el-button type="text" size="small">编辑</el-button>
          ],
        }
      },
    },
  ]
}