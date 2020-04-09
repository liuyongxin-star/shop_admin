import request from '@/utils/request'

//列表搜索
export const searchOrder = (filters = {}) => {
    return request({
        url: 'mgr/order',
        method: 'GET',
        params: {
            filters: JSON.stringify(filters)
        }
    })
}

//订单详情
export const getOrderDetail = (order_id) => {
    return request({
        url: 'order_v2/backstage/details',
        method: 'GET',
        params: {
            filters: {
                order_id
            }
        }
    })
}
//获取物流公司
export const getLogistics_company = () => {
    return request({
        url: 'order/logistics_company',
        method: 'GET'
    })
}

//获取订单发货列表
export const getdeliverList = (order_id) => {
    let filters = {
        order_id
    }
    return request({
        url: 'order_v2/backstage/sendinfo',
        method: 'GET',
        params: {
            filters
        }
    })
}

// 订单发货
export const delieverGoods = (filters) => {
    // let data={...filters}
    return request({
        // url:'http://111.229.241.145:30050/api/order/backstage',
        url: 'order_v2/backstage',
        method: 'POST',
        data: {
            filters
        }
    })
}

// 修改收货人信息
export const updatedConsignee = (filters) => {
    return request({
        url: 'order_v2/backstage/details',
        method: 'POST',
        data: {
            filters
        }

    })
}
// 取消订单
export const cancelOrder = (order_id) => {
    return request({
        url: 'order_v2/backstage/cancel',
        method: 'POST',
        data: {
            filters: {
                order_id
            }
        }
    })
}

//订单设置
export const orderSetting = (filters) => {
    return request({
        url: 'order_v2/setting',
        method: 'POST',
        data: {
            filters
        }
    })
}

// ---退货----//
// 获取订单退货列表
export const getOrderRefund = (filters = {}) => {
    return request({
        url: 'pay/refund_update_seller',
        method: 'GET',
        params: {
            filters
        }
    })
}
// 确认 /拒绝退货
export const confirmRefund = (filters) => {
    return request({
        url: 'pay/refund_update_seller',
        method: 'POST',
        data: {
            filters
        }
    })
}