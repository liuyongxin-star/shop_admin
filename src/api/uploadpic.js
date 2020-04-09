import request from '@/utils/request'
//图片上传获取Token
export const  uploadToken = (key) =>{
     return  request({
        url:"http://111.229.241.145:30050/api/mgr/img_token",
        method: 'GET',
        params: {key:key}
    })
}