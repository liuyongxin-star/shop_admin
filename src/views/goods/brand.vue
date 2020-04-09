<template>
	<div>
		<!-- 头部筛选 -->
		<div class="screen">
			<p class="title color85">查询</p>
			<div class="screen_condition color85 fontS14">
				<el-form :model="searchForm" :inline="true" ref="searchFormList" size="mini">
					<div class="screen_box">
						<el-form-item label="品牌名称" width="120" prop="name">
							<el-input v-model="searchForm.name" placeholder="请输入品牌名称"></el-input>
						</el-form-item>
						<el-form-item label="显示状态" prop="show" class="pad128">
							<el-select placeholder="请选择" v-model="searchForm.show" clearable>
								<el-option :label="item.name" :value="item.type" v-for="item in show_list" :key="item.type"></el-option>
							</el-select>
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
					<el-tab-pane label="在库" name="1"></el-tab-pane>
					<el-tab-pane label="待入库" name="2"></el-tab-pane>
				</el-tabs>
				<div class="table_btn">
					<el-button type="primary" size="mini" @click="openDialog">添加品牌</el-button>
				</div>
			</div>
			<!-- 表格 -->
			<div class="tab_content">
				<el-table ref="multipleTable" :data="page_list" tooltip-effect="dark" style="width: 100%" :header-cell-style="{background:'#FAFAFA'}">
					<el-table-column prop="brand_id" label="品牌编号"></el-table-column>
					<el-table-column prop="logo" label="品牌图标" show-overflow-tooltip>
						<template slot-scope="scope">
							<el-popover ref="popover" placement="left" title="营业执照" trigger="hover">
								<img :src="scope.row.logo" alt height="37" width="65" slot="reference" />
								<img :src="scope.row.logo" alt width="600" />
							</el-popover>
						</template>
					</el-table-column>
					<el-table-column prop="name" label="品牌名称" show-overflow-tooltip></el-table-column>
					<el-table-column prop="importance" label="排序" show-overflow-tooltip></el-table-column>
					<el-table-column prop="show" label="显示状态" show-overflow-tooltip>
						<template slot-scope="scope"><span :class="[scope.row.show?'bgcolor18':'bgcolor00','show_none']"></span>{{scope.row.show?'显示中':'隐藏'}}</template>
					</el-table-column>
					<el-table-column prop="show" label="提交用户ID" show-overflow-tooltip></el-table-column>
					<el-table-column prop="address" label="操作" show-overflow-tooltip>
						<template slot-scope="scope">
							<el-button type="text" size="small" @click='openDialog(scope.row)'>编辑</el-button>
							<el-button type="text" size="small" @click='showDetail(scope.row._id)'>入库</el-button>
						</template>
					</el-table-column>
				</el-table>
			</div><!-- 表格 End-->
			<div class="bottom-box">
				<!--分页功能 -->
				<el-pagination @current-change="handleCurrentChange" :current-page="searchForm.page" :page-size="searchForm.limit"
				 layout="total, prev, pager, next, jumper" :total="total"></el-pagination>
			</div>
		</div>
		<!-- 弹框 -->
		<div class="frame">
			<el-dialog :visible.sync="dialogFormVisible" width="40%" class="my-dialog" title="编辑品牌">
				<el-form :model="addBrandForm" label-width="150px" class="dialog-form" ref="addBrandForm">
					<el-form-item label="品牌名称:" prop="name">
						<el-input v-model="addBrandForm.name"></el-input>
					</el-form-item>
					<el-form-item label="排序:" prop="importance">
						<el-input v-model="addBrandForm.importance"></el-input>
					</el-form-item>
					<el-form-item label="是否显示:" prop="show">
						<el-radio-group v-model="addBrandForm.show">
							<el-radio :label="true">是</el-radio>
							<el-radio :label="false">否</el-radio>
						</el-radio-group>
					</el-form-item>
					<el-form-item label="品牌图标:" prop="logo">
						<el-upload class="upload-demo1" ref="upload_1" action="https://upload-z2.qiniup.com" :before-upload="changeMsg"
						 :on-success="uploadSuccesslogo" :limit="1" :on-remove="dellogo" :file-list="brandLogo" list-type="picture" :data="postData"
						 :on-error="uploadError" accept=".png, .jpg">
							<el-button size="small" slot="trigger" type="primary">点击</el-button>
						</el-upload>
					</el-form-item>
				</el-form>
				<span slot="footer" class="dialog-footer dialog-btn-ground">
					<el-button type="primary" @click="dialogFormVisible = false" size="mini">取消</el-button>
					<el-button type="primary" @click="submitOrderChange" size="mini">提交</el-button>
				</span>
			</el-dialog>
		</div>
	</div>
</template>
<script>
	import {
		searchBrand,
		deleteBrand,
		updatedConsignee
	} from "@/api/goods"
	import {
		uploadToken
	} from "@/api/uploadpic"
	import {
		format_objKey,
		parseTime
	} from '@/utils/methods'
	export default {
		data() {
			return {
				searchForm: {
					limit: 4,
					page: 1,
					name: '',
					show: ''
				},
				show_list: [{
					name: '全部',
					type: ''
				}, {
					name: '显示',
					type: true
				}, {
					name: '隐藏',
					type: false
				}],
				activeName: '1',
				total: 0,
				page_list: [],
				//新增品牌
				addBrandForm: {
					name: '',
					logo: "",
					importance: '',
					show: true
				},
				dialogFormVisible: false,
				//七牛云上传
				imageurl: "",
				postData: {
					key: "",
					token: ""
				},
				brandLogo: [], //回显logo
			}
		},
		mounted() {
			this.getData();
		},
		methods: {
			handleCurrentChange(val) {
				this.searchForm.page = val
				this.getData();
			},
			getData() {
				searchBrand(format_objKey(this.searchForm)).then(res => {
					this.total = res.data.data.count
					this.page_list = res.data.data.page_list
				})
			},
			handleClick() {

			},
			submitForm(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						this.getData()
					} else {
						return false;
					}
				});
			},
			resetForm(formName) {
				this.$refs[formName].resetFields();
			},
			openDialog(val) { //新增彈窗顯示
				if (val._id == undefined) {
					this.brandLogo = []; //回显图片
					this.brandImg = []; //回显图片
					this.addBrandForm = {
						show:true
					}
					this.addBrandForm.method = "post"
				} else {
					this.brandLogo = [{
						url: val.logo
					}]; //回显图片
					this.brandImg = [{
						url: val.img
					}]; //回显图片
					this.addBrandForm = {
						name: val.name,
						logo: val.log,
						ids: val._id,
						importance: val.importance,
						show: val.show,
						method:'update',
						removed:false,
					}
					let category_ //回显分类 临时处理 开始
					if (val.category_1 && val.category_1 < 100 && val.category_1 > 0) {
						category_ = val.category_1
						if (val.category_2 && val.category_2 > 100 && val.category_2 < 10000) {
							category_ = val.category_2
							if (val.category_3 && val.category_3 > 100000 && val.category_3 < 1000000) {
								category_ = val.category_3
							}
						}
					}
					let classify = {
						"category_id": category_,
					}
					// searchClassify(classify).then(res => {
					// 	this.defaultname = res.data.data.page_list[0].name
					// }) //回显分类 临时处理 结束
				}
				this.dialogFormVisible = true;
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

			changeMsg(file) { //上传前回调
				let _that = this
				let type = false //回调参数，before -upload 返回 为false 上传终止，利用特性解决获取token异步问题
				type = uploadToken(file.name).then(res => {
					if (res.data.ret == 0) {
						_that.postData = {
							key: file.name,
							token: res.data.data.upToken
						}
						return true
					} else {
						return false
					}
				})
				return type
			},
			uploadSuccessimg(res) {
				//上传成功
				var url = "http://qn.ygp.sany.com.cn/" + res.key; //图片地址拼接
				this.addBrandForm.img = url;
			},
			uploadSuccesslogo(res) {
				//上传成功
				var url = "http://qn.ygp.sany.com.cn/" + res.key; //图片地址拼接
				this.addBrandForm.logo = url;
			},
			delimg(file) { //删除图片操作
				this.addBrandForm.img = ""
				//////console.log(this.spuList.spu_img,"2")
			},
			dellogo(file) { //删除图片操作
				this.addBrandForm.logo = ""
				//////console.log(this.spuList.spu_img,"2")
			},
			uploadError(res) {
				alert(res)
				//上传失败
				////////console.log(res);
			},
			//新增品牌信息
			submitOrderChange() {
				var _that = this
				updatedConsignee(this.addBrandForm).then(res => {
					if (res.data.ret == '0') {
						this.$message({
							message: '操作成功',
							duration: 3000,
							type: 'success'
						})
						_that.dialogFormVisible = false;
						_that.getData()
					} else {
						this.$message({
							message: '操作失败请检查网路设置',
							duration: 3000,
							type: 'error'
						})
					}
				});
			},
		}
	}
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
	}

	.pad128 {
		padding-left: 128px;
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

	.bgcolor18 {
		background: rgba(24, 144, 255, 1);
	}

	.show_none {
		width: 6px;
		height: 6px;
		display: inline-block;
		border-radius: 50%;
		margin-right: 8px;
	}

	.bgcolor00 {
		background: rgba(0, 0, 0, 0.25);
	}

	.frame>>>.el-dialog__body {
		border-top: 1px solid rgba(0, 0, 0, 0.09);
		border-bottom: 1px solid rgba(0, 0, 0, 0.09);
		padding: 30px 20px 0;
	}

	.frame>>>.el-input__inner {
		height: 32px;
		width: 249px;
	}

	.frame>>>.dialog__footer {
		padding: 12px 20px 15px;
	}
</style>
