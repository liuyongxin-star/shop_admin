const Layout = () => import('@/components/layout')
const shopList = () => import('@/views/shop/shopList')  //店铺列表
const shopDetail = () => import('@/views/shop/shopDetail')  //店铺详情
const shop = {
    path: '/shop',
    name: '商家中心',
    icon:'https://qn.ygp.sany.com.cn/icon_merchant_select%E5%A4%87%E4%BB%BD%2031.png',
    component: Layout,
    meta: {
        leaf: true
    },
    children: [
        {
            path: 'shopList',
            component: shopList,
            meta: {
                parent: '商家中心',
                title: '店铺管理',
                keepAlive: false,
                isShow: true
            }
        },
        {
            path: 'shopDetail',
            component: shopDetail,
            meta: {
                title: '店铺详情',
                keepAlive: false,
                isShow: false,
                parent: '商家中心',
                parent_title: '店铺管理'
            }
        },

    ]
}
export default shop
