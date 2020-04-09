<template>
  <div>
    <div class="shipping-list">
      <span>发货列表</span>
    </div>
    <div class="table-btn-grounp">
      <!-- <el-button type="primary" size="mini">上传表格</el-button> -->
      <el-button
        type="primary"
        size="mini"
        @click="exportExcel"
      >导出表格</el-button>
    </div>

    <!-- 订单列表 -->
    <div class="table-list">
      <el-table
      ref='dataTable'
        id='orderTable'
        :data="orderList"
        row-key="id"
        default-expand-all
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        style="width:100%"
        :header-cell-style="{background:'#DCDFE6',color:'#303133'}"
      >
        <el-table-column
          prop="order_id"
          label="订单编号"
          sortable
         
        ></el-table-column>
        <el-table-column
          prop="product_name"
          label="商品名称"
          sortable
        ></el-table-column>
        <!-- <el-table-column prop='product_item_no' label="货号"></el-table-column> -->
        <el-table-column
          prop
          label="价格"
          sortable
        >
          <template slot-scope="scope">
              <span v-if='scope.row.product_price'>￥{{scope.row.product_price|fixedMoney}}</span> 
          </template>
        </el-table-column>
        <!-- <el-table-column prop="" label="商品图片">
          <template slot-scope="scope">
               <img :src="scope.row.product_img" height="60"  />
               <p v-if='showTableData'>{{scope.row.product_img}}</p>
          </template>
        </el-table-column> -->
        <el-table-column
          prop="product_attr"
          label="规格"
          sortable
        >
          <template slot-scope="scope">
            <span>{{ scope.row.product_attr}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="supplier"
          label="供应商"
        ></el-table-column>
        <el-table-column
          prop="product_count"
          label="数量"
          sortable
        >
          <template slot-scope="scope">
            <span>{{scope.row.product_count}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="consignee"
          label="收货人"
          sortable
        ></el-table-column>
        <el-table-column
          prop="mobile"
          label="手机号码"
          sortable
        ></el-table-column>
        <!-- <el-table-column prop="zip_code" label="邮政编码" sortable></el-table-column> -->
        <el-table-column
          prop="address"
          label="收货地址"
          sortable
        ></el-table-column>
        <el-table-column
          prop="store_name"
          label="商家"
          sortable
        ></el-table-column>
        <el-table-column
          prop=""
          label="物流公司"
        >
          <template slot-scope="scope">
            <el-select
              v-model="scope.row.logistics_company"
              v-if='scope.row.isShowInput!=false&&showSelect==false'
            >
              <el-option
                value='---'
                label="---"
              ></el-option>
              <el-option
                v-for="(item,index) in deliverCompany"
                :key='index'
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
            <p v-if='showTableData||showSelect'>{{scope.row.logistics_company}}</p>
          </template>
        </el-table-column>
        <el-table-column
          prop=""
          label="物流单号"
        >
          <template
            slot-scope="scope"
            v-if='scope.row.isShowInput!=false'
          >
            <el-input
              v-model="scope.row.logistics_number"
              placeholder="请输入"
            ></el-input>
            <p v-if='showTableData'>{{scope.row.logistics_number}}</p>
          </template>
        </el-table-column>
        <el-table-column
          prop="logistics_remarks"
          label="备注"
        >
          <template
            slot-scope="scope"
            v-if='scope.row.isShowInput!=false'
          >
            <el-input
              v-model="scope.row.logistics_remarks"
              placeholder="请输入"
            ></el-input>
            <p v-if='showTableData'>{{scope.row.logistics_remarks}}</p>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="table-btn-grounp">
      <el-button size="mini">取消</el-button>
      <el-button
        type="primary"
        size="mini"
        @click="submitGoods"
      >发货</el-button>
    </div>
  </div>

</template>

<script>
import { getdeliverList, delieverGoods ,getLogistics_company} from '@/api/order'
import filter from '@/utils/changeType'
import FileSaver from 'file-saver'
import XLSX from 'xlsx'
export default {
  data() {
    return {
      showSelect: false,
      showTableData: false,
      orderList: [
        {
          logistics_company: ''
        }
      ], //商品列表
      orderArr: [], //订单发货
      deliverCompany: [] //物流公司
    }
  },

  created() {
    this.fetchData();
    this.getCompany()
  },
  methods: {
   
     //导出表格
    exportExcel () {
        this.showTableData=true
        this.showSelect=true
        this.$nextTick(()=>{
              var xlsxParam = { raw: true };//转换成excel时，使用原始的格式
              let table = document.querySelector("#orderTable");
      var wb = XLSX.utils.table_to_book(table,xlsxParam);
      var wbout = XLSX.write(wb, {
        bookType: "xlsx",
        bookSST: true,
        type: "array"
      });
      try {
        FileSaver.saveAs(
          new Blob([wbout], { type: "application/octet-stream;charset=utf-8" }),
          "sheetjs.xlsx"
        );
       
      } catch (e) {
        if (typeof console !== "undefined") window.console.log(e, wbout);
      }
       this.showTableData=false
        this.showSelect=false
      return wbout;
        })
        try {
          FileSaver.saveAs(
            new Blob([wbout], {
              type: 'application/octet-stream;charset=utf-8'
            }),
            'sheetjs.xlsx'
          )
        } catch (e) {
          if (typeof console !== 'undefined') window.console.log(e, wbout)
        }
        this.showTableData = false
        this.showSelect = false
        return wbout
      },
    
    //获取发货列表
    fetchData() {
      let routerParams = JSON.parse(this.$route.query.selectArr) //选中的订单
      let orderLists = [] //订单号数组
      if (routerParams.length > 1) {
        //多选
        routerParams.forEach(item => {
          orderLists.push(item.order_id)
        })
      } else {
        //单个跳转
        orderLists = [localStorage.getItem('oneItem')]
      }

      //获取数据列表
      getdeliverList(orderLists).then(res => {
        const resp = res.data.data
        // ---给父子增加id字段
       for(let i=0;i<resp.length;i++){ 
         resp[i].id=i;
      
         resp[i].logistics_company='---'   //默认空物流公司
         let product_list=resp[i].children

         // ---给父级增加第一个商品数据
         resp[i]={...resp[i],...product_list[0]}

         product_list.shift() //children删除父级的第一个元素
         product_list.push({})  //添加表格空行
         for(let j=0;j<product_list.length;j++){  //子对象添加id
           product_list[j].id=(i+1)*10+j
             product_list[j].isShowInput=false  //子列表不显示输入框
         }
       }
      
        this.orderList = resp
      });
    },
    //获取物流公司
    getCompany(){
       getLogistics_company().then(res=>{
          this.deliverCompany=res.data.data.logistics_company_list
       })
    },
    // 订单发货
    submitGoods() {
      let orderList = this.orderList
      let flag = []
      orderList.forEach(item => {
        if (
          (!item.logistics_company && !item.logistics_number) ||
          item.logistics_company == '---'
        ) {
          flag.push(item)
        }
      })
      if(flag.length>0){
 this.$message({
          message:'请填写完所有订单信息',
          duration:3000
        })
        return
      }
    
     let orderObjs=this.orderList.map(item=>{ //过滤请求的数组对象
       return {
         order_id:item.order_id,
         logistics_number:item.logistics_number,
         logistics_company:item.logistics_company,
         logistics_remarks:item.logistics_remarks
       }
     })
      if(orderObjs.length==0){
        this.$message({
          message: '暂无可发货订单',
          duration: 3000
        })
        return
      }
      delieverGoods(orderObjs).then(res => {
        const resp = res.data
        if (resp.data.error_order.length > 0) {
          //有失败订单
          this.$message({
            showClose: true,
            message: `订单号${resp.data.error_order}发货失败`,
            type: 'warning'
          })
          return
        }
        if (resp.ret == '0') {
          this.$message({
            showClose: true,
            message: '发货成功',
            type: 'success'
          })
          this.fetchData()
          return
        }
      })
    }

  } 
}
</script>

<style scoped>
.shipping-list {
  border-radius: 10px;
  padding: 20px;
  border: 1px solid #ccc;
  margin: 20px;
}
.table-btn-grounp {
  text-align: right;
  padding: 0 20px;
  margin: 20px 0;
}
.table-list {
  padding: 0 20px;
}

</style>