<template>
  <div>
    <!-- 头部筛选 -->
    <div class="screen">
      <p class="title color85">查询</p>
      <div class="screen_condition color85 fontS14">
        <el-form :model="searchForm" :inline="true" ref="searchForm" size="mini">
          <div class="screen_box">
            <el-form-item label="下单时间" width="100">
              <el-date-picker
                v-model="searchForm.time"
                :picker-options="pickerOptions"
                type="datetimerange"
                :default-time="['00:00:00','23:59:59']"
                value-format="timestamp"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                unlink-panels
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="用户手机">
              <el-input v-model="searchForm.mobile" placeholder="请输入用户名手机"></el-input>
            </el-form-item>
            <el-form-item label="90%以上">
              <el-select placeholder="请选择" v-model="searchForm.ninety">
                <el-option value label="全部"></el-option>
                <el-option
                  v-for="(value, key) in $const.MATCH"
                  :label="value"
                  :value="key"
                  :key="key"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="70%以上">
              <el-select placeholder="请选择" v-model="searchForm.seventy">
                <el-option value label="全部"></el-option>
                <el-option
                  v-for="(value, key) in $const.MATCH"
                  :label="value"
                  :value="key"
                  :key="key"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="未匹配">
              <el-select placeholder="请选择" v-model="searchForm.unmatch">
                <el-option value label="全部"></el-option>
                <el-option
                  v-for="(value, key) in $const.UNMATCH"
                  :label="value"
                  :value="key"
                  :key="key"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="混批情况">
              <el-select placeholder="请选择" v-model="searchForm.store">
                <el-option value label="全部"></el-option>
                <el-option
                  v-for="(value, key) in $const.STORE"
                  :label="value"
                  :value="key"
                  :key="key"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="加购物车情况">
              <el-select placeholder="请选择" v-model="searchForm.buy">
                <el-option value label="全部"></el-option>
                <el-option
                  v-for="(value, key) in $const.BUY"
                  :label="value"
                  :value="key"
                  :key="key"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="立即购买情况">
              <el-select placeholder="请选择" v-model="searchForm.immediate">
                <el-option value label="全部"></el-option>
                <el-option
                  v-for="(value, key) in $const.IMMEDIATE"
                  :label="value"
                  :value="key"
                  :key="key"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="screen_btn">
            <el-button type="primary" @click="search" size="mini">查询</el-button>
            <el-button size="mini" @click="resetForm">重置</el-button>
          </div>
        </el-form>
      </div>
    </div>
    <!-- 头部筛选 End-->
    <div class="table">
      <!-- 状态 -->
      <div class="table_top">
        <my-tab :tabList="tabs" :currentView="curView" @tabClick="tabSwitch"></my-tab>
      </div>
      <!-- 表格 -->
      <el-table :data="dataList" ref="multipleTable" id="exportTable">
        <el-table-column type="selection" width="55"></el-table-column>
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
              <div v-if="column.fileType">
                <img :src="scope.row.fileType" />
              </div>
              <div v-else-if="column.btn" class="btn">
                <el-button type="text" @click="show(scope.row._id)">查看详情</el-button>
                <el-button type="text" @click="del(scope.row._id)">删除</el-button>
              </div>
              <span v-else-if="column.input">
                <el-input
                  type="textarea"
                  autosize
                  class="input"
                  maxlength="50"
                  v-model="scope.row.remark"
                ></el-input>
              </span>
              <span v-else>{{scope.row[column.prop]?scope.row[column.prop]:'--'}}</span>
            </template>
          </el-table-column>
          <el-table-column
            v-else
            :key="column.id"
            :fixed="column.fixed"
            :label="column.label"
            :prop="column.prop"
            :width="column.width"
          >
            <template slot-scope="scope">
              <span v-html="column.slot(scope)"></span>
            </template>
          </el-table-column>
        </template>
      </el-table>
      <!-- 表格 End-->
      <div class="bottom-box">
        <div class="btn_group">
          <el-button type="primary" @click="excel" size="mini">导出</el-button>
        </div>
        <!--分页功能 -->
        <div class="pagination">
          <el-pagination
            background
            @current-change="curPageChange"
            :current-page="searchForm.page"
            :page-size="searchForm.limit"
            :page-sizes="[10]"
            layout="total, prev, pager, next,sizes, jumper"
            :total="total"
          ></el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// import { getList,delEasyOrder } from "@/api/easyOrder";
import { format_objKey, parseTime } from '@/utils/methods'
import myTab from '@/components/myTab.vue'
export default {
  components: {
    myTab
  },
  data() {
    return {
      //搜索表单
      searchForm: {
        mobile: '', //手机号
        page: 1, //页码
        limit: 10 //每页条数
      },
      //配置tab
      curView: 'all',
      tabs: [
        {
          label: '全部',
          name: 'all'
        },
        {
          label: '中断操作',
          name: 'interrupt'
        },
        {
          label: '有混批',
          name: 'moreStore'
        },
        {
          label: '有导出',
          name: 'excel'
        },
        {
          label: '有缺货',
          name: 'lack'
        },
        {
          label: '手动补足',
          name: 'complement'
        },
        {
          label: '手动替换',
          name: 'replace'
        }
      ],
      //表格数据列表
      dataList: [],
      //表格配置项
      tableColumn: [
        {
          label: '序号',
          prop: 'serial',
          width: '50',
          slot: scope => {
            return scope.$index + 1
          }
        },
        {
          label: '用户手机',
          prop: 'mobile',
          width: '120'
        },
        {
          label: '下单时间',
          prop: 'time',
          width: '170',
          slot: scope => {
            return parseTime(scope.row.create_time, '{y}-{m}-{d} {h}:{i}:{s}')
          }
        },
        {
          label: '文件信息',
          prop: 'fileType',
          fileType: true,
          width: '95'
        },
        {
          label: '90%以上',
          prop: 'ninety',
          width: '95'
        },
        {
          label: '70%以上',
          prop: 'seventy',
          width: '95'
        },
        {
          label: '未匹配',
          prop: 'unmatch',
          width: '95'
        },
        {
          label: '混批情况',
          prop: 'store',
          width: '120'
        },
        {
          label: '加购物车情况',
          prop: 'buy',
          width: '120'
        },
        {
          label: '立即购买情况',
          prop: 'immediate',
          width: '120'
        },
        {
          label: '操作',
          prop: 'operation',
          btn: true
        }
      ],
      //时间限制 不能超过今天
      pickerOptions: {
        disabledDate(time) {
          let curDate = new Date().getTime()
          let year = 365 * 24 * 3600 * 1000
          return time.getTime() > Date.now()
        }
      }
    }
  },
  created() {
    // this.fetchData();
  },
  methods: {
    // //获取数据列表
    // fetchData(){
    //   getList(format_objKey(this.searchForm)).then(res => {
    //   let resp = res.data
    //   let list = resp.data;
    //   console.log(list)
    //   list.forEach(item=>{
    //     item.fileType= this.$const.FILETYPE[Number(item.status)]
    //   })
    // 			this.dataList = list;
    //       this.total = resp.msg.count;
    //       console.log(this.dataList)
    // 		})
    // },
    // //切换tab项
    // tabSwitch(name){
    //   switch (name) {
    //     case "all":
    //       this.searchForm.type="all"
    //       fetchData()
    //       break;
    //     default:
    //       break;
    //   }
    // },
    // //搜索
    // search() {
    //   this.searchForm.page = 1
    //   this.fetchData()
    // },
    //     //重置搜索
    // resetForm() {
    //   this.$refs['searchForm'].resetFields()
    //   this.fetchData()
    // },
    //     //查看详情
    //     show(id) {
    //       this.$router.push({ path: '/coupon/easyOrderDetail', query: { id:id } })
    //     },
    //     //删除批量下单信息
    //     del(id, index) {
    //       this.$confirm('确定删除此条批量下单信息?', '温馨提示',{
    //         confirmButtonText: '确定',
    //         cancelButtonText: '取消',
    //         type: 'warning'
    //       })
    //         .then(() => {
    //            let data = {
    //              method: 'delete',
    //              _id: id
    //            }
    //            delEasyOrder(data).then(res => {
    //              this.$message.success('删除成功～')
    //              this.fetchData()
    //            })
    //         })
    //         .catch(() => {
    //           this.$message({
    //             type: 'info',
    //             message: '已取消删除'
    //           })
    //         })
    //     },
    excel() {
      exportExcel('#exportTable', '求购数据表格')
    }
  }
}
</script>
<style scoped>
.screen {
  background-color: white;
  margin: 24px;
}

.title {
  padding: 16px 32px;
  border-bottom: 1px solid rgba(233, 233, 233, 1);
}

.screen_condition {
  padding: 24px 24px 32px 32px;
}

.screen_box {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}
.screen_box_row {
  display: flex;
  justify-content: space-between;
}
.screen >>> .el-form-item__label {
  display: block;
  padding-bottom: 8px;
  text-align: left;
}

.el-input {
  width: 249px;
}

.screen >>> .el-input__inner {
  height: 32px;
  width: 249px;
}

.screen_btn {
  margin-top: 14px;
  display: flex;
  justify-content: flex-end;
}
.top-tab {
  width: 100%;
  margin-right: 0;
}
.table {
  margin: 0 25px;
  background-color: white;
}

.color18 {
  background-color: #1890ff;
}
.el-pagination {
  text-align: right;
  padding: 23px 48px 48px;
}
.bottom-box {
  margin: 0 25px;
  display: flex;
  justify-content: space-between;
}
.btn_group {
  margin-top: 20px;
}
.pagination {
  display: flex;
  justify-content: flex-end;
  padding: 0 20px;
}
.table_top {
  display: flex;
  justify-content: space-between;
}
.table_top >>> .el-tabs__header {
  padding-left: 24px;
}
</style>