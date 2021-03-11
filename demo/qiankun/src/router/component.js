import Table from '../components/Table'
import Form from '../components/form/Index'
const IndexList = { template: '<div>IndexList</div>' }
// const Dialog = { template: '<div>Dialog</div>' }
const diff = { template: '<div>diff</div>' }

/*要注意，以 / 开头的嵌套路径会被当作根路径。 这让你充分的使用嵌套组件而无须设置嵌套的路径*/
export default {
    name: '组件',
    path: 'component',
    component: { template: ' <router-view></router-view>'},
    children: [
        {
            path: 'index-list',
            name: 'PC索引列表',
            component: IndexList
        },
        {
            name: 'Form',
            path: 'form',
            component: Form
        },
        {
            name: '表格',
            path: 'table',
            component: Table
        },
        {
            name: '首页3',
            path: 'posts',
            component: diff,
        }
    ]
}