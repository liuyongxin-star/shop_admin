<template>
  <div class="top-tab bg-white">
    <el-tabs v-model="curTab" @tab-click="tabClick">
      <el-tab-pane
        v-for="(item,index) in tabList"
        :key="index"
        :label="item.count?item.label+'('+item.count+')':item.label"
        :name="item.name"
      >
        <!-- <div :is='item.compontent' keep-alive></div> -->
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  data() {
    return {
      curTab: this.currentView,
     
    };
  },
  props: {
    currentView: String,
    tabList: Array
  },
  watch: {
    currentView(val) {
      this.curTab = val;
    },
    
   
  },
  methods: {
    tabClick() {
      this.$emit("tabClick", this.curTab);
    }
  }
};
</script>

<style scoped>
.top-tab {
  padding-left: 32px;
  margin-right: 20px;
  border-bottom: 1px solid #e8e8e8;
}
.top-tab .el-tabs >>> .el-tabs__header {
  margin: 0;
}
.top-tab .el-tabs >>> .el-tabs__item {
  text-align: center;
  height: 50px;
  line-height: 50px;
}
.top-tab .el-tabs >>> .el-tabs__nav-wrap::after {
  background-color: transparent;
}
</style>