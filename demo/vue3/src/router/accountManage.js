import Account from '../page/accoutManage/accout/Index'

/*要注意，以 / 开头的嵌套路径会被当作根路径。 这让你充分的使用嵌套组件而无须设置嵌套的路径*/
export default {
  name: '账户管理',
  path: 'account',
  component: { template: ' <router-view></router-view>'},
  children: [
    {
      name: '账户列表',
      path: 'list',
      component: Account
    },
  ]
}