<template>
  <section>
    <div class="container">
      <h4>退款/售后</h4>
      <div class="search-box">
        <el-form
          :inline="true"
          :model="searchForm"
        >
          <el-form-item label="订单编号">
            <el-input
              v-model="searchForm.order_id"
               @keyup.enter.native="search"
              placeholder="输入订单号"
              v-number-input
            ></el-input>
          </el-form-item>
          <el-form-item label="商品名称">
            <el-input
              v-model="searchForm.product_name"
                @keyup.enter.native="search"
              placeholder="输入商品名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="买家手机号码">
            <el-input
              v-model="searchForm.mobile"
              placeholder="输入买家手机号码"
                @keyup.enter.native="search"
              maxlength="11"
              v-number-input
            ></el-input>
          </el-form-item>
        </el-form>
        <el-form
          :inline="true"
          :model="searchForm"
          style="display:flex;align-item:center"
        >
          <el-form-item label="申请时间">
            <el-date-picker
              v-model="search_time_array"
              type="datetimerange"
              :picker-options="pickerOptions"
              :default-time="['00:00:00', '23:59:59']"
              value-format="timestamp"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              align="right"
            ></el-date-picker>
          </el-form-item>
        </el-form>
        <el-form :inline="true">
          <el-form-item label="退款编号">
            <el-input
              v-model="searchForm.refund_id"
                @keyup.enter.native="search"
              placeholder="输入退款编号"
              v-number-input
            ></el-input>
          </el-form-item>
          <!-- <el-form-item label="退款类型">
          <el-select v-model="searchForm.orderType" placeholder="请选择退款类型">  
            <el-option v-for='item in refundFilter.refundType' :key='item.type' :value="item.name"></el-option>
          </el-select>
        </el-form-item> -->
          <el-form-item label="退款方式">
            <el-select
              v-model="searchForm.request_type"
              placeholder="请选择退款方式"
            >
              <el-option
                v-for='item in refundFilter.refundWay'
                :key='item.type'
                :value="item.name"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <el-form :inline="true">
          <el-form-item label="退款状态">
            <el-select
              v-model="searchForm.order_status"
              placeholder="请选择退款状态"
            >
              <el-option
                v-for='item in refundFilter.refundStatus'
                :key='item.type'
                :value="item.type"
                :label="item.name"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="发货状态">
            <el-select
              v-model="searchForm.order_send_stauts"
              placeholder="请选择发货状态"
            >
              <el-option
                v-for='item in refundFilter.deliveryStatus'
                :key='item.type'
                :value="item.name"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="运单编号">
            <el-input
              placeholder="请输入运单编号"
              v-model="searchForm.order_logistics_number "
                @keyup.enter.native="search"
              v-number-input
            ></el-input>
          </el-form-item>
        </el-form>
        <div class="search-btn-box">
          <el-button
            size="medium"
            type="primary"
            class="btn-confirm"
            @click="search"
          >查询</el-button>
          <el-button
            size="medium"
            class="btn-confirm"
            @click="resetSearch"
          >清空</el-button>
        </div>
      </div>
      <!-- 导航栏切换 -->
      <div class="product-list-box">
        <el-tabs
          v-model="activeName"
          type="card"
          @tab-click='navClick'
        >
          <el-tab-pane
            v-for="item in refundFilter.refundNav"
            :key="item.type"
            :label="item.name"
          >
            <my-table
              :type='item.type'
              :dataList='refundList'
            ></my-table>
          </el-tab-pane>
        </el-tabs>
        <!-- 导航栏切换 end -->
        <div class="bottom-box">
          <el-pagination
            @current-change="handleCurrentChange"
            :current-page="searchForm.page"
            :page-size="searchForm.limit"
            layout="total, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { getRefundList } from '@/api/refund'
import { format_objKey } from '@/utils/methods'
import myTable from '@/views/refund/compontents/tableList.vue'
import filters from '@/utils/changeType'
export default {
  created() {
    this.fetchData()
  },
  components: {
    myTable
  },
  data() {
    return {
      activeName: '',
      refundList: [],
      search_time_array: [], //时间选择
      refundFilter: {
        //状态过滤对象
        refundType: filters._refundType, //退款类型
        refundWay: filters._refundWay, //退款方式
        refundStatus: filters._refundStatus, //退款状态
        deliveryStatus: filters._deliveryStatus, //发货状态
        refundNav: filters._refundNav //列表标题
      },
      pickerOptions: {
        disabledDate(time) {
          //限制不能超过今天
          let curDate = new Date().getTime()
          let year = 365 * 24 * 3600 * 1000
          // let threeMonths = curDate - year;
          // return time.getTime() > Date.now() || time.getTime() < threeMonths;;
          return time.getTime() > Date.now()
        },
        shortcuts: [
          {
            text: '最近7天',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近30天',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近90天',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      },
      //搜索对象
      searchForm: {
        order_id: '',
        product_name: '',
        mobile: '',
        refund_id: '',
        request_type: '',
        order_status: [],
        order_send_stauts: '',
        order_logistics_number: '',
        page: 1,
        limit: 10
      },
      total: 0
    }
  },
  methods: {
    //加载数据列表
    fetchData(navIndex = 0) {
      let searchObj = Object.assign({}, this.searchForm)
      // 设置退款方式 全部
      if (searchObj['request_type'] == '全部') {
        searchObj['request_type'] = ''
      }
      // 设置发货状态 全部
      if (searchObj['order_send_stauts'] == '全部') {
        searchObj['order_send_stauts'] = ''
      }
      //转换order_status为数组
      if (searchObj['order_status']) {
        searchObj['order_status'] = [searchObj['order_status']]
      } else {
        searchObj['order_status'] = ''
      }
      // tab栏切换请求
      if (navIndex == 1) {
        searchObj['order_status'] = ['8', '10']
      } else if (navIndex == 2) {
        searchObj['order_status'] = ['9']
      }
      //获取开始时间和结束时间
      if (this.search_time_array.length > 0) {
        ;(searchObj['start_time'] = this.search_time_array[0]),
          (searchObj['stop_time'] = this.search_time_array[1])
      }

      getRefundList(format_objKey(searchObj)).then(res => {
        const resp = res.data
        this.refundList = resp.data ? resp.data.return_list : []
        this.total = resp.data ? resp.data.count : 0
      })
    },
    //分页改变
    handleCurrentChange(val) {
      this.searchForm.page = val
      this.fetchData()
    },
    // 查询
    search() {
      this.searchForm.page = 1
      this.fetchData()
    },
    //标题选择
    navClick(e) {
      this.fetchData(e.index)
    },
    //清空 重置
    resetSearch() {
      this.searchForm = {
        order_id: '',
        goodName: '',
        mobile: '',
        number: '',
        orderType: '',
        refundWay: '',
        refundStatus: '',
        deliveryStatus: '',
        wayBillNo: '',
        page: 1,
        limit: 10
      }
      this.search_time_array = []
      this.fetchData()
    }
  }
}
</script>

<style scoped>
.container {
  margin: 20px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
h4 {
  margin-bottom: 10px;
}
.bottom-box {
  text-align: right;
  margin: 20px 0;
}
.search-box {
  border-radius: 10px;
  padding: 20px 40px 0;
  box-sizing: border-box;
  border: 1px solid #ccc;
  padding: 20px 40px;
}
.product-list-box {
  padding: 20px 30px;
}

.btn-confirm {
  width: 100px;
  margin-left: 20px;
}
.search-btn-box {
  text-align: right;
}
</style>
<style lang="less">
.product-list-box {
  .el-tabs--card > .el-tabs__header .el-tabs__nav {
    border: none;
  }
  .el-tabs--card > .el-tabs__header .el-tabs__item:first-child {
    border-left: 1px solid #e4e7ed;
  }
  .el-tabs--card > .el-tabs__header {
    border-bottom: none;
  }
  .el-tabs--card > .el-tabs__header .el-tabs__item {
    border: 1px solid #e4e7ed;
    border-right: 1px solid transparent;
    &:last-of-type {
      border-right: 1px solid #e4e7ed;
    }
  }
  .el-tabs--card > .el-tabs__header .el-tabs__item[aria-selected] {
    border-right: 1px solid #409eff;
    border-color: #409eff;
  }
}

.search-box {
  .el-input__inner {
    height: 35px;
    line-height: 35px;
  }
  .el-input__icon {
    line-height: 30px;
  }
  .el-form--inline .el-form-item__label {
    margin-right: 10px;
  }
  .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    width: 390px;
  }
  // ---单选
  .el-radio-group {
    margin-left: 15px;
  }
  .el-radio-button__inner {
    padding: 8px 15px;
  }
}
</style>