export default function (){
  return [
    {
      prop: "name",
      label: "司机ID",

    },
    {
      prop: "province",
      label: "司机姓名",
    },
    {
      prop: "city",
      label: "车型",
    },
    {
      prop: "address",
      label: "出勤时长",
      width: "320",
    },
    {
      prop: "zip",
      label: "听单时长",
    },
    {
      prop: "zip",
      label: "完单时长",
    },
    {
      fixed: 'right',
      label: "操作",
      prop: "zip",
      slot: () => {
        return {
          default: (scope) => [
            <el-button onClick={() => this.handleClick(scope)} type="text" size="small">司机档案</el-button>,
          ],
        }
      },
    },
  ]
}