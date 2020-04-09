<template>
	<div class="invoice_detail">
		<!-- 右上角按钮 -->
		<div class="right_btn">
			<el-button type="primary" size="small" v-if="invoiceDetail.status == '2'" @click="voucher(invoiceDetail._id)">上传凭证</el-button>
			<el-button type="primary" size="small" v-if="invoiceDetail.status == '1'" @click="refuse(invoiceDetail._id)">拒绝</el-button>
			<el-button type="primary" size="small" v-if="invoiceDetail.status == '1'" @click="adopt(invoiceDetail._id)">通过</el-button>
			<el-button type="primary" size="small" v-if="invoiceDetail.status == '4'" @click="pending(invoiceDetail._id)">红冲</el-button>
		</div>
		<!-- 右上角按钮End -->
		<div class="progress">
			<p class="fontW500 progress_title">订单进度</p>
			<div class="progress_content">
				<el-steps :active="invoiceDetail.send_time?3:invoiceDetail.operator_time?2:1" :space="200">
					<el-step title="开票申请" :description="invoiceDetail.create_time|dateFilter"></el-step>
					<el-step :title="invoiceDetail.status == 0?'审核拒绝':'审核通过'" :description="invoiceDetail.operator_time|dateFilter"></el-step>
					<el-step title="发票寄出" :description="invoiceDetail.send_time|dateFilter" v-if="invoiceDetail.status != 0"></el-step>
				</el-steps>
			</div>
		</div>
		<div class="essential">
			<div class="essential_one">
				<span class="color85 fontS16 fontW500">基本信息</span>
				<div class="fontS14 color85 flex_row pad16">
					<p>
						申请用户：
						<span class="color65">{{invoiceDetail.user_name}}</span>
					</p>
					<p>
						用户ID ：
						<span class="color65">{{invoiceDetail.user_id}}</span>
					</p>
					<p>
						开票状态：
						<span class="color65">{{invoiceDetail.invoice_status}}</span>
					</p>
				</div>
				<div class="fontS14 color85 flex_row">
					<p>
						开票类型：
						<span class="color65">{{invoiceDetail.invoice_title_type}}</span>
					</p>
					<p>
						开票金额：
						<span class="color65">{{invoiceDetail.invoice_amount}}</span>
					</p>
					<p>
						申请时间：
						<span class="color65">{{invoiceDetail.create_time|dateFilter}}</span>
					</p>
				</div>
			</div>
			<div class="essential_one">
				<span class="color85 fontS16 fontW500">开票信息</span>
				<el-button size="small" class="edit" @click="editInvoice()" v-if="invoiceDetail.status != 0">修改</el-button>
				<div class="fontS14 color85 flex_row pad16">
					<p>
						发票抬头：
						<span class="color65">{{invoiceDetail.invoice_title}}</span>
					</p>
					<p>
						税号：
						<span class="color65">{{invoiceDetail.tax_num}}</span>
					</p>
					<p>
						单位地址：
						<span class="color65">{{invoiceDetail.address}}</span>
					</p>
				</div>
				<div class="fontS14 color85 flex_row">
					<p>
						电话号码：
						<span class="color65">{{invoiceDetail.consignee_mobile}}</span>
					</p>
					<p>
						开户银行：
						<span class="color65">{{invoiceDetail.bank_name}}</span>
					</p>
					<p>
						银行账户：
						<span class="color65">{{invoiceDetail.bank_account}}</span>
					</p>
				</div>
			</div>
			<div class="essential_one">
				<span class="color85 fontS16 fontW500">寄送信息</span>
				<el-button size="small" class="edit" @click="editAddress(invoiceDetail.address_id)" v-if="invoiceDetail.status != 0">修改</el-button>
				<div class="fontS14 color85 flex_row pad16">
					<p>
						收货人 ：
						<span class="color65">{{invoiceDetail.consignee}}</span>
					</p>
					<p>
						联系电话：
						<span class="color65">{{invoiceDetail.consignee_mobile}}</span>
					</p>
					<p>
						收货地址 ：
						<span class="color65">{{invoiceDetail.province}}{{invoiceDetail.city}}{{invoiceDetail.district}}{{invoiceDetail.detail_address}}</span>
					</p>
				</div>
			</div>
			<div class="essential_one">
				<span class="color85 fontS16 fontW500">审核信息</span>
				<div class="fontS14 color85 flex_row pad16">
					<p>
						审核人：
						<span class="color65">{{invoiceDetail.operator_name || '_'}}</span>
					</p>
					<p>
						审核时间：
						<span class="color65">{{invoiceDetail.operator_time|dateFilter || '_'}}</span>
					</p>
				</div>
				<div class="fontS14 color85 flex_row">
					<p>
						寄出人：
						<span class="color65">{{invoiceDetail.logistics_operator || '_'}}</span>
					</p>
					<p>
						寄出时间：
						<span class="color65">{{invoiceDetail.logistics_time|dateFilter || '_'}}</span>
					</p>
				</div>
			</div>
		</div>
		<div class="orderList" v-for="(item,index) in invoiceDetail.order_detail" :key="index">
			<div class="orderList_top">
				<p>
					<span class="fontS16 color85 fontW500">订单{{index + 1}}</span>
					<span class="order_id">订单编号：{{item.order_id}}</span>
				</p>
				<p class="fontS14">
					<span class="color85">付款时间：</span>
					<span class="color65">{{item.create_time|dateFilter}}</span>
				</p>
			</div>
			<el-table :data="item.product_list" :header-cell-style="{background:'#FAFAFA'}">
				<el-table-column property="product_name" label="商品名称" width="428"></el-table-column>
				<el-table-column property="product_attr" label="型号"></el-table-column>
				<el-table-column property="item_pcs" label="单位"></el-table-column>
				<el-table-column property="product_count" label="数量"></el-table-column>
				<el-table-column property="product_pay_price" label="金额"></el-table-column>
			</el-table>
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
		<!-- 修改开票信息 -->
		<!-- <el-form ref="updataInvoice" :model="updataInvoice" label-width="120px" :rules="updataInvoice">
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
		</el-form> -->
		<!-- 上传凭证 End-->
	</div>
</template>

<script>
	import {
		invoice_detail_back,
		invoice_batch_back,
		updateInvoice,
		negative_invoice_back
	} from "@/api/invoice.js";
	import {
		parseTime
	} from "@/utils/methods";
	export default {
		data() {
			return {
				invoiceDetail: "",
				invoiceVoucher: {
					invoice_code: {
						required: true,
						message: "请输入发票代码",
						trigger: "blur"
					},
					invoice_number: {
						required: true,
						message: "请输入发票号码",
						trigger: "blur"
					},
					logistics_company: {
						required: true,
						message: "请输入物流公司",
						trigger: "blur"
					},
					logistics_number: {
						required: true,
						message: "请输入物流单号",
						trigger: "blur"
					}
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
				isVoucher: false, //上传凭证弹框
				isRefuse: false, //审核拒绝
				negativeList: [],
				isNegative: false, //待红冲弹框
				rulesRefuseContent: {
					refuse_reason: {
						required: true,
						message: "请输入拒绝原因",
						trigger: "blur"
					}
				},
			};
		},
		mounted() {
			this.getData();
		},
		methods: {
			getData() {
				var data = {
					_id: this.$route.query._id
				};
				invoice_detail_back(data).then(res => {
					this.invoiceDetail = res.data.data;
				});
			},
			editInvoice() {
				//修改发票信息
			},
			editAddress(id) {
				//修改地址
			},
			voucher(_id) {
				//上传凭证
				this.isVoucher = true;
				this.invoice._id = _id;
				this.invoice.status = 3;
			},
			handleClose() {
				this.isVoucher = false;
			},
			postInvoiceVoucher(formName) {
				//确认上传凭证
				this.$refs[formName].validate(valid => {
					if (valid) {
						this.postUpdateInvoice(this.invoice);
					} else {
						return false;
					}
				});
			},
			adopt(_id) {
				//通过
				this.invoice._id = _id;
				this.invoice.status = 2;
				this.$confirm("是否确定通过审核?", "提示", {
						confirmButtonText: "确定",
						cancelButtonText: "取消",
						type: "warning"
					})
					.then(() => {
						this.postUpdateInvoice(this.invoice);
					})
					.catch(() => {});
			},
			postUpdateInvoice(data) {
				updateInvoice(data).then(res => {
					this.isVoucher = false;
					this.isRefuse = false;
					this.getData();
					this.$message({
						message: res.data.msg,
						type: "success"
					});
				});
			},
			refuse(_id) {
				this.isRefuse = true;
				this.refuseContent._id = _id;
			},
			confirmRefuse(formName) {
				//审核拒绝
				this.$refs[formName].validate(valid => {
					if (valid) {
						this.postUpdateInvoice(this.refuseContent);
					} else {
						return false;
					}
				});
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
				return parseTime(type);
			}
		}
	};
</script>

<style scoped>
	.invoice_detail {
		padding: 0 24px;
	}

	.progress {
		background-color: white;
		margin-top: 24px;
		border-radius: 2px;
	}

	.progress_title {
		padding: 16px 32px;
		border-bottom: 1px solid rgba(233, 233, 233, 1);
	}

	.progress_content {
		padding: 25px 56px;
	}

	.essential {
		background-color: white;
		padding: 4px 32px 48px;
		margin-top: 24px;
	}

	.essential_one {
		border-bottom: 1px solid rgba(232, 232, 232, 1);
		padding-bottom: 32px;
		padding-top: 20px;
		position: relative;
	}

	.flex_row {
		display: flex;
		/* justify-content: space-between; */
	}

	.orderList_top {
		display: flex;
		justify-content: space-between;
		margin-bottom: 17px;
	}

	.flex_row p {
		width: 33%;
	}

	.pad16 {
		padding: 16px 0;
	}

	.orderList {
		background-color: white;
		padding: 27px 32px 48px;
		margin-top: 24px;
	}

	.order_id {
		color: #1890ff;
		padding-left: 20px;
	}

	.edit {
		position: absolute;
		right: 0;
	}

	.right_btn {
		position: absolute;
		right: 61px;
		top: 79px;
	}
	.view-head{
		position: relative;
	}
</style>
