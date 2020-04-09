// 优惠券类型
export const COUPON_TYPE = {
  new: '新人领取',
  all: '全场领取',
  vip: '会员领取'
}

// 优惠券状态
export const COUPON_STATE = {
  valid: '可用',
  invalid: '不可用',
  not_active: '未激活'
}

// 使用期限
export const COUPON_TIME = {
  duration: '领取倒计时',
  time: '限定日期'
}

// 使用状态
export const COUPON_USE_STATUS = {
  '0': '未使用',
  '1': '已使用',
  '-1': '已过期'
}

//使用范围
export const COUPON_SCOPE = {
  all: '全场通用',
  specifiedClassification: '指定分类'
}

//求购处理状态
export const WANTTOBUY_STATUS = {
  '1': '已处理',
  '2': '已查看',
  '3': '忽略',
  '4': '未处理'
}
//会员等级
export const MEMBER_LEVEL = {
  1: '普通会员',
  2: '白银会员',
  3: '黄金会员',
  4: '铂金会员',
  5: '钻石会员',
  6: '黑金会员'
}
//积分商城商品类型
export const PRODUCT_TYPE = {
  '1': '实物',
  '2': '虚拟'
}
//商品状态
export const PRODUCT_AVAILABLE = {
  true: '上架',
  false: '下架'
}
//订单状态
export const ORDER_STATUS = {
  1: '待发货',
  2: '待收货',
  3: '交易成功'
}
//发票类型
export const INVOICE_TYPE = {
  单位: '单位',
  个人: '个人'
}
//发票状态
export const INVOICE_STATUS = {
  '-1': '撤销审核',
  0: '审核未通过',
  1: '待审核',
  2: '待开票',
  3: '待寄出',
  4: '已寄出'
}
//订单类型
export const ORDER_TYPE = {
  1: '单独购买',
  2: '发起拼团'
}
//支付类型
export const PAY_TYPE = {
  0: '现金支付',
  1: '微信支付',
  2: '支付宝支付'
}
//匹配占比
export const MATCH = {
  0: '>=90%',
  1: '>=80%',
  2: '>=70%',
  3: '>=60%',
  4: '>=50%',
  5: '<50%',
}
//未匹配占比
export const UNMATCH = {
  0: '<10%',
  1: '<20%',
  2: '<30%',
  3: '<40%',
  4: '>=40%',
}
//混批情况
export const STORE = {
  0: '无',
  1: '2家店混批',
  2: '3家店混批',
  3: '3家以上混批'
}
//加购物车情况
export const BUY = {
  0: '加购物车并导出',
  1: '加购物车未导出',
  2: '未加购物车',
}
//购买情况
export const IMMEDIATE = {
  0: '购买并导出',
  1: '购买未导出',
  2: '未购买',
}
//文件类型
export const FILETYPE = {
  0: 'https://qn.ygp.sany.com.cn/Icon-WORD.png',
  1: 'https://qn.ygp.sany.com.cn/PDF.png',
  2: 'https://qn.ygp.sany.com.cn/Icon-Excel.png',
}
