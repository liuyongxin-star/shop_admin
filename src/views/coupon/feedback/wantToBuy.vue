<template>
  <div>
    <!-- 查询框 -->

    <div class="screen">
      <p class="title color85">查询</p>
      <div class="screen_condition color85 fontS14">
        <el-form :model="searchForm" :inline="true" ref="searchForm" size="mini">
          <div class="screen_box">
            <el-form-item label="产品名称">
              <el-input v-model="searchForm.name" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="有无图片">
              <el-select placeholder="请选择" v-model="searchForm.img">
                <el-option label="全部" value></el-option>
                <el-option label="有图片" value="true"></el-option>
                <el-option label="无图片" value="false"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="回复状态">
              <el-select placeholder="请选择" v-model="searchForm.status">
                <el-option value label="全部"></el-option>
                <el-option
                  v-for="(value, key) in $const.WANTTOBUY_STATUS"
                  :label="value"
                  :value="key"
                  :key="key"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="提交时间" width="100">
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
          </div>
          <div class="screen_btn">
            <el-button type="primary" @click="search" size="mini">查询</el-button>
            <el-button size="mini" @click="resetForm">重置</el-button>
          </div>
        </el-form>
      </div>
    </div>
    <!-- 数据列表 -->
    <div class="table">
      <el-table
        :data="dataList"
        ref="multipleTable"
        id="exportTable"
        @selection-change="handleSelectionChange"
      >
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
              <div v-if="column.preview" class="detailImg">
                <div v-if="scope.row.img.length===0" class="noDetailImg"></div>
                <div v-else-if="scope.row.img">
                  <el-popover
                    placement="bottom"
                    title
                    v-for="img in scope.row.img"
                    :key="img"
                    trigger="hover"
                  >
                    <img :src="img" />
                    <img
                      slot="reference"
                      :src="img"
                      :alt="img"
                      style="max-height: 50px;max-width: 130px"
                    />
                  </el-popover>
                </div>
              </div>
              <div v-else-if="column.btn" class="btn">
                <el-button type="text" @click="show(scope.row)">查看详情</el-button>
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
              <div
                v-if="column.status"
                :class="{'show-circle':true, 'error':(scope.row.status!=1||scope.row.status!=2)}"
              ></div>
              <span v-html="column.slot(scope)"></span>
            </template>
          </el-table-column>
        </template>
      </el-table>

      <div class="wb_bottom">
        <div class="btn_group">
          <el-button type="primary" @click="excel" size="mini">导出</el-button>
          <el-button size="mini" @click="allDel">批量删除</el-button>
        </div>
        <!--分页功能 -->
        <div class="pagination">
          <!--分页功能 -->
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
    <detail :show.sync="visable" :information="information" @success="fetchData" @close="closeAdd" />
  </div>
</template>
<script>
import detail from './components/detail'
import { parseTime, format_objKey, exportExcel } from '@/utils/methods'
import { wantToBuy, editWantBuy } from '@/api/feedback'
export default {
  components: {
    detail
  },
  data() {
    return {
      visable: false, //弹出框显示
      information: {}, //修改时原数据
      pickerOptions: {
        //时间限制 不能超过今天
        disabledDate(time) {
          let curDate = new Date().getTime()
          let year = 365 * 24 * 3600 * 1000
          return time.getTime() > Date.now()
        }
      },
      dialogVisible: false,
      dialogImageUrl: '',
      total: 0, //总条数
      date_min: '', //开始时间
      date_max: '', //结束时间
      //搜索表单
      searchForm: {
        name: '', //产品名称
        page: 1, //页码
        limit: 20 //每页条数
      },
      //数据列表
      dataList: [],
      tableColumn: [
        {
          label: '序号',
          prop: 'serial',
          width: '80',
          slot: scope => {
            return scope.$index + 1
          }
        },
        {
          label: '产品名称',
          prop: 'name',
          width: '180'
        },
        {
          label: '产品描述',
          prop: 'desc',
          width: '400'
        },
        {
          label: '图片',
          prop: 'img',
          preview: true,
          width: '100'
        },
        {
          label: '回复状态',
          prop: 'status',
          status: true,
          slot: scope => {
            return this.$const.WANTTOBUY_STATUS[Number(scope.row.status)]
          },
          width: '120'
        },
        {
          label: '操作',
          prop: 'operation',
          btn: true
        }
      ],
      //选择的数据
      selectArr: []
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    //获取数据列表
    fetchData() {
      let params = Object.assign({}, this.searchForm)
      if (params.time) {
        //获取时间
        params.date_min = Number(params.time[0]) / 1000
        params.date_max = Number(params.time[1]) / 1000
      }
      delete params.time
      wantToBuy(format_objKey(params))
        .then(res => {
          const resp = res.data
          this.dataList = resp.data
          this.total = resp.msg.count
        })
        .catch(err => {})
    },
    //搜索
    search() {
      this.searchForm.page = 1
      this.fetchData()
    },
    //重置搜索
    resetForm() {
      this.$refs['searchForm'].resetFields()
      this.fetchData()
    },
    //查看详情
    show(row) {
      this.visable = true
      this.information = row
    },
    //关闭详情弹窗
    closeAdd() {
      this.visable = false
      this.information = {}
    },
    //删除
    del(id) {},
    //导出
    excel() {
      exportExcel('#exportTable', '求购数据表格')
    },
    //表格选择
    handleSelectionChange(val) {
      this.selectArr = val
      console.log(this.selectArr)
    },
    // //批量删除
    // delAll(){
    //   let data = this.selectArr
    //   let spus = ['']
    //   if(data.length==0){
    //     return
    //   }
    //   data.forEach(item => {
    //     spus += item._id + ','
    //   })
    //   let sendData ={}
    // },

    /* //处理
    show(row) {
      let data = {
        method: 'update',
        status: '1',
        remark: row.remark,
        requests: row.request_id.toString()
      }
      
      editWantBuy(data)
        .then(res => {
          if (res.data.ret === 0) {
            this.$message({
              message: '处理成功',
              type: 'success'
            })
            this.fetchData()
          }
        })
        .catch(err => {
          this.$message.error('处理失败')
        })
    },
    //忽略
    ignore(row) {
      let data = {
        method: 'update',
        status: '3',
        remark: row.remark,
        requests: row.request_id.toString()
      }
      editWantBuy(data)
        .then(res => {
          if (res.data.ret === 0) {
            this.$message({
              message: '忽略成功',
              type: 'success'
            })
            this.fetchData()
          }
        })
        .catch(err => {
          this.$message.error('忽略失败')
        })
    },
    //待定
    pending(row) {
      let data = {
        method: 'update',
        status: '2',
        remark: row.remark,
        requests: row.request_id.toString()
      }
      editWantBuy(data)
        .then(res => {
          if (res.data.ret === 0) {
            this.$message({
              message: '待定成功',
              type: 'success'
            })
            this.fetchData()
          }
        })
        .catch(err => {
          this.$message.error('待定失败')
        })
    },*/
    //改变分页
    handleCurrentChange(val) {
      this.searchForm.page = val
      this.fetchData()
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

.table {
  margin: 0 25px;
  background-color: white;
}
.el-table {
  font-size: 14px;
}
.color18 {
  background-color: #1890ff;
}

.el-pagination {
  text-align: right;
  padding: 23px 48px 48px;
}

.table_top {
  display: flex;
  justify-content: space-between;
}
.table_top >>> .el-tabs__header {
  padding-left: 24px;
}
.wb_bottom {
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
.detailImg img {
  height: 40px;
  width: 40px;
}
.noDetailImg {
  height: 40px;
  width: 40px;
  background: #d8d8d8;
}
</style>