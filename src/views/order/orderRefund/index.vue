<template>
  <div>
    <!-- 查询框 -->
    <div class="searchBox">
      <div class="title">查询筛选</div>
      <div>
        <el-form
          :model="searchForm"
          :inline="true"
          ref="searchForm"
          label-width="100px"
          size="mini"
        >
          <el-row
            :gutter="20"
            align="middle"
          >
            <el-col
              :span="5"
              :md="8"
            >
              <el-form-item
                label="订单编号"
                prop="order_id"
              >
                <el-input
                  placeholder="订单编号"
                  v-model="searchForm.order_id"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col
              :span="5"
              :md="8"
            >
              <el-form-item
                label="操作人"
                prop="operator"
              >
                <el-input
                  placeholder="操作人员姓名"
                  v-model="searchForm.operator"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col
              :span="5"
              :md="8"
            >
              <el-form-item
                label="处理状态"
                prop="order_status"
              >
                <el-select
                  placeholder="处理状态"
                  v-model="searchForm.order_status"
                >
                  <el-option
                    v-for="item in handleState"
                    :key='item.type'
                    :label="item.name"
                    :value="item.type"
                  ></el-option>

                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row
            :gutter="20"
            align="middle"
          >
            <el-col
              :span="5"
              :md="8"
            >
              <el-form-item
                label="申请时间"
                prop="applyDate"
              >
                <el-date-picker
                  type="date"
                  placeholder="请选择时间"
                  style="width: 100%;"
                  value-format="timestamp"
                  v-model="searchForm.applyDate"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col
              :span="5"
              :md="8"
            >
              <el-form-item
                label="处理时间"
                prop="handleDate"
              >
                <el-date-picker
                  type="date"
                  placeholder="请选择时间"
                  style="width: 100%;"
                  value-format="timestamp"
                  v-model="searchForm.handleDate"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col
              :span="5"
              :md="8"
              class="search-button"
            >
              <el-form-item>
                <el-button @click="resetForm('searchForm')">重置</el-button>
                <el-button
                  type="primary"
                  @click="searchOrder"
                >查询</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
    <!-- 数据列表 -->
    <div class="order-list">
      <el-table
        :data="orderList"
        border
        style="width:100%"
        :page-size="limit"
        :header-cell-style="{background:'#DCDFE6',color:'#303133'}"
      >
        <el-table-column
          type="index"
          label="编号"
          width="50"
        ></el-table-column>
        <el-table-column
          prop=""
          label="服务单号"
        ></el-table-column>
        <el-table-column
          prop="create_time"
          label="申请时间"
        >
          <template slot-scope="scope">
            <span>{{scope.row.create_time|dateFilter}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop=""
          label="操作人员账号"
        >---</el-table-column>
        <el-table-column
          prop="order_id"
          label="订单编号"
        ></el-table-column>
        <el-table-column
          prop="refund_fee"
          label="订单金额"
        >
          <template slot-scope="scope">
            <span>￥{{scope.row.price_info.product_total_price |fixedMoney}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="order_status"
          label="申请状态"
        >
          <template slot-scope="scope">
            <span>{{scope.row.order_status|orderTypeFilter}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="log"
          label="处理时间"
        >
          <template slot-scope="scope">
            <span>{{scope.row.log[scope.row.log.length-1].create_time|dateFilter}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="reason"
          label="退货原因 "
        ></el-table-column>

        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="showOrder(scope.row.order_id,scope.row.id)"
            >查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 批量操作 -->
    <div class="bottom-box">
      <!--分页功能 -->
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="10"
        layout="total, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import orderFilter from '@/utils/changeType'
import { getOrderRefund } from '@/api/order'
import { parseTime, format_objKey } from '@/utils/methods'
export default {
  data() {
    return {
      searchForm: {
        order_id: '', //订单编号
        operator: '', //操作人
        order_status: '', //处理状态
        applyDate: '', //申请时间
        handleDate: '' //处理时间
      },

      handleState: orderFilter._handleState,
      orderList: [], //列表数据
      currentPage: 1,
      limit: 10,
      total: 100
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    //表单重置
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.fetchData()
    },
    //表单查询
    searchOrder() {
      this.searchForm.page = 1
      let searchObj = format_objKey(this.searchForm)
      getOrderRefund(searchObj).then(res => {
        this.orderList = res.data.data
      })
    },

    //查看详情
    showOrder(order_id, id) {
      let params = {
        order_id,
        id
      }
      localStorage.setItem('refundItem', params)
      this.$router.push({
        path: '/order/orderRefundDetail',
        query: params
      })
    },
    //改变分页
    handleCurrentChange() {},
    //批量操作
    submitOperator() {},
    //加载列表数据
    fetchData() {
      getOrderRefund().then(res => {
        this.orderList = res.data.data
        this.total = res.data.data.length
      })
    }
  },
  filters: {
    //申请状态
    orderTypeFilter(type) {
      return orderFilter._filterType(orderFilter._handleState, type)
    }
  }
}
</script>

<style scoped>
.el-input {
  width: 200px;
}

.searchBox {
  border-radius: 10px;
  padding: 20px;
  border: 1px solid #ccc;
  margin: 20px;
}
.title {
  margin-bottom: 10px;
}
.search-button {
  text-align: center;
}
.order-list {
  padding: 0 20px;
}
.bottom-box {
  display: flex;
  justify-content: flex-end;

  margin-top: 20px;
  padding: 0 20px;
}
.table-header {
  background: red;
}
</style>