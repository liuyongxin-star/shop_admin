const Layout = () => import('@/components/layout')
const couponList = () => import('@/views/coupon/couponList')
const couponData = () => import('@/views/coupon/couponData')
const banner = () => import('@/views/coupon/banner')
const newBanner = () => import('@/views/coupon/banner/newBanner')
const activity_bar = () => import('@/views/coupon/activity_bar')
const recommendedManagement = () =>
  import('@/views/coupon/recommendedManagement')
const wantToBuy = () => import('@/views/coupon/feedback/wantToBuy')
const easyOrder = () => import('@/views/coupon/easyOrder/easyOrder')
const easyOrderDetail = () => import('@/views/coupon/easyOrder/easyOrderDetail')
const coupon= {
    path: '/coupon',
    name: '运营中心',
    icon:'https://qn.ygp.sany.com.cn/icon_operating_select.png',
    component: Layout,
    children: [
      {
        path: 'couponList',
        component: couponList,
        meta: {
          parent: '运营管理',
          title: '优惠券管理',
          keepAlive: false,
          isShow: true
        }
      },
      {
        path: 'couponData',
        component: couponData,
        meta: {
          parent: '运营管理',
          title: '优惠券数据',
          keepAlive: false,
          isShow: false
        }
      },
      {
        path: 'banner',
        component: banner,
        meta: {
          title: 'banner管理',
          keepAlive: false,
          isShow: true,
          parent: '运营管理'
        }
      },
      {
        path: 'newBanner',
        component: newBanner,
        meta: {
          title: 'Banner管理',
          keepAlive: false,
          isShow: true,
          parent: '运营管理'
        }
      },
      {
        path: 'activity_bar',
        component: activity_bar,
        meta: {
          title: '活动专区',
          keepAlive: false,
          isShow: true,
          parent: '运营管理'
        }
      },
      {
        path: 'recommendedManagement',
        component: recommendedManagement,
        meta: {
          title: '推荐管理',
          keepAlive: false,
          isShow: true,
          parent: '运营管理'
        }
      },
      {
        path: 'wantToBuy',
        component: wantToBuy,
        meta: {
          title: '求购管理',
          keepAlive: false,
          isShow: true,
          parent: '运营管理'
        }
      }, 
      {
        path: 'easyOrder',
        component: easyOrder,
        meta: {
          title: '批量下单',
          keepAlive: false,
          isShow: true,
          parent: '运营管理'
        }
      },
      {
        path: 'easyOrderDetail',
        component: easyOrderDetail,
        meta: {
          title: '查看详情',
          keepAlive: false,
          isShow: false,
          parent: '运营管理',
          parent_title: '批量下单'
        }
      },
    ]
  }
  export default coupon