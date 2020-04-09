<template>
  <div class="container">
    <div class="step">
      <!-- 退货退款进度条 -->
      <el-steps
        :active="goodRefundActive()"
        align-center
        finish-status="success"
        v-if="refundDetail.request_type=='退货退款'"
      >
        <el-step
          v-for="(item,index) in stepGoodRefund"
          :key="index"
          :title="item.title"
        ></el-step>
      </el-steps>
      <!-- 退货退款进度条 end-->

      <!-- 退款进度条 -->
      <el-steps
        :active="refundActive"
        align-center
        finish-status="success"
        v-if="refundDetail.request_type=='退款'"
      >
        <el-step
          v-for="(item,index) in stepRefund"
          :key="index"
          :title="item.title"
        ></el-step>
      </el-steps>
      <!-- 退款进度条 end -->
    </div>
    <div class="content-box">
      <div class="side-box">
        <div class="order-box">
          <div class="content-top">
            <p>
              退款编码：
              <span>{{refundDetail.refund_id}}</span>
            </p>
            <p>
              售后类型：
              <span class="text-danger">{{refundDetail.request_type}}</span>
            </p>
            <p>
              发货状态：
              <span class="text-danger">{{refundDetail.order_send_stauts}}</span>
            </p>
            <p>
              退款金额：
              <span class="text-danger">￥{{refundDetail.refund_price|fixedMoney}}</span>
            </p>
            <p>
              退款原因：
              <span class="text-danger">{{refundDetail.request_reason}}</span>
            </p>
            <p>
              售后号码：
              <span class="text-danger">{{refundDetail.refund_mobile}}</span>
            </p>
            <el-divider></el-divider>
          </div>
          <div class="content-bottom">
            <div class="product-title">
              <img
                :src="refundDetail.product_img"
                width="80"
              />
              <span>{{refundDetail.product_name}}</span>
            </div>
            <p class="good-count">共{{refundDetail.product_count}}件商品 <br /> 实收：￥{{refundDetail.refund_price|fixedMoney}}(免运费)</p>
            <p>订单编号: {{refundDetail.order_id}}</p>
            <p>成团时间: {{refundDetail.sharing_success_time|dateFilter}}</p>
            <p>订单确认时间: {{refundDetail.create_time|dateFilter}}</p>
            <p>付款时间: {{refundDetail.time_end|dateFilter}}</p>
          </div>
          <el-divider></el-divider>
          <div>
            <p>收货人: {{refundDetail.consignee}}</p>
            <p>手机号: {{refundDetail.receipt_mobile}}</p>
            <p>买家收货地址: {{refundDetail.address}}</p>
            <p>发货物流公司: {{refundDetail.order_logistics_company}}</p>
            <p>发货物流单号: {{refundDetail.order_logistics_number}}</p>
          </div>
        </div>
      </div>
      <div class="detail-box">
        <!--退款原因补充-->
        <div class="refund-box">
          <p>退款原因补充：{{refundDetail.request_explain}}</p>
          <div class="refund-imgs-box">
            <p>售后图片：</p>
            <img
              :src="item"
              alt=""
              width="200"
              v-for='(item,index) in refundDetail.request_img'
              :key='index'
            >
          </div>
        </div>
        <div v-show="refundDetail.request_type=='退款'">
          <!-- 撤销申请 -->
          <div
            class="detail-title"
            v-if="order_status=='13'"
          >
            <div><i class="el-icon-warning"></i></div>
            <h4>买家已撤销申请</h4>
          </div>
          <!-- 撤销申请 end -->
          <!-- 倒计时 等待处理 -->
          <div
            class="detail-title"
            v-show="order_status=='8'"
          >
            <div><i class="el-icon-warning"></i> </div>
            <div>
              <h4>等待商家处理退款申请</h4>
              <p>收到买家仅退款申请，请尽快处理。</p>
              <p>
                请在<span
                  class="time-change"
                  id="timeEnd"
                >----</span>处理本次退款，如逾期未处理，将自动同意退款。
              </p>
              <el-button
                type="primary"
                @click="confirmBtn_click(true,true)"
              >同意买家退款申请</el-button>
              <el-button @click="openRefundDialog">拒绝退款申请</el-button>
            </div>
          </div>
          <!-- 倒计时 等待处理  end -->
          <!-- 退款结果 -->
          <div
            class="detail-title"
            v-if="order_status=='11'||order_status=='12'"
          >
            <div><i class="el-icon-warning"></i></div>
            <h4>
              卖家已<span v-if="order_status=='11'">同意</span><span v-if="order_status=='12'">拒绝</span>
            </h4>
          </div>
          <!-- 退款结果 end -->
        </div>
        <div v-show="refundDetail.request_type=='退货退款'">
          <!-- 倒计时 等待处理 -->
          <div
            class="detail-title"
            v-show="order_status=='8'"
          >
            <div><i class="el-icon-warning"></i> </div>
            <div>
              <h4>等待商家处理退款退款申请</h4>
              <p>收到买家退货退款申请，请尽快处理。</p>
              <p>
                请在<span
                  class="time-change"
                  id="timeEnd2"
                >-----</span>处理本次退款，如逾期未处理，将自动同意退款。
              </p>
              <el-button
                type="primary"
                @click="openSendFormDialog"

              >同意买家退货退款申请</el-button>
              <el-button @click="openRefundDialog">拒绝退货退款申请</el-button>
            </div>
          </div>
          <!-- 倒计时 等待处理  end -->
          <!-- 退货中 -->
          <div
            class="detail-title"
            v-if="order_status=='9'"
          >
            <div><i class="el-icon-warning"></i></div>
            <div>
              <h4>卖家已同意,请耐心等待买家退货</h4>
            </div>
          </div>
          <!-- 退货中 end -->
          <!-- 退货中 -->
          <div
            class="detail-title"
            v-if="order_status=='10'"
          >
            <div><i class="el-icon-warning"></i></div>
            <div>
              <h4>卖家已同意</h4>
              <p>物流公司: {{refundDetail.logistics_company}}</p>
              <p>物流单号: {{refundDetail.logistics_number}}</p>
              <div>
                <el-button @click="confirmBtn_click(true,false,true)">确认收货</el-button>
                <el-button
                  @click="confirmBtn_click(false)"
                  :disabled="disChange(refundDetail.time_out)"
                >未收到货</el-button>
              </div>
            </div>
          </div>
          <!-- 退货中 end -->
          <!-- 售后完成 -->
          <div
            class="detail-title"
            v-if="order_status=='11'"
          >
            <div><i class="el-icon-warning"></i></div>
            <div>
              <h4>已确认收货，售后完成</h4>
            </div>
          </div>
          <!-- 售后完成 end -->
          <!-- 未收到货-->
          <div
            class="detail-title"
            v-if="order_status=='12'"
          >
            <div><i class="el-icon-warning"></i></div>
            <div>
              <h4>未收到货</h4>
              <p>平台稍后将联系您相关退货事宜，感谢您的配合~</p>
            </div>
          </div>
          <!-- 未收到货 end -->
        </div>
      </div>
    </div>
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <el-input
        v-model="refuse_reason"
        placeholder="请输入拒绝理由，不超过50个字"
        maxlength="50"
      ></el-input>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="confirmRefund"
        >提 交</el-button>
      </span>
    </el-dialog>

    <!-- 物流表单 -->
    <el-dialog
      title="请输入收货人信息"
      :visible.sync="formDialogShow"
      width="30%"
    >
     <el-form :model='sendForm' ref='sendForm' label-width="80px">
       <el-form-item label="姓名">
         <el-input v-model='sendForm.store_consignee'></el-input>
       </el-form-item>
       <el-form-item label="联系方式">
         <el-input v-model='sendForm.store_mobile' v-number-input maxlength="11"></el-input>
       </el-form-item>
       <el-form-item label="收货地址">
         <el-input v-model='sendForm.store_address'></el-input>
       </el-form-item>
     </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="formDialogShow = false">取 消</el-button>
        <el-button
          type="primary"
          @click="confirmBtn_click(true)"
        >提 交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { TimeDown, parseTime,format_objKey } from '@/utils/methods'
import { getRefundDetail, agreeOrRefuse } from '@/api/refund'
export default {
  created() {
    this.fetchData()
  },
  mounted() {
    this.goodRefundActive()
  },
  data() {
    return {
      formDialogShow:false, //物流表单
      dialogVisible: false,
      sendForm:{
        store_consignee:'',
        store_mobile:'',
        store_address:''
      },
      refuse_reason: '',

      order_status: '',
      //退货退款
      stepGoodRefund: [
        {
          title: '退款申请中',
          description: ''
        },
        {
          title: '商家处理结果',
          description: ''
        },
        {
          title: '买家退货',
          description: ''
        },
        {
          title: '商家确认收货',
          description: ''
        }
      ],
      //退款
      stepRefund: [
        {
          title: '退款申请后',
          description: ''
        },
        {
          title: '商家处理结果',
          description: ''
        }
      ],
      refundDetail: {}
    }
  },
  computed: {
    // 退款进度条
    refundActive: {
      get() {
        let order_status = this.order_status
        if (order_status == '12' || order_status == '11') {
          //同意或拒绝
          return 2
        } else {
          return 1
        }
      }
    },
    //未收货 未到时间不可点击
    disChange() {
      return val => {
        // if(val==null){
        //   return false
        // }
        let now = new Date().getTime() //转换时间戳
        let orderTime = new Date(val).getTime()
        let isEnd = Math.floor(now - orderTime)
        if (isEnd > 1) {
          return true
        } else {
          return false
        }
      }
    }
  },
  methods: {
    // 获取数据
    fetchData() {
      let refund_id = this.$route.query.refund_id
      getRefundDetail(refund_id).then(res => {
        const resp = res.data
        this.refundDetail = resp.data
        this.order_status = resp.data.order_status
        if (resp.data.time_out != null) {
          if (resp.data.request_type == '退货退款') {
            TimeDown('timeEnd2', parseTime(resp.data.time_out))
          }
          if (resp.data.request_type == '退款') {
            TimeDown('timeEnd', parseTime(resp.data.time_out))
            // TimeDown('timeEnd','2019-11-20 19:13:00')
          }
        }
      })
    },
    // 同意或拒绝
    confirmBtn_click(is_agree,isRefMoney=false,isOnlyConfirm=false) {
      let obj = {
        refund_id: this.$route.query.refund_id,
        is_agree
      }
      if (is_agree == false||isRefMoney==true) {  //拒绝 //退款
        obj = {
          ...obj,
          refuse_reason: this.refuse_reason
        }
         this.$confirm('确认执行此操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        let paramObj= format_objKey(obj)
        agreeOrRefuse({
            ...paramObj,
          is_agree
        }).then(res => {
          if (res.data.ret == 0) {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.fetchData()
          }
        })
      })
      }
      if(is_agree&&isRefMoney==false){ //同意,确认， 退货退款
          obj={
            ...obj,
            store_consignee:this.sendForm.store_consignee,
            store_address:this.sendForm.store_address,
            store_mobile:this.sendForm.store_mobile
          }
          if(!isOnlyConfirm){
                 let flag=false
          for(let key in obj){
            if(!obj[key]){
              flag= true
              
            }
          }
          if(flag){
            this.$message({
              message:'请填写完收货人信息!'
            })
             flag= false
            return
          }
          }
       
          agreeOrRefuse(format_objKey(obj)).then(res => {
          if (res.data.ret == 0) {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
           this.formDialogShow=false
            this.fetchData()
          }
        })
      }
     
    },
    //打开表单框
    openSendFormDialog(){
      this.formDialogShow=true
     this. sendForm={
        store_consignee:'',
        store_mobile:'',
        store_address:''
      }
    },
    //  进度条
    goodRefundActive() {
      let order_status = this.order_status
      if (order_status == '8') {
        return 1
      }
      if (order_status == '9') {
        return 2
      }
      if (order_status == '10') {
        return 3
      }
      if (order_status == '11' || order_status == '12') {
        return 4
      }
    },
    //  打开对话框
    openRefundDialog() {
      this.refuse_reason = ''
      this.dialogVisible = true
    },
    // 拒绝退款，拒绝理由
    confirmRefund() {
      let refund_reason = this.refuse_reason.trim()
      if (refund_reason.length == 0 || this.refuse_reason == '') {
        this.$message({
          message: '请输入拒绝理由!',
          duration: 3000
        })
        this.refund_reason = ''
        return
      } else {
        this.confirmBtn_click(false)
        this.dialogVisible = false
      }
    }
  }
}
</script>
<style scoped lang='less'>
.refund-box {
  border: 1px solid #ccc;
  box-sizing: border-box;
  padding: 20px;

  margin-bottom: 20px;
  .refund-imgs-box img {
    display: inline-block;
    vertical-align: top;
    margin-right: 20px;
  }
}
.text-danger {
  color: #f56c6c;
}
.good-count {
  text-align: right;
}
.el-icon-warning {
  font-size: 40px;
  color: #409eff;
  margin-right: 20px;
}
.detail-title {
  display: flex;
}
.container {
  display: flex;
  flex-direction: column;
  width: 80%;
  margin: 40px auto;
}
.step {
  width: 60%;
}
.content-box {
  display: flex;
  margin: 20px 0 20px;
  .side-box {
    width: 30%;
    margin-right: 25px;
  }
  .order-box {
    border: 1px solid #ccc;
    padding: 20px;
    transition: all 0.2s;
  }
  .detail-box {
    border: 1px solid #ccc;
    padding: 20px 40px;
    width: 70%;
    transition: all 0.2s;
    .time-change {
      color: #cc9900;
    }
  }
  .nav-title {
    margin-top: 30px;
  }
}
</style>
<style lang="less">
.side-box {
  .el-tabs__nav-scroll {
    border-bottom: 1px solid #fff;
  }
  .el-tabs--card > .el-tabs__header .el-tabs__nav {
    border-radius: 0px;
    border: 1px solid #e4e7ed;
    width: 100%;
  }
  .el-tabs--card > .el-tabs__header .el-tabs__item {
    width: 50%;
    text-align: center;
  }
}
.product-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  img {
    width: 80px;
    margin-right: 10px;
  }
}
</style>