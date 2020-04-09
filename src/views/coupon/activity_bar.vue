<template>
  <div>
    <div class="data-list">
      <span>数据列表</span>
      <el-button
        type="primary"
        @click="openDialog"
      >新增banner</el-button>
    </div>
    <!-- 数据列表 -->
    <div class="table-box">
      <el-table
        :data="bannerList"
        style="width:100%"
        border
        align="center"
        :header-cell-style="{background:'#DCDFE6',color:'#303133'}"
      >
        <el-table-column
          label="编号"
          type="index"
          prop="spu_id"
          width="50"
        ></el-table-column>
        <el-table-column
          label="banner名称"
          prop="banner_name"
        ></el-table-column>
        <el-table-column
          label="轮播排序"
          prop="rank"
        ></el-table-column>
        <el-table-column
          label="LOGO"
          prop="banner_url"
        >
          <template slot-scope="scope">
            <img
              :src="scope.row.banner_url"
              alt="logo"
              width="60"
            >
          </template>
        </el-table-column>
        <el-table-column
          label="是否显示"
          prop="show"
        >
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.show"
              @change="isShow(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="small"
              @click="openDialog(scope.row)"
            >编辑</el-button>
            <el-button
              size="small"
              type="danger"
              @click="delbaner(scope.row._id)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--分页功能 -->
    <div class="pagination">
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="10"
        layout="total, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
      <div style="height:200px"> </div>
    </div>
    <!-- 弹框 -->
    <el-dialog
      :visible.sync="dialogFormVisible"
      center
      width="40%"
      class="my-dialog"
      :close-on-click-modal="true"
      :show-close="false"
      @close="handleClose"
    >
      <el-form
        model="addBrandForm"
        label-width="150px"
        class="dialog-form"
        ref="addBrandForm"
      >
        <el-form-item
          label="活动名称"
          prop="banner_name"
        >
          <el-input
            v-model="addBrandForm.banner_name"
            prop="banner_name"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="大图"
          prop="banner_url"
        >
          <el-upload
            class="upload-demo"
            ref="upload"
            action="https://upload-z2.qiniup.com"
            :before-upload="changeMsg"
            :on-success="uploadSuccess"
            :limit="1"
            list-type="picture"
            :file-list="bannerimg"
            :data="postData"
            :on-error="uploadError"
            accept=".png, .jpg"
          >
            <el-button
              size="small"
              type="primary"
            >点击</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item
          label="排序"
          prop="rank"
        >
          <el-input v-model="addBrandForm.rank"></el-input>
        </el-form-item>
        <el-form-item
          label="链接地址"
          prop="url"
        >
          <el-input v-model="addBrandForm.url"></el-input>
        </el-form-item>
        <el-form-item
          label="是否推荐"
          prop="show"
        >
          <el-radio-group v-model="addBrandForm.show">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
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
          @click="submitOrderChange "
        >提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { searchBanner, deleteBanner, changeBanner } from '@/api/operate'
import { uploadToken } from '@/api/uploadpic'
export default {
  created() {
    this.fetchDate()
  },
  data() {
    return {
      dialogFormVisible: false,
      currentPage: 1,
      total: 100,
      searchForm: {
        page: 1,
        limit: 10,
        type: 'activity_bar'
      },
      //新增activity
      addBrandForm: {
        banner_name: '',
        banner_url: '',
        rank: '',
        show: '',
        type: 'activity_bar'
      },
      bannerimg: [], //activity 图回显
      bannerList: [],
      //七牛云上传
      imageurl: '',
      postData: {
        key: '',
        token: ''
      }
    }
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
      let data = {
        banners: _id,
        method: 'delete',
        type: 'activity_bar'
      }
      deleteBanner(data).then(res => {
        this.fetchDate()
      })
    },
    openDialog(val) {
      //显示弹窗
      //缺失spu_id输入口
      if (val._id != undefined) {
        this.bannerimg = [] //清空之前存放图片，录入回显新图
        this.bannerimg.push({
          url: val.banner_url
        }) //图片回显
        this.addBrandForm = {
          banner_name: val.banner_name,
          banner_url: val.banner_url,
          rank: val.rank,
          show: val.show,
          url: val.url,
          _id: val._id,
          type: 'activity_bar'
        }
      } else {
        this.addBrandForm = {}
        this.addBrandForm.method = 'post'
        this.addBrandForm.type = 'activity_bar'
      }
      this.dialogFormVisible = true
    },
    //关闭弹窗
    handleClose() {
      this.bannerimg = [] //清空图片
      this.addBrandForm = {}
      this.dialogFormVisible = false
    },
    isShow(val) {
      let data = {
        _id: val._id,
        show: val.show,
        type: 'activity_bar'
      }
      changeBanner(data).then(res => {})
    },
    submitOrderChange() {
      //文件上传
      changeBanner(this.addBrandForm).then(res => {
        if (res.data.ret == '0') {
          this.$message({
            message: '修改成功',
            duration: 3000,
            type: 'success'
          })
          this.dialogFormVisible = false
          this.fetchDate()
          this.addBrandForm = {}
        } else {
          this.$message({
            message: '添加失败请检查网路设置',
            duration: 3000,
            type: 'error'
          })
        }
      })
    },
    handleIconImg() {},
    handleCurrentChange(val) {
      //分页
      this.searchForm.page = val
      this.fetchDate()
    },
    resetForm(formName) {
      //表单重置
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
    //七牛图片上传
    gettoken(param) {
      //图片点击选择
      let _that = this
      let key = param.name
      uploadToken(key).then(res => {
        //获取token
        _that.postData.key = key
        _that.postData.token = res.data.data.upToken
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
    uploadSuccess(res) {
      //上传成功
      var url = 'http://qn.ygp.sany.com.cn/' + res.key //图片地址拼接
      this.addBrandForm.banner_url = url
    },
    uploadError(res) {
      //上传失败
      alert(res)
    }
  }
}
</script>

<style scoped lang='less'>
.data-list {
  margin: 20px;
  padding: 20px;
  border-radius: 10px;
  border: 1px solid #ccc;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.table-box {
  padding: 0 20px;
}
.pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  padding: 0 20px;
}
.el-dialog {
  border-radius: 10px;
}
.dialog-form {
  width: 70%;
  margin: 0 auto;
}
.dialog-btn-ground {
  .el-button {
    margin-left: 10%;
    width: 100px;
  }
}
</style>