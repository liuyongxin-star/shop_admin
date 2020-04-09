<template>
  <div class="grade-container">
    <!--数据查询-->
    <div>
      <my-search @search="search" @reset="reset">
        <el-form :inline="true" :model="searchForm" ref="searchForm">
          <el-row :gutter="20" type="flex" justify="space-between">
            <el-col :span="6" :md="6" :lg="5">
              <el-form-item prop="user_id">
                <div>用户ID</div>
                <el-input  v-model="searchForm.user_id" placeholder="请输入用户ID"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6" :md="6" :lg="5">
              <el-form-item prop="mobile">
                <div>手机号</div>
                <el-input v-model="searchForm.mobile" placeholder="请输入手机号"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6" :md="6" :lg="8">
              <el-form-item label-width="110" prop="time_range">
                <div>申请时间</div>
                <el-date-picker
                        v-model="searchForm.time_range"
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
            <el-col :span="6" :md="8" :lg="5">
              <el-form-item prop="status_name">
                <div>提现状态</div>
                <el-select v-model="searchForm.status_name" placeholder="请选择提现状态">
                  <el-option label="待处理" :value="1"></el-option>
                  <el-option label="已完成" :value="2"></el-option>
                  <el-option label="已拒绝" :value="3"></el-option>
                </el-select>
              </el-form-item>
            </el-col>

          </el-row>
        </el-form>
      </my-search>
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

        <el-table-column
          prop="withdrawal_account_id"
          label="提现ID"
          sortable
        >
          <template slot-scope="scope">
            <span>{{scope.row.withdrawal_account_id}}</span>
          </template>
        </el-table-column>

        <el-table-column
          prop="user_id"
          label="用户ID"
          sortable
        >
          <template slot-scope="scope">
            <span>{{scope.row.user_id}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="user_name"
          label="用户账号"
          sortable
        >
          <template slot-scope="scope">
            <span>{{scope.row.user_name}}</span>
          </template>
        </el-table-column>

        <el-table-column
          prop="money"
          label="申请提现金额"
          sortable
        >
          <template slot-scope="scope">
            <span>{{scope.row.money|fixedMoney}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="last_withdrawal"
          label="可提现金额"
          sortable
        >
          <template slot-scope="scope">
            <span>{{scope.row.last_withdrawal|fixedMoney}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="create_time"
          label="申请提现时间"
          sortable
        >
          <template slot-scope="scope">{{scope.row.create_time|dateFilter}}</template>
        </el-table-column>
        <el-table-column
          prop="create_time"
          label="账户类型"
          sortable
        >
          <template slot-scope="scope">{{scope.row.type|payTypeFilter(scope.row.bank)}}</template>
        </el-table-column>
        <el-table-column
          prop="card_num"
          label="账户号码"
          sortable
        >
          <template slot-scope="scope">
            <span v-if="scope.row.type==='bank'">{{scope.row.card_num}}</span>
            <span v-if="scope.row.type==='zfb'">{{scope.row.mobile}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="账户姓名"
          sortable
        >
          <template slot-scope="scope">
            <span>{{scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop
          label="申请状态"
          sortable
        >
          <template slot-scope="scope">
            <span :class="['inline-block', 'stateCommon', scope.row.status==3? 'stateBgGreen':scope.row.status==1? 'stateBgDef': scope.row.status==2?'stateBgBule':'stateBgRed']"></span>
            <span>{{scope.row.status|cashTypeFilter}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="250"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="agreeRefuseOrderFn(scope.row,true)"
              v-if="scope.row.status==1"
            >同意</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="agreeRefuseOrderFn(scope.row,false)"
              v-if="scope.row.status==1"
            >拒绝</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="showUpBox(scope.row)"
              v-if="scope.row.status==2"
            >上传凭证</el-button>
            <el-button
              size="mini"
              @click="toEditPage(scope.row._id,scope.$index)"
            >查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog
        class="dialogMoc"
        title="凭证上传"
        :visible.sync="dialogFormVisible"
      >
        <el-upload
          class="upload-demo1"
          action="https://upload-z2.qiniup.com"
          :data="postData"
          v-model="img_url"
          :limit="3"
          list-type="picture-card"
          accept=".png, .jpg"
          :before-upload="changeMsg"
          :on-success="uploadSuccessimg"
          :on-remove="handleRemove"
          :on-exceed="isLimitFn"
          :on-preview="handlePictureCardPreview"
        >
          <el-button
            size="small"
            slot="trigger"
            type="primary"
          >点击上传图片</el-button>
          <el-dialog
            :visible.sync="dialogVisible"
            :modal='false'
          >
            <img
              width="100%"
              :src="dialogImageUrl"
              alt=""
            >
          </el-dialog>
        </el-upload>
        <div
          slot="footer"
          class="dialog-footer"
        >
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button
            type="primary"
            @click="upLoadvoucher"
          >确 定</el-button>
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
import mySearch from "@/components/searchBox.vue";
import memberLevelFilter from '@/utils/changeType'
import { format_objKey } from '@/utils/methods'
import { getWithdrawal } from '@/api/member'
import { uploadToken } from '@/api/uploadpic'
export default {
  created() {
    this.fetchDate()
  },
  components: {
    mySearch,
  },
  data() {
    return {
      id: '', //上传凭证的id
      total: 100,
      //七牛云上传
      postData: {
        key: '',
        token: ''
      },
      img_url: [],
      dialogImageUrl: '',
      dialogVisible: false,
      //搜索
      searchForm: {
        mobile:'',
        user_name: '',
        // create_time: "",
        money: '',
        page: 1, //当前显示页
        limit: 10, //每页数量
        status: [0, 1, 2, 3],
        status_name:'',
        time_range:'', //提现时间
      },
      memberState: memberLevelFilter._memberLevelStatus, //会员等级
      receiveType: memberLevelFilter._giftRecevieStatus, //领取状态
      orderList: [],
      selectArr: [],
      dialogFormVisible: false,
      form_data: {
        _id: '',
        logistics_number: '',
        logistics_company: '',
        status: 1
      },
      formLabelWidth: '120px',
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
      this.searchForm.status_name?this.searchForm.status=[this.searchForm.status_name]:'';
      let searchObj = {
        ...this.searchForm,
        start_time: this.searchForm.time_range[0],
        stop_time: this.searchForm.time_range[1],
      }
      getWithdrawal('GET', format_objKey(searchObj)).then(res => {
        const resp = res.data.data;
        this.orderList = resp.page_list;
        this.total = resp.count
        this.searchForm.status = [0, 1, 2, 3]
      })
    },

    changeMsg(file) {
      //上传前回调
      let _that = this
      let type = false //回调参数，before -upload 返回 为false 上传终止，利用特性解决获取token异步问题
      type = uploadToken(file.name).then(res => {
        if (res.data.ret == 0) {
          _that.postData = { key: file.name, token: res.data.data.upToken }
          return true
        } else {
          return false
        }
      })
      return type
    },
    uploadSuccessimg(res) {
      //上传成功详情
      var url = 'http://qn.ygp.sany.com.cn/' + res.key //图片地址拼接
      this.img_url.push(url)
    },
    handleRemove(file, fileList) {
      this.img_url = []
      fileList.forEach((item, index) => {
        this.img_url.push('http://qn.ygp.sany.com.cn/' + item.name)
      })
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    isLimitFn(files, filesList) {
      this.$message({
        message: '最多只能上传3张图片',
        duration: 3000,
        type: 'error'
      })
      return false
    },
    //表格选择
    handleSelectionChange(val) {
      this.selectArr = val
    },
    //同意或拒绝提现申请 flag:true 同意  flag:false 拒绝
    agreeRefuseOrderFn(item, flag) {
      let user_name = item.user_name
      if (user_name == 'null' || user_name == null) {
        user_name = ''
      }
      let money = (Number(item.money) / 100).toFixed(2)
      let text = ''
      text = flag ? '同意' : '拒绝'
      this.$confirm(
        '是否' + text + ' ' + user_name + '提现' + money + '?',
        text + '提现申请',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          center: true
        }
      ).then(() => {
        let obj = {
          _id: item._id
        }
        if (flag) {
          obj.status = 2
        } else {
          obj.status = 0
        }
        getWithdrawal('post', obj).then(res => {
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
          this.fetchDate()
        })
      })
    },

    upLoadvoucher() {
      //上传凭证
      let obj = {
        _id: this.id,
        status: 3,
        image: this.img_url
      }
      getWithdrawal('post', format_objKey(obj)).then(res => {
        this.$message({
          type: 'success',
          message: '上传凭证成功!'
        })
        this.dialogFormVisible = false
        this.dialogVisible = false
        this.img_url = []
        this.fetchDate()
      })
    },
    //上传凭证弹出框
    showUpBox(item) {
      this.dialogFormVisible = true
      this.id = item._id
    },
    //编辑
    toEditPage(id) {
      this.$router.push({
        path: '/distribution/editdistribution',
        query: {
          id
        }
      })
    },

    //改变分页
    handleCurrentChange(val) {
      this.searchForm.page = val
      this.fetchDate()
    },
    //数据搜索
    search() {
      this.fetchDate(this.searchForm);
    },
    reset() {
      this.$refs["searchForm"].resetFields();
    },
  },
  filters: {
    //支付类型
    payTypeFilter(type, bank) {
      let brank_name = ''
      switch (type) {
        case 'bank':
          brank_name = bank
          break
        case 'zfb':
          brank_name = '支付宝'
          break
        default:
          break
      }
      return brank_name
    },
    //领取状态
    cashTypeFilter(type) {
      return memberLevelFilter._filterType(
        memberLevelFilter._withdrawalStatus,
        type
      )
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
.el-input {
  width: 200px;
}
.title {
  margin-bottom: 10px;
}
.order-list {
  padding: 24px;
  background: #fff;
}
.bottom-box {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  /*margin-top: 20px;*/
  padding: 0 0 128px;
  background: #fff;
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
.imgPreMOck {
  z-index: 1003;
}

  /*搜索*/
.grade-container {
  padding: 0 24px 24px;
}

/**tab等级 end*/
.data-box .data-table {
  padding: 24px;
}

.data-box .el-link:last-child {
  margin-left: 40px;
}

.pagation {
  padding-bottom: 48px;
  padding-right: 50px;
  text-align: right;
}
.grade-container .my-search-box{
  margin-bottom: 0;
  border-bottom: 1px solid #E8E8E8;
}
</style>