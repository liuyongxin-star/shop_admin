<template>
  <div>
    <!--发货流程-->
    <div class="margin24 bg-white padding32">
      <h4 class="fontS18">批量发货流程</h4>
      <div class="step-box flex space-around">
        <div v-for="(item,index) in steps" :key="index" class="center">
          <img :src="'https://qn.ygp.sany.com.cn/'+item.icon+'.png'" alt class="icon" />
          <p class="marginB15">{{index+1}}、{{item.title}}</p>
          <el-button
            class="step-btn"
            type="primary"
            size="small"
            v-if="item.btnText"
            :style="{background:item.btnBg?item.btnBg:'#409EFF',border:item.btnBg?item.btnBg:'#409EFF'}"
            @click="templateBtnClick(item.btnFn)"
          >{{item.btnText}}</el-button>
        </div>
        <!-- 文件上传 -->
        <input
          v-show="false"
          class="input-file"
          type="file"
          @change="fileInput($event)"
          accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
        />
      </div>
    </div>
    <!--发货流程 end-->
    <!--发货记录-->
    <div class="padding24 bg-white margin24">
      <h4 class="fontS18">批量发货记录</h4>
      <span class="block marginT10 fontS12 color90">（注：发货成功的快递单号仅可修改一次，请仔细核对后再导入。）</span>
      <div>
        <my-tab :tabList="tabs" v-if="tabs[0].count" @tabClick="tabSwitch"></my-tab>
        <div class="padding24">
          <el-table :data="dataList">
            <el-table-column prop="order_id" label="订单编号"></el-table-column>
            <el-table-column prop="create_time" align="center" label="操作时间">
              <template slot-scope="scope">
                <span>{{scope.row.create_time|dateFilter}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="logistics_company" align="center" label="快递公司"></el-table-column>
            <el-table-column prop="logistics_number" align="center" label="快递单号"></el-table-column>
            <el-table-column prop="import_status" align="center" label="导入状态">
              <template slot-scope="scope">
                <div :class="{'show-circle':true, 'error':scope.row.import_status===false}"></div>
                <span>{{scope.row.import_status===true?'成功':'失败'}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="fail_reason" align="center" label="失败原因"></el-table-column>
            <el-table-column prop="logistics_remarks" align="center" label="备注"></el-table-column>
            <el-table-column label="操作" header-align="center" width="100">
              <template slot-scope="scope">
                <el-link
                  :type="scope.row.modify_count==1?'info':'primary'"
                  class="marginR20"
                  :disabled="scope.row.modify_count==1"
                  @click="openDialog('change',scope.row)"
                >修改</el-link>
                <el-link
                  type="primary"
                  @click="delRowItem(scope.row)"
                  v-if="scope.row.import_status===false"
                >删除</el-link>
              </template>
            </el-table-column>
          </el-table>
        </div>
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
    <!--发货记录end-->
    <!--弹框-->
    <my-dialog
      title="批量发货确认"
      :visbile="changeDialog"
      class="my-dialog"
      @close="closeDialog('change')"
      :showFooter="false"
    >
      <el-form :model="rowItem" ref="rowItem" style="width:400px;" label-width="100px">
        <el-form-item label="订单号：" prop="order_id">
          <el-input v-model="rowItem.order_id" :disabled="rowItem.import_status"></el-input>
        </el-form-item>
        <el-form-item label="快递公司：" prop="logistics_company">
          <el-select v-model="rowItem.logistics_company">
            <el-option
              v-for="(item,index) in companyList"
              :key="index"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="快递单号：" prop="logistics_number">
          <el-input v-model="rowItem.logistics_number" v-number-input></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            size="small"
            style="width:224px"
            @click="sendChang"
          >{{rowItem.import_status?'确认修改':'重新发货'}}</el-button>
          <p class="colorFail fontS12">注：已发货订单仅限修改一次。</p>
        </el-form-item>
      </el-form>
    </my-dialog>
    <!--弹框 end-->
  </div>
</template>

<script>
import { getBatchList, editRecorde, delRecorde } from "@/api/orderBatch";
import { getLogistics_company } from "@/api/order";
import myTab from "@/components/myTab.vue";
import myDialog from "@/components/myDialog.vue";
export default {
  created() {
    this.fetchCompany();
    this.fetchAllType();
  },
  components: {
    myTab,
    myDialog
  },
  data() {
    return {
      companyList: [],
      steps: [
        {
          icon: "icon_blue",
          title: "下载发货模板",
          btnText: "点击下载",
          btnFn: "download"
        },
        {
          icon: "icon_pink",
          title: "填写模板表格"
        },
        {
          icon: "icon_qingcolor",
          title: "导入填好的模板",
          btnText: "点击导入",
          btnBg: "#36CFC9",
          btnFn: "upload"
        },
        {
          icon: "icon_yellow_icon",
          title: "预览并确认发货"
        },
        {
          icon: "icon_green",
          title: "发货成功"
        }
      ],
      tabs: [
        {
          label: "全部",
          name: "all"
        },
        {
          label: "发货成功",
          name: "success"
        },
        {
          label: "发货失败",
          name: "fail"
        }
      ],
      dataList: [],
      total: 0,
      searchForm: {
        page: 1,
        limit: 10
      },
      changeDialog: false,
      rowItem: {}, //修改的对象
      prevChangObj: {} //修改之前存放
    };
  },
  watch: {
    changeDialog(val) {
      if (!val) {
        this.$nextTick(() => {
          this.$refs["rowItem"].resetFields();
        });
      }
    }
  },
  methods: {
    //获取物流公司
    fetchCompany() {
      getLogistics_company().then(res => {
        this.companyList = res.data.data.logistics_company_list;
      });
    },
    //单个类型记录
    fetchData(type = "all") {
      return new Promise((resolve, reject) => {
        getBatchList(this.searchForm, type).then(res => {
          if (res.data.ret === 0) {
            resolve(res.data.data);
          } else {
            reject();
          }
        });
      });
    },
    // 全部类型记录
    fetchAllType() {
      Promise.all([
        this.fetchData(),
        this.fetchData("success"),
        this.fetchData("fail")
      ]).then(res => {
        let tabs = this.tabs;
        tabs.forEach((item, index) => {
          tabs[index] = { ...item, ...res[index] };
        });
        //显示第一个列表
        this.tabSwitch("all");
      });
    },
    //刷新当前页数据
    refresh() {
      this.fetchData(this.curView).then(res => {
        this.dataList = res.send_recording_list;
      });
    },
    tabSwitch(curTab) {
      let tabs = this.tabs;
      this.curView = curTab;
      let activeIndex = tabs.findIndex(item => item.name == curTab);
      this.total = tabs[activeIndex].count;
      this.dataList = tabs[activeIndex].send_recording_list;
    },
    curPageChange(page) {
      this.searchForm.page = page;
      this.refresh();
    },
    
    templateBtnClick(btnFn) {
      if (btnFn == "download") {
        this.downloadTmp();
      } else if (btnFn == "upload") {
        this.isSelectFile = false;
        this.uploadTmp();
      }
    },
    //下载
    downloadTmp() {},
    //上传
    uploadTmp() {},
    openDialog(name, rowItem) {
      switch (name) {
        case "change":
          this.changeDialog = true;
          this.rowItem = rowItem;
          this.prevChangObj = Object.assign({}, rowItem);
          break;
      }
    },
    closeDialog(name) {
      switch (name) {
        case "change":
          this.changeDialog = false;
          break;
      }
    },
    //修改物流
    sendChang() {
      if (JSON.stringify(this.rowItem) == JSON.stringify(this.prevChangObj)) {
        this.$message({
          message: "请做出信息修改"
        });
        return;
      }
      let rowItem = this.rowItem;
      let sendData = {
        send_recording_id: rowItem.send_recording_id,
        logistics_company: rowItem.logistics_company,
        logistics_number: rowItem.logistics_number,
        order_id: rowItem.order_id
      };
      editRecorde(sendData).then(res => {
        const resp = res.data;
        if (resp.data.is_success) {
          this.$message({
            message: "修改成功",
            type: "success"
          });
          this.closeDialog('change')
          this.refresh();
        } else {
          this.$message({
            message: resp.msg
          });
        }
      });
    },
    //删除
    delRowItem(rowItem){
      this.$confirm('删除后无法恢复，是否继续？','提示',{
        confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).then(()=>{
        delRecorde(rowItem.send_recording_id).then(res=>{
          if(res.data.msg=='success'){
            this.$message({
              message:'删除成功',
              type:'success'
            })
            this.refresh()
          }
        })
      }).catch(()=>{})
    },
  }
};
</script>

<style scoped>
.step-btn {
  width: 153px;
}
.marginR20 {
  margin-right: 20px;
}
</style>