import axios from 'axios'

import {
    Loading,
    Message
} from 'element-ui'

import{getSessionToken,removeSessionToken }from './auth'

const loading = {
    loadingInstance: null, //loading 实例
    open() {
        if (this.loadingInstance === null) {
            this.loadingInstance = Loading.service({
                target: '.main',
                background: 'rgba(255,255,255,.8)'
            })
        }
    },
    close() {
        if (this.loadingInstance !== null) {
            this.loadingInstance.close()
        }
        this.loadingInstance = null
    }
}

const request = axios.create({
    baseURL:process.env.VUE_APP_SERVICE_URL,
    timeout: 5000,
    headers: {
        "Content-type": "application/x-www-form-urlencoded;charset=utf-8"
    }
})
//请求拦截器
request.interceptors.request.use(config=>{
    let token = getSessionToken() || ''
    if(token){
        config.headers.common['x-token']=token
    }
    loading.open()
    return config
}, error => {
    loading.close()
    return Promise.reject(error)
})

//响应拦截器
request.interceptors.response.use(response =>{
    return new Promise((resolve, reject) => {
    loading.close()
    const resp=response.data
    if(resp.ret!='0'){
        if (resp.ret === -2) {
            Message({
              message: resp.msg || '请求异常',
              type: 'warning',
              duration: 3000
            })
            removeSessionToken()//清token
            // 为了重新实例化vue-router对象 避免bug
          if (location.pathname.indexOf('/enter/login') === -1) {
            router.push({ path: '/enter/login' })
          }
        }else{
                 Message({
                message:resp.msg||'请求异常',
                type:'warning',
                duration:3000
            })
            }
            reject(response)
    }else{
        resolve(response)
    }
    return response
}, error => {
    loading.close()
    Message({
        message: error.message,
        type: 'error',
        duration: 3000
    })
    return Promise.reject(error)
})
})
export default request