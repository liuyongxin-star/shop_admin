<template>
  <div class="my-search-box bg-white">
        <div class="search-title color85">
          <span class="fontW500">查询</span>
        </div>
        <div class="search-content">
         <slot></slot>
        </div>
        <div class="search-footer">
          <el-button @click="search" size="small" type="primary">查询</el-button>
          <el-button size="small" @click="reset">重置</el-button>
        </div>
      </div>
</template>

<script>
export default {
  methods:{
    search(){
      this.$emit('search')
    },
    reset(){
      this.$emit('reset')
    }
  }
}
</script>

<style>
.my-search-box {
  margin: 24px 0;
}
.my-search-box .search-title {
  height: 55px;
  line-height: 55px;
  padding: 0 32px;
  border-bottom: 1px solid #e9e9e9;
}
.my-search-box .search-content{
  padding: 16px 32px 0
}
.my-search-box .el-form-item {
  margin-bottom: 32px;
  width: 100%
}
.my-search-box .el-form-item  .el-form-item__content, .el-select{
  width: 100%;
}
.my-search-box .search-footer{
  padding:0 32px 48px;
  text-align: right
}
.my-search-box .el-button{
  width: 74px
}
</style>