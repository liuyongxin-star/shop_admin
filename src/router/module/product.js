const Layout = () =>
    import('@/components/layout')
const goodsList = () =>
    import('@/views/goods/goodsList')
const goodsAdd = () =>
    import('@/views/goods/goodsAdd')
const goodsClassify = () =>
    import('@/views/goods/goodsClassify')
const goodsBrand = () =>
    import('@/views/goods/goodsBrand')
const gradeClassify = () => import('@/views/goods/gradeClassify')
const brand = () => import('@/views/goods/brand')
const product = {
    path: '/product',
    name: '商品中心',
    icon: 'https://qn.ygp.sany.com.cn/icon_goods_de.png',
    component: Layout,
    children: [{
            path: 'goodsList',
            component: goodsList,
            // component: () => import('@/views/orderList').then(m => m.default),
            meta: {
                parent: '商品中心',
                title: '商品列表',
                keepAlive: false,
                isShow: true
            }
        },
        {
            path: 'goodsAdd',
            component: goodsAdd,
            meta: {
                parent: '商品中心',
                title: '添加商品',
                keepAlive: false,
                isShow: true
            }
        },
        {
            path: 'goodsClassify',
            component: goodsClassify,
            meta: {
                parent: '商品中心',
                title: '商品分类',
                keepAlive: false,
                isShow: true
            }
        },
        {
            path: 'goodsBrand',
            component: goodsBrand,
            meta: {
                parent: '商品中心',
                title: '品牌管理',
                keepAlive: false,
                isShow: false
            }
        },
        {
            path: 'gradeClassify',
            component: gradeClassify,
            meta: {
                parent: '商品中心',
                title: '分类列表',
                keepAlive: false,
                isShow: true
            }
        },
        {
            path: 'brand',
            component: brand,
            meta: {
                parent: '商品中心',
                title: '品牌管理',
                keepAlive: false,
                isShow: true
            }
        },
    ]
}
export default product