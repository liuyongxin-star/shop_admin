<template>
  <div>
    <div class="data-list">
      <span>数据列表</span>
      <el-button type="primary" @click="openDialog">新增退货原因</el-button>
    </div>

    <!-- 数据列表 -->
    <el-table
      :data="dataList"
      style="width:100%"
      border
      :header-cell-style="{background:'#DCDFE6',color:'#303133'}"
    >
      <el-table-column label="排序" type="index" width="50"></el-table-column>
      <el-table-column label="编号" prop="number"></el-table-column>
      <el-table-column label="原因" prop="reason"></el-table-column>
      <el-table-column label="启用、禁用" prop="isEnable">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.isEnable"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="添加时间" prop="addTime"></el-table-column>
      <el-table-column label="操作">
        <el-button size="small">编辑</el-button>
        <el-button size="small">删除</el-button>
      </el-table-column>
    </el-table>

    <!-- 弹框 -->
    <el-dialog
      title="编辑退货原因"
      :visible.sync="dialogFormVisible"
      center
      width="25%"
      class="my-dialog"
      :close-on-click-modal="false"
      :show-close='false'
    >
      <el-form :model="reasonForm" label-width="50px" class="dialog-form" ref='reasonForm'>
        <el-form-item label="原因" prop="reason">
          <el-input v-model="reasonForm.reason"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="reasonForm.sort"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="isEnable">
          <el-radio-group v-model="reasonForm.isEnable">
             <el-radio :label="0">启用</el-radio>
          <el-radio :label="1">禁用</el-radio>
          </el-radio-group>
         
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer dialog-btn-ground">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dialogFormVisible: false,
      reasonForm: {
        reason: "",
        sort: "",
        isEnable: "1"
      },
      dataList: [
        {
          reason: "质量问题",
          number: "456131",
          isEnable: false,
          addTime: "2014-12-23 13:23:14"
        },
        {
          reason: "价格问题",
          number: "456131",
          isEnable: false,
          addTime: "2014-12-23 13:23:14"
        }
      ]
    };
  },
  methods: {
    openDialog() {
      this.dialogFormVisible = true;
      this.$nextTick(()=>{
        this.$refs['reasonForm'].resetFields()
      })
    }
  }
};
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