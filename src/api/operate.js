import request from '@/utils/request'
//banner列表
export const searchBanner = (filters={}) =>{
    return request({
        url:'backstage_banner_api',
        method: 'GET',
        params: {
            filters: JSON.stringify(filters)}
    })
}
//banner 删除
export const deleteBanner=(data)=>{
    return request({
        url:'backstage_banner_api',
        method:'POST',
        data:{
            filters:{
                ...data
            }
        }
    })
}
//修改 banner
export const changeBanner = (filters={}) =>{
    return request({
        url:'backstage_banner_api',
        method:'POST',
        data:{
            filters
        }       
    })
}
// 推荐列表
export const searchRecommend = (filters={}) =>{
    return request({
        url:'recommend_api',
        method: 'GET',
        params: {
            filters: JSON.stringify(filters)}
    })
}
//修改推荐
export const changeRecommend=(data)=>{
    return request({
        url:'recommend_api',
        method:'POST',
        data:{
            filters:{
                ...data
            }
        }
    })
}
//批量修改
export const changeAllRecommend=(data)=>{
    return request({
        url:'recommend_batch_api',
        method:'POST',
        data:{
            filters:{
                ...data
            }
        }
    })
}