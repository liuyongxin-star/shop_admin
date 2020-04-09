<template>
  <div class="ccontent">

    <el-form
      ref="form"
      :model="dataList"
      label-width="120px"
      :rules="rules"
    >
      <h3 v-if="status===3||(status==2&&type==='2')">查看</h3>
      <h3 v-else>编辑</h3>
      <el-form-item>
        <el-button @click="back">返回</el-button>
      </el-form-item>
      <el-form-item
        label="订单ID"
        prop="order_id"
      >{{dataList.order_id}}
      </el-form-item>
      <el-form-item
        label="用户ID"
        prop="user_id"
      >{{dataList.user_id}}
      </el-form-item>
      <el-form-item
        label="用户名称"
        prop="user_name"
      >{{dataList.user_name}}
      </el-form-item>
      <el-form-item
        label="商品ID"
        prop="goods_id"
      >{{
        dataList.goods_id
      }}
      </el-form-item>
      <el-form-item
        label="商品名称"
        prop="name"
      >{{dataList.name}}
      </el-form-item>
      <el-form-item
        label="商品类型"
        prop="type"
      >{{dataList.type}}
      </el-form-item>
      <el-form-item
        label="消耗积分"
        prop="exchange_points"
      >{{dataList.exchange_points}}
      </el-form-item>
      <el-form-item
        label="收货人"
        prop="create_time"
      >{{dataList.consignee}}
      </el-form-item>
      <el-form-item
        label="收货地址"
        prop="address"
      >{{dataList.province+dataList.city+dataList.district+dataList.detail_address}}
      </el-form-item>
      <el-form-item
        label="联系方式"
        prop="mobile"
      >{{dataList.mobile}}
      </el-form-item>
      <el-form-item
        label="订单创建时间"
        prop="create_time"
      >{{dataList.create_time}}
      </el-form-item>
      <el-form-item
        label="订单状态"
        prop="status"
      >{{dataList.status}}
      </el-form-item>
      <el-form-item
        label="物流公司"
        v-if="status===3&&type==='1'"
      >{{dataList.logistics_company}}</el-form-item>
      <el-form-item
        label="物流公司"
        prop="logistics_company"
        v-else-if="(status===1||status===2)&&type==='1'"
      >
        <el-select
          v-model="dataList.logistics_company"
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
        v-if="status===3&&type==='1'"
      >{{dataList.logistics_number}}</el-form-item>
      <el-form-item
        label="物流单号"
        prop="logistics_number"
        v-else-if="(status===1||status===2)&& type === '1'"
      >
        <el-input
          class="item-input"
          placeholder="物流单号"
          v-model="dataList.logistics_number"
          @keyup.enter.native="submit"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          v-if="status===2&&type==='1'"
          type="primary"
          @click="submit"
        >提交</el-button>
        <el-button
          v-if="status===1"
          type="primary"
          @click="submit"
        >发货</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>
<script>
import { getOrderList, deliverGoods } from '@/api/member'
import { parseTime, format_objKey } from '@/utils/methods'
import filter from '@/utils/changeType'
let _id //获取修改商品拿到的_id
export default {
  data() {
    let _that = this
    return {
      dataList: {},
      deliverCompany: filter._deliverCompany,
      rules: {
        logistics_number: [
          { required: true, message: '请输入物流单号', trigger: 'blur' }
        ],
        logistics_company: [
          { required: true, message: '请选择物流公司', trigger: 'change' }
        ]
      },
      status: '',
      type: ''
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      //获取
      var data = {
        _id: this.$route.query.id,
        page: 1,
        limit: 1
      }
      getOrderList(data).then(res => {
        const resp = res.data
        this.dataList = resp.data[0]
        this.status = this.dataList.status
        this.type = this.dataList.type
        this.dataList.type = this.$const.PRODUCT_TYPE[this.dataList.type]
        this.dataList.available = this.$const.PRODUCT_AVAILABLE[
          this.dataList.available
        ]
        this.dataList.create_time = parseTime(
          this.dataList.create_time,
          '{y}-{m}-{d} {h}:{i}:{s}'
        )
        this.dataList.status = this.$const.ORDER_STATUS[this.dataList.status]
      })
    },
    submit() {
      var data = {
        _id: this.$route.query.id,
        logistics_company: this.dataList.logistics_company,
        logistics_number: this.dataList.logistics_number,
        status: this.status === 1 ? 2 : ''
      }
      this.$refs.form.validate(valid => {
        if (valid) {
          deliverGoods(format_objKey(data))
            .then(res => {
              if (res.data.ret === 0) {
                this.$message({
                  message: '提交成功',
                  type: 'success'
                })
                this.$router.push({ path: '/member/mall/orderList' })
              } else {
                this.$message.error('提交失败')
                this.fetchData()
              }
            })
            .catch(err => {
              this.$message.error('提交失败')
              this.fetchData()
            })
        }
      })
    },
    back() {
      this.$router.go(-1)
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
.item-select,
.item-input {
  width: 300px;
}
/* 修改默认element 样式*/
.ccontent >>> .el-upload-list--picture-card .el-upload-list__item-thumbnail {
  height: auto;
}
.ccontent >>> .cell > img {
  width: 100px;
}
.img >>> .el-popover__reference {
  padding: 10px;
}
</style>