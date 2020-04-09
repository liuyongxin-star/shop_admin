<template>
  <div>
    <!-- 优惠券详情-->
    <div class="couponDetail">
      <div
        class="couponItem"
        v-for="(item, index) in list"
        :key="index"
      >
        <div class="couponItemTitle">{{item.label}}</div>
        <div class="couponItemValue">{{item.value}}</div>
      </div>
    </div>
    <!-- 查询框 -->
    <div class="searchBox">
      <div class="title">筛选</div>
      <div>
        <el-form
          :model="userSearchForm"
          :inline="true"
          ref="userSearchForm"
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
                label="使用状态"
                prop="status"
              >
                <el-select
                  placeholder="使用状态"
                  v-model="userSearchForm.status"
                >
                  <el-option
                    value=""
                    label="全部"
                  ></el-option>
                  <el-option
                    v-for="(value, key) in $const.COUPON_USE_STATUS"
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
            >
              <el-form-item
                label="订单编号"
                prop="orderId"
              >
                <el-input
                  placeholder="订单编号"
                  v-model="userSearchForm.order_id"
                ></el-input>
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
                  @click="searchUserCoupon"
                >查询</el-button>
                <el-button
                  type="primary"
                  @click="back"
                >返回上级</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
    <!-- 数据列表 -->
    <div class="coupon-list">
      <el-table
        :data="dataList"
        border
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
      </el-table>
    </div>
    <!--分页功能 -->
    <div class="pagination">
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="userSearchForm.page"
        :page-size="userSearchForm.limit"
        layout="total, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
import { parseTime, format_objKey } from '@/utils/methods'
import { searchCoupon, searchCoupoUser } from '@/api/coupon'
export default {
  data() {
    return {
      searchForm: {
        _id: this.$route.query.id, //优惠券模板id
        page: 1,
        limit: 1
      },
      //优惠券模板详情
      list: [
        {
          label: '名称',
          prop: 'name',
          value: ''
        },
        {
          label: '优惠券类型',
          prop: 'allow_member',
          value: ''
        },
        {
          label: '可使用分类',
          prop: 'cate',
          value: ''
        },
        {
          label: '使用门槛',
          prop: 'threshold',
          value: ''
        },
        {
          label: '面值',
          prop: 'discount',
          value: ''
        },
        {
          label: '状态',
          prop: 'status',
          value: ''
        },
        {
          label: '有效期',
          prop: 'type',
          value: ''
        },
        {
          label: '总发行量',
          prop: 'total_count',
          value: ''
        },
        {
          label: '已领取',
          prop: 'get_times',
          value: ''
        },
        {
          label: '待领取',
          prop: 'remain',
          value: ''
        },
        {
          label: '已使用',
          prop: 'used',
          value: ''
        },
        {
          label: '未使用',
          prop: 'unused',
          value: ''
        }
      ],
      info: {}, //优惠券模板详情
      total: 0,
      userSearchForm: {
        template_id: this.$route.query.id,
        page: 1,
        limit: 10
      },
      //用户优惠券详情
      dataList: [],
      tableColumn: [
        {
          label: '优惠券id',
          prop: 'id',
          width: '250'
        },
        {
          label: '领取人id',
          prop: 'user_id',
          width: '250'
        },
        {
          label: '领取时间',
          prop: 'create_time',
          slot: scope => {
            return parseTime(scope.row.create_time, '{y}-{m}-{d} {h}:{i}:{s}')
          }
        },
        {
          label: '当前状态',
          prop: 'status',
          slot: scope => {
            return this.$const.COUPON_USE_STATUS[scope.row.status]
          }
        },
        {
          label: '使用时间',
          prop: 'order_time',
          slot: scope => {
            return parseTime(scope.row.order_time, '{y}-{m}-{d} {h}:{i}:{s}')
          }
        },
        {
          label: '订单编号',
          prop: 'order_id'
        }
      ]
    }
  },
  created() {
    this.getCouponData() //优惠券模板详情
    this.getUserData() //用户优惠券列表
  },
  methods: {
    changeTimeFn(item) {
      //处理时间
      let day = item.create_time
      if (day.toString().length < 11) {
        day = parseInt(day * 1000)
      }
      const start = day
      const end = new Date(day + 60 * 60 * Number(item.indate || 0) * 24 * 1000)
      return item.type === 'duration'
        ? parseTime(start, '{y}-{m}-{d}') + '至' + parseTime(end, '{y}-{m}-{d}')
        : parseTime(item.start_time, '{y}-{m}-{d}') +
            '至' +
            parseTime(item.end_time, '{y}-{m}-{d}')
    },
    //处理分类
    changeCatFn(item) {
      let arr = []
      item.forEach((el, index) => {
        arr.push(el.name)
      })
      return arr.join(',')
    },
    // 格式化数据
    saveFormat(item) {
      item.status = this.$const.COUPON_STATE[item.status]
      item.allow_member = this.$const.COUPON_TYPE[item.allow_member]
      item.type = this.changeTimeFn(item)
      item.threshold =
        !item.threshold || Number(item.threshold) === 0
          ? '无门槛使用'
          : '满' + Number(item.threshold / 100) + '可用'
      item.discount = item.discount / 100 + '元'
      item.remain = Number(item.total_count) - Number(item.get_times)
      item.unused = Number(item.get_times) - Number(item.used)
      item.cate = this.changeCatFn(item.cat)
    },
    getCouponData() {
      //获取优惠券模板详细信息
      let searchObj = format_objKey(this.searchForm)
      searchCoupon(searchObj).then(res => {
        const resp = res.data
        resp.data.forEach(item => {
          this.saveFormat(item)
        })
        this.info = resp.data[0]
        for (let i in this.info) {
          this.list.forEach((el, index) => {
            if (el.prop === i) {
              el.value = this.info[i]
            }
          })
        }
      })
    },
    getUserData() {
      //获取用户优惠券数据列表
      let params = Object.assign({}, this.userSearchForm)
      searchCoupoUser(format_objKey(params)).then(res => {
        const resp = res.data
        this.dataList = resp.data
        this.total = resp.msg.count
      })
    },
    //搜索用户优惠券
    searchUserCoupon() {
      this.userSearchForm.page = 1
      this.getUserData()
    },
    //改变分页
    handleCurrentChange(val) {
      this.userSearchForm.page = val
      this.getUserData()
    },
    //返回上级
    back() {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped>
.couponDetail {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  text-align: center;
  width: 100%;
  margin: 20px;
}
.couponDetail .couponItem {
  width: 16%;
  border: 1px solid #f5f5f5;
}
.couponItemTitle {
  background: #c2c6ca;
  padding: 10px 0;
}
.couponItemValue {
  padding: 10px 0;
  min-height: 24px;
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
  text-align: center;
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