<template>
	<div class="invoice_detail">
		<div class="essential">
			<div class="essential_one">
				<span class="color85 fontS16 fontW500">基本信息</span>
				<div class="fontS14 color85 flex_row pad16">
					<p>
						企业名称：
						<span class="color65">{{company_data.com_name}}</span>
					</p>
					<p>
						法人姓名：
						<span class="color65">{{company_data.own_name}}</span>
					</p>
					<p>
						法人电话：
						<span class="color65">{{company_data.tel}}</span>
					</p>
				</div>
				<div class="fontS14 color85 flex_row">
					<p>
						统一社会信用代码：
						<span class="color65">{{company_data.com_id}}</span>
					</p>
					<p>
						认证时间：
						<span class="color65">{{company_data.check_time}}</span>
					</p>
					<p>
						认证状态：
						<span class="color65">{{company_data.status|verificateStatus}}</span>
					</p>
				</div>
				<div class="fontS14 color85 flex_row pad16">
					<p>
						认证地址：
						<span class="color65">_</span>
					</p>
					<p>
						营业执照：
						<img :src="company_data.img" />
					</p>
				</div>
			</div>
			<div class="essential_one" v-for="(val,index) in child_account_data" :key='index'>
				<span class="color85 fontS16 fontW500"> {{index == 0?'账号信息':('子账号'+index)}}</span>
				<div class="fontS14 color85 flex_row pad16">
					<p>
						账号昵称：
						<span class="color18">{{val.name}}</span>
					</p>
					<p>
						用户ID：
						<span class="color65">{{val._id}}</span>
					</p>
					<p>
						登录名：
						<span class="color18">{{val.login_name}}</span>
					</p>
				</div>
				<div class="fontS14 color85 flex_row">
					<p>
						注册时间 ：
						<span class="color65">{{val.create_time}}</span>
					</p>
					<p>
						绑定手机：
						<span class="color65">{{val.mobile}}</span>
					</p>
					<p>
						账号状态：
						<span class="color65">{{val.bank_account}}</span>
					</p>
				</div>
				<div class="fontS14 color85 flex_row pad16">
					<p>
						账号类型 ：
						<span class="color65">{{val.user_status}}</span>
					</p>
					<p>
						登录密码：
						<span class="color65">{{val.password}}</span>
					</p>
					<p>
						最近登录：
						<span class="color65">_</span>
					</p>
				</div>
				<div class="fontS14 color85 flex_row">
					<p>
						用户头像 ：
						<img :src="val.image" />
					</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import filter from '@/utils/changeType'
	import {
		format_objKey,
		sortAttr
	} from '@/utils/methods'
	import {
		addcountDetail
	} from '@/api/account'
	export default {
		created() {
			this.fetchData()
		},
		data() {
			return {
				child_account_data: [],
				company_data: {}
			}
		},
		filters: {
			//会员等级
			memberLevelFilter(type) {
				return filter._filterType(filter._memberLevel, type)
			},
			//申请者身份
			applyStatus(type) {
				return filter._filterType(filter._applyStatus, type)
			},
			//认证状态
			verificateStatus(type) {
				return filter._filterType(filter._verificateStatus, type);
			},
		},
		methods: {
			fetchData() {
				addcountDetail(this.$route.query.user_id).then(res => {
					this.company_data = res.data.data.company_data
					this.child_account_data = res.data.data.child_account_data
				})
			},
		}
	}
</script>

<style scoped>
	.invoice_detail {
		padding: 0 24px;
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

	img {
		width: 68px;
		height: 42px;
		vertical-align: top;
	}

	.color18 {
		color: #1890FF;
	}
</style>
