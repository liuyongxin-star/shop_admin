<template>
  <div class="container">
    <div class="top-box">
      <p>查询筛选</p>
      <div>
        <el-form
          :inline="true"
          :model='searchForm'
          ref='ruleForm1'
        >

          <el-form-item label="用户昵称">
            <el-input
              v-model="searchForm.user_name"
              placeholder="请输入用户昵称"
               @keyup.enter.native="search"
            ></el-input>
          </el-form-item>
          <el-form-item label="提交时间">
            <el-date-picker
              v-model="createTime_range"
              type="datetimerange"
              value-format="timestamp"
              :default-time="['00:00:00','23:59:59']"
              :picker-options="pickerOptions"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="意见类型">
            <el-select
              v-model="searchForm.feedback_type"
              placeholder="请选择意见类型"
            >
              <el-option
                v-for="item in feedbackStatus"
                :key='item.type'
                :value="item.type"
                :label="item.name"
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
          >清空</el-button>
        </div>
      </div>
    </div>
    <div class="table-box">
      <el-table
        :data='feedbackList'
        style='width:100%'
        :header-cell-style="{background:'#DCDFE6',color:'#303133'}"
      >
        <el-table-column
          type="index"
          label="序号"
        ></el-table-column>
        <el-table-column
          label="用户昵称"
          prop="user_name"
          sortable
        ></el-table-column>
        <el-table-column
          label="用户手机号"
          prop="mobile"
          sortable
        ></el-table-column>
        <el-table-column
          label="意见类型"
          prop="feedback_type"
          sortable
        ></el-table-column>
        <el-table-column
          label="意见内容"
          prop="feedback_content"
          sortable
        ></el-table-column>
        <el-table-column label="图片">
          <template slot-scope="scope">
            <div
              v-for='(item,index) in scope.row.feedback_img'
              :key='index'
            >
              <el-popover
                title="图片"
                width="400"
                trigger="hover"
                placement="left"
              >
                <img
                  :src="item"
                  alt=""
                  height='100'
                  width="100"
                  slot="reference"
                >
                <img
                  :src="item"
                  alt=""
                  width="400"
                >
              </el-popover>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="提交时间"
          prop="create_time"
          sortable
        >
          <template slot-scope="scope">
            <span>{{scope.row.create_time|dateFilter}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label='状态'
          prop='feedback_status'
        >
        </el-table-column>
        <!-- <el-table-column
          label='操作'
          width="250"
        > -->
          <!-- <template slot-scope="scope">
            <div v-if="scope.row.feedback_status=='未处理'">
              <el-button
                type="primary"
                @click="isPass(2,scope.row._id)"
                size="mini"
              >处理</el-button>
              <el-button
                type="danger"
                @click="isPass(0,scope.row._id)"
                size="mini"
              >忽略</el-button>
              <el-button
                type="primary"
                @click="isPass(1,scope.row._id)"
                size="mini"
              >待定</el-button>
            </div>

          </template> -->
        <!-- </el-table-column> -->
        <el-table-column
          label="备注"
          prop="remark"
          sortable
        >
          <!-- <template slot-scope="scope">
            <span>已联系<span v-if='scope.row.contact=="store"'>商家处理</span><span v-if="scope.row.contact=='user'">用户解决</span></span>
          </template> -->
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
import { format_objKey } from '@/utils/methods'
import { searchFeedback, updataType } from '@/api/account'
export default {
  created() {
    this.fetchData()
  },
  data() {
    return {
      createTime_range: [], //创建时间段
      feedbackStatus: filter._feedbackStatus, //类型
      feedbackList: [],
      total: 0,
      searchForm: {
        feedback_type: '',
        user_name: '',
        page: 1,
        limit: 10
      },
      pickerOptions: {
        //时间选择限制
        disabledDate(time) {
          let curDate = new Date().getTime()
          let year = 365 * 24 * 3600 * 1000
          return time.getTime() > Date.now()
        }
      }
    }
  },
  filters: {
    feedbackDealStatus(type) {
      return filter._filterType(filter._feedbackDealStatus, type)
    }
  },
  methods: {
    //加载数据
    fetchData() {
      let obj = Object.assign({}, this.searchForm)
      obj = {
         start_time: this.createTime_range[0],
        stop_time: this.createTime_range[1],
        ...obj
      }
      searchFeedback(format_objKey(obj)).then(res => {
        const resp = res.data
        
        this.feedbackList = resp.data.return_list
        this.total = resp.data.count
      })
    },

    //操作
    isPass(status, id) {
      this.$confirm('确定执行此操作吗？', '提示')
        .then(() => {
          updataType(id, status).then(res => {
            this.$message({
              message: res.data.msg,
              type: res.data.ret == 0 ? 'success' : 'warning'
            })
            this.$nextTick(() => {
              this.fetchData()
            })
          })
        })
        .catch(() => {})
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
        feedback_type: '',
        name: '',
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