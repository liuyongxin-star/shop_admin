<template>
  <div>
    <div class="btn-back">    <el-button  size="small" @click="goBack" >返回</el-button>
</div>
    <div class="progress-box">
      <el-steps align-center finish-status="success" :active="orderStep">
        <el-step
          v-for="(item,index) in stepItems"
          :key="index"
          :title="item.title"
          :description="item.description"
        ></el-step>
      </el-steps>
    </div>
    <div class="content-box" v-if="orderDetail">
      <div class="title-box">
        <span>当前订单状态：{{orderStatus|orderStateFilter}}</span>
        <div>
          <el-button size="mini" @click="editReciverMsg" v-if="Number(orderStatus)<4||Number(orderStatus)==4">修改收货人信息</el-button>
          <el-button size="mini" @click="cancelOrder" v-if="orderStatus == 1">取消订单</el-button>
        </div>
      </div>
      <div class="tableList-box">
        <div class="table-item">
          <div>基本信息</div>
          <div class="table-content">
            <el-table
              :data="orderDetail"
              border
              style="width:100%"
              :header-cell-style="tableHeaderStyle"
            >
              <el-table-column prop="order_id" label="订单编号"></el-table-column>
              <el-table-column prop label="发货单流水号"></el-table-column>
              <el-table-column prop="user_name" label="用户账号"></el-table-column>
              <el-table-column prop='pay_manner' label="支付方式">
                <template slot-scope="scope">
                    <span>{{scope.row.pay_manner?scope.row.pay_manner:'微信支付'}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="order_type" label="订单类型">
                <template slot-scope="scope">
                  <span>{{scope.row.order_type |orderTypeFilter}}</span>
                </template>
              </el-table-column>
            </el-table>
            <el-table
              :data="orderDetail"
              border
              style="width:100%"
              :header-cell-style="tableHeaderStyle"
            >
              <el-table-column prop="logistics_company" label="物流公司"></el-table-column>
              <el-table-column prop="logistics_number" label="物流单号"></el-table-column>
              <el-table-column prop="auto_delivery" label="自动确认收货时间">
                <template slot-scope="scope">
                  <span>{{scope.row.auto_delivery|dateFilter}}</span>
                </template>
              </el-table-column>
              <el-table-column prop label="活动信息"></el-table-column>
              <el-table-column prop="splic_order_id" label="关联单号">
                <template slot-scope="scope">
                  <span v-for="(item,index) in scope.row.splic_order_id" :key="index">{{item}}</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div class="table-item">
          <div>收货人信息</div>
          <div class="table-content">
            <el-table
              :data="orderDetail"
              border
              style="width:100%"
              :header-cell-style="tableHeaderStyle"
            >
              <el-table-column prop="consignee" label="收货人"></el-table-column>
              <el-table-column prop="mobile" label="手机号码"></el-table-column>
              <el-table-column prop="zip_code" label="邮政编码"></el-table-column>
              <el-table-column prop="address" label="收货地址"></el-table-column>
            </el-table>
          </div>
        </div>
        <div class="table-item">
          <div>发票信息</div>
          <div class="table-content">
            <el-table
              :data="orderDetail"
              border
              style="width:100%"
              :header-cell-style="tableHeaderStyle"
            >
              <el-table-column prop="invoice_type" label="类型"></el-table-column>
              <el-table-column prop="invoice_title" label="发票抬头"></el-table-column>
              <el-table-column prop="tax_num" label="税号"></el-table-column>
              <el-table-column prop="bank_name" label="开户银行"></el-table-column>
              <el-table-column prop="bank_account" label="开户银行账号"></el-table-column>
              <el-table-column prop="invoice_address" label="单位地址"></el-table-column>
            </el-table>
          </div>
        </div>
        <div class="table-item">
          <div>商品信息</div>
          <div class="table-content">
            <el-table
              :data="product_list"
              border
              style="width:100%"
              :header-cell-style="tableHeaderStyle"
            >
              <el-table-column prop="product_img" label="商品图片">
                <template slot-scope="scope">
                  <img :src="scope.row.product_img" alt="商品图片" width="60" />
                </template>
              </el-table-column>
              <el-table-column prop="product_name" label="名称"></el-table-column>
              <el-table-column label="价格">
                <template slot-scope="scope">
                  价格：{{scope.row.product_price|fixedMoney}}
                  <!-- <br />
                  货号: {{scope.row.product_item_no}} -->
                </template>
              </el-table-column>
              <el-table-column prop="product_attr" label="规格"></el-table-column>
              <el-table-column prop="supplier" label="供应商"></el-table-column>
              <el-table-column prop="product_count" label="数量"></el-table-column>
              <el-table-column label="小计">
                <template
                  slot-scope="scope"
                >￥{{(scope.row.product_price*scope.row.product_count)|fixedMoney}}</template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div class="table-item">
          <div>费用信息</div>
          <div class="table-content">
            <el-table
              :data="orderDetail"
              border
              style="width:100%"
              :header-cell-style="tableHeaderStyle"
            >
              <el-table-column prop='store_total_price' label="合计">
                <template slot-scope="scope">
                  <span>￥{{scope.row.store_total_price|fixedMoney}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="freight_price" label="运费">
                <template slot-scope="scope" v-if="scope.row.freight_price">￥{{scope.row.freight_price|fixedMoney}}</template>
              </el-table-column>
              <el-table-column prop="total_threshold_price" label="优惠券">
                <template
                  slot-scope="scope"
                  v-if="scope.row.total_coupon_price ||scope.row.total_threshold_price"
                >
                  <span>满￥{{scope.row.total_threshold_price|fixedMoney}}减￥{{scope.row.total_coupon_price|fixedMoney}}</span> <br/>
                  <span>实际折扣：￥{{scope.row.store_coupon_price|fixedMoney}}</span>
                </template>
              </el-table-column>
              <el-table-column prop='order_total_price' label="订单总金额">
                <template slot-scope="scope">
                  <span>￥{{scope.row.order_total_price|fixedMoney}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="user_pay_price" label="应付金额">
                <template slot-scope="scope">￥{{scope.row.user_pay_price |fixedMoney}}</template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div class="table-item">
          <div>操作日志</div>
          <div class="table-content">
            <el-table
              :data="operateTable"
              border
              style="width:100%"
              :header-cell-style="tableHeaderStyle"
            >
              <el-table-column prop="opertaor" label="操作者"></el-table-column>
              <el-table-column prop="opeTime" label="操作时间">
                <template slot-scope="scope">
                    <span v-if="scope.row.opeTime">{{scope.row.opeTime|dateFilter}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="orderStatus" label="订单状态">
                <template slot-scope="scope">
                  <span>{{scope.row.orderStatus |orderStateFilter}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="payStatus" label="付款状态">
                <template slot-scope="scope">
                  <span>{{scope.row.payStatus |payStateFilter}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="delieverStatus" label="发货状态">
                <template slot-scope="scope">
                  <span>{{scope.row.delieverStatus |deliverStateFilter}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="remark" label="备注"></el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </div>

    <!-- 对话框 -->
    <el-dialog
      title="收货人信息"
      :visible.sync="dialogFormVisible"
      center
      width="25%"
      class="my-dialog"
      :close-on-click-modal="false"
      :show-close="false"
    >
      <el-form :model="changeForm" label-width="80px" class="dialog-form" ref="reciverForm">
        <el-form-item label="收货人" prop="consignee" v-if="Number(orderStatus)<3||Number(orderStatus)==3">
          <el-input v-model="changeForm.consignee"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile" v-if="Number(orderStatus)<3||Number(orderStatus)==3">
          <el-input v-model="changeForm.mobile"  v-number-input maxlength="11"></el-input>
        </el-form-item>
        <el-form-item label="邮政编码" prop="zip_code" v-if="Number(orderStatus)<3||Number(orderStatus)==3">
          <el-input v-model="changeForm.zip_code" v-number-input></el-input>
        </el-form-item>
        <el-form-item label="收货地址" prop="address" v-if="Number(orderStatus)<3||Number(orderStatus)==3">
          <el-input v-model="changeForm.address"></el-input>
        </el-form-item>
        <el-form-item label='物流公司' prop='logistics_company' v-if="Number(orderStatus)==4">
          <el-select v-model="changeForm.logistics_company" style="width:100%">
            <el-option v-for='(item,index) in company' :key="index" :label="item.name" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label='物流单号' prop='logistics_number' v-if="Number(orderStatus)==4">
          <el-input v-model="changeForm.logistics_number"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer dialog-btn-ground">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="submitOrderChange">提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getOrderDetail, updatedConsignee, cancelOrder,getLogistics_company } from "@/api/order";
import orderFilter from "@/utils/changeType";
import { parseTime,format_objKey } from "@/utils/methods";
export default {
  created() {
    this.fetchData();
    this.getCompany();
  },

  data() {
    return {
      orderStep: 0, //当前步骤
      orderStatus: "",
      stepItems: [], //进度条
      tableHeaderStyle: { background: "#DCDFE6", color: "#303133" }, //表格样式
            company:[], //物流公司
      dialogFormVisible: false, //对话框
      orderDetail: [], //获取的详情对象
      changeForm: {

      }, //对话框
      product_list: [], //商品信息
      operateTable: [
        //操作日志
        {
          opertaor: "",
          opeTime: "",
          orderStatus: "",
          payStatus: "", //已退款
          delieverStatus: "", //已发货
          remark: ""
        }
      ]
    };
  },
  methods: {
    // 返回
    goBack() {
      this.$router.go(-1);
    },
    //取消对话框
    cancel(){
      this.dialogFormVisible = false
              this.$nextTick(()=>{
          this.$refs['reciverForm'].resetFields()
        })
    },
    //获取数据
    fetchData() {
      let routerParams = this.$route.query.order_id; //获取路由传参的order_id
      getOrderDetail(routerParams)
        .then(res => {
          const orderObj = res.data.data;
          // ---格式化空内容
          for (let key in orderObj) {
            orderObj[key] = orderObj[key] ? orderObj[key] : "---";
          }
          // ---格式化空内容

          this.orderDetail = [orderObj];
          this.orderStatus = orderObj.order_status || ""; //订单状态
          
           // ---步骤条
          this.stepItems = [
            { title: "提交订单", description: parseTime(orderObj.create_time) },
            { title: "支付订单", description: parseTime(orderObj.time_end) },
            { title: "平台发货", description: parseTime(orderObj.send_time) },
            { title: "确认收货", description: parseTime(orderObj.delivery_time) },
            { title: "完成评价", description: "完成评价" }
          ];
          // ---步骤条

          //---对话框信息
          this.changeForm = {
            order_id: orderObj.order_id,
            consignee: orderObj.consignee,
            mobile: orderObj.mobile,
            zip_code: orderObj.zip_code,
            address: orderObj.address,
            logistics_company:orderObj.logistics_company,
            logistics_number:orderObj.logistics_number

          };
          //---对话框信息

          //---产品信息
          if (orderObj.product_data&&orderObj.product_data.length == 0) {
            this.product_list = [{}];
          } else {
            this.product_list = orderObj.product_data;
          }
          //---产品信息
          
         
        })
        .then(() => {
          this.formartStep();
        })
        .catch(res =>{});
    },
    //转换步骤条
    formartStep() {
      const flag = this.orderDetail[0];
      if (flag.delivery_time != "---") {
        //确认收货时间
        this.orderStep = 4;
        return;
      }
      if (flag.send_time != "---") {
        //发货时间
        this.orderStep = 3;
        return;
      }
      if (flag.time_end != "---") {
        //支付订单
        this.orderStep = 2;
        return;
      }
      if (flag.create_time != "---") {
        //订单提交时间
        this.orderStep = 1;
        return;
      }
    },
    //打开对话框
    editReciverMsg() {
      this.dialogFormVisible = true;
    },
    //提交收货信息修改
    submitOrderChange() {
      let data=Object.assign({},this.changeForm)
      if(Number(this.orderStatus)==4){ //待收货状态，只能修改物流公司，无聊的单号
        data={
           order_id: data.order_id,
          logistics_company:data.logistics_company,
          logistics_number:data.logistics_number
        }
      }
      updatedConsignee(format_objKey(data)).then(res => {
        if (res.data.ret == "0") {
          this.$message({
            message: "修改成功",
            duration: 3000,
            type: "success"
          });
          this.dialogFormVisible = false;
          this.fetchData();
        }else{
          this.$message({
            message:res.data.msg,
          })
        }
      });
    },
    // 取消订单
    cancelOrder() {
      this.$confirm("是否取消订单？", "提示", {
        type: "warning",
        showClose: false,
        closeOnClickModal: false,
        confirmButtonText: "确认",
        cancelButtonText: "返回"
      })
        .then(() => {
          cancelOrder(this.changeForm.order_id).then(res => {
            if (res.data.ret == "0") {
              this.$message({
                message: "订单已取消",
                duration: 3000,
                type: "success"
              });
              this.fetchData();
            } else {
              this.$message({
                message: "取消失败",
                duration: 3000,
                type: "warning"
              });
            }
          });
        })
        .catch(() => {});
    },
     //获取物流公司
    getCompany(){
       getLogistics_company().then(res=>{
          this.company=res.data.data.logistics_company_list
       })
    },
  },
  filters: {
  
    // 订单类型
    orderTypeFilter(type) {
      return orderFilter._filterType(orderFilter._orderType, type);
    },
    //订单状态
    orderStateFilter(type) {
      return orderFilter._filterType(orderFilter._orderState, type);
    },
    //付款状态
    payStateFilter(type) {
      return orderFilter._filterType(orderFilter._payState, type);
    },
    // 发货状态
    deliverStateFilter(type) {
      return orderFilter._filterType(orderFilter._deliveState, type);
    }
  }
};
</script>

<style scoped lang='less'>
.btn-back{
 text-align: right;
     width: 80%;
    margin: 10px auto;
}
.progress-box {
  width: 70%;
  margin: 30px auto;
}
.content-box {
  width: 80%;
  margin: 10px auto;
  border: 1px solid #ccc;
  border-radius: 10px;
  .title-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    background: rgb(233, 234, 235);
    border-radius: 10px 10px 0 0;
    span {
      color: #f56c6c;
    }
  }
  .tableList-box {
    padding: 20px;
    width: 100%;
    box-sizing: border-box;
    .table-item {
      display: flex;
      margin-bottom: 20px;
      & div:first-child {
        text-align: right;
        margin-right: 10px;
        width: 8%;
      }
      & div:last-child {
        width: 90%;
      }
    }
  }
}
.el-dialog {
  border-radius: 10px;
}
.dialog-form {
  width: 90%;
  margin: 0 auto;
}
.dialog-btn-ground {
  .el-button {
    margin-left: 10%;
    width: 100px;
  }
}
</style>