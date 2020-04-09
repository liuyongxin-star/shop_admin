import request from '@/utils/request'
//订单查询
export const searchStatis = (filters={}) =>{
    return request({
        url:'order_data',
        method: 'GET',  
        params: {
            filters: JSON.stringify(filters)}
    })
}
//裂变查询
export const searchSharing = (filters={}) =>{
    return request({
        url:'order_sharing_data',
        method: 'GET',  
        params: {
            filters: JSON.stringify(filters)}
    })
}
