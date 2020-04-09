<template>
  <div>
    <div style="text-align:right;margin:20px;"><el-button size="small" @click="goBack">返回</el-button></div>
    <div class="title-box">
      <p>退货商品</p>
      <!-- 订单列表 -->
      <div class="table-list">
        <el-table
          border
          :data="goodDetail"
          style="width:100%"
          :header-cell-style="{background:'#DCDFE6',color:'#303133'}"
        >
          <el-table-column prop="product_img" label="商品图片">
            <template slot-scope="scope">
              <img :src="scope.row.product_img" alt="商品图片" height="80" />
            </template>
          </el-table-column>
          <el-table-column prop="product_name" label="商品名称"></el-table-column>
          <el-table-column label="价格、货号">
            <template slot-scope="scope">
              <span>价格:￥{{scope.row.product_price}}</span>
              <br />
              <span>货号:</span>
            </template>
          </el-table-column>
          <el-table-column prop="product_attr" label="属性"></el-table-column>
          <el-table-column prop="product_count" label="数量"></el-table-column>
          <el-table-column label="小计">
            <template slot-scope="scope">
              <span>￥{{((scope.row.product_count)*(scope.row.product_price))|fixedMoney}}</span>
            </template>
          </el-table-column>
        </el-table>
        <div class="total-money">
          合计：
          <span>￥{{sum|fixedMoney}}</span>
        </div>
      </div>
    </div>

    <!-- 订单详情列表 -->
    <div class="table-box">
      <table class="list-table">
        <tr>
          <th>服务单号</th>
          <td></td>
        </tr>
        <tr>
          <th>申请状态</th>
          <td>{{orderTable.order_status |orderStateFilter}}</td>
        </tr>
        <tr>
          <th>订单编号</th>
          <td>{{orderTable.order_id}}</td>
        </tr>
        <tr>
          <th>申请时间</th>
          <td>{{orderTable.create_time|dateFilter}}</td>
        </tr>
        <tr>
          <th>用户账号</th>
          <td>{{orderTable.user_name}}</td>
        </tr>
        <tr>
          <th>联系人</th>
          <td>{{orderTable.consignee}}</td>
        </tr>
        <tr>
          <th>联系电话</th>
          <td>{{orderTable.phone}}</td>
        </tr>
        <tr>
          <th>退货原因</th>
          <td>{{refundTable.reason}}</td>
        </tr>
        <tr>
          <th>问题描述</th>
          <td>{{refundTable.detail}}</td>
        </tr>
        <tr>
          <th>凭证图片</th>
          <td>
            
            <img :src="item" alt height="80" v-for="(item,index) in refundTable.goods_img" :key='index' />
          </td>
        </tr>
        <tr>
          <th>订单金额</th>
          <td>￥{{refundTable.price_info.product_total_price|fixedMoney}}</td>
        </tr>
        <tr>
          <th>确认退款金额</th>
          <td>
            <el-input v-model="inputObj.refund_fee" @keyup.native="number()" placeholder="输入退款金额" ></el-input>
          </td>
        </tr>
        <tr>
          <th>退货联系人</th>
          <td>
            <el-input v-model="inputObj.fefund_contact" placeholder="输入退货联系人"></el-input>
          </td>
        </tr>
        <tr>
          <th>退货联系人电话</th>
          <td>
            <el-input v-model="inputObj.refund_phone" placeholder="输入退货联系人电话" v-number-input maxlength="11"></el-input>
          </td>
        </tr>
        <tr>
          <th>退货地址</th>
          <td>
            <el-input v-model="inputObj.refund_addr" placeholder="输入退货地址"></el-input>
          </td>
        </tr>
        <tr>
          <th>备注</th>
          <td>
            <el-input v-model="inputObj.comment" placeholder="输入备注"></el-input>
          </td>
        </tr>
      </table>
    </div>

    <div class="btn-group">
      <el-button type="primary" @click="accepetApply(orderTable.id,'yes')">确认退货</el-button>
      <el-button type="danger" @click="accepetApply(orderTable.id,'no')">拒绝退货</el-button>
    </div>
  </div>
</template>

<script>
import orderFilter from "@/utils/changeType";
import { getOrderDetail, getOrderRefund, confirmRefund } from "@/api/order";
import { parseTime ,format_objKey} from "@/utils/methods";
export default {
  created() {
    this.fetchData();
  },
  data() {
    return {
      goodDetail: [],
      orderTable: {},
      refundTable:{},
      orderDetailObj:{},
      inputObj: {
        refund_fee: "",
        fefund_contact: "",
        refund_phone: "",
        refund_addr: "",
        comment: ""
      },
      refund_id:''
    };
  },
  computed: {
    sum() {
      var len = this.goodDetail.length;
      if (len == 0) {
        return 0;
      } else if (len == 1) {
        return this.goodDetail[0].product_price;
      } else {
        return  this.goodDetail[0].product_price + sum( this.goodDetail.slice(1));
      }
    }
  },
  filters: {
    //订单状态
    orderStateFilter(type) {
      return orderFilter._filterType(orderFilter._handleState, type);
    }
  },
  methods: {
    number(oInput){
    
      this.inputObj.refund_fee=this.inputObj.refund_fee.replace(/[^\.\d]/g,'');
    },
    goBack(){
      this.$router.go(-1)
    },
    fetchData() {
      let routerParams = this.$route.query.order_id; //获取路由传参的order_id
      let id = this.$route.query.id;
      this.refund_id=id
       getOrderDetail(routerParams).then(res => {
         if(res.data.ret==0){
           const orderObj = res.data.data;
        for (let key in orderObj) {
          orderObj[key] = orderObj[key] ? orderObj[key] : "---";
        }
         this.orderTable = orderObj;
        this.goodDetail = orderObj.product_data;
         }    
      });
       getOrderRefund({
        refund_id: id
      }).then(res => {
        this.refundTable=res.data.data[0]
      });
    },

    // 确认，拒绝退货
    accepetApply(id, word) {
      // 验证信息有无填写
      // let flag;
      // let inputObj=this.inputObj
      // for(let key in inputObj){
      //   if(inputObj[key]==""){
      //     flag=false 
      //   }else{
      //     flag=true
      //   }
      // }
      // if(!flag){
      //    this.$message({
      //       message:'请填写完退货信息',
      //       duration: 3000,
            
      //     });
      //   return
      // }
      if (!this.orderTable.id) {
        this.fetchData();
      }
      this.$nextTick(() => {
        let dataObj={
           refund_id:  this.refund_id,
          operation: word,
          ...this.inputObj
        }
        confirmRefund(format_objKey(dataObj)).then(res => {
          this.$message({
            message: res.data.msg,
            duration: 3000,
            
          });
          if (res.data.ret == "0") {
            this.fetchData();
          }
        });
      });
    }
  }
};
</script>

<style scoped lang='less'>
ul {
  list-style: none;
  display: flex;
  padding: 0;
  li {
    margin-left: 40px;
  }
}
.title-box {
  margin: 20px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
}
.table-list {
  padding: 0 20px;
}
.total-money {
  text-align: right;
  margin-top: 20px;
  span {
    color: #f56c6c;
  }
}
.table-box {
  padding-bottom: 20px;
  margin: 0 20px;
  .list-table {
    width: 100%;
    border-collapse: collapse;
    border: 1px solid #ccc;
    text-align: center;
    tr th {
      width: 20%;
      background: #dcdfe6;
      color: #303133;
      border: 1px solid #ccc;
      line-height: 50px;
    }
    tr td {
      border: 1px solid #ccc;
      text-align: left;
      padding-left: 20px;
    }
    .el-input {
      width: 30%;
    }
  }
}
.btn-group {
  text-align: center;
  margin-bottom: 20px;
  .el-button {
    margin-left: 20px;
    width: 120px;
  }
}
</style>