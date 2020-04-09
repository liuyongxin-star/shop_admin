<template>
  <el-dialog :modal='false' class="my-dialog" :title="title" :width="width" :visible.sync="dialogShow">
    <slot></slot>
    <div slot="footer" class="dialog-footer" v-if="showFooter">
      <el-button size="small" @click="cancel" v-if="showCancelBtn">取 消</el-button>
      <el-button size="small" type="primary" @click="confirm">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: {
    visbile: Boolean,
    width: {
      default: "580px",
      type: String
    },
    title: {
      default: "提示",
      type: String
    },
    showFooter: {
      default: true,
      type: Boolean
    },
    showCancelBtn: {
      default: true,
      type: Boolean
    }
  },
  computed: {
    dialogShow: {
      get() {
        //获取传过来的值
        return this.visbile;
      },
      set(val) {
        //改变后传出去
        this.$emit("close", val);
      }
    }
  },
  watch: {
    dialogShow(val) {
      if (!val) {
        this.visbile = false;
      }
    }
  },
  methods: {
    confirm() {
      this.$emit("confirm");
    },
    cancel() {
      this.$emit("cancel");
    }
  }
};
</script>

<style scoped>
.my-dialog >>> .el-dialog__header {
  border-bottom: 1px solid rgba(0, 0, 0, 0.09);
}
.my-dialog >>> .el-dialog__body {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.my-dialog >>> .el-dialog__footer {
  padding: 10px 16px;
  border-top: 1px solid rgba(0, 0, 0, 0.09);
}
/**表单样式 */
.my-dialog >>> .el-button {
  width: 65px;
}
.my-dialog >>> .el-input,
.my-dialog >>> .el-select {
  width: 224px;
}
.my-dialog >>> .el-form {
  width: 300px;
}
.my-dialog >>> .change-upload {
  display: inline-block;
  margin-left: 20px;
  color: #1890ff;
}
/**表单样式 */
</style>