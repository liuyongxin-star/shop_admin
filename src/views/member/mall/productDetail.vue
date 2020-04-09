<template>
  <div class="ccontent">

    <el-form
      ref="form"
      :model="dataList"
      label-width="120px"
    >
      <h3>商品详情</h3>
      <el-form-item>
        <el-button
          type="primary"
          @click="edit"
        >编辑</el-button>
        <el-button @click="back">返回</el-button>
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
        label="兑换积分"
        prop="exchange_points"
      >{{dataList.exchange_points}}
      </el-form-item>
      <el-form-item
        label="排序"
        prop="rank"
      >{{
        dataList.rank
      }}
      </el-form-item>
      <el-form-item
        label="商品状态"
        prop="available"
      >{{dataList.available}}
      </el-form-item>
      <el-form-item
        label="商品主图"
        prop="main_img"
      >
        <div class="img">
          <el-popover
            placement="bottom"
            title=""
            trigger="hover"
            v-for="img in dataList.main_img"
            :key="img"
          >
            <img :src="img">
            <img
              slot="reference"
              :src="img"
              :alt="img"
              style="max-height: 150px;max-width: 150px"
            >
          </el-popover>
        </div>
      </el-form-item>

      <el-form-item
        label="商品详情图"
        prop="detail_img"
      >
        <div class="img">
          <el-popover
            placement="bottom"
            title=""
            trigger="hover"
            v-for="img in dataList.detail_img"
            :key="img"
          >
            <img :src="img">
            <img
              slot="reference"
              :src="img"
              :alt="img"
              style="max-height: 150px;max-width: 150px"
            >
          </el-popover>
        </div>
      </el-form-item>
      <el-form-item
        label="兑换数量"
        prop="real_sold"
      >{{
        dataList.real_sold
      }}
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { getProductList } from '@/api/member'

let _id //获取修改商品拿到的_id
export default {
  data() {
    let _that = this
    return {
      dataList: {}
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      //获取
      var data = {
        _id: this.$route.query.id
      }
      getProductList(data).then(res => {
        const resp = res.data
        this.dataList = resp.data[0]
        this.dataList.type = this.$const.PRODUCT_TYPE[this.dataList.type]
        this.dataList.available = this.$const.PRODUCT_AVAILABLE[
          this.dataList.available
        ]
      })
    },
    back() {
      this.$router.go(-1)
    },
    edit() {
      this.$router.push({
        path: '/member/mall/addProduct',
        query: { id: this.$route.query.id }
      })
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
.img >>> .el-popover__reference {
  padding: 10px;
}
</style>