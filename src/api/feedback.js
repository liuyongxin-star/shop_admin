import request from '@/utils/request'
//求购信息列表
export const wantToBuy = (filters = {}) => {
  return request({
    url: 'backstage_request_api',
    method: 'GET',
    params: {
      filters: filters
    }
  })
}
export const editWantBuy = (filters = {}) => {
  return request({
    url: 'backstage_request_api',
    method: 'POST',
    data: { filters }
  })
}
