import request from '@/utils/request'
//查询分类
export const searchGrade = (filters = {}) => {
    return request({
        url: '/backstage_pc_category',
        method: 'GET',
        params: {
            filters
        }
    })
}
//编辑分类
export const updateGrade=(data={})=>{
    return request({
        url:'/backstage_pc_category',
        method:'POST',
        data
    })
}