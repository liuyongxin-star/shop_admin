const Layout = () => import('@/components/layout')
const distributionList = () => import('@/views/distribution/distributionList')
const editdistribution = () => import('@/views/distribution/editdistribution')
const distributionUser = () => import('@/views/distribution/distributionUser') //分销用户
const inviteRecords = () => import('@/views/distribution/inviteRecords') //邀请记录
const rebateRecords = () => import('@/views/distribution/rebateRecords') //返利记录
const distributionUserDetail = () => import('@/views/distribution/distributionUserDetail') //分销用户内部人员详情
const distribution = {
  path: '/distribution',
  name: '分销中心',
  icon:'https://qn.ygp.sany.com.cn/icon_distribution_de.png',
  component: Layout,
  meta: {
    leaf: true
  },
  children: [
    {
      path: 'distributionUser',
      component: distributionUser,
      meta: {
        parent: '分销管理',
        title: '分销用户',
        keepAlive: false,
        isShow: true
      }
    },
    {
      path: 'inviteRecords',
      component: inviteRecords,
      meta: {
        parent: '分销管理',
        title: '邀请记录',
        keepAlive: false,
        isShow: true
      }
    },
    {
      path: 'rebateRecords',
      component: rebateRecords,
      meta: {
        parent: '分销管理',
        title: '分销记录',
        keepAlive: false,
        isShow: true
      }
    },
    {
      path: 'distributionList',
      component: distributionList,
      meta: {
        parent: '分销管理',
        title: '提现审核',
        keepAlive: false,
        isShow: true
      }
    },
    {
      path: 'editdistribution',
      component: editdistribution,
      meta: {
        title: '查看详情',
        keepAlive: false,
        isShow: false,
        parent: '分销管理',
        parent_title: '提现审核'
      }
    },
    {
      path: 'distributionUserDetail',
      component: distributionUserDetail,
      meta: {
        title: '查看详情',
        keepAlive: false,
        isShow: false,
        parent: '分销管理',
        parent_title: '分销用户 / 普通用户'
      }
    }

  ]
}
export default distribution
