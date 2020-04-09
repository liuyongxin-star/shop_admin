<template>
  <div class="distributionUserInfo">
    <div class="userInfo bg-white fontS14">
      <div class="fontS16 mar_bottom">匹配情况</div>
      <el-row :gutter="20" class="info_item">
        <el-col :span="8">
          <div>
            <span>下单手机：</span>
            <span></span>
          </div>
        </el-col>
        <el-col :span="8">
          <div>
            <span>下单时间：</span>
            <span></span>
          </div>
        </el-col>
        <el-col :span="8">
          <div>
            <span>匹配用时：</span>
            <span></span>
          </div>
        </el-col>
      </el-row>

      <el-row :gutter="20" class="info_item">
        <el-col :span="8">
          <div>
            <span>90%以上</span>
            <span></span>
          </div>
        </el-col>
        <el-col :span="8">
          <div>
            <span>70%以上</span>
            <span></span>
          </div>
        </el-col>
        <el-col :span="8">
          <div>
            <span>未匹配</span>
            <span></span>
          </div>
        </el-col>
      </el-row>

      <el-row :gutter="20" class="info_item">
        <el-col :span="8">
          <div>
            <span>混批情况</span>
            <span></span>
          </div>
        </el-col>
      </el-row>

      <div class="border-width mar_bottom">
        <div class="fontS16 mar_bottom">筛选情况</div>
        <el-row :gutter="20" class="info_item">
          <el-col :span="8">
            <div>
              <span>中断操作：</span>
              <span></span>
            </div>
          </el-col>
          <el-col :span="8">
            <div>
              <span>导出情况：</span>
              <span></span>
            </div>
          </el-col>
          <el-col :span="8">
            <div>
              <span>缺货情况：</span>
              <span></span>
            </div>
          </el-col>
        </el-row>

        <el-row :gutter="20" class="info_item">
          <el-col :span="8">
            <div>
              <span>替换情况：</span>
              <span></span>
            </div>
          </el-col>
          <el-col :span="8">
            <div>
              <span>收藏夹导入情况：</span>
              <span></span>
            </div>
          </el-col>
          <el-col :span="8">
            <div>
              <span>其他推荐补足：</span>
              <span></span>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="fontS16 mar_bottom">购买/加购物车</div>
      <el-row :gutter="20" class="info_item">
        <el-col :span="8">
          <div>
            <span>加购物车情况：</span>
            <span></span>
          </div>
        </el-col>
        <el-col :span="8">
          <div>
            <span>立即购买情况：</span>
            <span></span>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { format_objKey } from "@/utils/methods";
// import { getInfo } from "@/api/easyOrder";
export default {
  name: "distributionUserInfo",
  data() {
    return {
      info: {}
    }
  },
  created() {
    // this.getInfo()
  },
  methods: {
    //获取详情
    // getInfo() {
    //   let data = {
    //      _id: this.$route.query.id
    //   };
    //   getInfo(data).then(res => {
    //     this.info = res.data.data;
    //     console.log(this.info)
    //   })
    // }
  }
}
</script>

<style scoped lang="less">
.distributionUserInfo {
  .userInfo {
    padding: 24px 32px 32px;
    margin: 24px;
    .info_item {
      margin-bottom: 16px;
      color: rgba(0, 0, 0, 0.65);
    }
    .border-width {
      border-top: 1px solid #e8e8e8;
      border-bottom: 1px solid #e8e8e8;
      padding-top: 16px;
    }
    .mar_bottom {
      margin-bottom: 16px;
    }
  }
}
</style>