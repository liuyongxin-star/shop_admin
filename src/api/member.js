import request from '@/utils/request'

//列表搜索
export const searchGift = (type, filters = {}) => {
  let data = ''
  if (type === 'get' || type === 'GET') {
    data = {
      filters: JSON.stringify(filters)
    }
  }
  if (type === 'POST' || type === 'post') {
    data = { filters }
  }
  return request({
    url: '/vip_birthday_back',
    method: type,
    params: data,
    data: data
  })
}

//分销管理-提现
export const getWithdrawal = (type,filters = {}) => {
    let data='';
    if(type==="get"||type==='GET'){
        data={
            filters: JSON.stringify(filters)
        }
        return request({
            url: 'back_withdrawal',
            method: type,
            params: data,
        })
    }
    if(type==="POST"|| type==='post'){
        data={filters}
        return request({
            url: 'back_withdrawal',
            method: type,
            data: data
        })
    }

}

//优惠礼包
export const couponGift = (filters = {}) => {
  return request({
    url: '/vip_coupon_back',
    method: 'GET',
    params: {
      filters: filters
    }
  })
}

//积分商城列表
export const getProductList = (filters = {}) => {
  return request({
    url: 'backstage_vip_store_api',
    method: 'GET',
    params: {
      filters: filters
    }
  })
}
//新增\修改\删除积分商城商品
export const updateProduct = (filters = {}) => {
  return request({
    url: 'backstage_vip_store_api',
    method: 'POST',
    data: { filters }
  })
}
//查询积分商城订单
export const getOrderList = (filters = {}) => {
  return request({
    url: 'points_purchase_back',
    method: 'GET',
    params: {
      filters: filters
    }
  })
}
//发货
export const deliverGoods = (filters = {}) => {
  return request({
    url: 'points_purchase_back',
    method: 'POST',
    data: { filters }
  })
}
//查询会员专区
export const getVIPAreaList = (filters = {}) => {
  return request({
    url: 'spu_api',
    method: 'GET',
    params: {
      filters: filters
    }
  })
}
