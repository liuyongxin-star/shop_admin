<template>
  <div>
    <div class="data-list">
      <span>数据列表</span>
      <el-button type="primary" @click="openDialog">新增属性</el-button>
    </div>

    <!-- 数据列表 -->
    <div class="table-box"
    >
      <el-table
      :data="dataList"
      style="width:100%"
      border 
      align='center'
      :header-cell-style="{background:'#DCDFE6',color:'#303133'}"
    >
      <el-table-column label="编号" type="index" width="50"></el-table-column>
      <el-table-column label="属性名称" prop="attrName"></el-table-column>
      <el-table-column label="商品分类" prop="goodClassify"></el-table-column>
      <el-table-column label="属性录入方式" prop="entryMode"></el-table-column>
      <el-table-column label="属性参数" prop="attrPara"></el-table-column>
      <el-table-column label="操作">
        <el-button size="small">编辑</el-button>
        <el-button size="small" type="danger">删除</el-button>
      </el-table-column>
    </el-table>
    </div>
    


 <!--分页功能 -->
 <div class="pagination">
     <el-pagination
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-size="10"
      layout="total, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
 </div>
  

    
    <!-- 弹框 -->
    <el-dialog
      :visible.sync="dialogFormVisible"
      center
      width="35%"
      class="my-dialog"
      title="编辑属性"
      :close-on-click-modal="true"
      :show-close="false"
    >
      <el-form :model="addAttrForm" label-width="100px" class="dialog-form" ref="addAttrForm">
        <el-form-item label="属性名称" prop="attrName">
          <el-input v-model="addAttrForm.attrName"></el-input>
        </el-form-item>
        <el-form-item label="商品分类" prop="attrSelect">
          
              <el-tabs tab-position="left">
            <el-tab-pane label="劳保用品">劳保用品</el-tab-pane>
            <el-tab-pane label="清洁用品">清洁用品</el-tab-pane>
            <el-tab-pane label="安防用品">安防用品</el-tab-pane>
          </el-tabs>
         
        </el-form-item>
        <el-form-item label="录入方式" prop="entrtMode">
          <el-radio-group v-model="addAttrForm.entrtMode">
            <el-radio :label="0">手动</el-radio>
            <el-radio :label="1">表格导入</el-radio>
          </el-radio-group>
        </el-form-item>
         <el-form-item label="属性参数" prop="attrParam">
          <el-input v-model="addAttrForm.attrParam"></el-input> <br>
          <el-button type="primary" size="mini">新增</el-button>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer dialog-btn-ground">
        <el-button  @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { searchGoods,deleteGoods } from "@/api/goods";

export default {
  data() {
    return {
      dialogFormVisible: false,
      currentPage:1,
      total:100,
      reasonForm: {
        reason: "",
        sort: "",
        isEnable: "1"
      },
    //   对话框
       addAttrForm: {
        attrName:'',
      attrSelect:'',
        entrtMode:'',
        attrParam:''
      },
      dataList: [
        {
          attrName: "颜色",
          goodClassify: "劳保用品-劳保手套",
          entryMode: '手动',
          attrPara: "黑色，白色，灰色",
        },
         {
          attrName: "颜色",
          goodClassify: "劳保用品-劳保手套",
          entryMode: '手动',
          attrPara: "黑色，白色，灰色",
        }
      ]
    };
  },
  methods: {
    openDialog() {
      this.dialogFormVisible = true;
      this.$nextTick(()=>{
        this.$refs['addAttrForm'].resetFields()
      })
    },
      handleCurrentChange(val) {   
            this.searchForm.page=val
            this.fetchDate()
    },
  }
}
</script>

<style scoped lang='less'>
.data-list {
  margin: 20px;
  padding: 20px;
  border-radius: 10px;
  border: 1px solid #ccc;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.table-box{
  padding: 0 20px;
}
.pagination{
  display: flex;
  justify-content:flex-end;
  margin-top: 20px;
  padding: 0 20px;
}
.el-dialog {
  border-radius: 10px;
}
.dialog-form {
  width: 70%;
  margin: 0 auto;
}
.dialog-btn-ground {
  .el-button {
    margin-left: 10%;
    width: 100px;
  }
}
</style>