const Layout = () => import('@/components/layout')
const orderStatis = () => import('@/views/statistics/orderStatis')
const fissionStatistis = () => import('@/views/statistics/fissionStatistis')
const statistics=  {
    path: '/statistics',
    name: '数据统计',
    icon:'https://qn.ygp.sany.com.cn/icon_money_de.png',
    component: Layout,
    children: [
      {
        path: 'orderStatistics',
        component: orderStatis,
        meta: {
          title: '订单统计',
          keepAlive: false,
          isShow: true,
          parent: '数据统计'
        }
      },
      {
        path: 'fissionStatistis',
        component: fissionStatistis,
        meta: {
          title: '裂变统计',
          keepAlive: false,
          isShow: true,
          parent: '数据统计'
        }
      }
    ]
  }
  export default statistics