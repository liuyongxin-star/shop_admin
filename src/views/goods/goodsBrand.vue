<template>
	<div>
		<div class="data-list">
			<span>数据列表</span>
			<el-button type="primary" @click="openDialog">新增品牌</el-button>
		</div>

		<!-- 数据列表 -->
		<div class="table-box">
			<el-table :data="dataList" style="width:100%" border align="center" :header-cell-style="{background:'#DCDFE6',color:'#303133'}">
				<el-table-column label="编号" type="index" width="50"></el-table-column>
				<el-table-column label="品牌名称" prop="name"></el-table-column>
				<el-table-column label="排序" prop="importance"></el-table-column>
				<el-table-column label="LOGO" prop="logo">
					<template slot-scope="scope">
						<img :src="scope.row.logo" alt="logo" width="60">
					</template>
				</el-table-column>
				<el-table-column label="是否显示" prop="show">
					<template slot-scope="scope">
						<el-switch v-model="scope.row.show" @change="upbrand(scope.row)"></el-switch>
					</template>
				</el-table-column>
				<el-table-column label="操作">
					<template slot-scope="scope">
						<el-button size="small" @click="openDialog(scope.row)">编辑</el-button>
						<el-button size="small" type="danger" @click="delbrand(scope.row._id)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>

		<!--分页功能 -->
		<!-- <div class="pagination">
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="10"
        layout="total, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
        <div style="height:200px"> </div> 
    </div> -->
		<!-- 弹框 -->
		<el-dialog :visible.sync="dialogFormVisible" center width="40%" class="my-dialog" :close-on-click-modal="true"
		 :show-close="false">
			<el-form :model="addBrandForm" label-width="150px" class="dialog-form" ref="addBrandForm">
				<el-form-item label="商品分类" class="item-input">
					<el-cascader :show-all-levels="false" prop="category_id" ref="myCategory" :placeholder="defaultname" v-model="category_id"
					 @change="onCategoryChange" :props="classify"></el-cascader>
					<!-- 多级下拉菜单-->
				</el-form-item>
				<el-form-item label="品牌名称" prop="name">
					<el-input v-model="addBrandForm.name"></el-input>
				</el-form-item>
				<el-form-item label="logo图标" prop="logo">
					<el-upload class="upload-demo1" ref="upload_1" action="https://upload-z2.qiniup.com" :before-upload="changeMsg"
					 :on-success="uploadSuccesslogo" :limit="1" :on-remove="dellogo" :file-list="brandLogo" list-type="picture" :data="postData"
					 :on-error="uploadError" accept=".png, .jpg">
						<el-button size="small" slot="trigger" type="primary">点击</el-button>
					</el-upload>
				</el-form-item>
				<el-form-item label="专区大图" prop="img">
					<el-upload class="upload-demo2" ref="upload_2" action="https://upload-z2.qiniup.com" :before-upload="changeMsg"
					 :on-success="uploadSuccessimg" :limit="1" :on-remove="delimg" list-type="picture" :file-list="brandImg" :data="postData"
					 :on-error="uploadError" accept=".png, .jpg">
						<el-button size="small" slot="trigger" type="primary">点击</el-button>
					</el-upload>
				</el-form-item>
				<el-form-item label="排序" prop="importance">
					<el-input v-model="addBrandForm.importance"></el-input>
				</el-form-item>
				<el-form-item label="是否显示" prop="isSshowhow">
					<el-radio-group v-model="addBrandForm.show">
						<el-radio :label="true">是</el-radio>
						<el-radio :label="false">否</el-radio>
					</el-radio-group>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer dialog-btn-ground">
				<el-button type="primary" @click="dialogFormVisible = false">取消</el-button>
				<el-button type="primary" @click="submitOrderChange ">提交</el-button>
			</span>
		</el-dialog>
	</div>
</template>
<script>
	import {
		searchBrand,
		searchClassify,
		deleteBrand,
		updatedConsignee
	} from "@/api/goods"
	import {
		uploadToken
	} from "@/api/uploadpic"
	export default {
		created() {
			this.fetchDate();
		},
		data() {
			return {
				category_id: "", //获取到的分类ID
				defaultname: "", //默认显示分类名
				brandLogo: [], //回显logo
				brandImg: [], //回显大图
				dialogFormVisible: false,
				currentPage: 1,
				total: 100,
				//新增品牌
				addBrandForm: {
					name: '',
					logo: "",
					img: "",
					importance: '',
					show: '',
					method: ""
				},
				dataList: [],
				//七牛云上传
				imageurl: "",
				postData: {
					key: "",
					token: ""
				},
				//多级下拉菜单
				classify: {
					checkStrictly: true,
					multiple: false,
					lazy: true,
					lazyLoad(node, resolve) {
						const {
							level
						} = node;
						if (node.level == 0) {
							searchClassify() //从后台获取数据
								.then(res => {
									const category_1 = res.data.data.page_list.map((value, i) => ({
										value: value.category_id, //设置唯一value，不能重复
										label: value.name,
										leaf: node.level >= 2
									}));
									// 通过调用resolve将子节点数据返回，通知组件数据加载完成
									resolve(category_1);
								})
								.catch(err => {

								});
						}
						if (node.level == 1) {
							const data = {
								family_code: node.value
							}
							searchClassify(data)
								.then(res => {
									if (res.data.data.page_list.length != 0) { //验证数据是否为空
										const category_2 = res.data.data.page_list.map((value, i) => ({
											value: value.category_id,
											label: value.name,
											leaf: node.level >= 2
										}));
										// 通过调用resolve将子节点数据返回，通知组件数据加载完成

										resolve(category_2);
									}
								})
								.catch(err => {

								});
						} else if (node.level == 2) {
							const data = {
								family_code: node.value
							}
							searchClassify(data)
								.then(res => {
									if (res.data.data.page_list.length != 0) { //验证数据是否为空 
										const category_3 = res.data.data.page_list.map((value, i) => ({
											value: value.category_id,
											label: value.name,
											leaf: node.level >= 2
										}));
										// 通过调用resolve将子节点数据返回，通知组件数据加载完成                
										resolve(category_3);
									}
								})
								.catch(err => {

								});
						}
					}
				},

			};
		},
		methods: {
			fetchDate() { //頁面渲染
				searchBrand(this.searchForm).then(res => {
					const resp = res.data;
					this.dataList = resp.data.page_list;
					this.total = resp.data.count;
				});
			},
			openDialog(val) { //新增彈窗顯示
				if (val._id == undefined) {
					this.brandLogo = []; //回显图片
					this.brandImg = []; //回显图片
					this.addBrandForm = {}
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
						img: val.img,
						sort: val.store_id,
						_id: val._id,
						importance: val.importance,
						show: val.show,
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
					searchClassify(classify).then(res => {
						this.defaultname = res.data.data.page_list[0].name
					}) //回显分类 临时处理 结束
				}
				this.dialogFormVisible = true;
			},
			handleCurrentChange(val) {
				this.searchForm.page = val
				this.fetchDate()
			},
			handleIconImg() {},
			delbrand(_id) { //品牌刪除
				////////console.log(_id);
				var data = {
					method: "delete",
					bIDs: _id
				}
				deleteBrand(data).then(res => {
					this.fetchDate()
					////////console.log(res.msg)
				})
			},
			//新增品牌信息
			submitOrderChange() {
				var _that = this
				updatedConsignee(this.addBrandForm).then(res => {
					if (res.data.ret == '0') {
						this.$message({
							message: '修改成功',
							duration: 3000,
							type: 'success'
						})
						_that.dialogFormVisible = false;
						_that.fetchDate()
					} else {
						this.$message({
							message: '添加失败请检查网路设置',
							duration: 3000,
							type: 'error'
						})
					}
				});
			},
			upbrand(val) { //是否显示
				let show = val.show
				let data = {
					_id: val._id,
					show: val.show,
				}
				updatedConsignee(data).then(res => {
					this.$message({
						message: res.data.msg,
						duration: 3000,
					})
				})
			},
			onCategoryChange() { //下拉分类点击事件
				//    ////////console.log(this.category_id,"id")//选中的所有分类id
				//    //////////console.log(this.$refs.myCategory.getCheckedNodes(),"myCategory")//选中的所有数据
				//将获取到的分类ID保存到要发送的数据中出去                 
				let category = this.category_id;
				category.forEach(item => {
					if (category.length == 1) {
						this.addBrandForm.category_1 = item
					} else if (category.length == 2) {
						this.addBrandForm.category_2 = item
					} else if (category.length == 3) {
						this.addBrandForm.category_3 = item
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

	.dialog-btn-ground {
		.el-button {
			margin-left: 10%;
			width: 100px;
		}
	}
</style>
