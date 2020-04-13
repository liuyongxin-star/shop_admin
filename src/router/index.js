import Vue from 'vue'
import VueRouter from 'vue-router'
const Layout = () => import('@/components/layout')
//商品管理
import product from './module/product'
//订单管理
import order from './module/order'
//售后管理
import refund from './module/refund'
//运营管理
import coupon from './module/coupon'
//会员管理
import member from './module/member'
//分销管理
import distribution from './module/distribution'
//商家中心
import shop from './module/shop'
//数据统计
import statistics from './module/statistics'
//账号管理
import account from './module/account'
//设置
import setting from './module/setting'
//登录
import login from './module/login'
// 资金管理
import fund from './module/fund'
import { getSessionToken } from '@/utils/auth'
// if (!window.VueRouter) Vue.use(VueRouter)  //重复点击菜单不重复加载路由
const routes = [
  {
    path: '/',
    redirect: "/product/goodsList",
    meta:{
      isShow: false
    }
  },
  product,
  order
]

const router = new VueRouter({
  base: process.env.BASE_URL,
  routes
})
// router.beforeEach((to, from, next) => {
//   //处理路由跳转
//   if (!to.meta.requireAuth) {
//     //判断是否有token
//     if (getSessionToken()) {
//       next()
//     } else {
//       next({
//         path: '/enter/login'
//       })
//     }
//   } else {
//     next()
//   }
// })
export default router
