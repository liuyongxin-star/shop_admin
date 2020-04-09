<template>
  <div class="detail">
    <div class="detail_left">
      <div class="detail_item">
        <el-button @click="back">返回上级</el-button>
      </div>
      <div class="detail_item">
        <span>发票抬头:</span>
        <span>{{dataList.invoice_title}}</span>
      </div>
      <div class="detail_item">
        <span>单位地址:</span>
        <span>{{dataList.address?dataList.address:'无'}}</span>
      </div>
      <div class="detail_item">
        <span>开户银行:</span>
        <span>{{dataList.bank_name?dataList.bank_name:'无'}}</span>
      </div>
      <div class="detail_item">
        <span>银行账号:</span>
        <span>{{dataList.bank_account?dataList.bank_account:'无'}}</span>
      </div>
      <div class="detail_item">
        <span>申请账号:</span>
        <span>{{dataList.user_id}} (昵称：{{dataList.user_name}})</span>
      </div>
    </div>
    <div class="detail_right">
      <div class="detail_item">
        <div class="detail_item">
          <span>税号:</span>
          <span>{{dataList.tax_num}}</span>
        </div>
        <div class="detail_item">
          <span>发票类型:</span>
          <span>{{dataList.invoice_title_type}}</span>
        </div>
        <div class="detail_item">
          <span>联系电话:</span>
          <span>{{dataList.mobile}}</span>
        </div>
      </div>
    </div>
    <h4>订单详情</h4>
    <div class="order_detail">
      <template v-for="(item,index) in dataList.order_detail">
        <p :key="index+'p'">订单{{index+1}}</p>
        <div
          class="table_item"
          :key="index+'d1'"
        >
          <p>基本信息</p>
          <table
            :key="index+'table1'"
            class="table"
          >
            <th>订单编号</th>
            <th>用户账户</th>
            <th>支付方式</th>
            <th>订单类型</th>
            <tr>
              <td>{{order_detail[index].order_id}}</td>
              <td>{{dataList.user_id}}</td>
              <td>{{order_detail[index].pay_manner}}</td>
              <td>{{$const.ORDER_TYPE[order_detail[index].order_type]}}</td>
            </tr>
          </table>
        </div>
        <div
          class="table_item"
          :key="index+'d2'"
        >
          <p>商品信息</p>
          <el-table
            :key="index"
            :data="tableList[index]"
            border
            ref="multipleTable"
            style="width:100%"
            :header-cell-style="{background:'#DCDFE6',color:'#303133'}"
          >
            <template v-for="column in tableColumn1">
              <el-table-column
                :key="column.id"
                :fixed="column.fixed"
                :label="column.label"
                :prop="column.prop"
                v-if="!column.slot"
                :width="column.width"
              >
                <template slot-scope="scope">
                  <span>{{scope.row[column.prop]?scope.row[column.prop]:'无'}}</span>
                </template>
              </el-table-column>
              <el-table-column
                :key="column.id"
                :fixed="column.fixed"
                :label="column.label"
                :prop="column.prop"
                v-else
                :width="column.width"
              >
                <template slot-scope="scope">
                  <span v-html="column.slot(scope)"></span>
                </template>
              </el-table-column>
            </template>
          </el-table>
        </div>
        <div
          class="table_item"
          :key="index+'d3'"
        >
          <p>商品信息</p>
          <table
            :key="index+'table2'"
            class="table"
          >
            <th>物流公司</th>
            <th>物流单号</th>
            <th>签收时间</th>
            <th>收货人</th>
            <th>手机号码</th>
            <th>邮政编码</th>
            <th>收货地址</th>
            <th>快递费用</th>
            <tr>
              <td>{{order_detail[index].logistics_company}}</td>
              <td>{{order_detail[index].logistics_number}}</td>
              <td>{{order_detail[index].delivery_time}}</td>
              <td>{{order_detail[index].consignee}}</td>
              <td>{{order_detail[index].mobile}}</td>
              <td>{{order_detail[index].zip_code}}</td>
              <td>{{order_detail[index].address}}</td>
              <td>{{order_detail[index].freight_price===0?'--':order_detail[index].freight_price+"元"}}</td>
            </tr>
          </table>
        </div>
        <div
          class="table_item"
          :key="index+'d4'"
        >
          <p>附加费用</p>
          <table
            :key="index+'table'"
            class="table"
          >
            <th>运费</th>
            <th>会员折扣</th>
            <th>满减优惠</th>
            <th>平台优惠券</th>
            <th>其他</th>
            <tr>
              <td>{{order_detail[index].freight_price===0?'--':order_detail[index].freight_price+"元"}}</td>
              <td>--</td>
              <td>--</td>
              <td>--</td>
              <td>--</td>
            </tr>
          </table>
        </div>
        <div
          class="table_item"
          :key="index+'d5'"
        >
          <p>最终费用</p>
          <el-table
            :key="index+'a'"
            :data="tableList[index]"
            border
            ref="multipleTable"
            style="width:100%"
            :header-cell-style="{background:'#DCDFE6',color:'#303133'}"
          >
            <template v-for="column in tableColumn2">
              <el-table-column
                :key="column.id"
                :fixed="column.fixed"
                :label="column.label"
                :prop="column.prop"
                v-if="!column.slot"
                :width="column.width"
              >
                <template slot-scope="scope">
                  <span>{{scope.row[column.prop]}}</span>
                </template>
              </el-table-column>
              <el-table-column
                :key="column.id"
                :fixed="column.fixed"
                :label="column.label"
                :prop="column.prop"
                v-else
                :width="column.width"
              >
                <template slot-scope="scope">
                  <span v-html="column.slot(scope)"></span>
                </template>
              </el-table-column>
            </template>
          </el-table>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { parseTime } from '@/utils/methods'
import { searchInvoice } from '@/api/invoice'
export default {
  data() {
    return {
      dataList: [],
      tableList: [],
      order_detail: [],
      tableColumn1: [
        {
          label: '商家',
          prop: 'supplier'
        },
        {
          label: '商品名',
          prop: 'product_name'
        },

        {
          label: '型号',
          prop: 'product_attr'
        },
        {
          label: '单价',
          prop: 'product_price',
          slot: scope => {
            return this.filters.fixedMoney(scope.row.product_price) + '元'
          }
        },
        {
          label: '数量',
          prop: 'product_count'
        },
        {
          label: '合计',
          prop: 'total_count',
          slot: scope => {
            return (
              this.filters.fixedMoney(
                scope.row.product_count * scope.row.product_price
              ) + '元'
            )
          }
        }
      ],
      tableColumn2: [
        {
          label: '商品名',
          prop: 'product_name'
        },

        {
          label: '型号',
          prop: 'product_attr'
        },
        {
          label: '单价',
          prop: 'product_price',
          slot: scope => {
            return this.filters.fixedMoney(scope.row.product_price) + '元'
          }
        },
        {
          label: '数量',
          prop: 'product_count'
        },
        {
          label: '单位',
          prop: 'unit'
        },
        {
          label: '金额',
          prop: 'total_count',
          slot: scope => {
            return (
              this.filters.fixedMoney(
                scope.row.product_count * scope.row.product_price
              ) + '元'
            )
          }
        },
        {
          label: '优惠',
          prop: 'discount'
        },
        {
          label: '实付',
          prop: 'actualPay'
        }
      ]
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      //获取
      let data = {
        _id: this.$route.query.id,
        page: 1,
        limit: 1
      }
      searchInvoice(data)
        .then(res => {
          const resp = res.data
          this.dataList = resp.data
          this.dataList.order_detail.forEach((item, index) => {
            this.order_detail[index] = item
            this.order_detail[index].delivery_time = parseTime(
              item.delivery_time
            )
            this.tableList[index] = item.product_data
          })
        })
        .catch(err => {})
    },
    back() {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped lang="less">
.detail {
  padding: 30px;
  .detail_left {
    margin-right: 60px;
    display: inline-block;
  }
  .detail_item {
    margin-bottom: 16px;
  }
  .detail_right {
    display: inline-block;
  }
  .order_detail {
    margin-left: 25px;
    margin-bottom: 30px;
  }
  .table_item {
    display: flex;
  }
  .table_item p {
    width: 80px;
    white-space: nowrap;
  }
  .table_item .table {
    margin: 10px 0 10px 10px;
    width: 100%;
  }
  th {
    text-align: left;
    background: #dcdfe6;
    font-size: 14px;
    padding: 12px 10px;
  }
  td {
    font-size: 14px;
    padding: 12px 10px;
    color: #606266;
  }
  table,
  th,
  td {
    border: 1px solid #ebeef5;
    border-collapse: collapse;
  }
}
</style>