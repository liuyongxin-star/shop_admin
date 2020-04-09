import request from '@/utils/request'

//获取批量发货记录
export function getBatchList(data, type) {
    let filters = {
        ...data
    }
    if (type == 'success') {
        filters.import_status = true
    } else if (type == 'fail') {
        filters.import_status = false
    }
    return request({
        url: '/backstage/send_order/recording',
        method: 'GET',
        params: {
            filters
        }
    })
}

//修改发货记录
export function editRecorde(data){
    return request({
        url:'/backstage/send_order/recording',
        method:'POST',
        data
    })
}

//删除发货记录
export function delRecorde(send_recording_id){
    return request({
        url:'/backstage/send_order/delete',
        method:'POST',
        data: {
            send_recording_id
        }
        
    })
}

//添加批量发货记录
export function addBatch(logistics_info){
    return request({
        url:'/backstage/send_order',
        method:'POST',
        data:{
            logistics_info
        }
    })
}