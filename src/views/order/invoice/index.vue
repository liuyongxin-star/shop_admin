<template>
	<div>
		<!-- 头部筛选 -->
		<div class="screen">
			<p class="title color85">查询</p>
			<div class="screen_condition color85 fontS14">
				<el-form :model="searchForm" :inline="true" ref="searchFormList" size="mini">
					<div class="screen_box">
						<el-form-item label="用户名ID" width="120" prop="name">
							<el-input v-model="searchForm.user_id" placeholder="请输入用户名ID"></el-input>
						</el-form-item>
						<el-form-item label="用户名" prop="user_name">
							<el-input v-model="searchForm.user_name" placeholder="请输入用户名"></el-input>
						</el-form-item>
						<el-form-item label="开票类型" prop="status">
							<el-select placeholder="请选择" v-model="searchForm.status" clearable>
								<el-option :label="item.name" :value="item.type" v-for="item in invoiceStatus" :key="item.type"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="申请时间" width="100" prop="apply_time">
							<el-date-picker v-model="searchForm.apply_time" type="datetimerange" value-format="timestamp" :default-time="['00:00:00', '23:59:59']"
							 range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
						</el-form-item>
					</div>
					<el-form-item class="screen_btn">
						<el-button type="primary" @click="submitForm('searchFormList')" size="mini">查询</el-button>
						<el-button size="mini" @click="resetForm('searchFormList')">重置</el-button>
					</el-form-item>
				</el-form>
			</div>
		</div>
		<!-- 头部筛选 End-->
		<div class="table">
			<!-- 状态 -->
			<div class="table_top">
				<el-tabs v-model="activeName" @tab-click="handleClick">
					<el-tab-pane :label="'全部('+(status_count[-1]+status_count[0]+status_count[1]+status_count[2]+status_count[3]+status_count[4])+')'"
					 name="-2"></el-tab-pane>
					<el-tab-pane :label="'待审核('+status_count[1]+')'" name="1"></el-tab-pane>
					<el-tab-pane :label="'待寄出('+status_count[2]+')'" name="2"></el-tab-pane>
					<el-tab-pane :label="'已寄出('+status_count[3]+')'" name="3"></el-tab-pane>
					<el-tab-pane :label="'已拒绝('+status_count[0]+')'" name="5"></el-tab-pane>
					<el-tab-pane :label="'已撤销('+status_count[-1]+')'" name="-1"></el-tab-pane>
					<el-tab-pane :label="'待红冲('+status_count[4]+')'" name="4"></el-tab-pane>
				</el-tabs>
				<div class="table_btn">
					<el-button type="primary" @click="batchAdopt('adopt')" size="mini">批量通过</el-button>
					<el-button @click="batchAdopt('refuse')" size="mini">批量拒绝</el-button>
				</div>
			</div>
			<!-- 表格 -->
			<div class="tab_content">
				<el-table ref="multipleTable" :data="invoiceList" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange"
				 :header-cell-style="{background:'#FAFAFA'}">
					<el-table-column type="selection" width="55"></el-table-column>
					<el-table-column prop="user_id" label="用户ID" width="120"></el-table-column>
					<el-table-column prop="user_name" label="用户名" show-overflow-tooltip width="100"></el-table-column>
					<el-table-column prop="create_time" label="申请时间" show-overflow-tooltip>
						<template slot-scope="scope">{{scope.row.create_time|dateFilter}}</template>
					</el-table-column>
					<el-table-column prop="invoice_type" label="开票类型" show-overflow-tooltip width="100">
						<template slot-scope="scope">
							{{scope.row.invoice_type == '增值税专用发票'?'专票':'普票'}}
						</template>
					</el-table-column>
					<el-table-column prop="address" label="开票信息" show-overflow-tooltip>
						<template slot-scope="scope">
							<div>
								<p>发票抬头：{{scope.row.invoice_title}}</p>
								<p>税号：{{scope.row.tax_num}}</p>
								<p>单位地址：{{scope.row.address}}</p>
								<p>电话号码：{{scope.row.mobile}}</p>
								<p>银行账户：{{scope.row.bank_account}}</p>
							</div>
						</template>
					</el-table-column>
					<el-table-column prop="address" label="寄送信息" show-overflow-tooltip>
						<template slot-scope="scope">
							<div>
								<p>收货人：{{scope.row.consignee}}</p>
								<p>电话号码：{{scope.row.consignee_mobile}}</p>
								<p>收货地址：{{scope.row.province}}{{scope.row.city}}{{scope.row.district}}{{scope.row.detail_address}}</p>
							</div>
						</template>
					</el-table-column>
					<el-table-column prop="invoice_amount" label="开票金额" show-overflow-tooltip width="100">
						<template slot-scope="scope">￥{{scope.row.invoice_amount}}</template>
					</el-table-column>
					<el-table-column prop="invoice_status" label="开票状态" show-overflow-tooltip width="100">
						<template slot-scope="scope">
							<span :class="['sign',scope.row.status != 2 && scope.row.status != 3 ?'color18':'']"></span>{{scope.row.invoice_status}}
						</template>
					</el-table-column>
					<el-table-column prop="address" label="操作" show-overflow-tooltip>
						<template slot-scope="scope">
							<el-button type="text" size="small" v-if='scope.row.status == "4"' @click="pending(scope.row._id)">待处理</el-button>
							<el-button type="text" size="small" v-if='scope.row.status == "1"' @click="adopt(scope.row._id)">通过</el-button>
							<el-button type="text" size="small" v-if='scope.row.status == "1"' @click="refuse(scope.row._id)">拒绝</el-button>
							<el-button type="text" size="small" v-if='scope.row.status == "2"' @click='voucher(scope.row._id)'>上传凭证</el-button>
							<el-button type="text" size="small" @click='showDetail(scope.row._id)'>查看详情</el-button>
						</template>
					</el-table-column>
				</el-table>
			</div>
			<!-- 表格 End-->
			<div class="bottom-box">
				<!--分页功能 -->
				<el-pagination @current-change="handleCurrentChange" :current-page="searchForm.page" :page-size="searchForm.limit"
				 layout="total, prev, pager, next, jumper" :total="total"></el-pagination>
			</div>
			<!-- 上传凭证 -->
			<el-form ref="invoice" :model="invoice" label-width="120px" :rules="invoiceVoucher">
				<el-dialog title="上传凭证" :visible.sync="isVoucher" width="35%" :before-close="handleClose">
					<el-form-item label="发票代码：" prop="invoice_code">
						<el-input v-model="invoice.invoice_code"></el-input>
					</el-form-item>
					<el-form-item label="发票号码：" prop="invoice_number">
						<el-input v-model="invoice.invoice_number"></el-input>
					</el-form-item>
					<el-form-item label="物流公司：" prop="logistics_company">
						<el-input v-model="invoice.logistics_company"></el-input>
					</el-form-item>
					<el-form-item label="物流单号：" prop="logistics_number">
						<el-input v-model="invoice.logistics_number"></el-input>
					</el-form-item>
					<span slot="footer" class="dialog-footer">
						<el-button @click="isVoucher = false">取 消</el-button>
						<el-button type="primary" @click="postInvoiceVoucher('invoice')">确 定</el-button>
					</span>
				</el-dialog>
			</el-form>
			<!-- 上传凭证 End-->
			<!-- 审核拒绝 -->
			<el-form ref="refuseContent" :model="refuseContent" label-width="120px" :rules="rulesRefuseContent">
				<el-dialog title="请填写拒绝原因" :visible.sync="isRefuse">
					<el-form-item label="拒绝原因：" prop="refuse_reason">
						<el-input v-model="refuseContent.refuse_reason" type="textarea" :rows="2" placeholder="请输入拒绝原因"></el-input>
					</el-form-item>
					<div slot="footer" class="dialog-footer">
						<el-button @click="isRefuse = false">取 消</el-button>
						<el-button type="primary" @click="confirmRefuse('refuseContent')">确 定</el-button>
					</div>
				</el-dialog>
			</el-form>
			<!-- 审核拒绝 End-->
			<!-- 待红冲数据 -->
			<el-dialog title="待红冲商品" :visible.sync="isNegative" width="689px">
				<el-table :data="negativeList" :header-cell-style="{background:'#FAFAFA'}" border>
					<el-table-column property="product_name" label="商品名称" width="223"></el-table-column>
					<el-table-column property="item_pcs" label="型号" width="141"></el-table-column>
					<el-table-column property="product_count" label="单位" width="74"></el-table-column>
					<el-table-column property="product_count" label="数量" width="97"></el-table-column>
					<el-table-column property="product_pay_price" label="金额" width="113"></el-table-column>
				</el-table>
				<span slot="footer" class="dialog-footer">
					<el-button @click="isNegative = false">取 消</el-button>
					<el-button type="primary" @click="isNegative = false">确 定</el-button>
				</span>
			</el-dialog>
			<!-- 待红冲数据 End-->
		</div>

	</div>
</template>
<script>
	import {
		searchInvoice,
		updateInvoice,
		invoice_batch_back,
		negative_invoice_back
	} from '@/api/invoice.js'
	import {
		format_objKey,
		parseTime
	} from '@/utils/methods'
	export default {
		data() {
			return {
				invoiceStatus: [ //发票状态
					{
						name: "已撤销",
						type: -1
					},
					{
						name: "已拒绝",
						type: 5
					},
					{
						name: "待审核",
						type: 1
					},
					{
						name: "待寄出",
						type: 2
					},
					{
						name: "已寄出",
						type: 3
					},
					{
						name: "待红冲",
						type: 4
					}
				],
				invoiceList: [],
				searchForm: { //搜索
					page: 1,
					limit: 4,
					user_id: "",
					status: "",
					user_name: "",
					start_time: "",
					end_time: "",
					apply_time: '',
				},
				invoice: { //上传发票凭证
					_id: '',
					status: '',
					invoice_code: '',
					invoice_number: '',
					logistics_company: '',
					logistics_number: ''
				},
				refuseContent: {
					_id: '',
					status: 0,
					refuse_reason: ''
				},
				total: 0, //总数量
				activeName: '-2',
				batchContent: { //批量通过or批量拒绝
					invoice_list: [],
					status: 0
				},
				status_count: {}, //各种发票状态的数量
				invoiceVoucher: {
					invoice_code: {
						required: true,
						message: '请输入发票代码',
						trigger: 'blur'
					},
					invoice_number: {
						required: true,
						message: '请输入发票号码',
						trigger: 'blur'
					},
					logistics_company: {
						required: true,
						message: '请输入物流公司',
						trigger: 'blur'
					},
					logistics_number: {
						required: true,
						message: '请输入物流单号',
						trigger: 'blur'
					}
				},
				rulesRefuseContent: {
					refuse_reason: {
						required: true,
						message: '请输入拒绝原因',
						trigger: 'blur'
					}
				},
				isVoucher: false, //上传凭证弹框
				isRefuse: false, //审核拒绝
				negativeList: [],
				isNegative: false, //待红冲弹框
			};
		},
		mounted() {
			this.getSearchInvoice();
		},
		methods: {
			handleClick(tab, event) {
				this.searchForm.status = tab.name == '-2' ? '' : Number(tab.name);
				this.getSearchInvoice();
			},
			handleSelectionChange(val) {
				this.batchContent.invoice_list = [];
				val.forEach(item => {
					this.batchContent.invoice_list.push(item._id)
				})
				this.batchContent.status = 2;
			},
			getSearchInvoice() {
				if (this.searchForm.status == 5) {
					this.searchForm.status = 0
				}
				searchInvoice(format_objKey(this.searchForm)).then(res => {
					if (this.searchForm.status == 0) {
						this.searchForm.status = 5
					}
					this.activeName = JSON.stringify(this.searchForm.status) || '-2';
					this.invoiceList = res.data.data.invoice_list;
					this.total = res.data.data.count;
					this.status_count = res.data.data.status_count;
				})
			},
			//改变分页
			handleCurrentChange(val) {
				this.searchForm.page = val
				this.getSearchInvoice()
			},
			submitForm(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						if (this.searchForm.apply_time) {
							this.searchForm.end_time = this.searchForm.apply_time[1];
							this.searchForm.start_time = this.searchForm.apply_time[0];
						}
						this.getSearchInvoice()
					} else {
						return false;
					}
				});
			},
			resetForm(formName) {
				this.$refs[formName].resetFields();
			},
			voucher(_id) { //上传凭证
				this.isVoucher = true;
				this.invoice._id = _id;
				this.invoice.status = 3;
			},
			handleClose() {
				this.isVoucher = false;
			},
			postInvoiceVoucher(formName) { //确认上传凭证
				this.$refs[formName].validate((valid) => {
					if (valid) {
						this.postUpdateInvoice(this.invoice);
					} else {
						return false;
					}
				});
			},
			adopt(_id) { //通过
				this.invoice._id = _id;
				this.invoice.status = 2;
				this.$confirm('是否确定通过审核?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.postUpdateInvoice(this.invoice);
				}).catch(() => {});
			},
			postUpdateInvoice(data) {
				updateInvoice(data).then(res => {
					this.isVoucher = false;
					this.isRefuse = false;
					this.getSearchInvoice();
					this.$message({
						message: res.data.msg,
						type: 'success'
					});
				})
			},
			refuse(_id) {
				this.isRefuse = true;
				this.refuseContent._id = _id;
			},
			confirmRefuse(formName) { //审核拒绝
				this.$refs[formName].validate((valid) => {
					if (valid) {
						this.postUpdateInvoice(this.refuseContent);
					} else {
						return false;
					}
				});
			},
			batchAdopt(type) { //批量通过or批量拒绝
				if (this.batchContent.invoice_list == '') {
					this.$message({
						message: '请选择需要批量' + (type == 'adopt' ? '通过' : '拒绝') + '的发票',
						type: 'warning'
					});
				} else {
					this.batchContent.status = type == 'adopt' ? 2 : 0;
					this.$confirm('是否确定批量' + (type == 'adopt' ? '通过' : '拒绝') + '审核?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						this.batch();
					}).catch(() => {});
				}
			},
			batch() {
				invoice_batch_back(this.batchContent).then(res => {
					this.isRefuse = false;
					this.getSearchInvoice();
					this.$message({
						message: res.data.msg,
						type: 'success'
					});
				})
			},
			//查看发票详情
			showDetail(_id) {
				this.$router.push({
					path: '/order/invoice_detail',
					query: {
						_id
					}
				})
			},
			//待红冲
			pending(_id) {
				this.isNegative = true;
				var data = {
					_id: _id
				}
				negative_invoice_back(data).then(res => {
					this.negativeList = res.data.data
				})
			}
		},
		filters: {
			//时间格式化
			dateFilter(type) {
				return parseTime(type)
			}
		}
	};
</script>
<style scoped>
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
	}

	.screen>>>.el-form-item__label {
		display: block;
		padding-bottom: 8px;
		text-align: left;
	}

	.el-input {
		width: 249px;
	}

	.screen>>>.el-input__inner {
		height: 32px;
		width: 249px;
	}

	.screen_btn {
		margin-top: 14px;
		margin-bottom: 0;
		display: flex;
		justify-content: flex-end;
	}

	.table {
		margin: 0 25px;
		background-color: white;
	}

	.sign {
		display: inline-block;
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background-color: #F5222D;
		margin-right: 6px;
	}

	/* 待寄出 || 已寄出 */
	.color18 {
		background-color: #1890FF;
	}

	.el-pagination {
		text-align: right;
		padding: 23px 48px 48px;
	}

	.table_top {
		display: flex;
		justify-content: space-between;
		background-color: #FDFFFF;
		border-bottom: 1px solid rgba(233, 233, 233, 1);
	}

	.table_top>>>.el-tabs__header {
		padding-left: 24px;
	}

	.table_btn {
		padding: 12px 24px 0px;
	}

	.table_top>>>.el-tabs__nav-wrap::after {
		display: none;
	}

	.tab_content {
		padding: 24px;
	}

	.table_top>>>.el-tabs__header {
		margin: 0;
	}

	.table_top>>>.el-tabs__item {
		height: 51px;
		line-height: 51px;
	}
</style>
