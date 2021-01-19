import DataOverview from '../page/dataBoard/dataOverview/Index'
import OperationData from '../page/dataBoard/operationData/Index'
import AbnormalDriver from '../page/dataBoard/abnormalDriver/Index'
import StatisticalReport from '../page/dataBoard/statisticalReport/Index'
import DriverDetail from '../page/dataBoard/driverDetail/Index'

/*要注意，以 / 开头的嵌套路径会被当作根路径。 这让你充分的使用嵌套组件而无须设置嵌套的路径*/
export default {
  name: '数据看板',
  path: 'component',
  component: { template: ' <router-view></router-view>'},
  children: [
    {
      path: 'data-overview',
      name: '数据概览',
      component: DataOverview
    },
    {
      name: '司机运营数据',
      path: 'operation-data',
      component: OperationData
    },
    {
      name: '异常司机',
      path: 'abnormal-driver',
      component: AbnormalDriver
    },
    {
      name: '统计报表',
      path: 'statistical-report',
      component: StatisticalReport
    },
    {
      name: '司机详情',
      path: 'driver-detail',
      component: DriverDetail
    }
  ]
}