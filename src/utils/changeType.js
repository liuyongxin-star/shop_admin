export default {
    //物流公司
    _deliverCompany:[
      {
        name:'圆通速递',
        value:'圆通速递'
    },{
        name:'申通快递',
        value:'申通快递'
    },{
        name:'中通快递',
        value:'中通快递'
    },{
        name:'百世快递',
        value:'百世快递'
    },{
        name:'韵达快递',
        value:'韵达快递'
    },{
        name:'顺丰速运',
        value:'顺丰速运'
    },{
        name:'天天快递',
        value:'天天快递'
    },{
        name:'中国邮政',
        value:'中国邮政'
    },{
        name:'德邦快递',
        value:'德邦快递'
    },{
        name:'跨境速运',
        value:'跨境速运'
    }],
    //订单分类
    _orderType: [{
            type: '未付款',
            name: '单独购买'
        },
        {
            type: 'success_paid',
            name: '已支付'
        },
        // {
        //     type: '3',
        //     name: '参加拼团'
        // },
    ],
 
    //付款状态
    _payState: [{
        type: '0',
        name: '已完成'
    },
    {
        type: '1',
        name: '已支付'
    },
    {
        type: '2',
        name: '已退款'
    },
],
    //订单状态
    _orderState: [{
        type: 'unpaid',
        name: '未付款'
    },
    {
        type: 'success_paid',
        name: '已支付'
    },
    ],
    //申请状态
    _applyState: [{
            type: '0',
            name: '待处理'
        },
        {
            type: '1',
            name: '退货中'
        },
        {
            type: '2',
            name: '已完成'
        },
        {
            type: '3',
            name: '已拒绝'
        }
    ],
      //发货状态
      _deliveState: [{
        type: '0',
        name: '待处理'
    },
    {
        type: '1',
        name: '发货中'
    },
    {
        type: '2',
        name: '未发货'
    },
    {
        type: '3',
        name: '已发货'
    }
],
    //处理状态
    _handleState:[{
        type:'1',
        name:'待付款'
    },{
        type:'2',
        name:'待成团'
    },{
        type:'3',
        name:'待发货'
    },{
        type:'4',
        name:'待收货'
    },{
        type:'5',
        name:'交易成功'
    },{
        type:'6',
        name:'交易取消'
    },{
        type:'7',
        name:'未收货，退款待审核'
    },{
        type:'8',
        name:'已发货，退款待审核'
    },{
        type:'9',
        name:'交易成功，退款待审核'
    },{
        type:'10',
        name:'卖家拒绝退款'
    },{
        type:'11',
        name:'卖家已拒绝'
    },{
        type:'12',
        name:'卖家已同意，请退货'
    },{
        type:'13',
        name:'退货中，等待卖家确认'
    },{
        type:'14',
        name:'退款成功'
    },{
        type:'15',
        name:'退货退款成功'
    }],
    // ----refund---//
    //退款类型
    _refundType:[
        {
            type:'',
            name:'全部'
        },{
        type:'1',
        name:'售中退款'
    },{
        type:'2',
        name:'售后退款'
    }],
    //退款方式
    _refundWay:[{
        type:'',
        name:'全部'
    },{
        type:'1',
        name:'退款'
    },{
        type:'2',
        name:'退货退款'
    }],
    //退款状态
    _refundStatus:[{
        type:'',
        name:'全部'
    },{
        type: '1',
        name: '待付款'
    },
    {
        type: '2',
        name: '待成团'
    },
    {
        type: '3',
        name: '待发货'
    },
    {
        type: '4',
        name: '待收货'
    },
    {
        type: '5',
        name: '交易成功'
    },
    {
        type: '6',
        name: '交易取消'
    },{
        type: '7',
        name: '售后中'
    },{
        type: '8',
        name: '退款待审核'
    },{
        type: '9',
        name: '卖家已同意，请退货'
    },{
        type: '10',
        name: '退货中，等待卖家确认'
    },{
        type: '11',
        name: '退款成功'
    },{
        type: '12',
        name: '退款失败'
    },{
        type: '13',
        name: '买家撤销申请'
    }],
    // 发货状态
    _deliveryStatus:[{
        type:'',
        name:'全部'
    },{
        type:'未发货',
        name:'未发货'
    },{
        type:'已发货',
        name:'已发货'
    }],
    //售后列表 标题
    _refundNav:[{
        type:'',
        name:'全部'
    },{
        type:'1',
        name:'待商家处理'
    },{
        type:'2',
        name:'待买家处理'
    },
    // {
    //     type:'3',
    //     name:'换货补寄待处理'
    // }
],
    // 企业认证状态
    _verificateStatus:[{
        type:'0',
        name:'审核未通过'
    },{
        type:'1',
        name:'审核中'
    },{
        type:'2',
        name:'已认证'
    }],
    //申请者身份
    _applyStatus:[{
        type:'0',
        name:'---',
    },{
        type:'1',
        name:'企业老板',
    },{
        type:'2',
        name:'采购负责人'
    },{
        type:'3',
        name:'采购人员'
    },{
        type:'4',
        name:'财务人员'
    },{
        type:'5',
        name:'其他'
    }],
    //审核拒绝原因
    _applyRefuseReason:[{
        type:'组织机构代码证与营业执照不一样',
        name:'组织机构代码证与营业执照不一样'
    },{
        type:'法人代表与营业执照不一致',
        name:'法人代表与营业执照不一致'
    },{
        type:'地址与营业执照不一致',
        name:'地址与营业执照不一致'
    },{
        type:'营业执照图片不清晰',
        name:'营业执照图片不清晰'
    },{
        type:'其他',
        name:'其他'
    }],
    // 会员等级
    _memberLevel:[{
        type:'1',
        name:'普通会员'
    },{
        type:'2',
        name:'白银会员'
    },{
        type:'3',
        name:'黄金会员'
    },{
        type:'4',
        name:'铂金会员'
    },{
        type:'5',
        name:'钻石会员'
    },{
        type:'6',
        name:'黑金会员'
    }],
    // 意见类型
    _feedbackStatus:[{
        type:'',
        name:'全部'
    },{
        type:'产品',
        name:'产品'
    },{
        type:'商品',
        name:'商品'
    },{
        type:'体验',
        name:'体验'
    },{
        type:'其他',
        name:'其他'
    }],
    // 意见反馈 处理状态
    _feedbackDealStatus:[{
        type:'0',
        name:'忽略'
    },{
        type:'1',
        name:'未处理'  
    },{
        type:'2',
        name:'已处理'
    }],
    // 会员等级状态
    _memberLevelStatus:[{
        type:'1',
        name:'普通会员'
    },{
        type:'2',
        name:'白银会员'
    },{
        type:'3',
        name:'黄金会员'
    },{
        type:'4',
        name:'铂金会员'
    },{
        type:'5',
        name:'钻石会员'
    },{
        type:'6',
        name:'黑金会员'
    }
    ],
    // 生日豪礼领取状态
    _giftRecevieStatus:[{
        type:'1',
        name:'待发货'
    },{
        type:'2',
        name:'待收货'
    },{
        type:'3',
        name:'交易成功'
    }
    ],
    // 分销提现申请状态
    _withdrawalStatus:[{
        type:'0',
        name:'已拒绝'
        }, {
        type:'1',
        name:'待处理'
        },{
            type:'2',
            name:'待上传凭证'
        },{
            type:'3',
            name:'已完成'
        }],
    // 店铺审核状态
    _shopVerifiedStatus:[{
        type:'1',
        name:'审核通过'
    },{
        type:'2',
        name:'创建未审核'
    },{
        type:'3',
        name:'审核未通过'
    },{
        type:'4',
        name:'关闭审核'
    },{
        type:'5',
        name:'装修未审核'
    },{
        type:'6',
        name:'店铺信息修改未审核'
    }],
    //店铺发票资质
    _shopInvoiceStatus:[{
        type:'0',
        name:'不可开票'
    },{
        type:'1',
        name:'可开普票'
    },{
        type:'2',
        name:'可开专票'
    },{
        type:'3',
        name:'可开普票及专票'
    },],
    _filterType(objType, type) {
        const obj = objType.find(item => item.type == type)
        return obj ? obj.name : null
    }
}