
<template>
  <el-form ref="form" :v-model="sizeForm" label-width="80px" size="mini">
    <el-form-item label="裂变统计" size="medium " style=" margin-top: 30px;margin-left: 77px;">
      <el-date-picker
        @change="getTime"
        style="float:right;margin-right:30px"
        v-model="value2"
        type="datetimerange"
        align="right"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :default-time="['00:00:00','23:59:59']"
        :picker-options="pickerOptions0"
        value-format="timestamp"
      ></el-date-picker>
      <span style="float:right;margin-right:10px">起止时间-</span>
      <!-- <el-radio-group
        @change="changestatis"
        v-model="searchFrom.order_type"
        size="medium"
        style="float:right;margin-right:30px"
      >
        <el-radio-button label="all">总</el-radio-button>
        <el-radio-button label="product">单品</el-radio-button>
        <el-radio-button label="cart">购物车</el-radio-button>
      </el-radio-group> -->
    </el-form-item>
    <el-form-item>
      <el-table
        :data="sizeForm"
        style="width: 100%"
        :default-sort="{prop: 'date', order: 'descending'}"
      >
        <el-table-column prop="date" label="日期" sortable width="180">
          <template slot-scope="scope">{{ scope.row.date}}</template>
        </el-table-column>
        <el-table-column prop="create_sharing_order" label="拼单结算数" sortable>
          <template
            slot-scope="scope"
          >{{scope.row.create_sharing_order }}</template>
        </el-table-column>
        <el-table-column  label="分享次数" sortable>
          <template
            slot-scope="scope"
          >{{scope.row.sharing_times }}</template>
        </el-table-column>
        <el-table-column label="分享订单" sortable>
          <template
            slot-scope="scope"
          >{{scope.row.sharing_order }}</template>
        </el-table-column>       
        <el-table-column label="分享率" sortable>
          <template
            slot-scope="scope"
          >{{scope.row.sharing_order_percent }}</template>
        </el-table-column>

        <el-table-column label="成团数" sortable>
          <template
            slot-scope="scope"
          >{{scope.row.complete_order }}</template>
        </el-table-column>
        <el-table-column label="成团率" sortable>
          <template
            slot-scope="scope"
          >{{scope.row.complete_order_percent }}</template>
        </el-table-column>
        <el-table-column label="分享成团数" sortable>
          <template
            slot-scope="scope"
          >{{scope.row.complete_sharing_order }}</template>
        </el-table-column>
        <el-table-column label="分享成团率" sortable>
          <template
            slot-scope="scope"
          >{{scope.row.complete_sharing_order_percent }}</template>
        </el-table-column>      
      </el-table>
    </el-form-item>
    <el-form-item>
      <!--分页功能 -->
      <el-pagination
        style="margin-bottom:100px"
        @current-change="handleCurrentChange"
        :current-page="searchFrom.page"
        :page-size="20"
        layout="total, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-form-item>
  </el-form>
</template>
<script>
import {searchSharing} from "@/api/orderStatis"
export default {
  created() {
    this.fetchDate();
  },
  data() {
    return {
      value2: "",
      faqipindan: "faqipindan",
      sizeForm: [],
      searchFrom: {
        //查询参数
        page: 1,
        start_time:"",
        end_time:"",
        limit: 20
      },
      total: 100 ,
     pickerOptions0:{//日期选择限制 一年前到今天
      disabledDate(time) {
            let curDate = (new Date()).getTime();
            let year = 365 * 24 * 3600 * 1000;
            let threeMonths = curDate - year;
            return time.getTime() > Date.now() || time.getTime() < threeMonths;;
          }
    },
    };
    
  },
  methods: {
    fetchDate() {
      //获取数据
      searchSharing(this.searchFrom).then(res => {
        this.sizeForm = res.data.data.data;
        this.total = res.data.data.count;
      });
    },
    getTime(res){        

     this.searchFrom.start_time = res[0]/1000
     this.searchFrom.end_time = res[1]/1000
      this.fetchDate();
    },
    // changestatis(res) {
    //   //重绘页面
    //   this.searchFrom.order_type = res;
    //   this.fetchDate();
    // },
    //改变分页
    handleCurrentChange(val) {
      this.searchFrom.page = val;
      this.fetchDate();
    },

  }
};
</script>