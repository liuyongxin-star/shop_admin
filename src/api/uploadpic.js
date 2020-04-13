import request from '@/utils/request'
//图片上传获取Token
export const  uploadToken = (key) =>{
     return  request({
        url:"https://www.dongsanchi.com.cn/api/mgr/img_token",
        method: 'GET',
        params: {key:key}
    })
}