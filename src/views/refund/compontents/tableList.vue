<template>
  <div>
    <el-table :data="dataList">
      <el-table-column label="退款编号" prop='refund_id' sortable></el-table-column>
      <el-table-column label="订单编号" prop='order_id' sortable></el-table-column>
      <el-table-column label="商品名称" prop='product_name' sortable></el-table-column>
      <el-table-column label="发货状态" prop='order_send_stauts' sortable></el-table-column>
      <el-table-column label="商品价格(元)" prop='user_pay_price' sortable>
          <template slot-scope='scope'>
             <span>{{scope.row.user_pay_price|fixedMoney}}</span>
          </template>
      </el-table-column>
      <el-table-column label="退款金额(元)" prop='refund_price' sortable>
          <template slot-scope="scope">
             <span>{{scope.row.refund_price|fixedMoney}}</span>
          </template>
      </el-table-column>
      <el-table-column label="退款方式" prop='request_type' sortable></el-table-column>
      <el-table-column label="申请时间" prop='create_time' sortable>
          <template slot-scope="scope">
              <span>{{scope.row.create_time|dateFilter}}</span>
          </template>
      </el-table-column>
      <el-table-column label="超时时间" prop='time_out' sortable>
          <template slot-scope="scope">
             <span>{{scope.row.time_out|dateFilter}}</span>
          </template>
      </el-table-column>
      <el-table-column label="退款状态" prop='order_status' sortable>
          <template slot-scope="scope">
              <span>{{scope.row.order_status|refundStatusFilter}}</span>
          </template>
      </el-table-column>
      <el-table-column label="操作">
          <template slot-scope="scope">
             <el-link type='primary' @click="goRefundDetail(scope.row.refund_id,scope.row.order_status)">查看详情</el-link>
          </template>
      </el-table-column>
      <!-- <el-table-column label="备注">
        <span>例子：已补发该用户商品***,快递单号***</span>
      </el-table-column> -->
    </el-table>
    
   
  </div>
</template>

<script>
 import filters from '@/utils/changeType'
// import { getRefundDetail } from "@/api/refund";
export default {
  created() {
   
  },
  data() {
    return {
      refundList: [],
    
    };
  },
  filters:{
       refundStatusFilter(type) {
      return filters._filterType(filters._refundStatus, type);
    }
  },
  props: {
      dataList:Array,
      type:String, //传递的index值
  },
  methods: {
    goRefundDetail(refund_id,order_status){
      this.$router.push({
        path:'refundDetail',
        query:{
          refund_id,
          order_status
        }
      })
    }
  }
};
</script>

<style scoped>

</style>