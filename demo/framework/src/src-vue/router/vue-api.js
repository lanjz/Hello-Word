import Props from '../vue-api/props/index'

/*要注意，以 / 开头的嵌套路径会被当作根路径。 这让你充分的使用嵌套组件而无须设置嵌套的路径*/
export default {
    name: 'vue-api',
    path: 'vue-api',
    component: { template: ' <router-view></router-view>'},
    children: [
        {
            path: 'Props',
            name: '非Prop的Attribute',
            component: Props
        },
    ]
}