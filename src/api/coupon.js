import request from '@/utils/request'
//优惠券列表
export const searchCoupon = (filters={}) =>{
    return request({
        url:'coupon_template',
        method: 'GET',
        params: {
            filters: filters
        }
    })
}
//领取人列表
export const searchCoupoUser = (filters={}) =>{
    return request({
        url:'back_coupon',
        method: 'GET',
        params: {
            filters: filters}
    })
}
//新增\修改优惠券
export const updateCoupon = (data = {}) =>{
    return request({
        url:'coupon_template',
        method: 'POST',
        data:data
    })
}
//删除优惠券
export const deleteCoupon = (filters={})=>{
    return request({
        url:'coupon_template',
        method: 'POST',
        data: {
            ...filters
        } 
    })
}