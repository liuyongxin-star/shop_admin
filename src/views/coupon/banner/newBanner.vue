<template>
  <div>
    <div class="table">
      <!-- 状态 -->
      <div class="table_top">
        <el-button type="primary" @click="add()">添加轮播图</el-button>
      </div>
      <!-- 表格 -->
      <el-table :data="bannerList" ref="multipleTable">
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
              <div v-if="column.preview&&scope.row.banner_url" class="bannerImg">
                <img :src="scope.row.banner_url" />
              </div>
              <div v-else-if="column.btn" class="btn">
                <el-button type="text" @click="edit(scope.row)">编辑</el-button>
                <el-button type="text" @click="delbaner(scope.row._id)">删除</el-button>
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
                :class="{'show-circle':true, 'error':(scope.row.show===false)}"
              ></div>
              <span v-html="column.slot(scope)"></span>
            </template>
          </el-table-column>
        </template>
      </el-table>
      <!-- 表格 End-->

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
    <add
      :show.sync="visable"
      :information="information"
      :modify="modify"
      @success="fetchData"
      @close="closeAdd"
    />
  </div>
</template>
<script>
import add from './components/add'
import { searchBanner, deleteBanner, changeBanner } from '@/api/operate'
import { parseTime } from '@/utils/methods'
import { uploadToken } from '@/api/uploadpic'
export default {
  components: {
    add
  },
  data() {
    return {
      modify: false,
      visable: false, //弹出框显示
      information: {}, //修改时原数据
      currentPage: 1,
      total: 0,
      searchForm: {
        page: 1,
        limit: 10
      },
      //数据列表
      bannerList: [],
      //表格配置项
      tableColumn: [
        {
          label: '序号',
          prop: 'serial',
          width: '80',
          slot: scope => {
            return this.filters.serialFormat(scope.$index + 1)
          }
        },
        {
          label: '名称',
          prop: 'banner_name',
          width: '180'
        },
        {
          label: '所属',
          prop: 'banner_cat',
          width: '100'
        },
        {
          label: '排序',
          prop: 'rank',
          width: '100'
        },
        {
          label: '轮播图片',
          prop: 'img',
          preview: true,
          width: '100'
        },
        {
          label: '图片链接',
          prop: 'banner_url',
          width: '100'
        },
        {
          label: '创建时间',
          prop: 'create_time',
          width: '120',
          slot: scope => {
            return parseTime(scope.row.create_time, '{y}-{m}-{d} {h}:{i}:{s}')
          }
        },
        {
          label: '状态',
          prop: 'show',
          status: true,
          slot: scope => {
            return scope.row.show ? '显示' : '隐藏'
          },
          width: '120'
        },
        {
          label: '操作',
          prop: 'operation',
          btn: true
        }
      ]
    }
  },
  created() {
    this.fetchDate()
  },
  methods: {
    fetchDate() {
      //获取
      searchBanner(this.searchForm).then(res => {
        const resp = res.data
        this.bannerList = resp.data.page_list
        this.total = resp.data.count
      })
    },
    delbaner(_id) {
      //删除当前信息
      this.$confirm('是否确定删除该banner？', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let data = {
            banners: _id,
            method: 'delete'
          }
          deleteBanner(data).then(res => {
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
    //新增
    add() {
      this.modify = false
      this.visable = true
    },
    //编辑
    edit(row) {
      this.modify = true
      this.visable = true
      this.information = row
    },
    //关闭详情弹窗
    closeAdd() {
      this.visable = false
      this.information = {}
    },
    //分页
    handleCurrentChange(val) {
      this.searchForm.page = val
      this.fetchDate()
    }
  }
}
</script>

<style scoped lang='less'>
.table {
  margin: 24px 25px 0;
  background-color: white;
}
.table_top {
  display: flex;
  justify-content: flex-end;
  border-bottom: 1px solid rgba(233, 233, 233, 1);
  .el-button {
    margin: 10px 24px 10px 0;
  }
}
.pagination {
  margin: 10px 25px;
  padding-bottom: 10px;
  display: flex;
  justify-content: flex-end;
}
.bannerImg img {
  width: 65px;
  height: 37px;
}
.error {
  background: #c5c4c7;
}
</style>