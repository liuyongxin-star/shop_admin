import request from '@/utils/request'

//商家中心-店铺管理列表  商家中心-店铺管理-删除店铺
export const getShopList = (type,filters = {}) => {
    let data='';
    if(type==="get"||type==='GET'){
        data={
            filters: JSON.stringify(filters)
        }
        return request({
            url: '/backstage_manage_store',
            method: type,
            params: data,
        })
    }
    if(type==="POST"|| type==='post'){
        data={filters}
        return request({
            url: '/backstage_manage_store',
            method: type,
            data: data
        })
    }

}

//商家中心-店铺审核记录
export const getVerifiedRecord = (type,filters = {}) => {
    let data='';
    if(type==="get"||type==='GET'){
        data={
            filters: JSON.stringify(filters)
        }
        return request({
            url: '/backstage_store_verified_record',
            method: type,
            params: data,
        })
    }
    if(type==="POST"|| type==='post'){
        data={filters}
        return request({
            url: '/backstage_store_verified_record',
            method: type,
            data: data
        })
    }

}

