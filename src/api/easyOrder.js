import request from '@/utils/request'
//获取批量下单列表
export const getList = (data) => {
  return request({
    url:'',
    method: 'GET',
    data:data
  })
}
//获取批量下单详情
export const getInfo = (filters={}) => {
  return request({
    url: '',
    method: 'GET',
    params: {
      filters: filters
    }
  })
}
//删除批量下单
export const delEasyOrder = (filters={}) => {
  return request({
    url: '',
    method: 'POST',
    params: {
      filters: filters
    }
  })
}