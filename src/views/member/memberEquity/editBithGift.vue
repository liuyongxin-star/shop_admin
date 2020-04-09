<template>
    <div class="editCom">
        <div class="content">
            <h1>编辑</h1>
            <el-button class="btn" @click="back">返回</el-button>
            <div class="bit-item">
                <span>领取编号:</span>
                <span>{{giftData.index}}</span>
            </div>
            <div class="bit-item">
                <span>礼品名称:</span>
                <span>{{giftData.name}}</span>
            </div>
            <div class="bit-item">
                <span>用户ID:</span>
                <span>{{giftData.user_id}}</span>
            </div>
            <div class="bit-item">
                <span>用户名称:</span>
                <span>{{giftData.user_name}}</span>
            </div>
            <div class="bit-item">
                <span>会员等级:</span>
                <span>{{giftData.level|levelTypeFilter}}</span>
            </div>
            <div class="bit-item">
                <span>领取时间:</span>
                <span>{{giftData.create_time|dateFilter}}</span>
            </div>
            <div class="bit-item">
                <span>收货人:</span>
                <span>{{giftData.consignee}}</span>
            </div>
            <div class="bit-item">
                <span>收货人联系方式:</span>
                <span>{{giftData.mobile}}</span>
            </div>
            <div class="bit-item">
                <span>收货人地址:</span>
                <span>{{giftData.province}} {{giftData.city}} {{giftData.district}} {{giftData.detail_address}}</span>
            </div>
            <el-form ref="form" :model="giftData" label-width="80px">
                <el-form-item label="领取状态">
                    <el-select v-model="giftData.status" placeholder="请选择领取状态">
                        <el-option :label="giftData.status|receiveTypeFilter" :value="giftData.status"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="快递公司">
                    <el-input v-model.trim="giftData.logistics_company" placeholder="请输入快递公司"></el-input>
                </el-form-item>
                <el-form-item label="快递单号">
                    <el-input v-model.trim="giftData.logistics_number" placeholder="请输入快递单号"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="sendData">保存修改</el-button>
                </el-form-item>
            </el-form>
        </div>

    </div>
</template>

<script>
    import memberLevelFilter from "@/utils/changeType";
    import { format_objKey, } from "@/utils/methods";
    import { searchGift } from "@/api/member";
    export default {
        name: "editBithGift",
        data(){
          return{
              giftData:{},
          }
        },
        created(){
            this.getDataGift();
        },
        methods:{
            getDataGift(){
                this.giftData=JSON.parse(localStorage.getItem('data_gift'));
            },
            back() {
                this.$router.push({ path: '/member/memberbenefits/memberList' })
            },
            sendData() {
                let searchObj={
                    _id:this.giftData._id,
                    logistics_company:this.giftData.logistics_company,
                    logistics_number:this.giftData.logistics_number
                };
                searchGift('post',format_objKey(searchObj)).then(res=>{
                    this.giftData={
                        ...this.giftData,
                        ...searchObj,
                    };
                    localStorage.setItem('data_gift',JSON.stringify(this.giftData));
                    this.$message({
                        message: '修改成功',
                        type: 'success'
                    });
                    this.getDataGift();
                })
            }
        },
        filters: {
            //会员等级类型
            levelTypeFilter(type) {
                return memberLevelFilter._filterType(memberLevelFilter._memberLevelStatus, type);
            },
            //领取状态
            receiveTypeFilter(type) {
                return memberLevelFilter._filterType(memberLevelFilter._giftRecevieStatus, type);
            },
        }
    }
</script>

<style scoped lang="less">
  .editCom{
      .content{
          margin:20px 44px;
          .bit-item{
              margin:22px 0;
              color: #606266;
              font-size: 14px;
              padding-left: 12px;
              span:nth-child(1){
                  margin-right: 48px;
                  display: inline-block;
                  width: 102px;
                  text-align: left;
              }
          }
          /deep/.el-input__inner{
              width: 328px;
          }

      }
  }
</style>