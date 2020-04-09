<template>
  <div>
    <div class="data-list">
      <span>数据列表</span>
      <el-button type="primary" @click="openDialog">新增分类</el-button>
    </div>

    <!-- 数据列表 -->
    <div class="table-box">
      <el-table
        :data="dataList"
        style="width:100%"
        border
        :header-cell-style="{background:'#DCDFE6',color:'#303133'}"
      >
        <el-table-column label="编号" type="index" width="50"></el-table-column>
        <el-table-column label="分类名称" prop="name"></el-table-column>
        <el-table-column label="级别" prop="level"></el-table-column>
        <!-- <el-table-column label="商品数量" prop="count"></el-table-column> -->
        <el-table-column label="数量单位" prop="pcs"></el-table-column>
        <el-table-column label="导航栏" prop="navi">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.navi" @change="isNavi(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="是否显示" prop="show">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.show" @change="isShow(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="排序" prop="importance"></el-table-column>
        <el-table-column label="设置" prop="family_code" width="200">
          <template slot-scope="scope">
            <el-button
              size="small"
              v-show="scope.row.level < 3"
              @click="lowerLevel(scope.row.family_code,scope.row.category_id)"
            >查看下级</el-button>
            <el-button
              size="small"
              v-show="scope.row.level > 1"
              @click="breakLevel(scope.row.level,parents_id)"
            >返回上级</el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button size="small" @click="openDialog(scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click="delclassify(scope.row._id)">删除</el-button>
          </template>
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
      <div style="height:200px"></div>
    </div>
    <!-- 弹框 -->
    <el-dialog
      :visible.sync="dialogFormVisible"
      center
      width="40%"
      class="my-dialog"
      :close-on-click-modal="true"
      :show-close="false"
      :data="addClassForm"
    >
      <el-form
        :model="addClassForm"
        :data="addClassForm"
        label-width="150px"
        class="dialog-form"
        ref="addClassForm"
      >
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="addClassForm.name"></el-input>
        </el-form-item>
        <el-form-item label="商品分类" class="item-input">
          <el-cascader
            ref="myCategory"
            :placeholder="defaultname"
            v-model="category_id"
            @change="onCategoryChange"
            :props="classify"
          ></el-cascader>
          <span style="font-size:10px; color:rgb(179,171,171)">不选此项则设为一级分类</span>
          <!-- 多级下拉菜单-->
        </el-form-item>
        <el-form-item label="数量单位" prop="pcs">
          <el-input v-model="addClassForm.pcs"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="importance">
          <el-input v-model="addClassForm.importance"></el-input>
        </el-form-item>
        <el-form-item label="是否显示在导航栏" prop="navi">
          <el-radio-group v-model="addClassForm.navi">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否显示" prop="show">
          <el-radio-group v-model="addClassForm.show">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="分类图标" prop="img">
          <el-upload
            class="upload-demo"
            ref="upload"
            action="https://upload-z2.qiniup.com"
            :before-upload="changeMsg"
            :on-success="uploadSuccess"
            :limit="1"
            :on-remove="dellogo"
            :file-list="classifyImg"
            list-type="picture"
            :data="postData"
            :on-error="uploadError"
            accept=".png, .jpg"
          >
            <el-button size="small" type="primary">点击</el-button>
            <!--   @click="submitUpload" -->
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer dialog-btn-ground">
        <el-button type="primary" @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="changeclassify">提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script src="https://unpkg.com/qiniu-js@<version>/dist/qiniu.min.js"></script>
<script>
import {
  searchBrand,
  deleteBrand,
  changeClassify,
  searchClassify,
  deleteClassify
} from "@/api/goods";
import { uploadToken } from "@/api/uploadpic";
export default {
  created() {
    this.fetchDate();
  },
  data() {
    return {
      classifyImg: [], //回显图标
      defaultname: "", //默认显示分类名
      dialogFormVisible: false,
      currentPage: 1,
      total: 100,
      //新增分类
      addClassForm: {
        name: "", //名称
        family_code: "0", //父级id
        parents_id: "", //祖先id
        pcs: "", //单位
        importance: "", //排序
        level: "1",
        navi: "", //是否导航
        show: "", //是否显示
        _id: "", //
        //文件上传
        img: "" //图片
      },
      parents_id: "0", //返回上级的ID
      searchForm: {
        //分页查询数据
        family_code: "0", //父分类id
        page: 1,
        limit: 10
      },
      dataList: [], //渲染数据
      classify: [], //分类渲染，新增开启获取
      //七牛云上传
      imageurl: "",
      postData: {
        key: "",
        token: ""
      },
      //多级下拉菜单
      category_id: "", //获取到的分类ID
      classify: {
        checkStrictly: true,
        multiple: true,
        lazy: true,
        lazyLoad(node, resolve) {
          const { level } = node;
          setTimeout(() => {
            if (node.level == 0) {
              searchClassify() //从后台获取数据
                .then(res => {
                  const category_1 = res.data.data.page_list.map(
                    (value, i) => ({
                      value: value.category_id, //设置唯一value，不能重复
                      label: value.name,
                      leaf: node.level >= 2
                    })
                  );
                  // 通过调用resolve将子节点数据返回，通知组件数据加载完成
                  resolve(category_1);
                })
                .catch(err => {});
            }
            if (node.level == 1) {
              const data = {
                family_code: node.value
              };
              searchClassify(data)
                .then(res => {
                  if (res.data.data.page_list.length != 0) {
                    //验证数据是否为空
                    const category_2 = res.data.data.page_list.map(
                      (value, i) => ({
                        value: value.category_id,
                        label: value.name,
                        leaf: node.level >= 2
                      })
                    );
                    // 通过调用resolve将子节点数据返回，通知组件数据加载完成
                    resolve(category_2);
                  }
                })
                .catch(err => {});
            } else if (node.level == 2) {
              const data = {
                family_code: node.value
              };
              searchClassify(data)
                .then(res => {
                  if (res.data.data.page_list.length != 0) {
                    //验证数据是否为空
                    const category_3 = res.data.data.page_list.map(
                      (value, i) => ({
                        value: value.category_id,
                        label: value.name,
                        leaf: node.level >= 2
                      })
                    );
                    // 通过调用resolve将子节点数据返回，通知组件数据加载完成
                    resolve(category_3);
                  }
                })
                .catch(err => {});
            }
          }, 1000);
        }
      }
    };
  },
  methods: {
    fetchDate() {
      //页面渲染获取数据
      searchClassify(this.searchForm).then(res => {
        this.dataList = res.data.data.page_list;
        this.total = res.data.data.count;
      });
    },
    onCategoryChange() {
      //下拉分类点击事件
      //  this.category_id//选中的所有分类id
      //    this.$refs.myCategory.getCheckedNodes()//选中的所有数据
      //将获取到的分类ID保存到要发送的数据中出去
      if (this.category_id[0].length > 0) {
        let category = this.category_id[0];
        category = category.splice(",");
        if (category.length == 1) {
          this.addClassForm.level = "2";
          this.addClassForm.family_code = category[0];
        } else if (category.length == 2) {
          this.addClassForm.level = "3";
          this.addClassForm.parents_id = "0";
          this.addClassForm.family_code = category[1];
        } else {
          this.addClassForm.level = "4";
          this.addClassForm.parents_id = category[1];
          this.addClassForm.family_code = category[2];
        }
      } else {
        this.addClassForm.level = "1";
        this.addClassForm.family_code = "0";
      }
    },
    openDialog(val) {
      //打开新增弹窗
      if (val._id != undefined) {
        //回显分类 临时处理 开始
        this.defaultname = val.category_family;
        this.classifyImg = [
          {
            url: val.img
          }
        ];
        //回显分类 临时处理 结束
        this.addClassForm = {
          name: val.name,
          img: val.img,
          pcs: val.pcs,
          _id: val._id,
          family_code: val.family_code, //父级id
          navi: val.navi,
          importance: val.importance,
          show: val.show,
          method: "post"
        };
      } else {
        this.addClassForm = {};
        this.classifyImg = [];
      }
      if (this.classify.length == 0) {
        //获取分类属性
        var data = {
          all: ""
        };
        searchClassify(data).then(res => {
          this.classify = res.data.data.page_list;
        });
      }
      this.dialogFormVisible = true;
    },
    lowerLevel(family_code, category_id) {
      //查看下级
      this.parents_id = family_code;
      this.searchForm.family_code = category_id;
      this.fetchDate();
    },
    breakLevel(level, parents_id) {
      //返回上级
      if (level == "2") {
        //临时处理没有祖先数据
        parents_id = "0";
      }
      this.searchForm.family_code = parents_id;
      this.fetchDate();
    },
    handleCurrentChange(val) {
      //分页
      this.searchForm.page = val;
      this.fetchDate();
    },
    delclassify(_id) {
      //删除
      let data = {
        cIDs: _id,
        method: "delete"
      };
        this.$alert('是否确认删除', {
          confirmButtonText: '确定',
          callback: action => {
      deleteClassify(data).then(res => {
         this.$message({
            message: '删除成功',
            duration: 3000,
            type: 'success'
          })
        this.fetchDate();
        });
       }
      })
    },
    changeclassify() {
      //classify小写为弹窗提交点击事件
      if (
        this.addClassForm.level == undefined ||
        this.addClassForm.level == ""
      ) {
        //验证是否有选择分类，没选择默认为一级目录
        this.addClassForm.level = "1";
        this.addClassForm.family_code = "0";
      }
      if (this.addClassForm._id == undefined) {
        this.addClassForm.method = "post";
      } else {
        this.addClassForm.method = "";
      }
      changeClassify(this.addClassForm).then(res => {
        if (res.data.ret == "0") {
           this.$alert('分类更改成功', '修改分类', {
          confirmButtonText: '确定',
          callback: action => {
            location.reload()
          }
        });
          // this.addClassForm = {}; //清空弹窗
          // this.dialogFormVisible = false;
          // this.fetchDate();
        } else {
          this.$message({
            message: "添加失败请检查网路设置",
            duration: 3000,
            type: "error"
          });
        }
      });
    },
    handleIconImg(file, fileList) {
      this.img = img.slice(0); //获取文件
      this.fileList = fileList.slice(-3);
    },
    isNavi(val) {
      //是否展示
      let data = {
        _id: val._id,
        navi: val.navi
      };
      changeClassify(data).then(res => {
        if (res.data.ret == "0") {
          this.$message({
            message: "修改成功",
            duration: 3000,
            type: "success"
          });
        } else {
          this.$message({
            message: "添加失败请检查网路设置",
            duration: 3000,
            type: "error"
          });
        }
      });
    },
    isShow(val) {
      //是否显示
      let data = {
        _id: val._id,
        show: val.show
      };
      changeClassify(data).then(res => {
        if (res.data.ret == "0") {
          this.$message({
            message: "修改成功",
            duration: 3000,
            type: "success"
          });
        } else {
          this.$message({
            message: "添加失败请检查网路设置",
            duration: 3000,
            type: "error"
          });
        }
      });
    },
    //七牛图片上传
    gettoken(param) {
      //图片点击选择
      let _that = this;
      let key = param.name;
      uploadToken(key).then(res => {
        //获取token
        _that.postData.key = key;
        _that.postData.token = res.data.data.upToken;
      });
    },
    changeMsg(file) {
      //上传前回调
      let _that = this;
      let type = false; //回调参数，before -upload 返回 为false 上传终止，利用特性解决获取token异步问题
      type = uploadToken(file.name).then(res => {
        if (res.data.ret == 0) {
          _that.postData = { key: file.name, token: res.data.data.upToken };
          return true;
        } else {
          return false;
        }
      });
      return type;
    },
    uploadSuccess(res) {
      //上传成功
      var url = "http://qn.ygp.sany.com.cn/" + res.key; //图片地址拼接
      this.addClassForm.img = url;
    },
    dellogo(file) {
      //删除图片操作
      this.addClassForm.img = "";
    },
    uploadError(res) {
      //上传失败
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
.table-box {
  padding: 0 20px;
}
.pagination {
  display: flex;
  justify-content: flex-end;
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
.attr-tab-box {
  display: flex;
  align-items: flex-start;
  .el-tabs {
    border: 1px solid #ccc;
    padding-right: 12px;
    box-sizing: border-box;
  }
  .el-button {
    margin-left: 30px;
  }
}
.dialog-btn-ground {
  .el-button {
    margin-left: 10%;
    width: 100px;
  }
}

.addAttr-box {
  // display: flex;
  // align-items: center;
  margin-top: 10px;
  .el-input {
    width: 200px;
    height: 28px;
    line-height: 28px;
    margin-right: 10px;
  }
}
</style>