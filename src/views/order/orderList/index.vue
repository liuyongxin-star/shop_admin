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
              :md="6"
            >
              <el-form-item
                label="订单编号"
                prop="order_id"
              >
                <el-input
                  placeholder="订单编号"
                  v-model="searchForm.order_id"
                  @keyup.enter.native='fetchDate'
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col
              :span="5"
              :md="6"
            >
              <el-form-item
                label="收货人"
                prop="consignee"
              >
                <el-input
                  placeholder="收货人姓名/手机号"
                  v-model="searchForm.consignee"
                    @keyup.enter.native='fetchDate'
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col
              :span="6"
              :md="10"
            >
              <el-form-item
                label="订单提交时间段"
                prop="create_time"
                label-width="110px"
              >
                <el-date-picker
                  v-model="time_range"
                  type="datetimerange"
                  value-format="timestamp"
                  :default-time="['00:00:00', '23:59:59']"
                  :picker-options="pickerOptions"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                ></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row
            :gutter="20"
            align="middle"
          >
            <el-col
              :span="5"
              :md="6"
            >
              <el-form-item
                label="订单状态"
                prop="order_status"
              >
                <el-select
                  placeholder="订单状态"
                  v-model="searchForm.order_status"
                >
                  <el-option
                    :label="item.name"
                    :value="item.type"
                    v-for="item in orderState"
                    :key="item.type"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col
              :span="5"
              :md="6"
            >
              <el-form-item
                label="订单分类"
                prop="order_type"
              >
                <el-select
                  placeholder="订单分类"
                  v-model="searchForm.order_type"
                >
                  <el-option
                    :label="item.name"
                    :value="item.type"
                    v-for="item in orderType"
                    :key="item.type"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col
              :span="6"
              :md="9"
              class="search-button"
            >
              <el-form-item>
                <div>
                  <el-button @click="resetForm('searchForm')">重置</el-button>
                  <el-button
                    type="primary"
                    @click="searchOrder"
                  >查询</el-button>
                  <el-button
                    type="primary"
                    @click="exportRangeData"
                  >导出时间段表格</el-button>
                  <el-button
                    type="primary"
                    @click="exportSortData"
                  >分供应商导出表格</el-button>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
    <div class="operator-box">
      <!-- 批量操作 -->
      <el-form
        ref="operatorForm"
        :model="operatorForm"
        :inline="true"
      >
        <el-form-item>
          <el-select
            v-model="operatorForm.operate"
            placeholder="批量操作"
          >
            <el-option
              label="批量发货"
              value="1"
            ></el-option>
            <el-option
              label="关闭订单"
              value="2"
            ></el-option>
            <el-option
              label="删除订单"
              value="3"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="submitOperator"
          >确定</el-button>
        </el-form-item>
      </el-form>
      <el-button
        type="primary"
        size="small"
        @click="exportAsExcel"
        class="export-btn"
      >导出表格</el-button>
    </div>
    <div class="order-list">
      <el-table
        :data="orderList"
        id="orderTable"
        border
        @selection-change="handleSelectionChange"
        style="width:100%"
        :header-cell-style="{background:'#DCDFE6',color:'#303133'}"
      >
        <el-table-column type="selection"></el-table-column>
        <el-table-column
          type="index"
          label="编号"
          width="50"
        ></el-table-column>
        <el-table-column
          prop="order_id"
          label="订单编号"
          sortable
        ></el-table-column>
        <el-table-column
          prop="create_time"
          label="订单提交时间"
          sortable
        >
          <template slot-scope="scope">{{scope.row.create_time|dateFilter}}</template>
        </el-table-column>
        <el-table-column
          prop="user_name"
          label="用户账号"
          sortable
        ></el-table-column>
        <el-table-column
          prop="user_pay_price"
          label="订单金额"
          sortable
        >
          <template slot-scope="scope">
            <span>￥{{scope.row.price_info.product_total_price|fixedMoney}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="order_type"
          label="订单类型"
          sortable
        >
          <template slot-scope="scope">
            <span>{{scope.row.order_type|orderTypeFilter}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop='pay_manner'
          label="支付方式"
          sortable
        >
          <template slot-scope="scope">
            <span>{{scope.row.pay_manner?scope.row.pay_manner:'微信支付'}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="store_name"
          label="供应商"
          sortable
        ></el-table-column>
        <el-table-column
          prop="order_status"
          label="订单状态"
          sortable
        >
          <template slot-scope="scope">
            <span>{{scope.row.order_status|orderStateFilter}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="200"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="showOrder(scope.row.order_id)"
            >查看订单</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="deliverOrder(scope.row.order_id)"
              v-if="scope.row.order_status==3"
            >订单发货</el-button>
            <!-- <el-button size="mini" type="primary" @click="removeOrder(scope.row.id)">删除订单</el-button> -->
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="bottom-box">
      <!--分页功能 -->
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="searchForm.page"
        :page-size="searchForm.limit"
        layout="total, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>

    <!-- 时间段表格 -->
    <el-dialog
      title="导出时间段表格"
      :visible.sync="exportDialogShow"
      width="95%"
    >
      <div
        slot="title"
        class="dialog-title"
      >
        <p>导出时间段表格</p>
        <el-button
          type="primary"
          @click="exportConfirm"
        >导出</el-button>
      </div>
      <div class="dialogBody">
        <el-table
          :data="exportList"
          id="exportTable"
          row-key="id"
          default-expand-all
          style="width:100%"
          :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
          :header-cell-style="{background:'#DCDFE6',color:'#303133'}"
        >
          <el-table-column
            type="index"
            label="编号"
            width="50"
          ></el-table-column>
          <el-table-column
            prop="order_id"
            label="订单编号"
            sortable
          ></el-table-column>
          <el-table-column
            prop="product_name"
            label="商品名称"
            sortable
          ></el-table-column>
          <el-table-column
            prop="product_attr"
            label="型号"
            sortable
          ></el-table-column>
          <el-table-column
            prop="spu_no"
            label="货号"
            sortable
          ></el-table-column>
          <el-table-column
            prop="product_count"
            label="数量"
            sortable
          ></el-table-column>
          <el-table-column
            prop="purchase_price"
            label="单价/元"
            sortable
          >
            <template slot-scope="scope">
              <span>{{scope.row.purchase_price|fixedMoney}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="subtotal_price"
            label="小计/元"
            sortable
           >
            <template slot-scope="scope" v-if='scope.row.product_count'>
              <span>{{(scope.row.product_count*(scope.row.purchase_price|fixedMoney))|fixedMoney}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="store_name"
            label="供应商"
            sortable
          ></el-table-column>
          <el-table-column
            prop="user_name"
            label="客户姓名"
            sortable
          ></el-table-column>
          <el-table-column
            prop="mobile"
            label="客户电话"
            sortable
          ></el-table-column>
          <el-table-column
            prop="address"
            label="收货地址"
            sortable
          ></el-table-column>
          <el-table-column
            prop
            label="物流公司"
            sortable
          ></el-table-column>
          <el-table-column
            prop
            label="物流单号"
            sortable
          ></el-table-column>
          <el-table-column
            prop
            label="备注"
            sortable
          ></el-table-column>
        </el-table>
      </div>
    </el-dialog>

    <!-- 分供应商表格 -->
    <el-dialog
      title="分供应商表格"
      :visible.sync="sortDialogShow"
      width="95%"
    >
      <div
        slot="title"
        class="dialog-title"
      >
        <p>分供应商表格</p>
        <el-button
          type="primary"
          @click.stop="exportSortConfirm"
        >导出</el-button>
      </div>
      <div class="dialogBody">
        <el-table
          v-for="(item,index) in sotrList"
          :key="index"
          :data="item.allData"
          :id="'sortTable'+index"
          row-key="id"
          default-expand-all
          :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
          style="width:100%"
          :header-cell-style="{background:'#DCDFE6',color:'#303133'}"
        >
          <el-table-column
            type="index"
            label="编号"
            width="50"
          ></el-table-column>
          <el-table-column
            prop="order_id"
            label="订单编号"
            sortable
          ></el-table-column>
          <el-table-column
            prop="product_name"
            label="商品名称"
            sortable
          ></el-table-column>
          <el-table-column
            prop="product_attr"
            label="型号"
            sortable
          ></el-table-column>
          <el-table-column
            prop="spu_no"
            label="货号"
            sortable
          ></el-table-column>
          <el-table-column
            prop="product_count"
            label="数量"
            sortable
          ></el-table-column>
          <el-table-column
            prop="purchase_price"
            label="单价/元"
            sortable
          >
            <template slot-scope="scope">
              <span>{{scope.row.purchase_price|fixedMoney}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="subtotal_price"
            label="小计/元"
            sortable
           >
            <template slot-scope="scope" v-if='scope.row.product_count'>
              <span>{{(scope.row.product_count*(scope.row.purchase_price|fixedMoney))|fixedMoney}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="store_name"
            label="供应商"
            sortable
          ></el-table-column>
          <el-table-column
            prop="user_name"
            label="客户姓名"
            sortable
          ></el-table-column>
          <el-table-column
            prop="mobile"
            label="客户电话"
            sortable
          ></el-table-column>
          <el-table-column
            prop="address"
            label="收货地址"
            sortable
          ></el-table-column>
          <el-table-column
            prop
            label="物流公司"
            sortable
          ></el-table-column>
          <el-table-column
            prop
            label="物流单号"
            sortable
          ></el-table-column>
          <el-table-column
            prop
            label="备注"
            sortable
          ></el-table-column>
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import orderFilter from '@/utils/changeType'
import {
  parseTime,
  format_objKey,
  exportExcel,
  addFileToZip,
  dealWithData
} from '@/utils/methods'
import { searchOrder } from '@/api/order'
import FileSaver from 'file-saver'
import JSZip from 'jszip'
export default {
  created() {
    this.fetchDate()
  },
  data() {
    return {
      maxDate: '',
      total: 100,
      time_range: '',
      exportDialogShow: false,
      exportList: [], //时间段导出
      sortDialogShow: false,
      sotrList: [], //分供应商导出  随机维数 数组
      //搜索
      searchForm: {
        order_id: '',
        consignee: '',
        // create_time: "",
        order_status: '',
        order_type: '',
        page: 1, //当前显示页
        limit: 10 //每页数量
      },
      orderState: orderFilter._orderState, //订单状态
      orderType: orderFilter._orderType, //订单类型
      orderList: [],
      selectArr: [],
      operatorForm: {
        operate: ''
      },
      pickerOptions: {
        //时间限制 不能超过今天
        disabledDate(time) {
          let curDate = new Date().getTime()
          let year = 365 * 24 * 3600 * 1000
          return time.getTime() > Date.now()
        }
      }
    }
  },
  methods: {
    //获取查询数据
    fetchDate() {
      let searchObj = {
        start_time: this.time_range[0],
        stop_time: this.time_range[1],
        is_inquire_all:false,
        ...this.searchForm
      }
      searchOrder(format_objKey(searchObj)).then(res => {
        const resp = res.data
        this.orderList = resp.data
        // this.total = resp.data.count
      })
    },
    //格式化获取数据
    formateData(resp) {
      // ---给父子增加id字段
      for (let i = 0; i < resp.length; i++) {
        resp[i].id = i
        let product_list = resp[i].children

        // ---给父级增加第一个商品数据
        resp[i] = { ...resp[i], ...product_list[0] }

        product_list.shift() //children删除父级的第一个元素
        product_list.push({}) //添加表格空行
        for (let j = 0; j < product_list.length; j++) {
          //子对象添加id
          product_list[j].id = (i + 1) * Math.random() + j
        }
      }
    },
    //打开时间段表格
    exportRangeData() {
      if(this.time_range.length==0||this.time_range.length==1){
        this.$message({
          message:'请选择订单提交时间段！'
        })
        return
      }
      this.exportDialogShow = true
      let searchObj = {
        start_time: this.time_range[0],
        stop_time: this.time_range[1],
        is_inquire_all:true,
        ...this.searchForm
      }
      searchOrder(format_objKey(searchObj)).then(res => {
        const resp = res.data.data.return_list
        this.formateData(resp)
        this.exportList = resp
      })
    },
    //打开分供应商表格
    exportSortData() {
       if(this.time_range.length==0||this.time_range.length==1){
        this.$message({
          message:'请选择订单提交时间段！'
        })
        return
      }
     
      let searchObj = {
        start_time: this.time_range[0],
        stop_time: this.time_range[1],
          is_inquire_all:true,
        ...this.searchForm
      }
      searchOrder(format_objKey(searchObj)).then(res => {
        if(res.data.data.return_list.length==0){
          this.$message({
            message:'该时间段暂无相关数据！'
          })
          return
        }
         this.sortDialogShow = true
        let sotrList = dealWithData(res.data.data.return_list) //分供应商数组  [[],[]...]
        for (let z = 0; z < sotrList.length; z++) {
          let resp = sotrList[z].allData
          this.formateData(resp)
        }
        this.sotrList = sotrList
      
       
      })
    },
    // 导出时间段表格
    exportConfirm() {
      exportExcel('#exportTable')
      this.$nextTick(() => {
        this.exportDialogShow = false
      })
    },
    //导出分供应商多表格
    exportSortConfirm() {
      let zipFiles = [] //zip包的文件数据
      for (let i = 0; i < this.sotrList.length; i++) {
        let id = '#sortTable' + i
        let fileName = this.sotrList[i].store_name
        zipFiles.push({
          xlsxName: fileName,
          contentData: exportExcel(id, fileName, true)
        })
      }

      //添加文件数据并打包为zip
      const zip = new JSZip()
      zipFiles.forEach(item => {
        zip.file(item.xlsxName + '.xlsx', item.contentData)
      })
      // 异步生成压缩文件
      zip.generateAsync({ type: 'blob' }).then(function(content) {
        // 保存到本地
        FileSaver.saveAs(content, '分供应商数据表格.zip')
      })
      this.$nextTick(() => {
        this.sortDialogShow = false
      })
    },
    //表单重置
    resetForm(formName) {
      this.time_range = ''
      this.$refs[formName].resetFields()
      this.fetchDate()
    },
    //表单查询
    searchOrder() {
      this.searchForm.page = 1
      this.fetchDate()
    },
    //表格选择
    handleSelectionChange(val) {
      this.selectArr = val
    },
    //查看订单详情
    showOrder(order_id) {
      this.$router.push({
        path: '/order/orderDetail',
        query: {
          order_id
        }
      })
    },
    //订单发货
    deliverOrder(id) {
      let selectArr = [id]
      localStorage.setItem('oneItem', selectArr)
      this.$router.push({
        path: '/order/orderGoods',
        query: {
          selectArr
        }
      })
    },
    //改变分页
    handleCurrentChange(val) {
      this.searchForm.page = val
      this.fetchDate()
    },
    //批量操作
    submitOperator() {
      if (this.operatorForm.operate == '1') {
        //批量发货
        this.$router.push({
          path: '/order/orderGoods',
          query: {
            selectArr: JSON.stringify(this.selectArr)
          }
        })
      }
    },
    //导出表格
    exportAsExcel() {
      exportExcel('#orderTable')
    }
  },
  filters: {
    //订单类型
    orderTypeFilter(type) {
      return orderFilter._filterType(orderFilter._orderType, type)
    },
  
    //订单状态
    orderStateFilter(type) {
      return orderFilter._filterType(orderFilter._orderState, type)
    },
    //时间格式化
    dateFilter(type) {
      return parseTime(type)
    }
  }
}
</script>

<style scoped>
.dialog-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  /* padding-right: 50px; */
  margin-top: 20px;
}
.dialogBody {
  height: 50%;
  overflow: auto;
}
.export-btn {
  /* float:right; */
  margin-bottom: 20px;
  margin-right: 24px;
}
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
  text-align: right;
  padding-right: 76px !important;
}
.order-list {
  padding: 0 20px;
}
.bottom-box {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 20px;
  padding: 0 20px;
}
.table-header {
  background: red;
}
.operator-box {
  display: flex;
  justify-content: flex-end;
}
</style>