import Team from '../page/resourceManage/team/Index'
import Driver from '../page/resourceManage/driver/Index'

/*要注意，以 / 开头的嵌套路径会被当作根路径。 这让你充分的使用嵌套组件而无须设置嵌套的路径*/
export default {
  name: '资源管理',
  path: 'resource',
  component: { template: ' <router-view></router-view>'},
  children: [
    {
      name: '车队管理',
      path: 'team',
      component: Team
    },
    {
      name: '司机管理',
      path: 'accout',
      component: Driver
    }
  ]
}