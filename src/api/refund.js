import request from '@/utils/request'
// 列表搜索
export function getRefundList(filters={}){
    return request({
        url:'refund/backstage',
        method:'GET',
        params:{
            filters
        }
    })
}
// 售后详情
export function getRefundDetail(refund_id){
    return request({
        url:'refund/backstage/detail',
        method:'GET',
        params:{
            filters:{
                refund_id
            }
        }
    })
}
// 商家操作 同意/拒绝
/**
 * 
 * @param refund_id 
 * @param is_agree
 */
export function agreeOrRefuse(filters={}){
    return request({
        url:'refund/backstage/detail',
        method:'POST',
        data:{
            filters
        }
    })
}
