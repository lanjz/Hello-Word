
import IndexList from '../hllView/components/indexList'
import Dialog from '../hllView/hllComponents/Modal'
import Form from '../page/com-demo/form/Index'
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
            name: '弹层',
            path: 'dialog',
            component: Dialog
        },
        {
            name: '表单',
            path: 'form',
            component: Form
        },
        {
            name: '首页3',
            path: 'posts',
            component: diff
        }
    ]
}