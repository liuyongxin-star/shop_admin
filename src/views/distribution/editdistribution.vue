<template>
  <div class="editCom">
    <div class="content bg-white fontS14">
      <h1 class="fontS16">基本信息</h1>
      <el-button
        class="btn"
        @click="back"
      >返回</el-button>
      <el-row :gutter="20" class="bit-item border_bottom">
        <el-col :span="8">
          <div class="">
            <span>用户ID:</span>
            <span>{{giftData.user_id}}</span>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="">
            <span>用户名称:</span>
            <span>{{giftData.user_name}}</span>
          </div>
        </el-col>
        <el-col :span="8">
          <div><span>手机号：</span> <span>{{giftData.user_mobile}}</span></div>
        </el-col>
      </el-row>

      <el-row :gutter="20" class="bit-item">
        <el-col :span="8">
          <!--<div>-->
            <!--<span>提现ID:</span>-->
            <!--<span>{{giftData.withdrawal_account_id}}</span>-->
          <!--</div>-->
          <div>
            <span>可提现金额:</span>
            <span>￥{{giftData.last_withdrawal|fixedMoney}}</span>
          </div>
        </el-col>
        <el-col :span="8">
          <div>
            <span>申请提现金额:</span>
            <span>￥{{giftData.money|fixedMoney}}</span>
          </div>
        </el-col>
        <el-col :span="8">
          <div>
            <span>申请时间:</span>
            <span>{{giftData.create_time|dateFilter}}</span>
          </div>
        </el-col>
      </el-row>

      <el-row :gutter="20" class="bit-item">
        <el-col :span="8">
          <div>
            <span>提现状态:</span>
            <span>{{giftData.status|withdrawalTypeFilter}}</span>
          </div>
        </el-col>
        <el-col :span="8">
          <div>
            <span>提现账户:</span>
            <span>{{giftData.type|payTypeFilter(giftData.bank)}}</span>
          </div>
        </el-col>
        <el-col :span="8">
          <div>
            <span>绑定手机号:</span>
            <span v-if="giftData.type==='bank'">{{giftData.card_num}}</span>
            <span v-if="giftData.type==='zfb'">{{giftData.mobile}}</span>
          </div>
        </el-col>
      </el-row>

      <el-row :gutter="20" class="bit-item">
        <el-col :span="8">
          <div>
            <span>绑定人姓名：</span>
            <span>{{giftData.name}}</span>
          </div>
        </el-col>
        <el-col :span="8">
          <div>
            <span>审核人：</span>
            <span>{{giftData.operator_name}}</span>
          </div>
        </el-col>
        <el-col :span="8">
          <div>
            <span>审核时间：</span>
            <span>{{giftData.operate_time|dateFilter}}</span>
          </div>
        </el-col>
      </el-row>
      <el-form
              ref="form"
              :model="giftData"
              label-width="80px"
      >
        <el-form-item
                label="上传凭证"
                v-if="giftData.status!=1"
        >
          <el-upload
                  class="upload-demo1"
                  action="https://upload-z2.qiniup.com"
                  :data="postData"
                  v-model="img_url"
                  :file-list="img_url_detail"
                  :limit="3"
                  list-type="picture-card"
                  accept=".png, .jpg"
                  :before-upload="changeMsg"
                  :on-success="uploadSuccessimg"
                  :on-remove="handleRemove"
                  :on-exceed="isLimitFn"
                  :on-preview="handlePictureCardPreview"
          >
            <el-button
                    size="small"
                    slot="trigger"
                    type="primary"
            >点击上传图片</el-button>
            <el-dialog
                    :visible.sync="dialogVisible"
                    style="z-index: 9998"
            >
              <img
                      width="100%"
                      :src="dialogImageUrl"
                      alt=""
              >
            </el-dialog>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button
                  v-if="giftData.status!=1"
                  type="primary"
                  @click="sendData"
          >保存修改</el-button>
        </el-form-item>
      </el-form>



    </div>

  </div>
</template>

<script>
import memberLevelFilter from '@/utils/changeType'
import { format_objKey } from '@/utils/methods'
import { searchGift, getWithdrawal } from '@/api/member'
import { uploadToken } from '@/api/uploadpic'
export default {
  name: 'editDis',
  data() {
    return {
      giftData: {},
      //七牛云上传
      postData: {
        key: '',
        token: ''
      },
      img_url: [],
      dialogImageUrl: '',
      dialogVisible: false,
      img_url_detail: []
    }
  },
  created() {
    this.getDataGift()
  },
  methods: {
    getDataGift() {
      let obj = {
        _id: this.$route.query.id
      }
      getWithdrawal('get', format_objKey(obj)).then(res => {
        this.img_url = []
        this.img_url_detail = []
        this.giftData = res.data.data
        if (this.giftData.status == 3 || res.data.data.image) {
          this.img_url = res.data.data.image
          res.data.data.image.forEach(item => {
            this.img_url_detail.push({
              url: item
            })
          })
        }
      })
    },
    back() {
      this.$router.go(-1)
    },
    sendData() {
      if (this.img_url.length == 0) {
        this.$message({
          message: '请上传凭证',
          duration: 3000,
          type: 'error'
        })
        return false
      }
      let searchObj = {
        _id: this.giftData._id,
        image: this.img_url,
        status: this.giftData.status
      }
      if (this.giftData.status == 2) {
        searchObj.status = 3
      }
      getWithdrawal('post', searchObj).then(res => {
        this.img_url = []
        this.img_url_detail = []
        this.getDataGift()
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
    uploadSuccessimg(res) {
      //上传成功详情
      var url = 'http://qn.ygp.sany.com.cn/' + res.key //图片地址拼接
      this.img_url.push(url)
    },
    handleRemove(file, fileList) {
      this.img_url = []
      fileList.forEach((item, index) => {
        this.img_url.push('http://qn.ygp.sany.com.cn/' + item.name)
      })
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    isLimitFn(files, filesList) {
      this.$message({
        message: '最多只能上传3张图片',
        duration: 3000,
        type: 'error'
      })
      return false
    }
  },
  filters: {
    //领取状态
    withdrawalTypeFilter(type) {
      return memberLevelFilter._filterType(
        memberLevelFilter._withdrawalStatus,
        type
      )
    },
    //支付类型
    payTypeFilter(type, bank) {
      let brank_name = ''
      switch (type) {
        case 'bank':
          brank_name = bank
          break
        case 'zfb':
          brank_name = '支付宝'
          break
        default:
          break
      }
      return brank_name
    }
  }
}
</script>

<style scoped lang="less">
.editCom {
  .content {
    margin: 24px;
    padding: 24px 32px;
    .bit-item {
      margin-bottom: 16px;
      color: #606266;
      font-size: 14px;
      padding-left: 12px;
      span:nth-child(1) {
        margin-right: 10px;
      }
    }
    .border_bottom{
      border-bottom: 1px solid #E8E8E8;
      padding-bottom: 26px;
    }
    .btn{
      margin-bottom: 8px;
    }
    /deep/.el-input__inner {
      width: 328px;
    }
  }
}
</style>