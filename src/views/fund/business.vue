<template>
	<div>
		<div class="business_tab">
			<el-tabs v-model="activeName" @tab-click="handleClick">
				<el-tab-pane label="交易明细" name="1"></el-tab-pane>
				<el-tab-pane label="商家结算" name="2"></el-tab-pane>
			</el-tabs>
		</div>
		<!-- 搜索 -->
		<div class="screen">
			<p class="title color85">查询</p>
			<div class="screen_condition color85 fontS14">
				<el-form :model="searchForm" :inline="true" ref="searchFormList" size="mini">
					<div>
						<div class="screen_box">
							<el-form-item label="订单编号" width="120" prop="order_id" v-if="activeName == 1">
								<el-input v-model="searchForm.order_id" placeholder="请输入订单编号"></el-input>
							</el-form-item>
							<el-form-item label="付款时间" width="100" prop="apply_time" v-if="activeName == 1">
								<el-date-picker v-model="searchForm.apply_time" type="datetimerange" value-format="timestamp" :default-time="['00:00:00', '23:59:59']"
								 range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
							</el-form-item>
							<el-form-item label="支付方式" prop="pay_manner" v-if="activeName == 1">
								<el-select placeholder="请选择" v-model="searchForm.pay_manner" clearable>
									<el-option :label="item.name" :value="item.type" v-for="item in pay_manner_list" :key="item.type"></el-option>
								</el-select>
							</el-form-item>
							<el-form-item label="商品名称" prop="product_name" v-if="activeName == 1">
								<el-input v-model="searchForm.product_name" placeholder="请输入商品名称"></el-input>
							</el-form-item>
						</div>
						<div>
							<el-form-item label="供应商名称" prop="supplier">
								<el-input v-model="searchForm.supplier" placeholder="请输入供应商名称"></el-input>
							</el-form-item>
						</div>
					</div>
					<el-form-item class="screen_btn">
						<el-button type="primary" @click="submitForm('searchFormList')" size="mini">查询</el-button>
						<el-button size="mini" @click="resetForm('searchFormList')">重置</el-button>
					</el-form-item>
				</el-form>
			</div>
		</div>
		<!-- 搜索 End-->
		<!-- 列表 -->
		<div class="table">
			<div class="table_btn">
				<el-button type="primary" @click="batchAdopt('adopt')" size="mini">导出</el-button>
				<el-button type="primary" @click="batchAdopt('refuse')" size="mini" v-if="activeName == 1">分供应商导出</el-button>
			</div>
			<div class="tab_content">
				<el-table ref="multipleTable" :data="product_list" tooltip-effect="dark" style="width: 100%"
				 :header-cell-style="{background:'#FAFAFA'}" v-if="activeName == 1">
					<el-table-column type="selection" width="26"></el-table-column>
					<el-table-column prop="product_no" label="序号" width="69"></el-table-column>
					<el-table-column prop="order_id" label="订单编号" width="180"></el-table-column>
					<el-table-column prop="time_end" label="付款时间" show-overflow-tooltip width="181">
						<template slot-scope="scope">{{scope.row.time_end|dateFilter}}</template>
					</el-table-column>
					<el-table-column prop="pay_manner" label="支付方式" show-overflow-tooltip width="92"></el-table-column>
					<el-table-column prop="refund_results" label="商品状态" show-overflow-tooltip width="103"></el-table-column>
					<el-table-column prop="product_name" label="商品名称" show-overflow-tooltip width="220"></el-table-column>
					<el-table-column prop="item_pcs" label="单位" show-overflow-tooltip width="132"></el-table-column>
					<el-table-column prop="product_unit_price" label="单价" show-overflow-tooltip width="123">
						<template slot-scope="scope">￥{{scope.row.product_unit_price}}</template>
					</el-table-column>
					<el-table-column prop="product_count" label="数量" show-overflow-tooltip width="123"></el-table-column>
					<el-table-column prop="product_pay_price" label="总金额" show-overflow-tooltip width="132">
						<template slot-scope="scope">￥{{scope.row.product_pay_price}}</template>
					</el-table-column>
					<el-table-column prop="supplier" label="供应商名称" show-overflow-tooltip></el-table-column>
				</el-table>


				<el-table ref="multipleTable" :data="supplier_list" tooltip-effect="dark" style="width: 100%"
				 :header-cell-style="{background:'#FAFAFA'}" v-if="activeName == 2">
					<el-table-column type="selection" width="26"></el-table-column>
					<el-table-column prop="product_no" label="序号" width="69"></el-table-column>
					<el-table-column prop="supplier" label="供应商名称" show-overflow-tooltip></el-table-column>
					<el-table-column prop="corporate_account_bank" label="对公账户银行"></el-table-column>
					<el-table-column prop="corporate_account_number" label="对公账户号"></el-table-column>
					<el-table-column prop="time_end" label="应付金额" show-overflow-tooltip>
						<template slot-scope="scope">￥{{scope.row.pay_store_price}}</template>
					</el-table-column>
				</el-table>
			</div>
			<!-- 列表 End-->
			<div class="bottom-box">
				<!--分页功能 -->
				<el-pagination @current-change="handleCurrentChange" :current-page="searchForm.page" :page-size="searchForm.limit"
				 layout="total, prev, pager, next, jumper" :total="total"></el-pagination>
			</div>
		</div>
	</div>
</template>
<script>
	import {
		store_product,
		store_settlement
	} from '@/api/fund'
	import {
		format_objKey,
		parseTime
	} from '@/utils/methods'
	export default {
		data() {
			return {
				searchForm: {
					order_id: '',
					start_time: '',
					stop_time: '',
					pay_manner: '',
					refund_results: '',
					product_name: '',
					supplier: '',
					apply_time: '',
					page: 1,
					limit: 4
				},
				pay_manner_list: [{ //支付方式
					name: '购花支付',
					type: '购花支付'
				}, {
					name: '微信支付',
					type: '微信支付'
				}, {
					name: '支付宝支付',
					type: '支付宝支付'
				}],
				product_list: [],
				total: 0,
				activeName: '1',
				supplier_list: []
			}
		},
		mounted() {
			this.getData();
		},
		methods: {
			handleClick() {
				this.searchForm = {
					order_id: '',
					start_time: '',
					stop_time: '',
					pay_manner: '',
					refund_results: '',
					product_name: '',
					supplier: '',
					apply_time: '',
					page: 1,
					limit: 4
				};
				this.getData();
				this.resetForm('searchFormList');
			},
			getData() {
				if (this.activeName == 1) {
					store_product(format_objKey(this.searchForm)).then(res => {
						this.product_list = res.data.data.product_list
						this.total = res.data.data.count
					})
				} else {
					store_settlement(format_objKey(this.searchForm)).then(res => {
						this.supplier_list = res.data.data.supplier_list
						this.total = res.data.data.count
					})
				}
			},
			//改变分页
			handleCurrentChange(val) {
				this.searchForm.page = val
				this.getData()
			},
			submitForm(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						if (this.searchForm.apply_time) {
							this.searchForm.end_time = this.searchForm.apply_time[1];
							this.searchForm.start_time = this.searchForm.apply_time[0];
						}
						this.getData();
					} else {
						return false;
					}
				});
			},
			resetForm(formName) {
				this.$refs[formName].resetFields();
			},
		},
		filters: {
			//时间格式化
			dateFilter(type) {
				return parseTime(type)
			}
		}
	}
</script>
<style scoped>
	.business_tab {
		background-color: white;
		padding: 0 30px;
	}

	.el-tabs__header {
		margin: 0;
	}

	.screen {
		background-color: white;
		margin: 24px;
	}

	.title {
		padding: 16px 32px;
		border-bottom: 1px solid rgba(233, 233, 233, 1);
		font-weight: bold;
	}

	.screen_condition {
		padding: 24px 24px 32px 32px;
	}

	.screen_box {
		display: flex;
		justify-content: space-between;
		/* flex-wrap:wrap; */
	}

	.screen>>>.el-form-item__label {
		display: block;
		padding-bottom: 8px;
		text-align: left;
	}

	.el-input {
		width: 294px;
	}

	.table {
		background-color: white;
		margin: 24px;
	}

	.screen>>>.el-input__inner {
		height: 32px;
		width: 294px;
	}

	.screen_btn {
		margin-bottom: 0;
		display: flex;
		justify-content: flex-end;
	}

	.tab_content {
		margin: 24px;
	}

	.el-pagination {
		text-align: right;
		padding: 23px 48px 48px;
	}

	.table_btn {
		padding: 12px 24px 7px;
		text-align: right;
		border-bottom: 1px solid #E9E9E9;
	}
</style>
