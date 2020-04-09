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
            label="发票抬头"
            prop="invoice_title"
          >
            <el-input
              placeholder="发票抬头"
              v-model="searchForm.invoice_title"
              @keyup.enter.native="search"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="税号"
            prop="tax_num"
          >
            <el-input
              placeholder="税号"
              v-model="searchForm.tax_num"
               @keyup.enter.native="search"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="发票抬头类型"
            prop="invoice_title_type"
          >
            <el-select
              placeholder="发票抬头类型"
              v-model="searchForm.invoice_title_type"
            >
              <el-option
                value=""
                label="全部"
              ></el-option>
              <el-option
                v-for="(value, key) in $const.INVOICE_TYPE"
                :label="value"
                :value="key"
                :key="key"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="发票状态"
            prop="invoice_status"
          >
            <el-select
              placeholder="发票状态"
              v-model="searchForm.invoice_status"
            >
              <el-option
                value=""
                label="全部"
              ></el-option>
              <el-option
                v-for="(value, key) in $const.INVOICE_STATUS"
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
              <div v-if="column.preview&&scope.row.image">
                <el-popover
                  placement="bottom"
                  title=""
                  trigger="hover"
                >
                  <img :src="scope.row.image[0]">
                  <img
                    slot="reference"
                    :src="scope.row.image[0]"
                    :alt="scope.row.image[0]"
                    style="max-height: 50px;max-width: 130px"
                  >
                </el-popover>
              </div>
              <span v-else-if="column.btn && scope.row.status===1">
                <el-button
                  type="primary"
                  size="mini"
                  @click="pass(scope.row, scope.$index)"
                >通过</el-button>
                <el-button
                  type="danger"
                  size="mini"
                  @click="reject(scope.row, scope.$index)"
                >拒绝</el-button>
              </span>
              <span v-else-if="column.btn && scope.row.status===2">
                <el-button
                  type="primary"
                  size="mini"
                  @click="edit(scope.row, scope.$index)"
                >上传凭证等信息</el-button>
              </span>
              <span v-else-if="column.detail">
                <router-link :to="{path:'/refundMange/detail',query:{id:scope.row._id}}">发票详情</router-link>
              </span>
              <span v-else>{{scope.row[column.prop]?scope.row[column.prop]:'--'}}</span>
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
              <span v-html="column.slot(scope)"></span>
            </template>
          </el-table-column>
        </template>

      </el-table>
    </div>

    <!--分页功能 -->
    <div class="pagination">
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="searchForm.page"
        :page-size="searchForm.limit"
        layout="total, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
      <!--添加\编辑弹出框-->
      <add
        :show.sync="show"
        :modify="modify"
        :information="information"
        @success="fetchData"
        @close="closeAdd"
      />
    </div>
  </div>
</template>

<script>
import { searchInvoice, updateInvoice } from '@/api/invoice'
import { parseTime, format_objKey } from '@/utils/methods'
import filter from '@/utils/changeType'
import add from './component/add'
export default {
  components: {
    add
  },
  data() {
    return {
      total: 0, //总条数
      //搜索表单
      searchForm: {
        page: 1, //页码
        limit: 10, //每页条数
        invoice_title: ''
      },
      //数据列表
      dataList: [],
      tableColumn: [
        {
          label: '发票抬头',
          prop: 'invoice_title'
        },
        {
          label: '税号',
          prop: 'tax_num'
        },
        {
          label: '单位地址',
          prop: 'address'
        },

        {
          label: '发票抬头类型',
          prop: 'invoice_title_type'
        },
        {
          label: '发票类型',
          prop: 'invoice_type'
        },
        {
          label: '开户银行',
          prop: 'bank_name'
        },
        {
          label: '银行账户',
          prop: 'bank_account'
        },
        {
          label: '用户ID',
          prop: 'user_id'
        },
        {
          label: '用户昵称',
          prop: 'user_name'
        },
        {
          label: '联系电话',
          prop: 'mobile'
        },
        {
          label: '详情',
          prop: 'detail',
          detail: true
        },
        {
          label: '发票金额',
          prop: 'invoice_amount',
          slot: scope => {
            return this.filters.fixedMoney(scope.row.invoice_amount)
          }
        },
        {
          label: '发票状态',
          prop: 'status',
          slot: scope => {
            return this.$const.INVOICE_STATUS[scope.row.status]
          },
          width: 80
        },
        {
          label: '操作',
          prop: 'operation',
          btn: true,
          width: '150'
        },
        {
          label: '发票代码',
          prop: 'invoice_code'
        },
        {
          label: '发票号码',
          prop: 'invoice_number'
        },
        {
          label: '上传凭证',
          prop: 'image',
          preview: true,
          width: 100
        },
        {
          label: '寄票快递单号',
          prop: 'logistics_number'
        },
        {
          label: '快递费用',
          prop: 'logistics_cost'
        }
      ],
      form: {},
      information: {}, //原信息
      show: false, //控制展示
      modify: false
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      //获取
      let params = Object.assign({}, this.searchForm)
      if (params.invoice_status) {
        params.status = []
        params.status.push(Number(params.invoice_status))
      }
      searchInvoice(format_objKey(params))
        .then(res => {
          const resp = res.data
          this.dataList = resp.data
          console.log(this.dataList)
          this.total = resp.msg.count
        })
        .catch(err => {})
    },
    //表单重置
    resetForm() {
      this.$refs['searchForm'].resetFields()
      this.fetchData()
    },
    //表单查询
    search() {
      this.searchForm.page = 1
      this.fetchData()
    },
    //通过
    pass(row) {
      this.$confirm('确定通过此发票申请?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let data = {
            _id: row._id,
            status: 2
          }
          updateInvoice(data)
            .then(res => {
              if (res.data.ret === 0) {
                this.$message({
                  message: '已通过',
                  type: 'success'
                })
                this.fetchData()
              } else {
                this.$message.error('通过失败')
                this.fetchData()
              }
            })
            .catch(err => {
              this.$message.error('通过失败')
              this.fetchData()
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },
    //拒绝
    reject(row) {
      this.$confirm('确定拒绝通过此发票申请?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let data = {
            _id: row._id,
            status: 0
          }
          updateInvoice(data)
            .then(res => {
              if (res.data.ret === 0) {
                this.$message({
                  message: '已拒绝',
                  type: 'success'
                })
                this.fetchData()
              } else {
                this.$message.error('拒绝失败')
                this.fetchData()
              }
            })
            .catch(err => {
              this.$message.error('拒绝失败')
              this.fetchData()
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },
    //上传凭证暂时做成都按编辑状态
    //上传凭证等信息
    // submit() {
    //   this.modify = false
    //   this.show = true
    // },
    //编辑凭证
    edit(row, index) {
      this.show = true
      this.modify = true
      this.information = row
    },
    //关闭弹出框
    closeAdd() {
      this.show = false
      this.information = {}
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