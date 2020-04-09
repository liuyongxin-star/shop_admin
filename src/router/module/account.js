const Layout = () => import('@/components/layout')
const company_list = () => import('@/views/account/verificate_list')
const accountList = () => import('@/views/account/accountList')
const countDetail = () => import('@/views/account/detail')
const feedback = () => import('@/views/account/feedback')
const thirdView = () => import('./third_routerView')

const account = {
  path: '/account',
  name: '用户中心',
  icon:'https://qn.ygp.sany.com.cn/icon_user_de.png',
  component: Layout,
  children: [
    {
      path: 'accountList',
      component: accountList,
      meta: {
        title: '账号列表',
        keepAlive: false,
        isShow: true,
        parent: '账号管理'
      }
    },
    {
      path: 'verificateList',
      component: company_list,
      meta: {
        title: '企业管理',
        keepAlive: false,
        isShow: true,
        parent: '账号管理'
      }
    },
    {
      path: 'countDetail',
      component: countDetail,
      meta: {
        title: '查看详情',
        keepAlive: false,
        isShow: false,
        parent: '账号管理'
      }
    },
    {
      path: 'feedback',
      component: thirdView,
      meta: {
        title: '意见反馈',
        keepAlive: false,
        isShow: true,
        parent: '账号管理'
      },
      children: [
        {
          path: 'accountfeedback',
          component: feedback,
          meta: {
            title: '意见反馈',
            keepAlive: false,
            isShow: true,
            parent: '意见反馈'
          }
        }
      ]
    }
  ]
}
export default account
