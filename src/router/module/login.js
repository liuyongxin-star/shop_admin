// 登录
const loginPage = () => import('@/views/login/login')
const thirdView = () => import('./third_routerView')
const login = { 
  path: '/enter',
  name: '登录入口',
  component: thirdView,
  redirect: '/enter/login',
  meta: {
    hide: true,
    //权限设置 -true为无需权限进入
    requireAuth: true
  },
  children: [
    {
      path: 'login',
      name: '登录',
      component: loginPage,
      meta: {
        hide: true,
        requireAuth: true
      }
    }
  ]
}
export default login
