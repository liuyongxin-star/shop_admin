<template>
  <div class="navBar">
    <el-menu
      :router="true"
      :unique-opened="true"
      @open="handleOpen"
      @close="handleClose"
      background-color="#001529"
      text-color="#fff"
      active-text-color="#fff"
      :default-active="$route.path"
    >
      <el-menu-item class="logo-box">
        <span class="logo-title">管理后台</span>
      </el-menu-item>
      <template v-for="(item,index) in routeArr">
    
        <el-submenu v-if="item.path !== '/'" :index="item.path" :key="index">
          <template slot="title" v-if="item.path !== '/'">
             <i  :class="item.icon"></i>
            <span>{{item.name}}</span>
          </template>

          <el-menu-item-group v-if="item.children && item.children.length ">
            <template v-for="(sub, sdx) in item.children">
              <el-submenu
                v-if="sub.children && sub.children.length"
                :key="sdx"
                :index="item.path + '/' +(sub.path||'')"
              >
                <template slot="title">
                  <span>{{sub.meta? sub.meta.title|| '' : ''}}</span>
                </template>
                <!-- 三级路由 -->
                <template v-for="(sun, sdx) in sub.children">
                  <el-menu-item
                    v-if="sun.meta && sun.meta.isShow"
                    :index="item.path + '/' +(sub.path||'')+ '/' +(sun.path||'')"
                    :key="sdx"
                  >{{sun.meta? sun.meta.title || '' : ''}}</el-menu-item>
                </template>
              </el-submenu>
              <!-- v-else-if="(sub.meta && sub.meta.isShow) || (sub.meta &&( sub.meta.isShow === 'undefined' || sub.meta.isShow === null)) || (!sub.meta)" -->
              <el-menu-item
                v-else-if="!(sub.meta && sub.meta.isShow === false)"
                :key="sdx"
                :index="item.path + '/' +(sub.path||'')"
              >{{sub.meta? sub.meta.title|| '' : ''}}</el-menu-item>
            </template>
          </el-menu-item-group>
        </el-submenu>
      </template>
    </el-menu>
  </div>
</template>

<script>
export default {
  data() {
    return {
      routeArr: [],
      curView: "1"
    };
  },
  methods: {
    handleOpen(index) {
      this.$store.dispatch("changeData", index);
    },
    handleClose() {}
  },
  mounted() {
    this.routeArr = this.$router.options.routes;
  }
};
</script>

<style  scoped>
.logo-box {
  background: #012041;
}
.logo {
  padding-right: 10px;
  border-right: 1px solid #fff;
}
.logo-title {
  font-size: 18px;
  margin-left: 10px;
}
.el-menu {
  border: none;
}
.el-menu .el-menu-item-group .el-menu-item {
  background: #000c17 !important;
}

.title-icon{
    display: inline-block;
    width: 15px;
    height: 15px;
    margin-right: 12px;
    background-position: center;
    background-size: 14px 14px;
}
.logo-box {
  background: #012041 !important;
  box-shadow: 2px 0px 6px 0px rgba(0, 0, 0, 0.4);
  z-index: 999;
}
.el-menu .el-menu-item.is-active {
  background: #1890ff !important;
}
.el-menu >>> .el-menu-item{
  padding-left: 45px !important;
}
 ::-webkit-scrollbar-track-piece {
      background: rgb(0, 21, 41);
    }

    ::-webkit-scrollbar {
      width: 6px;
    }

    ::-webkit-scrollbar-thumb {
      background: #f5f5f5;
      border-radius: 20px;
    }
</style>