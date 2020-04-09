import request from '@/utils/request'

//分销管理-分销用户-普通用户
export const getDistributionUser = (type,filters = {}) => {
    let data='';
    if(type==="get"||type==='GET'){
        data={
            filters: JSON.stringify(filters)
        }
        return request({
            url: 'back_distribution_user/common',
            method: type,
            params: data,
        })
    }
    if(type==="POST"|| type==='post'){
        data={filters}
        return request({
            url: 'back_distribution_user/common',
            method: type,
            data: data
        })
    }

}

//分销管理-分销用户-内部销售
export const getDistributionSalesman = (type,filters = {}) => {
    let data='';
    if(type==="get"||type==='GET'){
        data={
            filters: JSON.stringify(filters)
        }
        return request({
            url: 'back_distribution_user/salesman',
            method: type,
            params: data,
        })
    }
    if(type==="POST"|| type==='post'){
        data={filters}
        return request({
            url: 'back_distribution_user/salesman',
            method: type,
            data: data
        })
    }

}

//分销管理-分销用户-普通用户-基本信息
export const getDistributionUserInfo = (type,filters = {}) => {
    let data='';
    if(type==="get"||type==='GET'){
        data={
            filters: JSON.stringify(filters)
        }
        return request({
            url: 'back_distribution_user/common/base_info',
            method: type,
            params: data,
        })
    }
}

//分销管理-分销用户-普通用户-邀请明细
export const getDistributionUserInvite = (type,filters = {}) => {
    let data='';
    if(type==="get"||type==='GET'){
        data={
            filters: JSON.stringify(filters)
        }
        return request({
            url: 'back_distribution_user/common/invite_info',
            method: type,
            params: data,
        })
    }
}

//分销管理-分销用户-普通用户-返利明细
export const getDistributionUserRebate = (type,filters = {}) => {
    let data='';
    if(type==="get"||type==='GET'){
        data={
            filters: JSON.stringify(filters)
        }
        return request({
            url: 'back_distribution_user/common/earning_detail',
            method: type,
            params: data,
        })
    }
}

//分销管理-分销记录
export const getDistributionBill = (type,filters = {}) => {
    let data='';
    if(type==="get"||type==='GET'){
        data={
            filters: JSON.stringify(filters)
        }
        return request({
            url: 'back_distribution_bill',
            method: type,
            params: data,
        })
    }
}

//分销管理-邀请记录
export const getDistributionInvite = (type,filters = {}) => {
    let data='';
    if(type==="get"||type==='GET'){
        data={
            filters: JSON.stringify(filters)
        }
        return request({
            url: 'back_distribution_invite',
            method: type,
            params: data,
    })
    }
}