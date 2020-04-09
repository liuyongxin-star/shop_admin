import request from '@/utils/request'
// 搜索企业认证列表
export const searchCompany=(filters={})=>{
    return request({
        url:'back_user_center/company_list',
        method:'GET',
        params:{
            filters
        }
    })
}

//同意 拒绝企业认证
export const updataCompany=(filters={})=>{
    return request({
        url:'back_user_center/company_check',
        method:'POST',
        data:{
            filters
        }
    })
}

// 搜索账号列表
export const searchAccount=(filters={})=>{
    return request({
        url:'/user_back',
        method:'GET',
        params:{
            filters
        }
    })
}

// 获取企业详情/账号详情
export const addcountDetail=(_id)=>{
    return request({
        url:'back_user_center/company_detail',
        method:'GET',
        params:{
            filters:{
                _id
            }
        }
    })
}

//  搜索意见反馈列表
export const searchFeedback=(filters={})=>{
    return request({
        url:'/feedback/backstage',
        method:'GET',
        params:{
            filters
        }
    })
}

// 处理已经反馈   处理，待定
export const updataType=(_id,status)=>{
    return request({
        url:'http://127.0.0.1:7300/mock/5de470ce0ffce21d3cfa80fb/http:/193.112.198.123:30050/api/updataType',
        method:'POST',
        data:{
            filters:{
                _id,
                status
            }
        }
    })
}
