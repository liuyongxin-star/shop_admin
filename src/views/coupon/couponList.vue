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
                label="优惠券名称"
                prop="coupon_name"
              >
                <el-input
                  placeholder="优惠券名称"
                  v-model="searchForm.name"
                  @keyup.enter.native="searchCoupon"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col
              :span="5"
              :md="8"
            >
              <el-form-item
                label="优惠券类型"
                prop="coupon_type"
              >
                <el-select
                  placeholder="优惠券类型"
                  v-model="searchForm.allow_member"
                >
                  <el-option
                    value=""
                    label="全部"
                  ></el-option>
                  <el-option
                    v-for="(value, key) in $const.COUPON_TYPE"
                    :label="value"
                    :value="key"
                    :key="key"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col
              :span="5"
              :md="8"
              class="search-button"
            >
              <el-form-item>
                <el-button
                  type="primary"
                  @click="searchCoupon"
                >查询</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
    <!-- 新增优惠券 -->
    <div class="add-btn-group">
      <el-button
        type="primary"
        size="small"
        @click="addCoupon"
      >新增优惠券</el-button>
    </div>
    <!-- 数据列表 -->
    <div class="coupon-list">
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
          ></el-table-column>
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
        <el-table-column
          label="操作"
          width="300"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="showCoupon(scope.row, scope.$index)"
            >查看优惠券</el-button>
            <el-button
              size="mini"
              @click="editCoupon(scope.row, scope.$index)"
            >编辑</el-button>
            <el-button
              size="mini"
              @click="deleteCoupon(scope.row.id, scope.$index)"
            >删除</el-button>
          </template>
        </el-table-column>
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
      <addcoupon
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
import { parseTime, format_objKey } from '@/utils/methods'
import { searchCoupon, deleteCoupon } from '@/api/coupon'
import addcoupon from './components/addcoupon'
export default {
  components: {
    addcoupon
  },
  data() {
    return {
      modify: false, //新增或修改
      show: false, //弹出框显示
      information: {}, //修改时原数据
      category_id: '', //商品分类id
      total: 0, //总条数
      //搜索表单
      searchForm: {
        name: '', //优惠券名称
        page: 1, //页码
        limit: 10 //每页条数
      },
      //数据列表
      dataList: [],
      tableColumn: [
        {
          label: '编号',
          prop: 'serial',
          width: '80'
        },
        {
          label: '优惠券名称',
          prop: 'name'
        },
        {
          label: '优惠券类型',
          prop: 'allow_member',
          slot: scope => {
            return this.$const.COUPON_TYPE[scope.row.allow_member]
          }
        },
        {
          label: '会员等级',
          prop: 'allow_level',
          slot: scope => {
            return this.$const.MEMBER_LEVEL[scope.row.allow_level]
          }
        },
        {
          label: '使用门槛',
          prop: 'threshold',
          slot: scope => {
            return !scope.row.threshold || Number(scope.row.threshold) === 0
              ? '无门槛使用'
              : '满' + Number(scope.row.threshold / 100) + '可用'
          }
        },
        {
          label: '面值',
          prop: 'discount',
          slot: scope => {
            return Number(scope.row.discount / 100) + '元'
          }
        },
        {
          label: '状态',
          prop: 'status',
          slot: scope => {
            return this.$const.COUPON_STATE[scope.row.status]
          }
        },
        {
          label: '有效期',
          prop: 'type',
          slot: scope => {
            if (scope.row.type === 'duration') {
              return scope.row.indate + '天'
            } else {
              return (
                parseTime(scope.row.start_time, '{y}-{m}-{d}') +
                '至' +
                parseTime(scope.row.end_time, '{y}-{m}-{d}')
              )
            }
          }
        }
      ]
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    //获取数据列表
    fetchData() {
      let params = Object.assign({}, this.searchForm)
      searchCoupon(format_objKey(params)).then(res => {
        const resp = res.data
        this.dataList = resp.data
        this.total = resp.msg.count
      })
    },
    //搜索
    searchCoupon() {
      this.searchForm.page = 1
      this.fetchData()
    },
    // 查看详情
    showCoupon(row, index) {
      this.$router.push({ path: '/coupon/couponData', query: { id: row.id } })
    },

    deleteCoupon(id, index) {
      //删除优惠券
      this.$confirm('确定删除此优惠券?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          var data = {
            method: 'delete',
            _id: id
          }
          deleteCoupon(data).then(res => {
            this.$message.success('删除成功～')
            this.fetchData()
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    //新增优惠券
    addCoupon() {
      this.modify = false
      this.show = true
    },
    //编辑优惠券
    editCoupon(row, index) {
      this.show = true
      this.modify = true
      this.information = row
      if (this.information.cat[0].category_id === '0') {
        this.information.coupon_scope = 'all'
        //this.information.cat.splice(0, 1);
      } else {
        this.information.coupon_scope = 'specifiedClassification'
      }
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
.title {
  margin-bottom: 10px;
}
.search-button {
  text-align: center;
}
.add-btn-group {
  text-align: right;
  padding: 0 20px 20px;
}
.coupon-list {
  padding: 0 20px;
}
.pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  padding: 0 20px;
}
</style>