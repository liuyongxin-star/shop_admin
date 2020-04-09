const Layout = () => import('@/components/layout')
const refundManage = () => import('@/views/refund/refund')
const refundDetail = () => import('@/views/refund/refundDetail')
const invoice = () => import('@/views/refund/invoice/invoice')
const detail = () => import('@/views/refund/invoice/detail')
const refund = {
  path: '/refundMange',
  name: '售后管理',
  icon:'https://qn.ygp.sany.com.cn/icon_merchant_de.png',
  component: Layout,
  children: [
    {
      path: 'refund',
      component: refundManage,
      meta: {
        title: '退款/售后',
        keepAlive: false,
        isShow: true,
        parent: '售后管理'
      }
    },
    {
      path: 'refundDetail',
      component: refundDetail,
      meta: {
        title: '售后详情',
        keepAlive: false,
        isShow: false,
        parent: '售后管理'
      }
    },
    {
      path: 'invoice',
      component: invoice,
      meta: {
        title: '发票审核',
        keepAlive: false,
        isShow: true,
        parent: '售后管理'
      }
    },
    {
      path: 'detail',
      component: detail,
      meta: {
        title: '发票详情',
        keepAlive: false,
        isShow: false,
        parent: '售后管理'
      }
    }
  ]
}
export default refund
