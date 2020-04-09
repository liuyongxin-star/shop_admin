<template>
  <div class="main">
    <login-bar></login-bar>
    <div class="view-head bg-white">
      <el-breadcrumb separator="/">
        <!--<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>-->
        <el-breadcrumb-item>{{$route.meta.parent}}</el-breadcrumb-item>
        <el-breadcrumb-item v-if="$route.meta.parent_title">{{$route.meta.parent_title}}</el-breadcrumb-item>
        <el-breadcrumb-item :to="{path:$route.path}" class="active-item">{{$route.meta.title}}</el-breadcrumb-item>
      </el-breadcrumb>
      <p class="router-name">{{$route.meta.title}}</p>
    </div>
    <router-view></router-view>
  </div>
</template>
<script>
import loginBar from "./loginBar.vue";
export default {
  components: {
    loginBar
  },
  watch: {
    $route(newData) {}
  },
  mounted() {}
};
</script>

<style scoped>
.view-head {
  margin-right: 20px;
}
/* 面包屑导航 */
.el-breadcrumb {
  padding: 15px 32px;
}
.el-breadcrumb >>> .el-breadcrumb__inner {
  color: rgba(0, 0, 0, 0.45);
}
.active-item >>> .el-breadcrumb__inner {
  color: rgba(0, 0, 0, 0.65);
}
/* 面包屑导航 end*/

.router-name {
  padding: 0 0 12px 32px;
  font-size: 20px;
  font-weight: 500;
}
</style>