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
          <el-row :gutter="20" align="middle">
            <el-col :span="5" :md="7">
              <el-form-item label="用户名称" prop="order_id">
                <el-input placeholder="用户名称" v-model="searchForm.user_name" @keyup.enter.native="searchOrder"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6" :md="9">
              <el-form-item label="领取时间" prop="create_time" label-width="110px">
                <el-date-picker
                  v-model="time_range"
                  type="datetimerange"
                  value-format="timestamp"
                  :default-time="['00:00:00','23:59:59']"
                  :picker-options="pickerOptions"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                ></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20" align="middle">
            <el-col :span="5" :md="7">
              <el-form-item label="会员等级" prop="level">
                <el-select placeholder="会员等级" v-model="searchForm.level">
                  <el-option
                    :label="item.name"
                    :value="Number(item.type)"
                    v-for="item in memberState"
                    :key="item.type"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="5" :md="9" class="search-button">
              <el-form-item>
                <div>
                  <el-button @click="resetForm('searchForm')">重置</el-button>
                  <el-button type="primary" @click="searchOrder">查询</el-button>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>

    <!-- 数据列表 ----->
    <div class="order-list">
      <el-table
        :data="orderList"
        id="orderTable"
        border
        @selection-change="handleSelectionChange"
        style="width:100%"
        :header-cell-style="{background:'#DCDFE6',color:'#303133'}"
      >
        <el-table-column type="index" label="编号" width="50"></el-table-column>
        <el-table-column prop="name" label="礼包名称" sortable>
          <template slot-scope="scope">
            <span>{{scope.row.level|levelTypeFilter}}优惠礼包</span>
          </template>
        </el-table-column>

        <el-table-column prop="user_id" label="用户ID" sortable>
          <template slot-scope="scope">
            <span>{{scope.row.user_id}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="user_name" label="用户账号" sortable>
          <template slot-scope="scope">
            <span>{{scope.row.user_name}}</span>
          </template>
        </el-table-column>

        <el-table-column prop="level" label="会员等级" sortable>
          <template slot-scope="scope">
            <span>{{scope.row.level|levelTypeFilter}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="create_time" label="领取时间" sortable>
          <template slot-scope="scope">{{scope.row.create_time|dateFilter}}</template>
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
import memberLevelFilter from "@/utils/changeType";
import { format_objKey } from "@/utils/methods";
import { couponGift } from "@/api/member";
export default {
  created() {
    this.fetchDate();
  },
  data() {
    return {
      total: 100,
      time_range: "",
      //搜索
      searchForm: {
        user_name: "",
        // create_time: "",
        level: "",
        page: 1, //当前显示页
        limit: 10 //每页数量
      },
      memberState: memberLevelFilter._memberLevelStatus, //会员等级
      orderList: [],
      selectArr: [],
      pickerOptions: {
        //时间限制 不能超过今天
        disabledDate(time) {
          let curDate = new Date().getTime();
          let year = 365 * 24 * 3600 * 1000;
          // let threeMonths = curDate - year;
          // return time.getTime() > Date.now() || time.getTime() < threeMonths;;
          return time.getTime() > Date.now();
        }
      }
    };
  },
  methods: {
    //获取查询数据
    fetchDate() {
      let searchObj = {
        start_time: this.time_range[0],
        end_time: this.time_range[1],
        ...this.searchForm
      };
      couponGift(format_objKey(searchObj)).then(res => {
        const resp = res.data;
        this.orderList = resp.data;
        this.total = resp.msg.count;
      });
    },

    //表单重置
    resetForm(formName) {
      this.time_range = "";
      // this.$refs[formName].resetFields()
      this.searchForm = {
        user_name: "",
        level: "",
        page: 1, //当前显示页
        limit: 10 //每页数量
      };
      this.fetchDate();
    },
    //表单查询
    searchOrder() {
      this.searchForm.page = 1;
      this.fetchDate();
    },
    //表格选择
    handleSelectionChange(val) {
      this.selectArr = val;
    },

    //改变分页
    handleCurrentChange(val) {
      this.searchForm.page = val;
      this.fetchDate();
    }
  },
  filters: {
    //会员等级类型
    levelTypeFilter(type) {
      return memberLevelFilter._filterType(
        memberLevelFilter._memberLevelStatus,
        type
      );
    }
  }
};
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
.dialogMoc >>> .el-input {
  width: 320px;
}
</style>