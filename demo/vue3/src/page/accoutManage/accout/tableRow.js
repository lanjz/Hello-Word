export default function (){
  return [
    {
      prop: "name",
      label: "账号ID",

    },
    {
      prop: "province",
      label: "英文名",
    },
    {
      prop: "city",
      label: "所属角色",
    },
    {
      prop: "address",
      label: "状态",
      width: "320",
    },
    {
      prop: "zip",
      label: "创建时间",
      'min-width': 100
    },
    {prop: "zip", label: "登录时间", 'min-width': 110},
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