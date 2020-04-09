import request from '@/utils/request'
// const baseURL='http://111.229.241.145:30050'


//测试
export const searchtest =(filters ={}) =>{
    return request({
        url:'es_want',
        method: 'GET',
        params: {  filters: JSON.stringify(filters)}
           
    })
}
//测试
//商品列表
export const searchGoods = (filters={}) =>{
    return request({
        url:'mgr/product_info',
        method: 'GET',
        params: {
            filters: JSON.stringify(filters)}
    })
}
//sku查询
export const searchSku = (filters={}) =>{
    return request({
        url:'product_api',
        method:'GET',
        params: {
            filters: JSON.stringify(filters)}
    }) 

}
//添加商品
export const addGoods = (filters={}) =>{
    return request({
        url:'product_api',
        method:'POST',
        data:{
            filters
        }       
    })
}
//删除商品
export const deleteGoods=(data)=>{
    return request({
        url:'spu_api',
        method:'POST',
        data:{
            filters:{
                ...data
            }
        }
    })
}
//商品上下架
export const showGoods=(data)=>{
    return request({
        url:'spu_api',
        method:'POST',
        data:JSON.stringify({'filters':data})
    })
}
//批量上下架
export const showAllGoods=(data)=>{
    return request({
        url:'spu_batch_api',
        method:'POST',
        data:JSON.stringify({'filters':data})
    })
}
//分类列表
export const searchClassify = (filters={}) =>{
    return request({
        url:'backstage_category_api',
        method: 'GET',        
        params: {
            filters: JSON.stringify(filters)}
    })
}
//分类更新
export const changeClassify = (filters={}) =>{
    return request({
        url:'backstage_category_api',
        method:'POST',
        data:{
            filters
        }       
    })
}
//删除分类
export const deleteClassify=(data)=>{
    return request({
        url:'backstage_category_api',
        method:'POST',
        data:{
            filters:{
                ...data
            }
        }
    })
}
//品牌列表
export const searchBrand = (filters={}) =>{
    return request({
        url:'backstage_brand',
        method: 'GET',
        params: {
            filters: JSON.stringify(filters)}
    })
}
//新增品牌信息
 export const updatedConsignee=(filters)=>{ 
    return request({
        url:'backstage_brand',
        method:'POST',
        data:{
            filters
        }       
    })
}
//删除品牌
export const deleteBrand=(data)=>{
    return request({
        url:'backstage_brand',
        method:'POST',
        data:{
            filters:{
                ...data
            }
        }
    })
}

// //分类显示http://192.168.31.71:8000/api/product/cat_show?cIDs
// export const showClassify=(filters)=>{ 
//     return request({
//         url:'api/product/cat_show',
//         method:'POST',
//         data:{
//             filters
//         }       
//     })
// }

// //分类导航栏http://192.168.30.18:8000/api/product/cat_nav
// export const naviClassify=(filters)=>{ 
//     return request({
//         url:'api/product/cat_nav',
//         method:'POST',
//         data:{
//             filters
//         }       
//     })
// }