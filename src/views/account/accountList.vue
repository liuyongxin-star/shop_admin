<template>
  <div class="container">
    <div class="top-box">
      <p>查询筛选</p>
      <div>
        <el-form
          :inline="true"
          :model='searchForm'
        >
          <el-form-item label="账号昵称">
            <el-input
              v-model="searchForm.name"
              placeholder="请输入账号昵称"
              @keyup.enter.native="search"
            ></el-input>
          </el-form-item>
          <el-form-item label="用户ID">
            <el-input
              v-model="searchForm._id"
              placeholder="请输入用户ID"
              @keyup.enter.native="search"
            ></el-input>
          </el-form-item>
          <el-form-item label="申请时间">
            <el-date-picker
              v-model="createTime_range"
              type="datetimerange"
              value-format="timestamp"
              :default-time="['00:00:00', '23:59:59']"
              :picker-options="pickerOptions"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="账号类型">
            <el-select
              v-model="searchForm.is_company"
              placeholder="请选择账号类型"
            >
              <el-option
                value=""
                label="全部"
              ></el-option>
              <el-option
                :value="false"
                label="个人账号"
              ></el-option>
              <el-option
                :value="true"
                label="企业账号"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>

        <div class="search-btn-box">
          <el-button
            type="primary"
            size="mini"
            @click="search"
          >查询</el-button>
          <el-button
            size='mini'
            type='primary'
            @click="resetSearch"
          >重置</el-button>
        </div>
      </div>
    </div>
    <div class="table-box">
      <el-table
        :data='accountList'
        ref='dataTable'
        style='width:100%'
        :header-cell-style="{background:'#DCDFE6',color:'#303133'}"
      >
        <el-table-column
          type="index"
          label="序号"
        ></el-table-column>
        <el-table-column
          label="账号昵称"
          prop="name"
          sortable
        >
          <template slot-scope="scope">
            <el-link
              type='primary'
              @click="toDetail(scope.row.user_id)"
            >{{scope.row.name}}</el-link>
          </template>
        </el-table-column>
        <el-table-column
          label="用户id"
          prop="user_id"
          sortable
        ></el-table-column>
        <el-table-column
          label="账号类型"
          sortable
        >
          <template slot-scope="scope">
            <span v-if="scope.row.company">企业账号</span>
            <span v-else>个人账号</span>
          </template>
        </el-table-column>
        <el-table-column
          label='绑定手机号'
          prop='mobile'
          sortable
        ></el-table-column>
        <el-table-column
          label="注册时间"
          sortable
        >
          <template slot-scope="scope">
            <span>{{scope.row.create_time|dateFilter}}</span>
          </template>

        </el-table-column>
        <el-table-column
          label="会员等级"
          prop="level"
          sortable
        >
          <template slot-scope="scope">
            <span>{{scope.row.level|memberLevelFilter}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="保级起始日期"
          sortable
        >
          <template slot-scope="scope">
            <span>{{scope.row.level_startTime|dateFilter}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="保级结束日期"
          prop="clearing_time"
          sortable
        >
          <template slot-scope="scope">
            <span>{{scope.row.clearing_time|dateFilter}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="累计积分"
          prop="cumulative_points"
          sortable
        ></el-table-column>
        <el-table-column
          label="可用积分"
          prop="points"
          sortable
        ></el-table-column>
        <el-table-column
          label="升级待消费金额/元"
          sortable
        >
          <template slot-scope="scope">
            <span>￥{{scope.row.next_require_exp|fixedMoney}}</span>
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

  </div>
</template>

<script>
import filter from '@/utils/changeType'
import { format_objKey, sortAttr } from '@/utils/methods'
import { searchAccount } from '@/api/account'
export default {
  created() {
    this.fetchData()
  },
  data() {
    return {
      createTime_range: [], //申请时间段
      accountList: [],
      total: 0,
      searchForm: {
        name: '',
        _id: '',
        is_company: '',
        page: 1,
        limit: 10
      },
      pickerOptions: {
        //时间选择限制
        disabledDate(time) {
          let curDate = new Date().getTime()
          let year = 365 * 24 * 3600 * 1000 //毫秒
          return time.getTime() > Date.now()
        }
      }
    }
  },
  filters: {
    //会员等级
    memberLevelFilter(type) {
      return filter._filterType(filter._memberLevel, type)
    }
  },
  methods: {
    //加载数据
    fetchData() {
      // let obj=Object.assign({},this.searchForm)
      let obj = {
        start_time: this.createTime_range[0],
        end_time: this.createTime_range[1],
        ...this.searchForm
      }
      searchAccount(format_objKey(obj)).then(res => {
        const dataList = res.data.data
        dataList.map(item => {
          item['level_startTime'] = item['clearing_time'] - 24 * 60 * 60 * 90
        })
        this.accountList = dataList
        this.total = res.data.msg.count
      })
    },

    //跳转详情
    toDetail(user_id) {
      this.$router.push({
        path: 'countDetail',
        query: {
          user_id
        }
      })
    },
    //改变分页
    handleCurrentChange(val) {
      this.searchForm.page = val
      this.fetchData()
    },
    // 搜索
    search() {
      this.searchForm.page = 1
      this.fetchData()
    },
    //重置
    resetSearch() {
      this.createTime_range = []
      ;(this.searchForm = {
        name: '',
        _id: '',
        is_company: '',
        page: 1,
        limit: 10
      }),
        this.fetchData()
    }
  }
}
</script>

<style scoped>
.container {
  width: 97%;
  flex-direction: column;
  margin: 0 auto;
}
.top-box {
  border-radius: 20px;
  padding: 20px;
  border: 1px solid #ccc;
  margin: 20px 0;
}
.search-btn-box {
  text-align: right;
}
.bottom-box {
  margin-top: 20px;
  margin-bottom: 20px;
  text-align: right;
}
.el-form-item {
  margin-right: 30px;
}
</style>
<style lang="less">
.el-table .tableRowColor {
  background: #f0f9eb;
}
</style>