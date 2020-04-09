<template>
 <div class="login-bar bg-white fontS14 color65 box-shadow">
      <div class="user-box flex">
        <div class="user-img"></div>
        <span>{{phone}}</span>
      </div>
      <div class="logout flex" @click="signOut">退出登录</div>
    </div>
</template>

<script>
import {  getMobile } from '@/utils/auth'
export default {
  data() {
    return {
       phone:""
    };
  },
   created() {
   this.phone=getMobile()||"用户名"
  },

  methods:{
     signOut(){
      //退出登录
        return this.$store.dispatch("logout").then(res => {
          this.$router.push({ path: "/enter/login" });
          this.$message.success("退出成功");
        });
    }
  }
}
</script>

<style scoped>
/*登录条 */
.login-bar{
  margin-right: 20px;
  border-bottom: 1px solid rgba(0,21,41,0.12);
  height: 64px;
  display: flex;
  justify-content: flex-end;
  padding: 0 23px;
}
.login-bar .user-box{
 margin-right: 40px
}
.login-bar .user-box .user-img{
  width: 24px;
  height: 24px;
  border-radius: 50%;
  margin-right: 10px;
  background:#A6DBFF ;
  box-sizing: border-box;
  border: 1px solid #D4D7D9
}
.logout{
  cursor:pointer;
}
/*登录条  end*/
</style>