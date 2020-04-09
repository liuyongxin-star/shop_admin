  <template>
  <!--添加\编辑弹出框-->
  <div class= "dialog">
  <el-dialog
    :visible.sync="dialogFormVisible"
    width="579px"
    :close-on-click-modal="true"
    @close="handleClose"
    title="求购详情"
  >
      <el-row class="row_top"> 
          <el-col class="dialog_item"  :span="4">
            <span>产品名称：</span>
            </el-col>
            <el-col :span="20">
            <div>{{information.name}}</div>
            </el-col>

        </el-row>
        <el-row class="row_middle">
          <el-col class="dialog_item" :span="4">
            <span>产品描述：</span>
            </el-col>
            <el-col :span="20">
            <div>{{information.desc===""?'--':information.desc}}</div>
            </el-col>
      </el-row>
      <el-row class="row_bottom">
        <el-col class="dialog_item" :span="4">
            <span>产品图片：</span>
            </el-col>
            <el-col :span="20">
            <div class="picture">
            <div v-if="info.img.length===0" class="noPicture"></div>
            <img v-else :src="info.img[0]"/>
            </div>
            </el-col>
      </el-row>
      <el-row class="topBorder" v-if="Number(information.status)===1">
        <div class="bottom">
            <el-col class="dialog_item msg" :span="4">
            <span>我的回复：</span>
            </el-col>
            <el-col :span="20">
               <div>{{info.reply}}</div>
            </el-col>
        </div>
      </el-row>
      <div v-else-if="!(Number(information.status)===1)">
      <el-row class="topBorder bottom" >
            <el-col class="dialog_item msg" :span="4">
            <span>我的回复：</span>
            </el-col>
            <el-col :span="20">
                <el-input
                  type="textarea"
                  :rows="4"
                  maxlength="100"
                  placeholder="请输入回复内容（100字以内）"
                  v-model="info.reply"
                  show-word-limit
                  width="444px"
                ></el-input>
            </el-col>
      </el-row>
      <el-row class="topBorder d_btn">
        <el-button
          @click="handleClose"
        >返回</el-button>
        <el-button
          type="primary"
          @click="submit"
        >确认回复</el-button>      
      </el-row>
    </div>
   </el-dialog>
  </div>
</template>
<script>
import { parseTime } from '@/utils/methods'
import { multiclass } from '@/api/multiclass'
import { searchClassify } from '@/api/goods'
import { updateCoupon } from '@/api/coupon'
export default {
  name: 'addcoupon',
  props: {
    //控制显示与否
    show: {
      type: Boolean,
      default: false
    },
    //原数据
    information: {
      type: [Object, Array],
      default: () => {}
    }
  },
  data() {
    return {
      info:{
        img:[]
      },
      dialogFormVisible: false
    }
  },
  watch: {
    // 控制展示
    show(value) {
      this.dialogFormVisible = value
      if(this.show){
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
    //初始化
    init(){
      this.info = Object.assign({}, this.information)
    },
    //提交回复
    submit(){},
    //关闭弹出框
    handleClose() {
      this.$emit('update:show', false)
      this.$emit('close')
    }
  }
}
</script>

<style scoped lang="less">
.el-dialog {
  border-radius: 4px;
} 
/deep/.el-dialog__header{
  border-bottom: 1px solid #E6E8EA;
}
/deep/.el-dialog__body{
  padding: 0
}
.topBorder{
  border-top: 1px solid #E6E8EA;
}
.picture img{
  width: 66px;
  height: 66px;
}
.noPicture{
  height: 66px;
  width: 66px;
  background: #D8D8D8;
}
.dialog_item{
font-size:14px;
font-family:PingFangSC-Regular,PingFang SC;
font-weight:400;
color:rgba(0,0,0,0.85);
text-align: right
}
.row_top{
  margin-top: 24px;
}
.row_middle{
  margin:16px 0;
}
.row_bottom{
  margin-bottom: 24px;
}
.bottom{
 padding:24px 40px 37px 25px;
}
.msg{
  text-align: left;
  width: 14%;
}
.d_btn{
  display: flex;
  justify-content: flex-end;
  padding:10px 16px 22px 0px;
}
</style>