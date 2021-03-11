export default function (){
  return [
    {
      prop: "name",
      label: "车队ID",

    },
    {
      prop: "province",
      label: "车队名称",
    },
    {
      prop: "city",
      label: "所在城市",
    },
    {
      prop: "address",
      label: "车队长账号",
      width: "320",
    },
    {
      prop: "zip",
      label: "车队长姓名",
      'min-width': 100
    },
    {prop: "zip", label: "车队长手机号", 'min-width': 110},
    {prop: "zip2", label: "司机数量",},
    {prop: "zip4", label: "注册时间",},
    {
      fixed: 'right',
      label: "操作",
      prop: "zip",
      slot: () => {
        return {
          default: (scope) => [
            <el-button onClick={() => this.handleClick(scope)} type="text" size="small">车队注销</el-button>,
          ],
        }
      },
    },
  ]
}