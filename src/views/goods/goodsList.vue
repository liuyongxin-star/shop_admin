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
            <el-col :span="5" :md="8">
              <el-form-item label="商品名称" prop="name">
                <el-input placeholder="商品名称" v-model="searchForm.name" @keyup.enter.native="search"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="5" :md="8">
              <el-form-item label="商品货号" prop="name">
                <el-input
                  placeholder="商品货号"
                  v-model="searchForm.spu_id"
                  @keyup.enter.native="search"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="5" :md="8">
              <el-form-item label="商品分类" class="item-input">
                <el-cascader
                  :show-all-levels="false"
                  prop="name"
                  ref="myCategory"
                  :placeholder="defaultname"
                  v-model="category_id"
                  @change="onCategoryChange"
                  :props="classify"
                ></el-cascader>
                <!-- 多级下拉菜单-->
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20" align="middle">
            <el-col :span="5" :md="8">
              <el-form-item label="商品品牌" prop="brand">
                <el-select placeholder="商品品牌" v-model="searchForm.brand">
                  <!--品牌遍历列表-->
                  <el-option
                    :label="item.name"
                    :value="item.brand_id"
                    v-for="item in classifyList"
                    :key="item.brand_id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="5" :md="8">
              <el-form-item label="上架状态" prop="available">
                <el-select placeholder="上架状态" v-model="searchForm.available">
                  <el-option label="全部" value></el-option>
                  <el-option label="上架" value="true"></el-option>
                  <el-option label="下架" value="false"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="5" :md="8">
              <el-form-item label="会员商品" prop="vip_area">
                <el-select placeholder="是否会员商品" v-model="searchForm.vip_area">
                  <el-option label="全部" value></el-option>
                  <el-option label="会员商品" value="true"></el-option>
                  <el-option label="非会员商品" value="false"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="5" :md="8" class="search-button">
              <el-form-item>
                <el-button @click="resetForm('searchForm')">重置</el-button>
                <el-button type="primary" @click="search">查询</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
    <div class="add-btn-group">
      <el-form ref="operatorForm" :model="operatorForm" :inline="true">
        <el-form-item>
          <el-select v-model="operatorForm.operate" placeholder="批量操作">
            <el-option label="上架" value="1"></el-option>
            <el-option label="下架" value="2"></el-option>
            <el-option label="设为会员商品" value="3"></el-option>
            <el-option label="取消会员商品" value="4"></el-option>
            <el-option label="批量删除" value="5"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitOperator">确定</el-button>
        </el-form-item>
        <el-button type="primary" @click="editOrder">添加商品</el-button>
      </el-form>
    </div>
    <!-- 数据列表 -->
    <div class="order-list">
      <el-table
        :data="goodsList"
        border
        @selection-change="handleSelectionChange"
        style="width:100%"
        :header-cell-style="{background:'#DCDFE6',color:'#303133'}"
      >
        <el-table-column type="selection"></el-table-column>
        <el-table-column type="index" label="编号" width="50"></el-table-column>
        <el-table-column prop="goodImg" label="商品图片">
          <template slot-scope="scope">
            <img :src="scope.row.img" width="80" />
          </template>
        </el-table-column>
        <el-table-column prop="name" label="商品名称"></el-table-column>
        <el-table-column prop="item_price" label="划线价格">
          <template slot-scope="scope">
            <span>￥{{scope.row.item_price/100}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="sale_price" label="真实售价">
          <template slot-scope="scope">
            <span>￥{{scope.row.sale_price/100}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="spu_id" label="商品编码"></el-table-column>
        <el-table-column prop="available" label="是否上架">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.available" @change="isShow(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="vip_area" label="是否会员商品">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.vip_area" @change="isVIP(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="importance" label="商品推荐"></el-table-column> -->
        <!-- "scope." -->
        <el-table-column prop="set_sold" label="预设销量"></el-table-column>
        <el-table-column prop="real_sold" label="真实销量"></el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button size="mini" @click="editOrder(scope.row._id)">编辑</el-button>
            <el-button size="mini" @click="removeOrder(scope.row._id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 批量操作 -->
    <div class="bottom-box">
      <!--分页功能 -->
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="searchForm.page"
        :page-size="10"
        layout="total, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
    <div style="height:200px"></div>
  </div>
</template>

<script>
import {
  searchGoods,
  deleteGoods,
  showGoods,
  showAllGoods,
  searchBrand,
  searchClassify
} from '@/api/goods'
import { orderFilter } from '@/utils/changeType'

export default {
  created() {
    this.fetchDate()
    // this.classifylist() //获取品牌列表
  },
  data() {
    return {
      searchForm: {
        page: 1,
        limit: 10
      },
      confirmOptions: {},
      goodsList: [],
      total: 100,
      operatorForm: {
        operate: ''
      },
      classifyList: {}, //品牌列表
      defaultname: '',
      //多级下拉菜单
      category_id: '', //获取到的分类ID
      classify: {
        checkStrictly: true,
        multiple: false,
        lazy: true,
        lazyLoad(node, resolve) {
          const { level } = node
          setTimeout(() => {
            if (node.level == 0) {
              searchClassify() //从后台获取数据
                .then(res => {
                  const category_1 = res.data.data.page_list.map(
                    (value, i) => ({
                      value: value.category_id, //设置唯一value，不能重复
                      label: value.name,
                      leaf: node.level >= 2
                    })
                  )
                  // 通过调用resolve将子节点数据返回，通知组件数据加载完成
                  resolve(category_1)
                })
                .catch(err => {})
            }
            if (node.level == 1) {
              const data = {
                family_code: node.value
              }
              searchClassify(data)
                .then(res => {
                  if (res.data.data.page_list.length != 0) {
                    //验证数据是否为空
                    const category_2 = res.data.data.page_list.map(
                      (value, i) => ({
                        value: value.category_id,
                        label: value.name,
                        leaf: node.level >= 2
                      })
                    )
                    // 通过调用resolve将子节点数据返回，通知组件数据加载完成
                    resolve(category_2)
                  }
                })
                .catch(err => {})
            } else if (node.level == 2) {
              const data = {
                family_code: node.value
              }
              searchClassify(data)
                .then(res => {
                  if (res.data.data.page_list.length != 0) {
                    //验证数据是否为空
                    const category_3 = res.data.data.page_list.map(
                      (value, i) => ({
                        value: value.category_id,
                        label: value.name,
                        leaf: node.level >= 2
                      })
                    )
                    // 通过调用resolve将子节点数据返回，通知组件数据加载完成
                    resolve(category_3)
                  }
                })
                .catch(err => {})
            }
          }, 1000)
        }
      }
    }
  },
  methods: {
    fetchDate() {
      //获取
      let params = Object.assign({}, this.searchForm)
      searchGoods(params).then(res => {
        const resp = res.data

        this.goodsList = resp.data.data

        this.total = Math.ceil(resp.data.total_count / this.searchForm.limit) 
      })
    },
    onCategoryChange() {
      //下拉分类点击事件
      //    this.category_id,"id"//选中的所有分类id
      //   this.$refs.myCategory.getCheckedNodes()//选中的所有数据
      //将获取到的分类ID保存到要发送的数据中出去
      let category = this.category_id
      category.forEach(item => {
        if (category.length == 1) {
          this.searchForm.category_1 = item
        } else if (category.length == 2) {
          this.searchForm.category_2 = item
        } else if (category.length == 3) {
          this.searchForm.category_3 = item
        }
      })
    },
    //表单重置
    resetForm(formName) {
      this.$refs['searchForm'].resetFields()
      this.searchForm = []
      this.category_id = ''
      this.searchForm.page = 1
      this.searchForm.limit = 10
    },
    //表单查询
    search() {
      this.searchForm.page = 1
      this.fetchDate()
    },
    //表格选择
    handleSelectionChange(val) {
      this.selectArr = val
    },
    //品牌获取
    classifylist() {
      searchBrand().then(res => {
        this.classifyList = res.data.data.page_list
      })
    },
    //改变分页
    handleCurrentChange(val) {
      this.searchForm.page = val
      this.fetchDate()
    },
    //编辑
    editOrder(res) {
      let _id = res
      if (_id.altKey != undefined) {
        _id = ''
      }
      this.$router.push({
        path: '/product/goodsAdd',
        query: {
          _id
        }
      })
    },
    //上下架
    isShow(val) {
      let data = {
        _id: val._id,
        available: val.available
      }
      showGoods(data).then(res => {
        if (res.data.ret == '0') {
          this.$message({
            message: '修改成功',
            duration: 3000,
            type: 'success'
          })
        } else {
          this.$message({
            message: '添加失败请检查网路设置',
            duration: 3000,
            type: 'error'
          })
        }
      })
    },
    //是否会员商品
    isVIP(val) {
      let data = {
        _id: val._id,
        vip_area: val.vip_area
      }
      showGoods(data).then(res => {
        if (res.data.ret == '0') {
          this.$message({
            message: '修改成功',
            duration: 3000,
            type: 'success'
          })
        } else {
          this.$message({
            message: '添加失败请检查网路设置',
            duration: 3000,
            type: 'error'
          })
        }
      })
    },
    //删除
    removeOrder(_id) {
      let data = {
        spus: _id,
        method: 'delete'
      }
      this.$alert('是否确认删除', {
        confirmButtonText: '确定',
        callback: action => {
          deleteGoods(data).then(res => {
            if (res.data.ret == '0') {
              this.$message({
                message: '删除成功',
                duration: 3000,
                type: 'success'
              })
              const resp = res.data
              this.fetchDate()
            } else {
              this.$message({
                message: '添加失败请检查网路设置',
                duration: 3000,
                type: 'error'
              })
            }
          })
        }
      })
    },
    submitOperator() {
      let type = Number(this.operatorForm.operate)
      let data = this.selectArr
      let spus = ['']
      if (!data) {
        return
      }
      data.forEach(item => {
        spus += item.spu_id + ','
      })
      let res = {}
      switch (type) {
        case 1:
          res = {
            spus: spus,
            available: true
          }

          showAllGoods(res).then(res => {
            if (res.data.ret == '0') {
              this.$message({
                message: '修改成功',
                duration: 3000,
                type: 'success'
              })
              this.fetchDate()
            } else {
              this.$message({
                message: '添加失败请检查网路设置',
                duration: 3000,
                type: 'error'
              })
            }
          })
          break
        case 2:
          res = {
            spus: spus,
            available: false
          }
          showAllGoods(res).then(res => {
            if (res.data.ret == '0') {
              this.$message({
                message: '修改成功',
                duration: 3000,
                type: 'success'
              })
              this.fetchDate()
            } else {
              this.$message({
                message: '添加失败请检查网路设置',
                duration: 3000,
                type: 'error'
              })
            }
          })
          break
        case 3:
          res = {
            spus: spus,
            vip_area: true
          }

          showAllGoods(res).then(res => {
            if (res.data.ret == '0') {
              this.$message({
                message: '修改成功',
                duration: 3000,
                type: 'success'
              })
              this.fetchDate()
            } else {
              this.$message({
                message: '添加失败请检查网路设置',
                duration: 3000,
                type: 'error'
              })
            }
          })
          break
        case 4:
          res = {
            spus: spus,
            vip_area: false
          }
          showAllGoods(res).then(res => {
            if (res.data.ret == '0') {
              this.$message({
                message: '修改成功',
                duration: 3000,
                type: 'success'
              })
              this.fetchDate()
            } else {
              this.$message({
                message: '添加失败请检查网路设置',
                duration: 3000,
                type: 'error'
              })
            }
          })
          break
        case 5:
          res = {
            spus: spus,
            removed: true
          }
          showAllGoods(res).then(res => {
            if (res.data.ret == '0') {
              this.$message({
                message: '修改成功',
                duration: 3000,
                type: 'success'
              })
              const resp = res.data
              this.fetchDate()
            } else {
              this.$message({
                message: '添加失败请检查网路设置',
                duration: 3000,
                type: 'error'
              })
            }
          })
          break
        default:
          alert('匹配操作出错')
          break //最后一个default可以不写break，但建议写上
      }
    }
  },
  filters: {}
}
</script>

<style scoped>
.el-input {
  width: 200px;
}

.searchBox {
  border-radius: 10px;
  padding: 20px;
  border: 1px solid #ccc;
  margin: 20px;
}
.el-table-column {
  text-align: center;
}
.title {
  margin-bottom: 10px;
}
.search-button {
  text-align: center;
}
.add-btn-group {
  text-align: right;
  padding: 0 20px 20px;
}
.order-list {
  padding: 0 20px;
}
.bottom-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  padding: 0 20px;
}
.table-header {
  background: red;
}
</style>