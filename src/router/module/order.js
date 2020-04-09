const Layout = () => import('@/components/layout')
const orderList = () => import('@/views/order/orderList')
const batchDeliver=()=> import('@/views/order/batchDeliver')
const orderDetail = () => import('@/views/order/orderList/orderDetail')
const orderSetting = () => import('@/views/order/orderSetting')
const orderGoods = () => import('@/views/order/orderGoods')
const orderRefund = () => import('@/views/order/orderRefund')
const orderRefundDetail = () =>
	import('@/views/order/orderRefund/orderRefDetail')
const orderReason = () => import('@/views/order/orderReason')
const invoiceList = () => import('@/views/order/invoice/index')
const invoice_detail = () => import('@/views/order/invoice/invoice_detail')
const order = {
	path: '/order',
	name: '订单中心',
	icon: 'https://qn.ygp.sany.com.cn/icon_oder_selected.png',
	component: Layout,
	children: [{
			path: 'orderList',
			component: orderList,
			meta: {
				title: '订单列表',
				keepAlive: false,
				isShow: true,
				parent: '订单中心'
			}
		}, {
			path: 'invoiceList',
			component: invoiceList,
			meta: {
				title: '发票管理',
				keepAlive: false,
				isShow: true,
				parent: '订单中心'
			}
		}, {
			path: 'invoice_detail',
			component: invoice_detail,
			meta: {
				title: '发票详情',
				keepAlive: false,
				isShow: false,
				parent: '发票管理',
				parent_title: '订单中心'
			}
		},
		{
			path: 'orderSetting',
			component: orderSetting,
			meta: {
				title: '订单设置',
				keepAlive: false,
				isShow: false,
				parent: '订单中心'
			}
		},
		{
			path: 'orderGoods',
			component: orderGoods,
			meta: {
				title: '订单发货',
				keepAlive: false,
				parent: '订单中心',
				isShow: false
			}
		},
		{
			path: 'orderRefund',
			component: orderRefund,
			meta: {
				title: '退货申请处理',
				keepAlive: false,
				isShow: false,
				parent: '订单中心'
			}
		},
		{
			path: 'orderReason',
			component: orderReason,
			meta: {
				title: '退货原因设置',
				keepAlive: false,
				isShow: false,
				parent: '订单中心'
			}
		},
		{
			path: 'orderRefundDetail',
			component: orderRefundDetail,
			meta: {
				title: '退货申请详情',
				keepAlive: false,
				isShow: false,
				parent: '订单中心'
			}
		},
		{
			path: 'orderDetail',
			component: orderDetail,
			meta: {
				title: '订单详情',
				keepAlive: false,
				isShow: false,
				parent: '订单中心'
			}
		}
	]
}
export default order
