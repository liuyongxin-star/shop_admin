<template>
  <div>
    <my-tab class="my-tab" :tabList="tabLsit" :currentView="currentView" @tabClick="tabClick"></my-tab>
    <div class="grade-container">
      <my-search @search="search" @reset="reset">
        <el-form :inline="true" :model="searchForm" ref="searchForm">
          <el-row :gutter="20" type="flex" justify="space-between">
            <el-col :span="6" :md="6" :lg="5">
              <el-form-item prop="category_id">
                <div>分类编号</div>
                <el-input v-number-input v-model="searchForm.category_id" placeholder="请输入分类编号"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6" :md="6" :lg="5">
              <el-form-item prop="name">
                <div>分类名称</div>
                <el-input v-model="searchForm.name" placeholder="请输入分类名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6" :md="6" :lg="5">
              <el-form-item prop="level">
                <div>分类等级</div>
                <el-select v-model="searchForm.level" placeholder="请选择分类等级">
                  <el-option label="1" value="1"></el-option>
                  <el-option label="2" value="2"></el-option>
                  <el-option label="3" value="3"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6" :md="6" :lg="5">
              <el-form-item prop="show">
                <div>显示状态</div>
                <el-select v-model="searchForm.show" placeholder="请选择显示状态">
                  <el-option label="显示" :value="true"></el-option>
                  <el-option label="隐藏" :value="false"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </my-search>
      <div class="bg-white">
        <div class="grade-tab">
          <my-tab :tabList="gradeLsit" :currentView="curGrade" @tabClick="gradeClick"></my-tab>
        </div>
        <div class="padding24">
          <el-table :data="dataList">
            <el-table-column prop="category_id" align="center" width="160" label="分类编号"></el-table-column>
            <el-table-column prop="name" align="center" label="分类名称"></el-table-column>
            <el-table-column prop="level" align="center" label="分类等级"></el-table-column>
            <el-table-column prop="importance" align="center" label="排序"></el-table-column>
            <el-table-column prop="show" align="center" label="显示状态">
              <template slot-scope="scope">
                <div :class="{'show-circle':true, 'error':scope.row.show===false}"></div>
                <span>{{scope.row.show===true?'显示':'隐藏'}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="count" align="center" label="包含SKU数"></el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-link
                  type="primary"
                  :class="{'el-border-right':scope.row.level>'1'}"
                  v-if="scope.row.level<'3'"
                  @click="queryGrade(scope.row,'next')"
                >查看下级</el-link>
                <el-link
                  type="primary"
                  v-if="scope.row.level>'1'"
                  @click="queryGrade(scope.row,'prev')"
                >查看上级</el-link>
                <el-link type="primary" @click="openEditeDialog(scope.row)" class="margingL40">编辑</el-link>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="my-pages">
          <el-pagination
            background
            @current-change="curPageChange"
            :current-page="searchForm.page"
            :page-size="searchForm.limit"
            :page-sizes="[10]"
            layout="total, prev, pager, next,sizes, jumper"
            :total="total"
          ></el-pagination>
        </div>
      </div>
      <my-dialog title="分类编辑" :visbile="editDialogShow" :showFooter="false" @close="closeDialog">
        <el-form :model="editForm" ref="editForm">
          <el-form-item label="名称：" prop="name">
            <el-input v-model="editForm.name"></el-input>
          </el-form-item>
          <el-form-item label="排序：" prop="importance">
            <el-input v-model="editForm.importance" v-number-input></el-input>
          </el-form-item>
          <el-form-item label="状态：" prop="show">
            <el-select v-model="editForm.show">
              <el-option label="显示" :value="true"></el-option>
              <el-option label="隐藏" :value="false"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="图标：">
            <el-image class="img-thumbnail" :src="editForm.img" fit="contain">
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline"></i>
              </div>
            </el-image>
            <div class="change-upload">
              <el-upload
                :multiple="false"
                :action="upload_qiniu_url"
                type="primary"
                class="fontS12"
                :data="qiniuData"
                :show-file-list="false"
                :before-upload="beforeUpload"
                :on-success="uploadSuccess"
                accept=".png, .jpg, .jpeg"
              >修改</el-upload>
            </div>
          </el-form-item>
        </el-form>
        <div>
          <el-button size="small" class="cancel-btn" @click="closeDialog">取 消</el-button>
          <el-button size="small" type="primary" @click="updateEdit">确 定</el-button>
        </div>
      </my-dialog>
    </div>
  </div>
</template>

<script>
import myTab from "@/components/myTab.vue";
import mySearch from "@/components/searchBox.vue";
import myDialog from "@/components/myDialog.vue";
import { uploadToken } from "@/api/uploadpic";
import { format_objKey } from "@/utils/methods";
import { searchGrade, updateGrade } from "@/api/gradeClassify";
export default {
  components: {
    myTab,
    mySearch,
    myDialog
  },
  created() {
    this.fetchData();
  },
  data() {
    return {
      tabLsit: [
        {
          label: "pc分类",
          name: "pc-port"
        },
        {
          label: "小程序分类",
          name: "wx-port"
        }
      ],
      gradeLsit: [
        {
          label: "一级",
          name: "1"
        },
        {
          label: "二级",
          name: "2"
        },
        {
          label: "三级",
          name: "3"
        }
      ],
      currentView: "pc-port",
      curGrade: "1",
      total: 0,
      searchForm: {
        category_id: "",
        level: "",
        show: "",
        name: "",
        limit: 10,
        page: 1
      },
      dataList: [],
      editDialogShow: false,
      editForm: {},
      oldUrl: "",
      upload_qiniu_url: "https://upload-z2.qiniup.com", //携带token上传的地址
      qiniuData: {}
    };
  },
  watch: {
    editDialogShow(val) {
      if (!val) {
        //取消dialog，用原本的url
        this.editForm["img"] = this.oldUrl;
        this.$nextTick(() => {
          this.$refs["editForm"].resetFields();
        });
      }
    }
  },
  methods: {
    fetchApi(dataObj) {
      searchGrade(dataObj).then(res => {
        const resp = res.data.data;
        this.dataList = resp.page_list;
        this.total = resp.count;
      });
    },
    //获取七牛token
    beforeUpload(file) {
      return uploadToken(file.name).then(res => {
        if (res.data.ret == 0) {
          this.qiniuData = {
            key: file.name,
            token: res.data.data.upToken
          };
        }
      });
    },
    // 上传后显示
    uploadSuccess(res, file, fileList) {
      this.editForm["img"] = "http://qn.ygp.sany.com.cn/" + res.key;
    },
    //大tab切换
    tabClick(curTab) {
      this.currentView = curTab;
    },
    // 等级 tab切换
    gradeClick(curTab) {
      this.curGrade = curTab;
      this.searchForm.level = curTab;
      this.fetchData(curTab);
    },
    // 列表获取
    fetchData(grade = null) {
      let dataObj = format_objKey(Object.assign({}, this.searchForm));
      // 判断默认获取的等级类型
      if (grade) {
        //搜索
        this.curGrade = grade;
        dataObj["level"] = grade;
      } else {
        //重置
        dataObj["level"] = this.curGrade;
      }
      // 字符串false 添加boolean
      if (this.searchForm["show"] === false) {
        dataObj["show"] = false;
      }

      dataObj["category_id"]
        ? (dataObj["category_id"] = parseInt(dataObj["category_id"]))
        : "";

      this.fetchApi(dataObj);
    },
    search() {
      this.fetchData(this.searchForm["level"]);
    },
    reset() {
      this.$refs["searchForm"].resetFields();
      this.fetchData();
    },
    curPageChange(val) {
      this.searchForm.page = val;
      this.fetchData();
    },
    // 确定编辑发送
    updateEdit() {
      let dataObj = {
        _id: this.editForm["_id"],
        name: this.editForm["name"],
        importance: this.editForm["importance"],
        show: this.editForm["show"],
        img: this.editForm["img"]
      };
      let updateObj = format_objKey(dataObj);
      if (this.editForm["show"] == false) {
        updateObj["show"] = false;
      }
      updateGrade(updateObj).then(res => {
        if (res.data.ret == 0) {
          this.$message({
            message: "修改成功",
            type: "success"
          });
          this.editDialogShow = false;
          this.fetchData();
        }
      });
    },
    openEditeDialog(formObj) {
      this.editDialogShow = true;
      this.editForm = formObj;
      this.oldUrl = formObj["img"];
    },
    closeDialog() {
      this.editDialogShow = false;
      this.$nextTick(() => {
        this.$refs["editForm"].resetFields();
      });
    },
    //查找上一级，下一级
    queryGrade(rowItem, type) {
      let dataObj = {
        limit: 10,
        page: 1
      };
      if (type == "next") {
        dataObj["family_code"] = String(rowItem["category_id"]);
      } else if (type == "prev") {
        if (rowItem["level"] == "2") {
          dataObj["family_code"] = "0";
        } else {
          dataObj["family_code"] = String(rowItem["category_1"]);
        }
      }
      this.fetchApi(dataObj);
    }
  }
};
</script>

<style scoped>
.grade-container {
  padding: 0 24px 24px;
}
/**tab等级 */
.grade-tab >>> .top-tab {
  margin-right: 0;
}
.grade-tab >>> .el-tabs__item {
  font-size: 16px;
  width: 113px;
}
.grade-tab >>> .el-tabs__active-bar {
  width: 113px;
  box-sizing: border-box;
}
/**tab等级 end*/
.el-image .image-slot {
  background: #f5f7fa;
}

.cancel-btn {
  margin-right: 94px;
}
</style>