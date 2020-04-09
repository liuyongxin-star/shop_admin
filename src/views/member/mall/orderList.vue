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

          <el-form-item
            label="订单编号"
            prop="order_id"
          >
            <el-input
              placeholder="订单编号"
              v-model="searchForm.order_id"
               @keyup.enter.native="search"
            ></el-input>
          </el-form-item>

          <el-form-item
            label="用户ID"
            prop="user_id"
          >
            <el-input
              placeholder="用户ID"
              v-model="searchForm.user_id"
               @keyup.enter.native="search"
            ></el-input>
          </el-form-item>

          <el-form-item
            label="订单状态"
            prop="order_status"
          >
            <el-select
              placeholder="订单状态"
              v-model="searchForm.order_status"
            >
              <el-option
                value=""
                label="全部"
              ></el-option>
              <el-option
                v-for="(value, key) in $const.ORDER_STATUS"
                :label="value"
                :value="key"
                :key="key"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="search"
            >查询</el-button>
            <el-button
              type="primary"
              @click="resetForm"
            >重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <!-- 数据列表 -->
    <div class="product-list">
      <el-table
        :data="dataList"
        border
        ref="multipleTable"
        style="width:100%"
        :header-cell-style="{background:'#DCDFE6',color:'#303133'}"
      >
        <template v-for="column in tableColumn">
          <el-table-column
            :key="column.id"
            :fixed="column.fixed"
            :label="column.label"
            :prop="column.prop"
            v-if="!column.slot"
            :width="column.width"
          >
            <template slot-scope="scope">
              <span v-if="column.btn">
                <el-button
                  size="mini"
                  @click="edit(scope.row, scope.$index)"
                  v-if="scope.row.status===3||(scope.row.status===2&&scope.row.type==='2')"
                >查看</el-button>
                <el-button
                  size="mini"
                  @click="edit(scope.row, scope.$index)"
                  v-else
                >编辑</el-button>
                <el-button
                  type="primary"
                  size="mini"
                  @click="deliverGoods(scope.row, scope.$index)"
                  v-if="scope.row.status===1"
                >发货</el-button>
              </span>
              <span v-else>{{scope.row[column.prop]}}</span>
            </template>
          </el-table-column>
          <el-table-column
            :key="column.id"
            :fixed="column.fixed"
            :label="column.label"
            :prop="column.prop"
            v-else
            :width="column.width"
          >
            <template slot-scope="scope">
              <span
                class="clickitem"
                v-if="column.click"
                v-html="column.slot(scope)"
                @click.stop="column.click(scope)"
              ></span>
              <span
                v-else
                v-html="column.slot(scope)"
              ></span>
            </template>
          </el-table-column>
        </template>

      </el-table>
    </div>
    <!--发货弹窗-->
    <el-dialog
      :visible.sync="dialogFormVisible"
      width="450px"
      :close-on-click-modal="true"
      @close="handleClose"
    >
      <el-form
        :rules="rules"
        :model="deliverGoodsForm"
        label-width="150px"
        class="dialog-form"
        ref="deliverGoodsForm"
      >
        <el-form-item
          label="物流公司"
          prop="logistics_company"
        >
          <el-select
            v-model="deliverGoodsForm.logistics_company"
            class="item-select"
          >
            <el-option
              v-for="(item,index) in deliverCompany"
              :key="index"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item
          label="物流单号"
          prop="logistics_number"
        >
          <el-input
            class="item-input"
            placeholder="物流单号"
            v-model="deliverGoodsForm.logistics_number"
            @keyup.enter.native="submit"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="submit"
          >提交</el-button>
          <el-button
            type="primary"
            @click="handleClose"
          >取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--分页功能 -->
    <div class="pagination">
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="searchForm.page"
        :page-size="searchForm.limit"
        layout="total, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { getOrderList, deliverGoods } from '@/api/member'
import { parseTime, format_objKey } from '@/utils/methods'
import filter from '@/utils/changeType'
export default {
  data() {
    return {
      total: 0, //总条数
      //搜索表单
      searchForm: {
        user_id: '',
        order_id: '',
        page: 1, //页码
        limit: 10 //每页条数
      },
      //数据列表
      dataList: [],
      tableColumn: [
        {
          label: '订单编号',
          prop: 'order_id'
        },
        {
          label: '用户ID',
          prop: 'user_id'
        },
        {
          label: '用户名称',
          prop: 'user_name',
          width: 100
        },
        {
          label: '商品ID',
          prop: 'goods_id',
          width: 70
        },
        {
          label: '商品名称',
          prop: 'name',
          width: 120
        },
        {
          label: '商品类型',
          prop: 'type',
          width: 50,
          slot: scope => {
            return this.$const.PRODUCT_TYPE[scope.row.type]
          }
        },
        {
          label: '消耗积分',
          prop: 'exchange_points',
          width: 80
        },
        {
          label: '订单创建时间',
          prop: 'create_time',
          slot: scope => {
            return parseTime(scope.row.create_time, '{y}-{m}-{d} {h}:{i}:{s}')
          }
        },
        {
          label: '订单状态',
          prop: 'status',
          slot: scope => {
            return this.$const.ORDER_STATUS[scope.row.status]
          },
          width: 80
        },
        {
          label: '收货地址',
          prop: 'address',
          slot: scope => {
            return (
              scope.row.province +
              scope.row.city +
              scope.row.district +
              scope.row.detail_address
            )
          }
        },
        {
          label: '收货人',
          prop: 'consignee',
          width: 80
        },
        {
          label: '联系方式',
          prop: 'mobile'
        },
        {
          label: '操作',
          prop: 'operation',
          btn: true,
          width: '150'
        }
      ],
      dialogFormVisible: false, //弹窗
      deliverCompany: filter._deliverCompany,
      deliverGoodsForm: {
        logistics_company: '',
        logistics_number: ''
      },
      rules: {
        logistics_number: [
          { required: true, message: '请输入物流单号', trigger: 'blur' }
        ],
        logistics_company: [
          { required: true, message: '请选择物流公司', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      //获取
      let params = Object.assign({}, this.searchForm)
      if (params.order_status) {
        //获取时间
        params.status = []
        params.status.push(Number(params.order_status))
      }
      delete params.order_status
      getOrderList(format_objKey(params))
        .then(res => {
          const resp = res.data
          this.dataList = resp.data
          this.total = resp.msg.count
        })
        .catch(err => {})
    },
    //表单重置
    resetForm() {
      this.$refs.searchForm.resetFields()
      this.fetchData()
    },
    //表单查询
    search() {
      this.searchForm.page = 1
      this.fetchData()
    },
    //发货
    deliverGoods(row) {
      if (row.type === '1') {
        this.dialogFormVisible = true
        this.deliverGoodsForm._id = row._id
        this.deliverGoodsForm.status = 2
      } else if (row.type === '2') {
        this.deliverGoodsForm._id = row._id
        this.deliverGoodsForm.status = 2
        deliverGoods(format_objKey(this.deliverGoodsForm))
          .then(res => {
            if (res.data.ret === 0) {
              this.$message({
                message: '发货成功',
                type: 'success'
              })
              this.dialogFormVisible = false
              this.fetchData()
            } else {
              this.$message.error('发货失败')
              this.dialogFormVisible = false
              this.fetchData()
            }
          })
          .catch(err => {
            this.$message.error('发货失败')
            this.dialogFormVisible = false
            this.fetchData()
          })
      }
    },
    //关闭弹框
    handleClose() {
      this.$refs['deliverGoodsForm'].resetFields()
      this.dialogFormVisible = false
    },
    //发货提交
    submit() {
      this.$refs.deliverGoodsForm.validate(valid => {
        if (valid) {
          deliverGoods(format_objKey(this.deliverGoodsForm))
            .then(res => {
              if (res.data.ret === 0) {
                this.$message({
                  message: '提交成功',
                  type: 'success'
                })
                this.dialogFormVisible = false
                this.fetchData()
              } else {
                this.$message.error('提交失败')
                this.dialogFormVisible = false
                this.fetchData()
              }
            })
            .catch(err => {
              this.$message.error('提交失败')
              this.dialogFormVisible = false
              this.fetchData()
            })
        }
      })
    },
    //编辑
    edit(row) {
      this.$router.push({
        path: '/member/mall/editOrder',
        query: { id: row._id }
      })
    },
    //改变分页
    handleCurrentChange(val) {
      this.searchForm.page = val
      this.fetchData()
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
.search-button {
  text-align: center;
}
.add-btn-group {
  text-align: right;
  padding: 0 20px 20px;
}
.product-list {
  padding: 0 20px;
}
.pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  padding: 0 20px;
}
.previewImg {
  height: 50px;
  width: 50px;
}
.item-select,
.item-input {
  width: 200px;
}
</style>