<template>

  <!--发票凭证弹窗-->
  <el-dialog
    :visible.sync="dialogFormVisible"
    width="450px"
    :close-on-click-modal="true"
    @close="handleClose"
  >
    <el-form
      :model="addForm"
      label-width="80px"
      class="dialog-form"
      ref="addForm"
      :rules="rules"
    >
      <el-form-item
        label="发票号码"
        prop="invoice_number"
      >
        <el-input
          class="item-input"
          placeholder="发票号码"
          v-model="addForm.invoice_number"
          @keyup.native="val => checkValue(val, 'invoice_number',addForm)"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="发票代码"
        prop="invoice_code"
      >
        <el-input
          class="item-input"
          placeholder="发票代码"
          v-model="addForm.invoice_code"
          @keyup.native="val => checkValue(val, 'invoice_code',addForm)"
        ></el-input>
      </el-form-item>

      <el-form-item
        label="物流公司"
        prop="logistics_company"
      >
        <el-select
          v-model="addForm.logistics_company"
          class="item-select"
        >
          <el-option
            v-for="(item,index) in deliverCompany"
            :key="index"
            :label="item.name"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item
        label="物流单号"
        prop="logistics_number"
      >
        <el-input
          class="item-input"
          placeholder="物流单号"
          v-model="addForm.logistics_number"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="快递费用"
        prop="logistics_cost"
      >
        <el-input
          class="item-input"
          placeholder="快递费用"
          v-model="addForm.logistics_cost"
          @keyup.native="val => checkValue(val, 'logistics_cost',addForm)"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="凭证"
        prop="image"
      >
        <el-upload
          :class="{hide:hideUpload}"
          multiple
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
          <el-button
            size="small"
            slot="trigger"
            type="primary"
          >点击上传图片</el-button>
        </el-upload>
        <small class="tipsText">* 只允许一张 </small>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="submit"
        >提交</el-button>
        <el-button
          type="primary"
          @click="handleClose"
        >取消</el-button>
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
      addForm: {
        logistics_company: '',
        logistics_cost: '',
        logistics_number: '',
        invoice_number: '',
        invoice_code: '',
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
    // 传入原值
    information: {
      handler(cval, oval) {},
      deep: true
    }
  },
  methods: {
    //数据初始化
    init() {
      this.hideUpload = false
      this.addForm._id = this.information._id
      if (this.information.invoice_number) {
        this.addForm.invoice_number = this.information.invoice_number
        this.addForm.invoice_code = this.information.invoice_code
        this.addForm.logistics_company = this.information.logistics_company
        this.addForm.logistics_number = this.information.logistics_number
        this.addForm.logistics_cost = this.information.logistics_cost
        this.addForm.image = this.information.image
        this.addForm.image.forEach(item => {
          this.imageList.push({
            url: item
          })
        })
        this.checkupImg()
      }
    },
    //提交表单
    submit(form) {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          this.addForm.logistics_cost = Number(this.addForm.logistics_cost)
          this.addForm.invoice_code = Number(this.addForm.invoice_code)
          this.addForm.invoice_number = Number(this.addForm.invoice_number)
          updateInvoice(this.addForm)
            .then(res => {
              if (res.data.ret === 0) {
                this.$message({
                  message: '提交成功',
                  type: 'success'
                })
                this.dialogFormVisible = false
                this.$emit('success')
              } else {
                this.$message.error('提交失败')
              }
            })
            .catch(err => {
              this.$message.error('提交失败')
            })
        }
      })
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

<style scoped>
.el-dialog {
  border-radius: 10px;
}
.dialog-form {
  width: 70%;
  margin: 0 auto;
}
.hide >>> .el-upload--picture-card {
  display: none;
}
</style>