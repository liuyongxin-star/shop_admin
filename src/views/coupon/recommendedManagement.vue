<template>
  <div>
    <!-- 查询框 -->
    <div class="searchBox">
      <div class="title">数据列表</div>
      <div>
        <el-form
          :model="searchForm"
          :inline="true"
          ref="searchForm"
          label-width="100px"
          size="mini"
        >
          <el-row
            :gutter="20"
            align="middle"
          >
            <el-col
              :span="5"
              :md="7"
            >
              <el-form-item
                label="商品名称"
                prop="name"
              >
                <el-input
                  placeholder="商品名称"
                  v-model.trim="searchForm.name"
                  @keyup.enter.native="search"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col
              :span="5"
              :md="7"
            >
              <el-form-item
                label="商品货号"
                prop="spu_no"
              >
                <el-input
                  placeholder="商品货号"
                  v-model.trim="searchForm.spu_no"
                   @keyup.enter.native="search"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col
              :span="5"
              :md="7"
            >
              <el-form-item
                label="商品品牌"
                prop="brand"
              >
                <el-select
                  placeholder="商品品牌"
                  v-model="searchForm.brand"
                >
                  <!--品牌遍历列表-->
                  <el-option
                    :label="item.name"
                    :value="item.brand_id"
                    v-for="item in bannerList"
                    :key="item.brand_id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col
              :span="5"
              :md="3"
              class="search-button"
            >
              <el-form-item>
                <el-button @click="resetForm('searchForm')">重置</el-button>
                <el-button
                  type="primary"
                  @click="search"
                >查询</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
    <div class="add-btn-group">
      <el-form
        ref="operatorForm"
        :model="operatorForm"
        :inline="true"
      >
        <el-form-item>
          <el-select
            v-model="operatorForm.operate"
            placeholder="批量操作"
          >
            <el-option
              label="推荐"
              value="1"
            ></el-option>
            <el-option
              label="不推荐"
              value="2"
            ></el-option>
            <el-option
              label="批量删除"
              value="3"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="submitOperator"
          >确定</el-button>
        </el-form-item>
        <el-button
          type="primary"
          @click="openDialog"
        >添加推荐</el-button>
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
        <el-table-column
          type="index"
          label="编号"
          width="50"
        ></el-table-column>
        <el-table-column
          prop="spu_no"
          label="商品ID"
        ></el-table-column>
        <el-table-column
          prop="goodImg"
          label="商品图片"
        >
          <template slot-scope="scope">
            <img
              :src="scope.row.spu_img[0].img_url"
              width="80"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="商品名称"
        ></el-table-column>
        <el-table-column
          prop="spu_no"
          label="推荐类目"
        ></el-table-column>
        <el-table-column
          prop="sale_price"
          label="价格"
        >
          <template slot-scope="scope">
            <span>￥{{scope.row.sale_price/100}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="recommend"
          label="是否推荐"
        >
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.recommend"
              @change="isShow(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column
          prop="recommend_index"
          label="是否爆款"
        >
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.recommend_index"
              @change="isShow(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="150"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="openDialog(scope.row)"
            >修改</el-button>
            <el-button
              size="mini"
              @click="removeOrder(scope.row._id)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 弹窗 -->
    <el-dialog
      :visible.sync="dialogFormVisible"
      center
      width="40%"
      class="my-dialog"
      :close-on-click-modal="true"
      :show-close="false"
    >
      <!-- -->
      <el-form
        :model="addBrandForm"
        label-width="150px"
        class="dialog-form"
        ref="addBrandForm"
      >
        <el-form-item
          label="商品检索"
          prop="name"
        >
          <el-autocomplete
            v-model="state"
            :fetch-suggestions="querySearchAsync"
            placeholder="请输入商品ID"
            @select="handleSelect"
          ></el-autocomplete>
        </el-form-item>
        <el-form-item
          label="爆款排序"
          prop="recommend_index_rank"
        >
          <el-input
            v-model="addBrandForm.recommend_index_rank"
            size="small"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="分类排序"
          prop="recommend_rank"
        >
          <el-input
            v-model="addBrandForm.recommend_rank"
            size="small"
          ></el-input>
        </el-form-item>
            <el-form-item
          label="促销价格"
          prop="sale_price"
        >
          <el-input
            v-model="addBrandForm.promotion_price"
            size="small"
          ></el-input>
        </el-form-item>

        <el-form-item
          label="是否分类推荐"
          prop="recommend"
        >
          <el-radio-group v-model="addBrandForm.recommend">
            <el-radio :label="true">推荐</el-radio>
            <el-radio :label="false">不推荐</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="是否爆款推荐"
          prop="recommend_index"
        >
          <el-radio-group v-model="addBrandForm.recommend_index">
            <el-radio :label="true">推荐</el-radio>
            <el-radio :label="false">不推荐</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="商品信息">
          <div>商品id：{{goodsMsg.spu_id}}</div>
          <div>商品名称：{{goodsMsg.name}}</div>
          <div>商品分类：{{goodsMsg.categray_name}}</div>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer dialog-btn-ground"
      >
        <el-button
          type="primary"
          @click="dialogFormVisible = false"
        >取消</el-button>
        <el-button
          type="primary"
          @click="submitOrderChange"
        >提交</el-button>
      </span>
    </el-dialog>
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
    <div style="height:200px"> </div>
  </div>
</template>

<script>
import orderFilter from '@/utils/changeType'
import {
  searchGoods,
  deleteGoods,
  searchBrand,
  showGoods,
  showAllGoods,
  searchtest,
  searchClassify
} from '@/api/goods'
import {
  searchRecommend,
  changeRecommend,
  changeAllRecommend
} from '@/api/operate'
export default {
  created() {
    this.fetchDate()
    this.bannerlist() //获取品牌列表
  },
  data() {
    return {
      dialogFormVisible: false,
      searchForm: {
        page: 1,
        limit: 10
      },
      //新增推荐
      addBrandForm: {
        // recommend_type: "", //保留字段无意义
        // recommend_category: "", //一级分类
        recommend_index: true, //是否爆款
        // recommend_index_rank:"",//爆款推荐排序
        // recommend_rank: "", //排序
        // _id: "", //商品_id
        recommend: true ,//是否推荐
        promotion_price:''
      },
      checkList: [], //复选择框信息
      confirmOptions: {},
      goodsList: [],
      total: 100,
      operatorForm: {
        operate: ''
      },
      goodsMsg: {}, //商品详情
      bannerList: {}, //品牌列表
      classif: '', //分类名
      state: '',
      restaurants: [],
      timeout: null
    }
  },
  methods: {
    fetchDate() {
      //获取
      searchRecommend(this.searchForm).then(res => {
      
        let resp = res.data;
        this.goodsList = resp.data;
        this.total = resp.msg.count;
       
        // this.classifyList = resp.msg.category;
      })
    },
    openDialog(val) {
      //新增彈窗顯示
      this.goodsMsg = {}
      if (val._id == undefined) {
        this.addBrandForm = {}
        this.addBrandForm.method = 'post'
      } else {
        this.addBrandForm = {
          recommend_category: val.recommend_category, //一级分类
          recommend_rank: val.recommend_rank, //排列
          recommend: val.recommend, //是否推荐
          recommend_index: val.recommend_index,
          recommend_index_rank: val.recommend_index_rank,
          promotion_price:val.sale_price/100,
          _id: val._id
        }
        this.goodsMsg = {
          spu_id: val.spu_id,
          name: val.name,
          categray_name: val.categray_name
        }
      }
      this.dialogFormVisible = true
    },
    //新增品牌信息
    submitOrderChange() {
      ;(this.addBrandForm.recommend_rank =this.addBrandForm.recommend_rank * 1), //排列
        (this.addBrandForm.recommend_index_rank =this.addBrandForm.recommend_index_rank * 1),
        (this.addBrandForm.recommend_category = this.goodsMsg.category_1),
         (this.addBrandForm.promotion_price =this.addBrandForm.promotion_price *100)
      changeRecommend(this.addBrandForm).then(res => {
        if (res.data.ret == '0') {
          this.$message({
            message: '修改成功',
            duration: 3000,
            type: 'success'
          })
          this.fetchDate()
          this.dialogFormVisible = false
        } else {
          this.$message({
            message: '添加失败请检查网路设置',
            duration: 3000,
            type: 'error'
          })
        }
      })
    },
    querySearchAsync(queryString, cb) {
      //商铺搜索
      var restaurants = this.restaurants
      var results = queryString
        ? restaurants.filter(this.createStateFilter(queryString))
        : restaurants
      let list = [{}]
      var send = {
        name: queryString
      }
      searchGoods(send)
        .then(res => {
          for (let i of res.data.data) {
            i.value = i.name
          }
          list = res.data.data
          cb(list)
        })
        .catch(error => {})
    },
    createStateFilter(queryString) {
      return state => {
        return (
          state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        )
      }
    },
    handleSelect(item) {
      this.addBrandForm._id = item._id
      var data = {
        //查询分类名称
        category_id: item.category_1
      }
      searchClassify(data).then(res => {
        //赋值分类名
        this.goodsMsg = item
        this.addBrandForm.recommend_category =
          res.data.data.page_list[0].category_id
        this.goodsMsg.categray_name = res.data.data.page_list[0].name
        this.addBrandForm.categray_name = res.data.data.page_list[0].name
        //多选框默认勾选
        this.checkList.push(res.data.data.page_list[0].name)
        this.checkList.push('爆款推荐')
      })
    },
    //表单重置
    resetForm(formName) {
          this.$refs['searchForm'].resetFields()
      this.searchForm.page =1
    },
    //表单查询
    search() {
      this.searchForm.page =1
      this.fetchDate();
    },
    //表格选择
    handleSelectionChange(val) {
      this.selectArr = val
    },
    //品牌获取
    bannerlist() {
      searchBrand().then(res => {
        this.bannerList = res.data.data.page_list
      })
    },

    //改变分页
    handleCurrentChange(val) {
      this.searchForm.page = val
      this.fetchDate()
    },
    //编辑
    editOrder(res) {
      var selectArr = res
      if (selectArr.altKey != undefined) {
        selectArr = ''
      }
      this.$router.push({
        path: '/product/goodsAdd',
        query: {
          selectArr
        }
      })
    },
    //上下架
    isShow(val) {
      let data = {
        _id: val._id,
        recommend: val.recommend
      }
       this.$alert('是否确认删除', {
          confirmButtonText: '确定',
          callback: action => {
      changeRecommend(data).then(res => {
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
        }
      })
    },
    //删除
    removeOrder(_id) {
      let data = {
        spus: _id,
        method: 'delete'
      }
      
      changeRecommend(data).then(res => {
        const resp = res.data
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
    },

    //批量操作
    submitOperator() {
      let type = Number(this.operatorForm.operate)
      let data = this.selectArr
      let spus = ['']
      if(data.length==0){
        return
      }
      data.forEach(item => {
        spus += item._id + ','
      })
      let res = {}
      switch (type) {
        case 1:
          res = {
            spus: spus,
            recommend: true
          }

          changeAllRecommend(res).then(res => {
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
            recommend: false
          }
          changeAllRecommend(res).then(res => {
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
            removed: true
          }
          changeAllRecommend(res).then(res => {
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