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
    icon: 'el-icon-s-goods',
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
      
       
    ]
}
export default product