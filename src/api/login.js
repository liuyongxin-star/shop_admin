import request from '@/utils/request'
//登录接口
export const doLogin = (data) => {
  return request({
    url:'user/background/login',
    method: 'POST',
    data:data
  }).then(res => {
    return res
  })
}

//登出
export const doLogout = () => {
  return request({
    url: 'user/background/quit',
    method: 'POST',
  }).then(res => {
    return res
  })
}