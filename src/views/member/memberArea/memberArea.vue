<template>
  <div class="content">
    <!-- 查询框 -->
    <!-- <div class="searchBox">
      <div class="title">查询筛选</div>
      <div>
        <el-form
          :model="searchForm"
          :inline="true"
          ref="searchForm"
          label-width="100px"
          size="mini"
        >

          <el-form-item
            label="商品名称"
            prop="name"
          >
            <el-input
              placeholder="商品名称"
              v-model="searchForm.name"
            ></el-input>
          </el-form-item>

          <el-form-item
            label="商品类型"
            prop="type"
          >
            <el-select
              placeholder="商品类型"
              v-model="searchForm.type"
            >
              <el-option
                value=""
                label="全部"
              ></el-option>
              <el-option
                v-for="(value, key) in $const.PRODUCT_TYPE"
                :label="value"
                :value="key"
                :key="key"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item
            label="上架状态"
            prop="available"
          >
            <el-select
              placeholder="上架状态"
              v-model="searchForm.available"
            >
              <el-option
                value=""
                label="全部"
              ></el-option>
              <el-option
                v-for="(value, key) in $const.PRODUCT_AVAILABLE"
                :label="value"
                :value="key"
                :key="key"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="search"
            >查询</el-button>
            <el-button
              type="primary"
              @click="resetForm"
            >重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div> -->
    <!-- 新增商品 -->
    <!-- <div class="add-btn-group">
      <el-button
        type="primary"
        size="small"
        @click="addProduct"
      >添加商品</el-button>
    </div> -->

    <!-- 数据列表 -->
    <div class="product-list">
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
          >
            <template slot-scope="scope">
              <div v-if="column.preview">

                <el-popover
                  placement="bottom"
                  title=""
                  trigger="hover"
                >
                  <img :src="scope.row.main_img[0]">
                  <img
                    slot="reference"
                    :src="scope.row.main_img[0]"
                    :alt="scope.row.main_img[0]"
                    style="max-height: 50px;max-width: 130px"
                  >
                </el-popover>
              </div>

              <span v-else-if="column.btn">
                <el-button
                  type="primary"
                  size="mini"
                  @click="showProduct(scope.row, scope.$index)"
                >查看</el-button>
                <el-button
                  type="primary"
                  size="mini"
                  @click="editProduct(scope.row, scope.$index)"
                >编辑</el-button>
                <el-button
                  type="danger"
                  size="mini"
                  @click="deleteProduct(scope.row._id, scope.$index)"
                >删除</el-button>
              </span>
              <span v-else>{{scope.row[column.prop]}}</span>
            </template>
          </el-table-column>
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
        :current-page="searchForm.page"
        :page-size="searchForm.limit"
        layout="total, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { getProductList, updateProduct } from '@/api/member'
import { format_objKey, parseTime } from '@/utils/methods'
export default {
  data() {
    return {
      total: 0, //总条数
      //搜索表单
      searchForm: {
        name: '', //商品名称
        page: 1, //页码
        limit: 10 //每页条数
      },
      //数据列表
      dataList: [],
      tableColumn: [
        {
          label: '商品编号',
          prop: 'goods_id',
          width: '80'
        },
        {
          label: '商品图片',
          prop: 'main_img',
          preview: true
        },
        {
          label: '商品名称',
          prop: 'name'
        },
        {
          label: '拼单价',
          prop: 'price'
        },
        {
          label: '白银拼单价',
          prop: 'yin'
        },
        {
          label: '黄金拼单价',
          prop: 'gold'
        },
        {
          label: '铂金拼单价',
          prop: 'bojin'
        },
        {
          label: '钻石拼单价',
          prop: 'zuanshi'
        },
        {
          label: '黑金拼单价',
          prop: 'black'
        },
        {
          label: '创建时间',
          prop: 'create_time',
          width: '210',
          slot: scope => {
            return parseTime(scope.row.create_time, '{y}-{m}-{d} {h}:{i}:{s}')
          }
        }
      ]
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      //获取
      // getProductList(format_objKey(this.searchForm)).then(res => {
      //   const resp = res.data
      //   this.dataList = resp.data
      //   this.total = resp.msg.count
      // })
    },
    // //添加商品
    // addProduct() {
    //   this.$router.push({ path: '/member/mall/addProduct' })
    // },
    // //表单重置
    // resetForm() {
    //   this.$refs['searchForm'].resetFields()
    //   this.fetchData()
    // },
    // //表单查询
    // search() {
    //   console.log(this.searchForm)
    //   this.fetchData()
    // },
    // //商品详情
    // showProduct(row) {
    //   this.$router.push({
    //     path: '/member/mall/productDetail',
    //     query: { id: row._id }
    //   })
    // },
    // //编辑商品
    // editProduct(row) {
    //   this.$router.push({
    //     path: '/member/mall/addProduct',
    //     query: { id: row._id }
    //   })
    // },
    // //删除商品
    // deleteProduct(id) {
    //   this.$confirm('确定删除此商品?', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   })
    //     .then(() => {
    //       var data = {
    //         removed: true,
    //         method: 'update',
    //         goods: id
    //       }
    //       updateProduct(data).then(res => {
    //         if (res.data.ret === 0) {
    //           this.$message.success('删除成功～')
    //           this.fetchData()
    //         }
    //       })
    //     })
    //     .catch(() => {})
    // },
    //改变分页
    handleCurrentChange(val) {
      this.searchForm.page = val
      this.fetchData()
    }
  }
}
</script>

<style scoped>
.content {
  padding: 20px;
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
.search-button {
  text-align: center;
}
.add-btn-group {
  text-align: right;
  padding: 0 20px 20px;
}
.product-list {
  padding: 0 20px;
}
.pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  padding: 0 20px;
}
.previewImg {
  height: 50px;
  width: 50px;
}
</style>