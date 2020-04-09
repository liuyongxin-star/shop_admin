<template>
  <div class="ccontent">
    <el-form ref="form" :model="dataList" label-width="120px" :rules="rules">
      <h3>基本信息</h3>
      <el-form-item label="商品名称" class="item-input" prop="name">
        <el-input v-model="dataList.name" size="small"></el-input>
      </el-form-item>
      <el-form-item label="商品类型" prop="type">
        <el-radio-group v-model="dataList.type">
          <el-radio :label="1">实物</el-radio>
          <el-radio :label="2">虚拟</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="兑换积分" class="item-input" prop="exchange_points">
        <el-input
          v-model="dataList.exchange_points"
          size="small"
          @keyup.native="val => checkValue(val, 'exchange_points')"
        ></el-input>
      </el-form-item>
      <el-form-item label="排序" class="item-input" prop="rank">
        <el-input
          v-model="dataList.rank"
          size="small"
          @keyup.native="val => checkValue(val, 'rank')"
        ></el-input>
      </el-form-item>
      <el-form-item label="商品状态" prop="available">
        <el-radio-group v-model="dataList.available">
          <el-radio :label="true">上架</el-radio>
          <el-radio :label="false">下架</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="商品主图" prop="main_img">
        <el-upload
          :class="{hide:hideUpload}"
          multiple
          v-model="dataList.main_img"
          action="https://upload-z2.qiniup.com"
          :on-success="uploadSuccesslogo"
          :limit="limitCount"
          list-type="picture-card"
          :data="postData"
          :file-list="mainImgList"
          :before-upload="changeMsg"
          :on-remove="deleteMainImg"
          :on-change="checkupImg"
          :on-error="uploadError"
          accept=".png, .jpg"
        >
          <el-button size="small" slot="trigger" type="primary">点击上传图片</el-button>
        </el-upload>
        <small class="tipsText">* 建议图片为正方形，最多添加十张</small>
      </el-form-item>

      <el-form-item label="商品详情图" prop="detail_img">
        <el-upload
          :class="{hide:hideUpload}"
          multiple
          v-model="dataList.detail_img"
          action="https://upload-z2.qiniup.com"
          :on-success="uploadSuccessimg"
          :limit="limitCount"
          list-type="picture-card"
          :before-upload="changeMsg"
          :on-remove="deleteDetailImg"
          :on-change="checkupImg"
          :data="postData"
          :file-list="detailImgList"
          :on-error="uploadError"
          accept=".png, .jpg"
        >
          <el-button size="small" slot="trigger" type="primary">点击上传图片</el-button>
        </el-upload>
        <small class="tipsText">* 建议图片为正方形，最多添加十张</small>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit" v-if="_id">保存修改</el-button>
        <el-button type="primary" @click="onSubmit" v-else>确认添加</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { updateProduct, getProductList } from '@/api/member'
import { format_objKey } from '@/utils/methods'
import { uploadToken } from '@/api/uploadpic'

let _id //获取修改商品拿到的_id
export default {
  data() {
    let _that = this
    return {
      img: false,
      dataList: {
        name: '',
        type: '',
        exchange_points: '',
        rank: '',
        available: '',
        main_img: [],
        detail_img: []
      },
      hideUpload: false, //隐藏上传按钮
      mainImgList: [], //主图回显
      detailImgList: [], //详情回显
      limitCount: 10, //图片限制数量
      //信息填写验证
      rules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        exchange_points: [
          { required: true, message: '请输入兑换积分', trigger: 'blur' }
        ],
        rank: [{ required: true, message: '请输入排序', trigger: 'blur' }],
        type: [
          { required: true, message: '请选择商品类型', trigger: 'change' }
        ],
        available: [
          { required: true, message: '请选择商品状态', trigger: 'change' }
        ],
        main_img: [
          { required: true, message: '请选择图片', trigger: 'change' }
        ],
        detail_img: [
          { required: true, message: '请选择图片', trigger: 'change' }
        ]
      },
      //七牛云上传
      postData: {
        key: '',
        token: ''
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      //获取
      _id = this.$route.query.id //获取页面返回值
      this._id = _id
      if (_id != undefined) {
        //是否为修改信息
        this.img = true
        if (_id != undefined && _id != '' && _id != null) {
          var data = {
            _id: _id
          }
          getProductList(data)
            .then(res => {
              //更新商品信息数据渲染
              const resp = res.data
              this.dataList = resp.data[0]
              this.dataList.type = Number(this.dataList.type)
              this.dataList.main_img.forEach(item => {
                this.mainImgList.push({
                  url: item
                })
              })
              this.dataList.detail_img.forEach(item => {
                this.detailImgList.push({
                  url: item
                })
              })
            })
            .catch(err => {})
        }
      }
    },
    // 输入框只能输入数字
    checkValue(value, key) {
      return this.$set(
        this.dataList,
        key,
        this.dataList[key].replace(/\D/g, '')
      )
    },
    onSubmit() {
      //表单提交
      // console.log(this.mainImgList)
      this.$refs.form.validate(valid => {
        if (valid) {
          // 处理提交数据
          let params = Object.assign({}, this.dataList)
          params.exchange_points = Number(params.exchange_points)
          params.rank = Number(params.rank)
          delete params._id
          if (this._id) {
            params.goods = this._id
            params.method = 'update'
          } else {
            params.method = 'post'
          }
          updateProduct(params)
            .then(res => {
              if (res.data.ret === 0) {
                this.$message({
                  message: this._id ? '修改成功' : '添加成功',
                  type: 'success'
                })
                this.$router.push({ path: '/member/mall/productList' })
              } else {
                this.$message.error(this._id ? '修改失败' : '添加失败')
              }
            })
            .catch(err => {
              this.$message.error(this._id ? '修改失败' : '添加失败')
            })
        }
      })
    },
    //上传图片
    changeMsg(file) {
      //上传前回调
      let _that = this
      let type = false //回调参数，before -upload 返回 为false 上传终止，利用特性解决获取token异步问题
      type = uploadToken(file.name)
        .then(res => {
          if (res.data.ret == 0) {
            _that.postData = { key: file.name, token: res.data.data.upToken }
            return true
          } else {
            return false
          }
        })
        .catch(err => {})
      return type
    },
    uploadSuccessimg(res, file, fileList) {
      //上传成功详情
      var url = 'http://qn.ygp.sany.com.cn/' + res.key //图片地址拼接
      this.dataList.detail_img.push(url)
      file.url = url
      this.$refs.form.validateField('detail_img')
    },
    uploadSuccesslogo(res, file, fileList) {
      //上传成功主图
      var url = 'http://qn.ygp.sany.com.cn/' + res.key //图片地址拼接
      this.dataList.main_img.push(url)
      file.url = url
    },
    deleteMainImg(file, fileList) {
      //删除主图操作
      this.dataList.main_img = []
      fileList.forEach((item, index) => {
        this.dataList.main_img.push(item.url)
      })
      this.hideUpload = fileList.length >= this.limitCount
      this.$refs.form.validateField('main_img')
    },
    deleteDetailImg(file, fileList) {
      //删除详情图操作
      this.dataList.detail_img = []
      fileList.forEach((item, index) => {
        this.dataList.detail_img.push(item.url)
      })
      this.hideUpload = fileList.length >= this.limitCount
      this.$refs.form.validateField('detail_img')
    },
    checkupImg(flie, fileList) {
      this.hideUpload = fileList.length >= this.limitCount
      if (
        this.dataList.main_img.length > 10 ||
        this.dataList.detail_img.length > 10
      ) {
        this.message({
          message: '图片文件过多',
          duration: 3000,
          type: 'error'
        })
        return false
      }
    },
    uploadError(res) {
      //上传失败
    }
  }
}
</script>
<style scoped>
.tipsText {
  color: #999999;
}
.tipsHover {
  color: #ff6725;
  margin-left: 20px;
}
.tipsimg {
  width: 300px;
  height: 400px;
  position: absolute;
  top: -200px;
  left: 320px;
}
.tipsHover > .tipsimg {
  display: none;
}
.tipsHover:hover {
  text-decoration: underline;
}
.demo-form-inline {
  width: 600px;
  border: 1px solid rgba(49, 24, 24, 0.2);
  min-height: 200px;
  padding: 10px;
}
.ccontent {
  width: 1000px;
  margin: 0 auto;
}
.item-input {
  width: 400px;
}
/* 修改默认element 样式*/
.ccontent >>> .el-upload-list--picture-card .el-upload-list__item-thumbnail {
  height: auto;
}
.ccontent >>> .cell > img {
  width: 100px;
}
.hide >>> .el-upload--picture-card {
  display: none;
}
</style>