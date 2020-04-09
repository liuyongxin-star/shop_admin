const Layout = () => import('@/components/layout')
const thirdView = () => import('./third_routerView')
const order_list = () => import('@/views/member/mall/orderList')
const editOrder = () => import('@/views/member/mall/editOrder')
const memberList = () => import('@/views/member/memberEquity/memberBirthGift')
const editBithGift = () => import('@/views/member/memberEquity/editBithGift')
const giftPackage = () => import('@/views/member/memberEquity/giftPackage')
const memberArea = () => import('@/views/member/memberArea/memberArea')
const productList = () => import('@/views/member/mall/productList')
const addProduct = () => import('@/views/member/mall/addProduct')
const productDetail = () => import('@/views/member/mall/productDetail')
const member = {
  path: '/member',
  name: '会员中心',
  icon:'https://qn.ygp.sany.com.cn/icon_vip_de.png',
  component: Layout,
  meta: {
    leaf: true
  },
  children: [
    {
      path: 'mall',
      component: thirdView,
      meta: {
        title: '积分商城',
        keepAlive: false,
        isShow: true,
        parent: '会员管理'
      },
      children: [
        {
          path: 'productList',
          component: productList,
          meta: {
            title: '商品列表',
            keepAlive: false,
            isShow: true,
            parent: '积分商城'
          }
        },
        {
          path: 'addProduct',
          component: addProduct,
          meta: {
            title: '添加商品',
            keepAlive: false,
            isShow: false,
            parent: '积分商城',
            parent_title: '商品列表'
          }
        },
        {
          path: 'productDetail',
          component: productDetail,
          meta: {
            title: '商品详情',
            keepAlive: false,
            isShow: false,
            parent: '积分商城',
            parent_title: '商品列表'
          }
        },
        {
          path: 'orderList',
          component: order_list,
          meta: {
            title: '订单列表',
            keepAlive: false,
            isShow: true,
            parent: '积分商城'
          }
        },
        {
          path: 'editOrder',
          component: editOrder,
          meta: {
            title: '编辑',
            keepAlive: false,
            isShow: false,
            parent: '积分商城',
            parent_title: '订单列表'
          }
        }
      ]
    },
    {
      path: 'memberbenefits',
      component: thirdView,
      meta: {
        parent: '会员管理',
        title: '会员权益',
        keepAlive: false,
        isShow: true
      },
      children: [
        {
          path: 'memberList',
          component: memberList,
          meta: {
            parent: '会员权益',
            title: '生日豪礼',
            keepAlive: false,
            isShow: true
          }
        },
        {
          path: 'editBithGift',
          component: editBithGift,
          meta: {
            title: '编辑',
            keepAlive: false,
            isShow: false,
            parent: '会员权益',
            parent_title: '生日豪礼'
          }
        },
        {
          path: 'giftPackage',
          component: giftPackage,
          meta: {
            parent: '会员权益',
            title: '优惠礼包',
            keepAlive: false,
            isShow: true
          }
        }
      ]
    },
    {
      path: 'memberArea',
      component: memberArea,
      meta: {
        parent: '会员管理',
        title: '会员专区',
        keepAlive: false,
        isShow: false
      }
    }
  ]
}
export default member
