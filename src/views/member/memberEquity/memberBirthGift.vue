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
                  :default-time="['00:00:00','23:59:59']"
                  value-format="timestamp"
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
            <el-col :span="5" :md="7">
              <el-form-item label="领取状态" prop="status">
                <el-select placeholder="领取状态" v-model="searchForm.statusValue">
                  <el-option
                    :label="item.name"
                    :value="Number(item.type)"
                    v-for="item in receiveType"
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
        <el-table-column prop="name" label="礼品名称" sortable>
          <template slot-scope="scope">
            <span>{{scope.row.name}}</span>
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
        <el-table-column prop label="领取状态" sortable>
          <template slot-scope="scope">
            <span>{{scope.row.status|receiveTypeFilter}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="detail_address" label="收货地址" sortable>
          <template slot-scope="scope">
            <span>{{scope.row.province}} {{scope.row.city}} {{scope.row.district}} {{scope.row.detail_address}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="mobile" label="收货人联系方式" sortable>
          <template slot-scope="scope">
            <span>{{scope.row.mobile}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="consignee" label="收货人" sortable>
          <template slot-scope="scope">
            <span>{{scope.row.consignee}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="danger"
              @click="deliverOrder(scope.row)"
              v-if="scope.row.status==1"
            >发货</el-button>
            <el-button
              size="mini"
              type="primary"
              @click="toEditPage(scope.row,scope.$index)"
              v-if="scope.row.status==2"
            >编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog class="dialogMoc" title="发货信息" :visible.sync="dialogFormVisible">
        <el-form :model="form_data" ref="send_form">
          <el-form-item label="物流公司" :label-width="formLabelWidth">
            <el-input v-model="form_data.logistics_company" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="物流单号" :label-width="formLabelWidth">
            <el-input v-model="form_data.logistics_number" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="deliverOrderFn">确 定</el-button>
        </div>
      </el-dialog>
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
import { searchGift } from "@/api/member";
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
        limit: 10, //每页数量
        status: [1, 2, 3],
        statusValue: ""
      },
      memberState: memberLevelFilter._memberLevelStatus, //会员等级
      receiveType: memberLevelFilter._giftRecevieStatus, //领取状态
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
      },
      dialogFormVisible: false,
      form_data: {
        _id: "",
        logistics_number: "",
        logistics_company: "",
        status: 1
      },
      formLabelWidth: "120px"
    };
  },
  methods: {
    //获取查询数据
    fetchDate(all) {
      if (all) {
        this.searchForm.status = [1, 2, 3];
      }
      let searchObj = {
        start_time: this.time_range[0],
        end_time: this.time_range[1],
        ...this.searchForm
      };
      searchGift("GET", format_objKey(searchObj)).then(res => {
        const resp = res.data;
        this.orderList = resp.data;
        this.total = resp.msg.count;
        this.searchForm.status = [1, 2, 3];
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
        limit: 10, //每页数量
        status: [1, 2, 3],
        statusValue: ""
      };
      this.fetchDate();
    },
    //表单查询
    searchOrder() {
      this.searchForm.page = 1;
      if (this.searchForm.statusValue > 0) {
        var status_num = Number(this.searchForm.statusValue);
        this.searchForm.status = [status_num];
      } else {
        this.searchForm.status = [1, 2, 3];
      }
      this.fetchDate();
    },
    //表格选择
    handleSelectionChange(val) {
      this.selectArr = val;
    },

    //订单发货
    deliverOrder(item) {
      //表单重置
      this.form_data.logistics_number = "";
      this.form_data.logistics_company = "";
      this.dialogFormVisible = true;
      this.form_data._id = item._id;
      this.form_data.status = Number(item.status) + 1;
    },
    //发货
    deliverOrderFn() {
      let flag = false;
      for (let key in this.form_data) {
        if (this.form_data[key] == "") {
          flag = true;
        }
      }
      if (flag) {
        this.$message({
          message: "请填写完发货信息"
        });
        return;
      }
      searchGift("POST", format_objKey(this.form_data)).then(res => {
        this.$message({
          message: "发货成功",
          type: "success"
        });
        this.dialogFormVisible = false;
        this.fetchDate(true);
      });
    },
    //订单编辑
    toEditPage(item, index) {
      let data_gift = {
        index: index + 1,
        ...item
      };
      localStorage.setItem("data_gift", JSON.stringify(data_gift));
      this.$router.push({
        path: "/member/memberbenefits/editBithGift"
      });
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
    },
    //领取状态
    receiveTypeFilter(type) {
      return memberLevelFilter._filterType(
        memberLevelFilter._giftRecevieStatus,
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