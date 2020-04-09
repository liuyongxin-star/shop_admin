<template>
	<div class="container">
		<!-- 搜索 -->
		<div class="screen">
			<p class="title color85">查询</p>
			<div class="screen_condition color85 fontS14">
				<el-form :model="searchForm" :inline="true" ref="searchFormList" size="mini">
					<div>
						<div class="screen_box">
							<el-form-item label="企业名称" width="120" prop="com_name">
								<el-input v-model="searchForm.com_name" placeholder="请输入"></el-input>
							</el-form-item>
							<el-form-item label="用户名" width="120" prop="name">
								<el-input v-model="searchForm.name" placeholder="请输入"></el-input>
							</el-form-item>
							<el-form-item label="用户ID" width="120" prop="user_id">
								<el-input v-model="searchForm.user_id" placeholder="请输入"></el-input>
							</el-form-item>
							<el-form-item label="登录名" width="120" prop="login_name">
								<el-input v-model="searchForm.login_name" placeholder="请输入"></el-input>
							</el-form-item>
						</div>
						<div class="screen_box">
							<el-form-item label="认证时间" width="100" prop="apply_time">
								<el-date-picker v-model="searchForm.apply_time" type="datetimerange" value-format="timestamp" :default-time="['00:00:00', '23:59:59']"
								 range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
							</el-form-item>
							<el-form-item label="认证状态" prop="status">
								<el-select placeholder="请选择" v-model="searchForm.status" clearable>
									<el-option :label="item.name" :value="item.type" v-for="item in status_list" :key="item.type"></el-option>
								</el-select>
							</el-form-item>
							<el-form-item label="账号状态" prop="user_status">
								<el-select placeholder="请选择" v-model="searchForm.user_status" clearable>
									<el-option :label="item.name" :value="item.type" v-for="item in user_status_list" :key="item.type"></el-option>
								</el-select>
							</el-form-item>
							<el-form-item label="账号身份" prop="role">
								<el-select placeholder="请选择" v-model="searchForm.role" clearable>
									<el-option :label="item.name" :value="item.type" v-for="item in role_list" :key="item.type"></el-option>
								</el-select>
							</el-form-item>
						</div>
					</div>
					<div>
						<el-form-item label="统一社会信用代码" prop="com_id">
							<el-input v-model="searchForm.com_id" placeholder="请输入"></el-input>
						</el-form-item>
					</div>
					<div>
					</div>
					<el-form-item class="screen_btn">
						<el-button type="primary" @click="submitForm('searchFormList')" size="mini">查询</el-button>
						<el-button size="mini" @click="resetForm('searchFormList')">重置</el-button>
					</el-form-item>
				</el-form>
			</div>
		</div>
		<!-- 搜索 End-->
		<div class="table-box">
			<el-table :data="companyList" ref="dataTable" style="width:100%" :header-cell-style="{background:'#FAFAFA',color:'rgba(0,0,0,0.85)'}">
				<el-table-column type="index" label="序号"></el-table-column>
				<el-table-column label="企业名称" prop="com_name"></el-table-column>
				<el-table-column label="统一社会信用代码（组织机构代码）" prop="com_id"></el-table-column>
				<el-table-column label="地址" prop="address">
					<template>
						<span>_</span>
					</template>
				</el-table-column>
				<el-table-column label="法人代表" prop="own_name"></el-table-column>
				<el-table-column label="法人电话" prop="tel"></el-table-column>
				<el-table-column label="营业执照" prop="img">
					<template slot-scope="scope">
						<div v-for="(item,index) in scope.row.img" :key="index">
							<el-popover ref="popover" placement="left" title="营业执照" width="600" trigger="hover">
								<img :src="item" alt height="80" slot="reference" />
								<img :src="item" alt width="600" />
							</el-popover>
						</div>
					</template>
				</el-table-column>
				<el-table-column label="认证状态">
					<template slot-scope="scope">
						<span>{{scope.row.status | verificateStatus}}</span>
					</template>
				</el-table-column>
				<el-table-column label="认证时间" prop="create_time">
					<template slot-scope="scope">
						<span>{{scope.row.check_time|dateFilter}}</span>
					</template>
				</el-table-column>
				<el-table-column label="账号状态" prop="removed">
					<template slot-scope="scope">
						<el-switch v-model="scope.row.removed">
						</el-switch>
					</template>
				</el-table-column>
				<el-table-column label="操作" show-overflow-tooltip>
					<template slot-scope="scope">
						<el-button type="text" @click="isPass(2,scope.row._id)" size="mini" v-if="scope.row.status==1">通过</el-button>
						<el-button type="text" @click="openDialog(scope.row._id)" size="mini" v-if="scope.row.status==1">拒绝</el-button>
						<el-button type="text" @click="toDetail(scope.row._id)" size="mini">查看详情</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<div class="bottom-box">
			<!--分页功能 -->
			<el-pagination @current-change="handleCurrentChange" :current-page="searchForm.page" :page-size="searchForm.limit"
			 layout="total, prev, pager, next, jumper" :total="total"></el-pagination>
		</div>

		<!-- 拒绝的dialog -->
		<el-dialog title="请填写拒绝原因" :visible.sync="dialogFormVisible" width="30%">
			<el-select placeholder="请选择拒绝原因" v-model="refuse_reason" style="width:100%;margin-bottom:20px">
				<el-option :label="item.name" :value="item.name" v-for="(item,index) in applyRefuseReason" :key="index"></el-option>
			</el-select>
			<el-input v-model="refuse_detail" type="textarea" placeholder="请描述具体内容..."></el-input>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取 消</el-button>
				<el-button type="primary" @click="isPass(0)">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import filter from "@/utils/changeType";
	import {
		format_objKey,
		sortAttr
	} from "@/utils/methods";
	import {
		searchCompany,
		updataCompany
	} from "@/api/account";
	export default {
		created() {
			this.fetchData();
		},
		data() {
			return {
				refuse_reason: "", //拒绝原因
				refuse_detail: "", //具体原因
				refuse_id: "",
				dialogFormVisible: false,
				//    isShowColor:false,
				applyRefuseReason: filter._applyRefuseReason, //拒绝原因
				companyStatus: filter._verificateStatus, //认证状态
				companyList: [],
				total: 0,
				status_list: [{
					name: '认证失败',
					type: '0'
				}, {
					name: '认证中',
					type: '1'
				}, {
					name: '认证成功',
					type: '2'
				}],
				role_list: [{
					name: '企业老板',
					type: '1'
				}, {
					name: '采购负责人',
					type: '2'
				}, {
					name: '采购员',
					type: '3'
				}, {
					name: '财务',
					type: '4'
				}, {
					name: '其他',
					type: '5'
				}],
				user_status_list: [{
					name: '正常',
					type: 'normal'
				}, {
					name: '封禁',
					type: 'freeze'
				}],
				searchForm: {
					name: "",
					login_name: "",
					user_status: "",
					com_id: "",
					user_id: "",
					com_name: "",
					status: "",
					role: "",
					start_time: "",
					end_time: "",
					apply_time: "",
					page: 1,
					limit: 4
				},
				pickerOptions: {
					//时间选择限制
					disabledDate(time) {
						let curDate = new Date().getTime();
						let year = 365 * 24 * 3600 * 1000;
						return time.getTime() > Date.now();
					}
				}
			};
		},
		filters: {
			//认证状态
			verificateStatus(type) {
				return filter._filterType(filter._verificateStatus, type);
			},
			//申请者身份
			// applyStatus(type) {
			// 	return filter._filterType(filter._applyStatus, type);
			// }
		},
		methods: {
			//open dialog
			openDialog(id) {
				(this.refuse_reason = ""),
				(this.refuse_detail = ""),
				(this.refuse_id = id),
				(this.dialogFormVisible = true);
			},
			//加载数据
			fetchData() {
				// let obj = Object.assign({}, this.searchForm);
				// obj = {
				// 	start_time: this.searchForm.apply_time[0],
				// 	end_time: this.searchForm.apply_time[1],
				// 	...obj
				// };
				// obj.status = obj.status != "" ? [Number(obj.status)] : "";
				searchCompany(format_objKey(this.searchForm)).then(res => {
					// let companyList = res.data.data.data_list;
					this.companyList = res.data.data.data_list;
					this.total = res.data.data.count;
					//  companyList.sort(sortAttr('user_id'))   //排序
					//  this.sortChange(companyList) //加背景色判断
				});
			},
			// 相同id的数据添加颜色标注,
			// sortChange( column, prop, order){
			//     console.log(column,prop,order)
			//     this.isShowColor=false
			//       let dataList= this.$refs['dataTable'].data
			//      for(let i=0;i<dataList.length;i++){
			//          if(dataList[i]&&dataList[i+1]&&dataList[i+2]){
			//            if((dataList[i].user_id!==dataList[i+1].user_id)&&(dataList[i+1].user_id===dataList[i+2].user_id)){  //i!=i+1 && i+1==i+2
			//                 dataList[i].showColor=false
			//                     dataList[i+1].showColor=true
			//                     dataList[i+2].showColor=true
			//            }
			//          }
			//          if(dataList[i]&&dataList[i+1]){
			//             if(dataList[i].user_id===dataList[i+1].user_id){ //i==i+1
			//                     dataList[i].showColor=true
			//                         dataList[i+1].showColor=true
			//            }
			//          }
			//         //  if((dataList[i].user_id!==dataList[i-1]&&dataList[i-1]===dataList[i-2])&&(dataList[i]!=dataList[i+1]&&dataList[i+1]===dataList[i+2])){
			//         //      dataList[i-1].showColor=
			//         //      dataList[i].showColor=
			//         //      data[i+1].showColor=true
			//         //  }
			//        }
			//        this.isShowColor=true
			// },
			//根据颜色标注显示颜色区分
			// rowClassName(row,rowIndex){
			//     if(row.row.showColor &&this.isShowColor){
			//         return 'tableRowColor'
			//     }
			//     return ''
			// },
			//操作
			isPass(status, id) {
				let operation = () => {
					let obj = {
						_id: id,
						status: Number(status)
					};
					if (status == 0) {
						obj = {
							status: Number(status),
							_id: this.refuse_id,
							refuse_reason: this.refuse_reason,
							refuse_detail: this.refuse_detail
						};
					}
					updataCompany(obj).then(res => {
						this.$message({
							message: res.data.msg,
							type: res.data.ret == 0 ? "success" : "warning"
						});
						this.$nextTick(() => {
							this.fetchData();
						});
					});
				};

				if (status == 2) {
					//通过
					this.$confirm("确定通过该企业认证吗？", "温馨提示")
						.then(() => {
							operation();
						})
						.catch();
				}
				if (status == 0) {
					//拒绝
					if (this.refuse_reason == "") {
						this.$message({
							message: "请选择拒绝原因"
						});
						return;
					}
					operation();
					this.dialogFormVisible = false;
				}
			},
			//去详情页
			toDetail(user_id) {
				this.$router.push({
					path: "countDetail",
					query: {
						user_id
					}
				});
			},
			//改变分页
			handleCurrentChange(val) {
				this.searchForm.page = val;
				this.fetchData();
			},
			// 搜索
			submitForm(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						if (this.searchForm.apply_time) {
							this.searchForm.end_time = this.searchForm.apply_time[1];
							this.searchForm.start_time = this.searchForm.apply_time[0];
						}
						this.fetchData()
					} else {
						return false;
					}
				});
			},
			//重置
			resetForm(formName) {
				this.$refs[formName].resetFields();
			}
		}
	};
</script>

<style scoped>
	.screen {
		background-color: white;
	}

	.title {
		padding: 16px 32px;
		border-bottom: 1px solid rgba(233, 233, 233, 1);
		font-weight: bold;
	}

	.screen_condition {
		padding: 24px 24px 32px 32px;
		border-bottom: 1px solid #E8E8E8;
	}

	.screen_box {
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
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
		margin-bottom: 0;
		display: flex;
		justify-content: flex-end;
	}


	.container {
		flex-direction: column;
		background-color: white;
		margin: 24px;
		margin-right: 20px;
	}

	.table-box {
		margin: 24px;
	}

	.bottom-box {
		text-align: right;
		padding-bottom: 24px;
		padding-right: 24px;
	}
</style>
