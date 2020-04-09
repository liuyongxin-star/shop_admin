import request from '@/utils/request'

export const store_product = (filters = {}) => {//获取商家对账的交易明细
  return request({
    url: 'backstage/accounts/store/product',
    method: 'GET',
    params: {
      filters: filters
    }
  })
}

export const store_settlement = (filters = {}) => {//获取商家结算的商家结算
  return request({
    url: 'backstage/accounts/store/settlement',
    method: 'GET',
    params: {
      filters: filters
    }
  })
}