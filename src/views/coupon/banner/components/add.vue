<template>
  <!--banner弹窗-->
  <el-dialog
    :visible.sync="dialogFormVisible"
    width="579px"
    :close-on-click-modal="true"
    @close="handleClose"
    :title="title"
  >
    <el-form :model="addForm" label-width="80px" class="dialog-form" ref="addForm" :rules="rules">
      <el-form-item label="名称" prop="banner_name">
        <el-input
          class="item-input"
          placeholder="请输入"
          v-model="addForm.banner_name"
          @keyup.native="val => checkValue(val, 'invoice_number',addForm)"
        ></el-input>
      </el-form-item>
      <el-form-item label="所属" prop="banner_cat">
        <el-select placeholder="请选择" v-model="addForm.banner_cat">
          <el-option label="PC" value="true"></el-option>
          <el-option label="小程序" value="false"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="排序" prop="rank">
        <el-input
          class="item-input"
          placeholder="请输入"
          v-model="addForm.rank"
          @keyup.native="val => checkValue(val, 'rank',addForm)"
        ></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="show">
        <el-select v-model="addForm.show" class="item-select" placeholder="请选择">
          <el-option label="显示" value="true"></el-option>
          <el-option label="隐藏" value="false"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="链接" prop="banner_url">
        <el-input class="item-input" placeholder="请输入" v-model="addForm.banner_url"></el-input>
      </el-form-item>
      <el-form-item label="图片" prop="image">
        <el-upload
          :class="{hide:hideUpload}"
          v-model="addForm.image"
          action="https://upload-z2.qiniup.com"
          :on-success="uploadSuccess"
          :limit="limitCount"
          list-type="picture-card"
          :data="postData"
          :file-list="imageList"
          :before-upload="changeMsg"
          :on-remove="deleteImg"
          :on-change="checkupImg"
          :on-error="uploadError"
          accept=".png, .jpg"
        >
          <el-button class="changeImg_btn" v-if="modify===true" size="small">修改</el-button>
          <img class="add_icon" src="https://qn.ygp.sany.com.cn/Icon%EF%BC%8FPlus.png" v-else />
        </el-upload>

        <small class="tipsText">图片尺寸：1234*1234</small>
      </el-form-item>
      <div class="border"></div>
      <el-form-item>
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="submit">确定</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import filter from '@/utils/changeType'
import { uploadToken } from '@/api/uploadpic'
import { updateInvoice } from '@/api/invoice'
export default {
  name: 'add',
  props: {
    //控制显示与否
    show: {
      type: Boolean,
      default: false
    },
    //判断新增或修改
    modify: {
      type: Boolean,
      default: false
    },
    //修改时显示的原数据
    information: {
      type: [Object, Array],
      default: () => {}
    }
  },
  data() {
    return {
      title: '添加轮播图',
      addForm: {
        banner_name: '',
        banner_url: '',
        rank: '',
        image: []
      },
      //七牛云上传
      postData: {
        key: '',
        token: ''
      },
      imageList: [],
      dialogFormVisible: false,
      hideUpload: false, //隐藏上传按钮
      limitCount: 1, //限制上传文件个数
      deliverCompany: filter._deliverCompany,
      rules: {
        invoice_number: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        invoice_code: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        image: [{ required: true, message: '请选择图片', trigger: 'change' }]
      }
    }
  },
  watch: {
    // 控制展示
    show(value) {
      this.dialogFormVisible = value
      if (this.show) {
        this.init()
      }
    },
    // 控制标题
    modify() {
      this.title = this.modify ? '编辑轮播图' : '添加轮播图'
    },
    // 传入原值
    information: {
      handler(cval, oval) {},
      deep: true
    }
  },
  methods: {
    //数据初始化
    init() {
      if (this.modify) {
        this.addForm = Object.assign({}, this.information)
        this.addForm.show = this.addForm.show ? 'true' : 'false'
        this.addForm.image = []
        this.addForm.image.push(this.addForm.banner_url)
        this.imageList.push({
          url: this.addForm.banner_url
        })
        this.checkupImg()
      }
    },
    //提交表单
    submit(form) {
      let params = Object.assign({}, this.addForm)
      if (this.addForm.show === 'true') {
        params.show = true
      } else if (this.searchForm.show === 'false') {
        params.show = false
      }
    },
    // 输入框只能输入数字
    checkValue(value, key, form) {
      return this.$set(form, key, form[key].replace(/\D/g, ''))
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
    uploadSuccess(res, file, fileList) {
      var url = 'http://qn.ygp.sany.com.cn/' + res.key //图片地址拼接
      this.addForm.image.push(url)
      file.url = url
      this.$refs.addForm.validateField('image')
    },
    deleteImg(file, fileList) {
      //删除详情图操作
      this.hideUpload = fileList.length >= this.limitCount
      this.addForm.image = []
      fileList.forEach((item, index) => {
        this.addForm.image.push(item.url)
      })
    },
    //关闭弹出框
    handleClose() {
      this.imageList = []
      this.$refs['addForm'].resetFields()
      this.addForm = this.$options.data().addForm
      this.$emit('update:show', false)
      this.$emit('close')
    },
    checkupImg(flie, fileList) {
      console.log(flie, fileList)
      if (this.imageList.length != 0) {
        fileList = this.imageList
      }
      this.hideUpload = fileList.length >= this.limitCount
    },
    uploadError(res) {
      //上传失败
    }
  }
}
</script>

<style scoped lang="less">
.el-dialog {
  border-radius: 4px;
}
/deep/.el-dialog__header {
  border-bottom: 1px solid #e6e8ea;
}
/deep/.el-dialog__body {
  padding: 0;
}
.border {
  border-top: 1px solid #e6e8ea;
}
.el-form-item {
  margin: 24px 0 0 13px;
  .el-input,
  .el-select {
    width: 410px;
    height: 32px;
  }
  &:last-child {
    display: flex;
    justify-content: flex-end;
    margin: 0;
    padding: 10px;
  }
}
.changeImg_btn {
  margin-right: 8px;
}
.el-upload,
/deep/.el-upload--picture-card,
/deep/.el-upload-list__item {
  border-radius: 0;
  width: 65px;
  height: 37px;
}
</style>