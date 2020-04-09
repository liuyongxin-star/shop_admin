import request from '@/utils/request'
//优惠券列表
export const searchInvoice = (filters = {}) => {
	return request({
		url: 'invoice_back',
		method: 'GET',
		params: {
			filters: filters
		}
	})
}
export const updateInvoice = (filters = {}) => {
	return request({
		url: 'invoice_back',
		method: 'POST',
		data: {
			filters
		}
	})
}
export const invoice_batch_back = (filters = {}) => { //批量通过or批量拒绝
	return request({
		url: 'invoice_batch_back',
		method: 'POST',
		data: {
			filters
		}
	})
}
export const negative_invoice_back = (filters = {}) => { //待红冲数据
	return request({
		url: 'negative_invoice_back',
		method: 'GET',
		params: {
			filters: filters
		}
	})
}
export const invoice_detail_back = (filters = {}) => { //发票详情
	return request({
		url: 'invoice_detail_back',
		method: 'GET',
		params: {
			filters: filters
		}
	})
}