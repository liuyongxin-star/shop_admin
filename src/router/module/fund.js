
const Layout = () => import('@/components/layout')
const business = () => import('@/views/fund/business')
const fund = {
    path: '/fund',
    name: '资金管理',
    icon:'https://qn.ygp.sany.com.cn/icon_merchant_select%E5%A4%87%E4%BB%BD%2031.png',
    component: Layout,
    meta: {
        leaf: true
    },
    children: [
        {
            path: 'business',
            component: business,
            meta: {
                parent: '资金管理',
                title: '商家对账',
                keepAlive: false,
                isShow: true
            }
        },

    ]
}
export default fund