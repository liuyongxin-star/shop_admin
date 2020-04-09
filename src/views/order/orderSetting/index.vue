<template>
  <div class="container">
    <el-form
      :rules="rules"
      :model="orderSettingForm"
      ref="orderSettingForm"
      label-width="120px"
      style="width:65%"
    >
      <el-row :gutter="20">
        <el-col :span="16">
          <el-form-item label="正常订单超过" prop="pay_interval">
            <el-input  v-model.number="orderSettingForm.pay_interval" type="number">
              <span slot="append">分钟</span>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <div class="tips-text">未付款，订单自动关闭</div>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="16">
          <el-form-item label="发货超过" prop="send_interval">
            <el-input  v-model.number="orderSettingForm.send_interval" type="number">
              <span slot="append">天</span>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <div class="tips-text">未收货，订单自动完成</div>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="16">
          <el-form-item label="订单完成超过" prop="delivery_interval">
            <el-input  v-model.number="orderSettingForm.delivery_interval" type="number">
              <span slot="append">天</span>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <div class="tips-text">自动结束交易，不能申请售后</div>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="16">
          <el-form-item label="正常订单超过" prop="evaluation_interval">
            <el-input  v-model.number="orderSettingForm.evaluation_interval" type="number">
              <span slot="append">天</span>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <div class="tips-text">自动五星好评</div>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="16">
          <el-form-item class="button-ground">
            <el-button type="primary" @click="submitSetting('orderSettingForm')">保存</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { orderSetting } from "@/api/order";
export default {
  data() {
    //数据格式验证
    let formatVal=(rule,value,callback)=>{
      let flag=new RegExp('^[1-9][0-9]*$').test(value)
      if(!flag){
       callback(new Error('请输入正整数'))
      }else{
        callback()
      }
    }
    return {
      orderSettingForm: {
        pay_interval: "",
        send_interval: "",
        delivery_interval: "",
        evaluation_interval: ""
      },
      rules: {
        pay_interval: [
         { required: true, message: '请输入时间', trigger: 'blur' },
         { validator:formatVal, trigger: 'blur' }
        ],
        send_interval: [
          { required: true, message: "请输入时间", trigger: "blur" },
           { validator:formatVal, trigger: 'blur' }
        ],
        delivery_interval: [
          { required: true, message: "请输入时间", trigger: "blur" },
           { validator:formatVal, trigger: 'blur' }
        ],
        evaluation_interval: [
          { required: true, message: "请输入时间", trigger: "blur" },
           { validator:formatVal, trigger: 'blur' }
        ]
      }
    };
  },
  methods: {

    //保存
    submitSetting(formName) {
      this.$refs[formName].validate((valid)=>{
        if(valid){ //验证通过
          this.submitVal()
          this.$nextTick(()=>{
             this.$refs['orderSettingForm'].resetFields(); //重置表单
          })
         
        }else{
          return false
        }
      })
    },

    //请求数据
    submitVal(){  
       orderSetting(this.formatData()).then(res => {
        this.$message({
          message:
            res.data.ret == "0" ? "设置成功" : `设置失败！${res.data.msg}`,
          type: res.data.ret == "0" ? "success" : "warning",
          duration: 3000
        });
      });
    },

    //表单数据转化
    formatData(){
      let dataObj={...this.orderSettingForm}
      dataObj.send_interval= dataObj.send_interval * 24 * 60
      dataObj.delivery_interval= dataObj.delivery_interval * 24 * 60
      dataObj.evaluation_interval= dataObj.evaluation_interval * 24 * 60
      return dataObj
    }
  }
};
</script>

<style scoped>
.container {
  width: 85%;
  margin: 40px auto;
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 50px 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
.button-ground {
  margin-bottom: 0;
  text-align: right;
}
.tips-text {
  font-size: 14px;
  color: #606266;
  height: 40px;
  line-height: 40px;
}
</style>